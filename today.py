import datetime
from dateutil import relativedelta
import requests
import os
import time
import hashlib

HEADERS = {'authorization': 'token ' + os.environ['ACCESS_TOKEN']}
USER_NAME = 'amethystani'
QUERY_COUNT = {
    'user_getter': 0, 'follower_getter': 0, 'graph_repos_stars': 0,
    'recursive_loc': 0, 'graph_commits': 0, 'loc_query': 0,
    'top_languages': 0, 'contribution_calendar': 0, 'featured_repos': 0,
}

WEEKLY_STATUSES = [
    "training models & pushing commits",
    "deep in research papers",
    "building something new",
    "optimizing algorithms",
    "shipping features",
    "reading, thinking, coding",
    "debugging late into the night",
    "exploring new frameworks",
    "writing clean code",
    "connecting the dots",
    "running experiments",
    "designing systems",
    "grinding through complexity",
]

# ─────────────────────────── helpers ────────────────────────────

def format_plural(unit):
    return 's' if unit != 1 else ''


def daily_readme(birthday):
    diff = relativedelta.relativedelta(datetime.datetime.today(), birthday)
    return '{} {}, {} {}, {} {}{}'.format(
        diff.years,  'year'  + format_plural(diff.years),
        diff.months, 'month' + format_plural(diff.months),
        diff.days,   'day'   + format_plural(diff.days),
        ' 🎂' if (diff.months == 0 and diff.days == 0) else '')


def simple_request(func_name, query, variables):
    req = requests.post(
        'https://api.github.com/graphql',
        json={'query': query, 'variables': variables},
        headers=HEADERS,
    )
    if req.status_code == 200:
        return req
    raise Exception(func_name, 'failed with', req.status_code, req.text, QUERY_COUNT)


def query_count(funct_id):
    global QUERY_COUNT
    QUERY_COUNT[funct_id] += 1


def perf_counter(funct, *args):
    start = time.perf_counter()
    result = funct(*args)
    return result, time.perf_counter() - start


def formatter(query_type, difference, funct_return=False, whitespace=0):
    print('{:<26}'.format('   ' + query_type + ':'), sep='', end='')
    if difference > 1:
        print('{:>12}'.format('%.4f' % difference + ' s '))
    else:
        print('{:>12}'.format('%.4f' % (difference * 1000) + ' ms'))
    if whitespace:
        return f"{'{:,}'.format(funct_return): <{whitespace}}"
    return funct_return


def stars_counter(data):
    return sum(n['node']['stargazers']['totalCount'] for n in data)


# ─────────────────────────── user / followers ────────────────────────────

def user_getter(username):
    query_count('user_getter')
    query = '''
    query($login: String!) {
        user(login: $login) { id createdAt }
    }'''
    req = simple_request(user_getter.__name__, query, {'login': username})
    d = req.json()['data']['user']
    return {'id': d['id']}, d['createdAt']


def follower_getter(username):
    query_count('follower_getter')
    query = '''
    query($login: String!) {
        user(login: $login) { followers { totalCount } }
    }'''
    req = simple_request(follower_getter.__name__, query, {'login': username})
    return int(req.json()['data']['user']['followers']['totalCount'])


# ─────────────────────────── repos / stars ────────────────────────────

def graph_repos_stars(count_type, owner_affiliation, cursor=None, add_loc=0, del_loc=0):
    query_count('graph_repos_stars')
    query = '''
    query ($owner_affiliation: [RepositoryAffiliation], $login: String!, $cursor: String) {
        user(login: $login) {
            repositories(first: 100, after: $cursor, ownerAffiliations: $owner_affiliation) {
                totalCount
                edges { node { ... on Repository { nameWithOwner stargazers { totalCount } } } }
                pageInfo { endCursor hasNextPage }
            }
        }
    }'''
    variables = {'owner_affiliation': owner_affiliation, 'login': USER_NAME, 'cursor': cursor}
    req = simple_request(graph_repos_stars.__name__, query, variables)
    if count_type == 'repos':
        return req.json()['data']['user']['repositories']['totalCount']
    elif count_type == 'stars':
        return stars_counter(req.json()['data']['user']['repositories']['edges'])


# ─────────────────────────── lines of code ────────────────────────────

