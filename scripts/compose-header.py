"""Frame the upstream Platane/snk SVG without changing its animation."""
from pathlib import Path
import re
root = Path(__file__).resolve().parents[1]
snake = (root / 'assets/contribution-arcade.svg').read_text()
snake = snake.replace('width="880" height="192"', 'x="28" y="249" width="1144" height="250"', 1)
header = '''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="525" viewBox="0 0 1200 525" role="img" aria-labelledby="profile-title profile-desc">
<title id="profile-title">Animesh Mishra — ML/NLP Researcher</title><desc id="profile-desc">An orange arcade snake moves through Animesh's actual GitHub contribution grid. Scientific AI, retrieval and evaluation. Open to research roles in New Delhi.</desc>
<rect width="1200" height="525" rx="12" fill="#16120f"/><path d="M12 0H1188V6H12Z" fill="#ff792e"/>
<g font-family="Arial,Helvetica,sans-serif"><text x="38" y="48" fill="#ff994c" font-family="monospace" font-size="15" letter-spacing="2">AMETHYSTANI / RESEARCH + CODE</text><text x="1162" y="48" text-anchor="end" fill="#c7a689" font-family="monospace" font-size="14">NEW DELHI, INDIA</text>
<text x="32" y="137" fill="#fff0d9" font-size="83" font-weight="900" letter-spacing="-4">ANIMESH MISHRA<tspan fill="#ff792e">_</tspan></text>
<text x="38" y="184" fill="#ffc28f" font-size="24">ML/NLP Researcher · Scientific AI · Retrieval · Evaluation</text>
<path d="M38 214H1162" stroke="#634029"/><text x="38" y="248" fill="#ff994c" font-family="monospace" font-size="14" letter-spacing="1">CONTRIBUTION ARCADE / MY GITHUB ACTIVITY, IN MOTION</text><text x="1162" y="248" text-anchor="end" fill="#b9977a" font-family="monospace" font-size="14">OPEN TO RESEARCH ROLES ↗</text></g>
'''
(root / 'assets/profile-arcade.svg').write_text(header + snake + '</svg>')