def recursive_loc(owner, repo_name, data, cache_comment, addition_total=0, deletion_total=0, my_commits=0, cursor=None):
    query_count('recursive_loc')
    query = '''
    query ($repo_name: String!, $owner: String!, $cursor: String) {
        repository(name: $repo_name, owner: $owner) {
            defaultBranchRef {
                target {
                    ... on Commit {
                        history(first: 100, after: $cursor) {
                            totalCount
                            edges {
                                node {
                                    ... on Commit { committedDate }
                                    author { user { id } }
                                    deletions additions
                                }
                            }
                            pageInfo { endCursor hasNextPage }
                        }
                    }
                }
            }
        }
    }'''
    variables = {'repo_name': repo_name, 'owner': owner, 'cursor': cursor}
    # Retry with exponential backoff on transient server errors (502/503)
    for attempt in range(4):
        req = requests.post('https://api.github.com/graphql',
                            json={'query': query, 'variables': variables}, headers=HEADERS)
        if req.status_code == 200:
            ref = req.json()['data']['repository']['defaultBranchRef']
            if ref is not None:
                return loc_counter_one_repo(owner, repo_name, data, cache_comment,
                                            ref['target']['history'],
                                            addition_total, deletion_total, my_commits)
            return 0
        if req.status_code in (502, 503) and attempt < 3:
            wait = 2 ** (attempt + 1)
            print(f"⚠️  {req.status_code} — retrying in {wait}s (attempt {attempt + 1}/3)")
            time.sleep(wait)
            continue
        break
    force_close_file(data, cache_comment)
    if req.status_code == 403:
        raise Exception('Rate-limited by GitHub anti-abuse')
    raise Exception('recursive_loc failed', req.status_code, req.text, QUERY_COUNT)


def loc_counter_one_repo(owner, repo_name, data, cache_comment, history,
                          addition_total, deletion_total, my_commits):
    for node in history['edges']:
        if node['node']['author']['user'] == OWNER_ID:
            my_commits += 1
            addition_total += node['node']['additions']
            deletion_total += node['node']['deletions']
    if not history['edges'] or not history['pageInfo']['hasNextPage']:
        return addition_total, deletion_total, my_commits
    return recursive_loc(owner, repo_name, data, cache_comment,
                         addition_total, deletion_total, my_commits,
                         history['pageInfo']['endCursor'])


def loc_query(owner_affiliation, comment_size=0, force_cache=False, cursor=None, edges=None):
    if edges is None:
        edges = []
    query_count('loc_query')
    query = '''
    query ($owner_affiliation: [RepositoryAffiliation], $login: String!, $cursor: String) {
        user(login: $login) {
            repositories(first: 60, after: $cursor, ownerAffiliations: $owner_affiliation) {
                edges {
                    node {
                        ... on Repository {
                            nameWithOwner
                            defaultBranchRef {
                                target { ... on Commit { history { totalCount } } }
                            }
                        }
                    }
                }
                pageInfo { endCursor hasNextPage }
            }
        }
    }'''
    variables = {'owner_affiliation': owner_affiliation, 'login': USER_NAME, 'cursor': cursor}
    req = simple_request(loc_query.__name__, query, variables)
    data = req.json()['data']['user']['repositories']
    if data['pageInfo']['hasNextPage']:
        edges += data['edges']
        return loc_query(owner_affiliation, comment_size, force_cache,
                         data['pageInfo']['endCursor'], edges)
    return cache_builder(edges + data['edges'], comment_size, force_cache)


def cache_builder(edges, comment_size, force_cache, loc_add=0, loc_del=0):
    print(f"\n📊 Processing {len(edges)} repositories...")
    filename = 'cache/' + hashlib.sha256(USER_NAME.encode()).hexdigest() + '.txt'
    try:
        with open(filename, 'r') as f:
            data = f.readlines()
    except FileNotFoundError:
        data = []
        if comment_size > 0:
            for _ in range(comment_size):
                data.append('This line is a comment block.\n')
        with open(filename, 'w') as f:
            f.writelines(data)

    if len(data) - comment_size != len(edges) or force_cache:
        print("🔄 Rebuilding cache...")
        flush_cache(edges, filename, comment_size)
        with open(filename, 'r') as f:
            data = f.readlines()

    cache_comment = data[:comment_size]
    data = data[comment_size:]
    start_time = time.perf_counter()

    for index in range(len(edges)):
        repo_name = edges[index]['node']['nameWithOwner']
        repo_hash, commit_count, *__ = data[index].split()
        if repo_hash == hashlib.sha256(repo_name.encode()).hexdigest():
            try:
                actual = edges[index]['node']['defaultBranchRef']['target']['history']['totalCount']
                if int(commit_count) != actual:
                    print(f"🔍 Analyzing: {repo_name}")
                    owner, name_only = repo_name.split('/')
                    time.sleep(0.3)   # gentle pacing to avoid anti-abuse
                    loc = recursive_loc(owner, name_only, data, cache_comment)
                    data[index] = (repo_hash + ' ' + str(actual) + ' ' +
                                   str(loc[2]) + ' ' + str(loc[0]) + ' ' + str(loc[1]) + '\n')
            except (TypeError, Exception) as exc:
                print(f"⚠️  Skipping {repo_name}: {exc}")
                data[index] = repo_hash + ' 0 0 0 0\n'

    print(f"💾 Saving cache ({time.perf_counter() - start_time:.2f}s)")
    with open(filename, 'w') as f:
        f.writelines(cache_comment)
        f.writelines(data)

    for line in data:
        loc = line.split()
        loc_add += int(loc[3])
        loc_del += int(loc[4])

    return [loc_add, loc_del, loc_add - loc_del, True]


def flush_cache(edges, filename, comment_size):
    with open(filename, 'r') as f:
        data = []
        if comment_size > 0:
            data = f.readlines()[:comment_size]
    with open(filename, 'w') as f:
        f.writelines(data)
        for node in edges:
            f.write(hashlib.sha256(node['node']['nameWithOwner'].encode()).hexdigest() + ' 0 0 0 0\n')


def force_close_file(data, cache_comment):
    filename = 'cache/' + hashlib.sha256(USER_NAME.encode()).hexdigest() + '.txt'
    with open(filename, 'w') as f:
        f.writelines(cache_comment)
        f.writelines(data)
    print('Error: partial cache data saved to', filename)


def commit_counter(comment_size):
    total = 0
    filename = 'cache/' + hashlib.sha256(USER_NAME.encode()).hexdigest() + '.txt'
    with open(filename, 'r') as f:
        data = f.readlines()
    for line in data[comment_size:]:
        total += int(line.split()[2])
    return total


# ─────────────────────────── NEW: languages ────────────────────────────

def get_top_languages():
    """Fetch language byte totals across all owned repos. Returns top 5 by bytes."""
    query_count('top_languages')
    query = '''
    query($login: String!, $cursor: String) {
        user(login: $login) {
            repositories(first: 100, after: $cursor, ownerAffiliations: [OWNER], isFork: false) {
                nodes {
                    languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                        edges { size node { name color } }
                    }
                }
                pageInfo { endCursor hasNextPage }
            }
        }
    }'''
    lang_totals = {}
    cursor = None
    while True:
        req = simple_request('get_top_languages', query, {'login': USER_NAME, 'cursor': cursor})
        repos = req.json()['data']['user']['repositories']
        for repo in repos['nodes']:
            for edge in repo['languages']['edges']:
                name = edge['node']['name']
                color = edge['node']['color'] or '#8b949e'
                if name not in lang_totals:
                    lang_totals[name] = {'bytes': 0, 'color': color}
                lang_totals[name]['bytes'] += edge['size']
        if not repos['pageInfo']['hasNextPage']:
            break
        cursor = repos['pageInfo']['endCursor']

    total_bytes = sum(v['bytes'] for v in lang_totals.values())
    sorted_langs = sorted(lang_totals.items(), key=lambda x: x[1]['bytes'], reverse=True)
    result = []
    for name, info in sorted_langs[:5]:
        pct = round(info['bytes'] / total_bytes * 100, 1) if total_bytes else 0
        result.append({'name': name, 'color': info['color'], 'pct': pct})
    return result


# ─────────────────────────── NEW: contribution calendar ────────────────────────────

def get_contribution_calendar():
    """Fetch last 26 weeks of daily contribution data."""
    query_count('contribution_calendar')
    now = datetime.datetime.utcnow()
    start = now - datetime.timedelta(weeks=26)
    query = '''
    query($login: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $login) {
            contributionsCollection(from: $from, to: $to) {
                contributionCalendar {
                    totalContributions
                    weeks {
                        contributionDays { contributionCount date weekday }
                    }
                }
            }
        }
    }'''
    variables = {
        'login': USER_NAME,
        'from': start.strftime('%Y-%m-%dT00:00:00Z'),
        'to':   now.strftime('%Y-%m-%dT23:59:59Z'),
    }
    req = simple_request('get_contribution_calendar', query, variables)
    cal = req.json()['data']['user']['contributionsCollection']['contributionCalendar']
    return cal['weeks'], cal['totalContributions']


# ─────────────────────────── NEW: featured repos ────────────────────────────

def get_featured_repos():
    """Fetch pinned repos + recent repos for weekly rotation."""
    query_count('featured_repos')
    query = '''
    query($login: String!) {
        user(login: $login) {
            pinnedItems(first: 6, types: [REPOSITORY]) {
                nodes {
                    ... on Repository {
                        name description stargazerCount forkCount
                        primaryLanguage { name color }
                    }
                }
            }
            repositories(first: 12, ownerAffiliations: [OWNER],
                          orderBy: {field: UPDATED_AT, direction: DESC}, isFork: false) {
                nodes {
                    name description stargazerCount forkCount
                    primaryLanguage { name color }
                }
            }
        }
    }'''
    req = simple_request('get_featured_repos', query, {'login': USER_NAME})
    data = req.json()['data']['user']
    pinned = [n for n in data['pinnedItems']['nodes'] if n and n.get('description')]
    recent = [n for n in data['repositories']['nodes'] if n and n.get('description')]
    seen, repos = set(), []
    for r in pinned + recent:
        if r['name'] not in seen:
            seen.add(r['name'])
            repos.append(r)
    return repos


# ─────────────────────────── NEW: streak calculation ────────────────────────────

def calculate_streak(weeks):
    """Count consecutive days with contributions, ending today."""
    days = sorted(
        [d for w in weeks for d in w['contributionDays']],
        key=lambda x: x['date']
    )
    streak = 0
    today = datetime.date.today()
    for day in reversed(days):
        d = datetime.date.fromisoformat(day['date'])
        if d > today:
            continue
        if day['contributionCount'] > 0:
            streak += 1
        elif d == today:
            continue   # today might not have data yet
        else:
            break
    return streak


# ─────────────────────────── SVG GENERATION ────────────────────────────

ASCII_ART = [
    "              *   '''`````'''",
    "          *",
    "       *",
    "     *           ..i'            q.",
    "   *         .poj;               \\*.",
    "  .         oKPO                  THk",
    " .k        {HHk`                   THH,",
    " dH,       ;YJH.                   YHHk",
    "{HHk       :lHHk                   jHHH}",
    " THHk      `NJHH,                 .HHHl'",
    "  THHk,     lHHHHk                jHHHHP",
    "   THHHi:,  `GHHHHH,.           .'HHHHH",
    "   `THHHHHHi\\WHHHHHkoo....ooooojHHHHHHF",
    "    `*THHHH`THHHHHHHHHHHHHHHHHHHHHHHHl",
    "     `*THHHYHHHHHHHHHHHHHHHHHHHHHHHI",
    "       `*THHYHHHHHHHHHHHHHHHHHHHHHH}",
    "         `*THHHHHHHHHHHHHHHHHHHHHH}",
    "           `THHHHHHHHHHHHHHHHHHHP",
    "            `THHHHHHHHHHHHHHHHHP",
    "             `THHHHHHHHHHHHHHHP",
    "              `THHHHHHHHHHHHHP",
    "               `THHHHHHHHHHHP",
    "               `THHHHHHHHHHHP",
    "               `THHHHHHHHHHHP",
]

CONTRIB_COLORS = {
    'dark':  {0: '#161b22', 1: '#0e4429', 2: '#006d32', 3: '#26a641', 4: '#39d353'},
    'light': {0: '#ebedf0', 1: '#9be9a8', 2: '#40c463', 3: '#30a14e', 4: '#216e39'},
}

THEME = {
    'dark': {
        'bg':       '#0d1117',
        'card':     '#161b22',
        'chrome':   '#21262d',
        'border':   '#30363d',
        'text':     '#c9d1d9',
        'key':      '#ffa657',
        'value':    '#a5d6ff',
        'comment':  '#8b949e',
        'green':    '#3fb950',
        'red':      '#f85149',
        'purple':   '#a371f7',
        'dim':      '#21262d',
    },
    'light': {
        'bg':       '#ffffff',
        'card':     '#f6f8fa',
        'chrome':   '#eaeef2',
        'border':   '#d0d7de',
        'text':     '#1f2328',
        'key':      '#953800',
        'value':    '#0550ae',
        'comment':  '#6e7781',
        'green':    '#1a7f37',
        'red':      '#cf222e',
        'purple':   '#8250df',
        'dim':      '#eaeef2',
    },
}


def contrib_level(count):
    if count == 0:   return 0
    if count <= 3:   return 1
    if count <= 6:   return 2
    if count <= 9:   return 3
    return 4


def _esc(s):
    """XML-escape a string for SVG text content."""
    return (str(s)
            .replace('&', '&amp;')
            .replace('<', '&lt;')
            .replace('>', '&gt;')
            .replace('"', '&quot;'))


def _dots(max_len, used):
    """Return a dot-padding string to right-align values."""
    n = max(2, max_len - used)
    return ' ' + ('·' * n) + ' '


def generate_heatmap(weeks, mode):
    """Return SVG elements for the contribution heatmap grid."""
    colors = CONTRIB_COLORS[mode]
    cell, gap = 10, 2
    step = cell + gap
    x0, y0 = 110, 545   # top-left of first cell (Sun, oldest week)

    cells = []
    for wi, week in enumerate(weeks[-26:]):   # last 26 weeks
        for day in week['contributionDays']:
            wd = day['weekday']  # 0=Sun, 6=Sat
            cx = x0 + wi * step
            cy = y0 + wd * step
            color = colors[contrib_level(day['contributionCount'])]
            title = f"{day['date']}: {day['contributionCount']} contribution{'s' if day['contributionCount'] != 1 else ''}"
            cells.append(
                f'<rect x="{cx}" y="{cy}" width="{cell}" height="{cell}" '
                f'rx="2" fill="{color}"><title>{_esc(title)}</title></rect>'
            )
    return '\n'.join(cells)


def generate_lang_bars(top_langs, mode, x_name, x_bar, x_pct, bar_max_w, y_start, row_h):
    """Return SVG elements for animated language progress bars."""
    t = THEME[mode]
    elements = []
    for i, lang in enumerate(top_langs):
        y = y_start + i * row_h
        bar_w = max(2, int(bar_max_w * lang['pct'] / 100))
        color = lang['color'] if lang['color'] else t['comment']
        delay = 1.2 + i * 0.15
        name = _esc(lang['name'][:10])   # truncate long lang names

        elements.append(
            # dot + name
            f'<text x="{x_name}" y="{y}" fill="{t["comment"]}" font-size="15">. </text>'
            f'<text x="{x_name + 18}" y="{y}" fill="{t["key"]}" font-size="15">{name}</text>'
        )
        # bar background
        elements.append(
            f'<rect x="{x_bar}" y="{y - 12}" width="{bar_max_w}" height="9" rx="3" fill="{t["dim"]}"/>'
        )
        # bar fill (animated)
        elements.append(
            f'<rect x="{x_bar}" y="{y - 12}" width="{bar_w}" height="9" rx="3" fill="{color}" '
            f'class="bar_fill" style="animation-delay:{delay:.2f}s"/>'
        )
        # percentage
        elements.append(
            f'<text x="{x_pct}" y="{y}" fill="{t["value"]}" font-size="14">{lang["pct"]}%</text>'
        )
    return '\n'.join(elements)


def generate_svg(mode, data):
    """
    Build the complete profile SVG as a string.
    mode: 'dark' or 'light'
    data: dict with all profile stats.
    """
    t = THEME[mode]
    W, H = 985, 665

    # ── right-panel stat lines ──────────────────────────────────────────
    # Each entry: (label, value, max_dots)  — dots pad to fixed column
    age      = _esc(data['age'])
    repos    = _esc(str(data['repos']))
    contrib  = _esc(str(data['contrib']))
    stars    = _esc(str(data['stars']))
    commits  = _esc('{:,}'.format(data['commits']))
    followers= _esc(str(data['followers']))
    loc_net  = _esc(data['loc_net'])
    loc_add  = _esc(data['loc_add'])
    loc_del  = _esc(data['loc_del'])
    streak   = _esc(str(data['streak']))
    status   = _esc(data['status'])

    # ── featured project marquee ────────────────────────────────────────
    if data['featured']:
        f = data['featured']
        lang_str = f['primaryLanguage']['name'] if f.get('primaryLanguage') else '?'
        desc_str = (f.get('description') or '')[:80]
        marquee_content = (
            f"  📌  featured · {_esc(f['name'])}  ·  {_esc(desc_str)}"
            f"  ·  {_esc(lang_str)}  ·  ⭐ {f.get('stargazerCount', 0)}"
            f"  ·  🍴 {f.get('forkCount', 0)}     "
        )
    else:
        marquee_content = "  📌  amethystani — animeshmishra.us     "
    # Duplicate so the scroll loops seamlessly
    marquee_text = marquee_content * 3

    # ── heatmap cells ───────────────────────────────────────────────────
    heatmap_cells = generate_heatmap(data['weeks'], mode)

    # ── language bars ───────────────────────────────────────────────────
    lang_bars = generate_lang_bars(
        data['top_langs'], mode,
        x_name=390, x_bar=520, x_pct=660,
        bar_max_w=130,
        y_start=200, row_h=30,
    )
    lang_section_h = len(data['top_langs']) * 30  # dynamic height

    # ── ASCII art tspans ────────────────────────────────────────────────
    ascii_lines = '\n'.join(
        f'<tspan x="5" y="{20 + i * 20}">{_esc(line)}</tspan>'
        for i, line in enumerate(ASCII_ART)
    )

    # ── legend for heatmap ──────────────────────────────────────────────
    cc = CONTRIB_COLORS[mode]
    legend_cells = ''.join(
        f'<rect x="{870 + i * 13}" y="530" width="10" height="10" rx="2" fill="{cc[i]}"/>'
        for i in range(5)
    )

    # ── CSS ─────────────────────────────────────────────────────────────
    css = f"""
@font-face {{
  src: local('Consolas'), local('Consolas Bold');
  font-family: 'ConsolasFallback';
  font-display: swap;
  -webkit-size-adjust: 109%;
  size-adjust: 109%;
}}
text, tspan {{ white-space: pre; }}

/* ── blink cursor ── */
@keyframes blink {{
  0%,49% {{ opacity:1; }} 50%,100% {{ opacity:0; }}
}}
.cursor {{ animation: blink 1.2s step-end infinite; }}

/* ── ASCII art amethyst glow ── */
@keyframes glow {{
  0%,100% {{ filter: drop-shadow(0 0 2px {t['purple']}88); }}
  50%     {{ filter: drop-shadow(0 0 9px {t['purple']}cc); }}
}}
.ascii_glow {{ animation: glow 4s ease-in-out infinite; }}

/* ── staggered fade-in for stat rows ── */
@keyframes fadein {{
  from {{ opacity:0; transform:translateX(-6px); }}
  to   {{ opacity:1; transform:translateX(0);    }}
}}
{"".join(f'.r{i} {{ animation: fadein 0.45s ease-out {0.05 + i * 0.07:.2f}s both; }}' for i in range(28))}

/* ── animated language bar fill ── */
@keyframes bar_fill {{
  from {{ transform: scaleX(0); }}
  to   {{ transform: scaleX(1); }}
}}
.bar_fill {{
  transform-box: fill-box;
  transform-origin: left center;
  animation: bar_fill 1.4s cubic-bezier(0.22,0.61,0.36,1) 1.2s both;
}}

/* ── self-drawing separator lines ── */
@keyframes draw_line {{
  from {{ stroke-dashoffset: 1000; }}
  to   {{ stroke-dashoffset: 0;    }}
}}
.draw_line {{
  stroke-dasharray: 1000;
  animation: draw_line 1.2s ease-out 0.1s both;
}}

/* ── scrolling marquee ── */
@keyframes marquee {{
  0%   {{ transform: translateX(0); }}
  100% {{ transform: translateX(-33.33%); }}
}}
.marquee_inner {{
  animation: marquee 32s linear infinite;
  white-space: nowrap;
}}

/* ── contribution cell pulse on high-activity days ── */
@keyframes cell_pulse {{
  0%,100% {{ opacity:1;   }}
  50%     {{ opacity:0.7; }}
}}
.hot_cell {{ animation: cell_pulse 2s ease-in-out infinite; }}

/* ── header underline draw ── */
@keyframes draw_underline {{
  from {{ stroke-dashoffset: 600; }}
  to   {{ stroke-dashoffset: 0;   }}
}}
.draw_underline {{
  stroke-dasharray: 600;
  animation: draw_underline 0.9s ease-out 0.3s both;
}}
"""

    # ── stat line helper ─────────────────────────────────────────────────
    def row(label, value, row_idx, y, extra=''):
        dl = _dots(30, len(label) + 2)
        return (
            f'<text x="390" y="{y}" class="r{row_idx}" font-size="15">'
            f'<tspan fill="{t["comment"]}">. </tspan>'
            f'<tspan fill="{t["key"]}">{_esc(label)}</tspan>'
            f'<tspan fill="{t["comment"]}">:{_esc(dl)}</tspan>'
            f'<tspan fill="{t["value"]}">{value}</tspan>'
            f'{extra}</text>'
        )

    def section_header(label, y, row_idx):
        x_line_start = 390 + len(f'- {label} -') * 9.6 + 4
        return (
            f'<text x="390" y="{y}" class="r{row_idx}" font-size="15">'
            f'<tspan fill="{t["comment"]}">- </tspan>'
            f'<tspan fill="{t["text"]}">{_esc(label)}</tspan>'
            f'<tspan fill="{t["comment"]}"> -</tspan></text>'
            f'<line x1="{x_line_start:.0f}" y1="{y - 4}" x2="980" y2="{y - 4}" '
            f'stroke="{t["border"]}" stroke-width="1" class="draw_underline"/>'
        )

    # ── build right panel ────────────────────────────────────────────────
    right = []
    # username header
    right.append(
        f'<text x="390" y="30" class="r0" font-size="15">'
        f'<tspan fill="{t["text"]}">{USER_NAME}</tspan>'
        f'<tspan fill="{t["comment"]}"> — </tspan>'
        f'<tspan fill="{t["purple"]}">{status}</tspan>'
        f'</text>'
        f'<line x1="390" y1="35" x2="980" y2="35" stroke="{t["border"]}" '
        f'stroke-width="1" class="draw_underline"/>'
    )
    right.append(row('OS',     'Sequoia 15.5 / iOS 18.5 / Linux',  1, 55))
    right.append(row('Uptime', age,                                  2, 75))
    right.append(row('Site',   'animeshmishra.us',                   3, 95))
    right.append(row('IDE',    'Cursor, VSCode, IDEA',               4, 115))
    right.append(row('Shell',  'zsh  ·  iTerm2',                     5, 135))

    # ── Languages section ──────────────────────────────────────────────
    right.append(f'<text x="390" y="165" class="r6" font-size="15" fill="{t["comment"]}">.</text>')
    right.append(section_header('Top Languages (by bytes written)', 185, 7))
    right.append(lang_bars)

    # stats below languages (dynamic y based on lang_section_h)
    y_after_langs = 200 + lang_section_h + 10
    right.append(f'<text x="390" y="{y_after_langs}" class="r8" font-size="15" fill="{t["comment"]}">.</text>')
    right.append(section_header('Contact', y_after_langs + 22, 9))
    right.append(row('Email',    'animeshmishra0567@gmail.com', 10, y_after_langs + 44))
    right.append(row('LinkedIn', 'animeshmishra0',              11, y_after_langs + 64))
    right.append(row('Discord',  'sch_rodinger',                12, y_after_langs + 84))
    right.append(row('Work',     'am847@snu.edu.in',            13, y_after_langs + 104))

    y_stats = y_after_langs + 126
    right.append(f'<text x="390" y="{y_stats - 16}" class="r14" font-size="15" fill="{t["comment"]}">.</text>')
    right.append(section_header('GitHub Stats', y_stats, 15))

    right.append(
        f'<text x="390" y="{y_stats + 22}" class="r16" font-size="15">'
        f'<tspan fill="{t["comment"]}">. </tspan>'
        f'<tspan fill="{t["key"]}">Repos</tspan>'
        f'<tspan fill="{t["comment"]}">: </tspan>'
        f'<tspan fill="{t["value"]}">{repos}</tspan>'
        f'<tspan fill="{t["comment"]}">  {{contributed: </tspan>'
        f'<tspan fill="{t["value"]}">{contrib}</tspan>'
        f'<tspan fill="{t["comment"]}"  >}}  </tspan>'
        f'<tspan fill="{t["key"]}">Stars</tspan>'
        f'<tspan fill="{t["comment"]}">: </tspan>'
        f'<tspan fill="{t["value"]}">{stars}</tspan>'
        f'</text>'
    )
    right.append(
        f'<text x="390" y="{y_stats + 44}" class="r17" font-size="15">'
        f'<tspan fill="{t["comment"]}">. </tspan>'
        f'<tspan fill="{t["key"]}">Commits</tspan>'
        f'<tspan fill="{t["comment"]}">: </tspan>'
        f'<tspan fill="{t["value"]}">{commits}</tspan>'
        f'<tspan fill="{t["comment"]}">    </tspan>'
        f'<tspan fill="{t["key"]}">Followers</tspan>'
        f'<tspan fill="{t["comment"]}">: </tspan>'
        f'<tspan fill="{t["value"]}">{followers}</tspan>'
        f'</text>'
    )
    right.append(
        f'<text x="390" y="{y_stats + 66}" class="r18" font-size="15">'
        f'<tspan fill="{t["comment"]}">. </tspan>'
        f'<tspan fill="{t["key"]}">Lines of Code</tspan>'
        f'<tspan fill="{t["comment"]}">: </tspan>'
        f'<tspan fill="{t["value"]}">{loc_net}</tspan>'
        f'<tspan fill="{t["comment"]}">  (</tspan>'
        f'<tspan fill="{t["green"]}">{loc_add}++</tspan>'
        f'<tspan fill="{t["comment"]}">  </tspan>'
        f'<tspan fill="{t["red"]}">{loc_del}--</tspan>'
        f'<tspan fill="{t["comment"]}">)</tspan>'
        f'</text>'
    )
    right.append(
        f'<text x="390" y="{y_stats + 88}" class="r19" font-size="15">'
        f'<tspan fill="{t["comment"]}">. </tspan>'
        f'<tspan fill="{t["key"]}">Streak</tspan>'
        f'<tspan fill="{t["comment"]}">: </tspan>'
        f'<tspan fill="{t["green"]}">{streak} days</tspan>'
        f'<tspan fill="{t["comment"]}">    </tspan>'
        f'<tspan fill="{t["key"]}">Week</tspan>'
        f'<tspan fill="{t["comment"]}">: </tspan>'
        f'<tspan fill="{t["value"]}">#{data["week_num"]}</tspan>'
        f'</text>'
    )

    # ── prompt + blink cursor ────────────────────────────────────────────
    prompt_y = y_stats + 110
    right.append(
        f'<text x="390" y="{prompt_y}" class="r20" font-size="15">'
        f'<tspan fill="{t["purple"]}">❯</tspan>'
        f'<tspan fill="{t["comment"]}"> </tspan>'
        f'<tspan fill="{t["text"]}" class="cursor">▊</tspan>'
        f'</text>'
    )

    right_panel = '\n'.join(right)

    # ── vertical divider between ASCII and stats ─────────────────────────
    divider_h = max(520, prompt_y + 20)

    # ── assemble SVG ─────────────────────────────────────────────────────
    svg = f"""<?xml version='1.0' encoding='UTF-8'?>
<svg xmlns="http://www.w3.org/2000/svg"
     font-family="ConsolasFallback,Consolas,monospace"
     width="{W}px" height="{H}px" font-size="16px">

<defs>
  <!-- Marquee clip -->
  <clipPath id="marquee_clip">
    <rect x="0" y="632" width="{W}" height="28"/>
  </clipPath>
  <!-- Amethyst gradient for card border -->
  <linearGradient id="border_grad" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%"   stop-color="{t['purple']}" stop-opacity="0.6"/>
    <stop offset="50%"  stop-color="{t['border']}" stop-opacity="1"/>
    <stop offset="100%" stop-color="{t['purple']}" stop-opacity="0.6"/>
  </linearGradient>
</defs>

<style>{css}</style>

<!-- Card background -->
<rect width="{W}" height="{H - 10}" fill="{t['card']}" rx="15"
      stroke="url(#border_grad)" stroke-width="1.5"/>

<!-- Chrome bar top-left (ASCII panel) -->
<rect x="0" y="0" width="385" height="20" fill="{t['chrome']}" rx="12"/>
<rect x="0" y="10" width="385" height="10" fill="{t['chrome']}"/>
<circle cx="16" cy="11" r="5" fill="#ff5f56"/>
<circle cx="32" cy="11" r="5" fill="#ffbd2e"/>
<circle cx="48" cy="11" r="5" fill="#27c93f"/>

<!-- Vertical divider -->
<line x1="385" y1="0" x2="385" y2="{divider_h}"
      stroke="{t['border']}" stroke-width="1" class="draw_line"/>

<!-- ASCII art with amethyst glow -->
<g class="ascii_glow">
  <text x="5" y="20" fill="{t['text']}" font-size="15.5">
{ascii_lines}
  </text>
</g>

<!-- Right panel stats -->
{right_panel}

<!-- Horizontal separator before heatmap -->
<line x1="0" y1="522" x2="{W}" y2="522"
      stroke="{t['border']}" stroke-width="1" class="draw_line"/>

<!-- Heatmap header -->
<text x="110" y="540" fill="{t['comment']}" font-size="13">
  contributions · last 26 weeks
</text>
<text x="750" y="540" fill="{t['comment']}" font-size="13">streak:</text>
<text x="805" y="540" fill="{t['green']}"   font-size="13">{streak} days</text>

<!-- Day labels -->
<text x="98" y="558" fill="{t['comment']}" font-size="11" text-anchor="end">Mon</text>
<text x="98" y="580" fill="{t['comment']}" font-size="11" text-anchor="end">Wed</text>
<text x="98" y="602" fill="{t['comment']}" font-size="11" text-anchor="end">Fri</text>

<!-- Contribution heatmap -->
{heatmap_cells}

<!-- Heatmap legend -->
<text x="855" y="540" fill="{t['comment']}" font-size="11">less</text>
{legend_cells}
<text x="935" y="540" fill="{t['comment']}" font-size="11">more</text>

<!-- Separator before marquee -->
<line x1="0" y1="625" x2="{W}" y2="625"
      stroke="{t['border']}" stroke-width="1"/>

<!-- Scrolling featured project marquee -->
<g clip-path="url(#marquee_clip)">
  <text y="646" fill="{t['comment']}" font-size="13" class="marquee_inner"
        dominant-baseline="middle">{_esc(marquee_text)}</text>
</g>

</svg>"""
    return svg


# ─────────────────────────── main ────────────────────────────

if __name__ == '__main__':
    print('🚀 Starting GitHub Stats Update...')
    print('Calculation times:')

    user_data, user_time = perf_counter(user_getter, USER_NAME)
    OWNER_ID, acc_date = user_data
    formatter('account data', user_time)

    age_data, age_time = perf_counter(daily_readme, datetime.datetime(2002, 7, 5))
    formatter('age calculation', age_time)

    try:
        total_loc, loc_time = perf_counter(loc_query, ['OWNER', 'COLLABORATOR', 'ORGANIZATION_MEMBER'], 7)
        formatter('LOC (cached)' if total_loc[-1] else 'LOC (rebuilt)', loc_time)
        commit_data, commit_time = perf_counter(commit_counter, 7)
        formatter('commit count', commit_time)
    except Exception as exc:
        print(f'⚠️  LOC/commit scan failed (using 0): {exc}')
        total_loc = [0, 0, 0, False]
        commit_data = 0
        commit_time = 0

    star_data, star_time     = perf_counter(graph_repos_stars, 'stars', ['OWNER'])
    formatter('stars', star_time)

    repo_data, repo_time     = perf_counter(graph_repos_stars, 'repos', ['OWNER'])
    formatter('repos', repo_time)

    contrib_data, contrib_time = perf_counter(
        graph_repos_stars, 'repos', ['OWNER', 'COLLABORATOR', 'ORGANIZATION_MEMBER'])
    formatter('contrib repos', contrib_time)

    follower_data, follow_time = perf_counter(follower_getter, USER_NAME)
    formatter('followers', follow_time)

    top_langs, lang_time = perf_counter(get_top_languages)
    formatter('top languages', lang_time)

    weeks_data, cal_time = perf_counter(get_contribution_calendar)
    weeks, cal_total = weeks_data
    formatter('contribution cal', cal_time)

    featured_repos, feat_time = perf_counter(get_featured_repos)
    formatter('featured repos', feat_time)

    # Weekly rotation
    week_num = datetime.date.today().isocalendar()[1]
    featured = featured_repos[week_num % len(featured_repos)] if featured_repos else None
    status   = WEEKLY_STATUSES[week_num % len(WEEKLY_STATUSES)]
    streak   = calculate_streak(weeks)

    # Format LOC
    loc_add_fmt = '{:,}'.format(total_loc[0])
    loc_del_fmt = '{:,}'.format(total_loc[1])
    loc_net_fmt = '{:,}'.format(total_loc[2])

    profile_data = {
        'age':       age_data,
        'commits':   commit_data,
        'stars':     star_data,
        'repos':     repo_data,
        'contrib':   contrib_data,
        'followers': follower_data,
        'loc_add':   loc_add_fmt,
        'loc_del':   loc_del_fmt,
        'loc_net':   loc_net_fmt,
        'top_langs': top_langs,
        'weeks':     weeks,
        'streak':    streak,
        'featured':  featured,
        'week_num':  week_num,
        'status':    status,
    }

    print('\n🎨 Generating SVGs...')
    with open('dark_mode.svg', 'w', encoding='utf-8') as f:
        f.write(generate_svg('dark', profile_data))
    with open('light_mode.svg', 'w', encoding='utf-8') as f:
        f.write(generate_svg('light', profile_data))

    print('\n✅ Done!')
    print(f'   repos={repo_data}  stars={star_data}  commits={commit_data:,}')
    print(f'   followers={follower_data}  loc={loc_net_fmt}')
    print(f'   streak={streak}d  week={week_num}  featured={featured["name"] if featured else "—"}')
    print(f'   languages={[l["name"] for l in top_langs]}')
    print(f'\nTotal GitHub GraphQL API calls: {sum(QUERY_COUNT.values()):>3}')
    for name, count in QUERY_COUNT.items():
        print(f'   {name:<28} {count:>4}')
