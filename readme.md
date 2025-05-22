<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Animesh Mishra - Profile</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;700&family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-color: #0D1117; /* Dark background, similar to GitHub dark mode */
            --primary-text-color: #C9D1D9; /* Light grey text */
            --secondary-text-color: #8B949E; /* Medium grey text */
            --accent-color-primary: #58A6FF; /* GitHub's primary blue accent */
            --accent-color-secondary: #3FB950; /* GitHub's green accent */
            --accent-color-purple: #8A63D2; /* A purple accent, inspired by 'radical' theme */
            --border-color: #30363D; /* Border color for elements */
            --card-bg-color: #161B22; /* Background for card-like elements */
            --font-primary: 'Roboto Mono', monospace;
            --font-display: 'Orbitron', sans-serif; /* More "robotic" font for headers */
            --link-color: var(--accent-color-primary);
            --link-hover-color: #79C0FF;
        }

        body {
            font-family: var(--font-primary);
            background-color: var(--bg-color);
            color: var(--primary-text-color);
            margin: 0;
            padding: 20px;
            line-height: 1.6;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            background-color: var(--card-bg-color);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        h1, h2, h3 {
            font-family: var(--font-display);
            color: var(--accent-color-primary);
            border-bottom: 2px solid var(--border-color);
            padding-bottom: 8px;
            margin-top: 20px;
            margin-bottom: 15px;
        }
        h1 {
            font-size: 2.5em;
            text-align: center;
            color: var(--accent-color-secondary); /* Make main title stand out */
        }
        h2 {
            font-size: 1.8em;
            color: var(--accent-color-purple);
        }
        h3 {
            font-size: 1.4em;
            color: var(--primary-text-color);
            border-bottom: none;
        }

        p {
            margin-bottom: 15px;
        }

        a {
            color: var(--link-color);
            text-decoration: none;
            transition: color 0.3s ease;
        }
        a:hover {
            color: var(--link-hover-color);
            text-decoration: underline;
        }

        .header-section, .connect-section, .footer-section, .stats-section {
            text-align: center;
            margin-bottom: 30px;
        }

        .header-section .subtitle {
            font-size: 1.1em;
            color: var(--secondary-text-color);
            margin-bottom: 20px;
        }

        .social-badges img, .status-badges img {
            margin: 5px;
            transition: transform 0.2s ease-in-out;
        }
        .social-badges img:hover, .status-badges img:hover {
            transform: scale(1.1);
        }

        hr {
            border: none;
            height: 1px;
            background-color: var(--border-color);
            margin: 40px 0;
        }

        .skills-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        .skills-table th, .skills-table td {
            border: 1px solid var(--border-color);
            padding: 12px;
            text-align: left;
            vertical-align: top;
        }
        .skills-table th {
            background-color: rgba(var(--accent-color-purple-rgb, 138, 99, 210), 0.1); /* Using RGB for opacity */
            color: var(--accent-color-purple);
            font-family: var(--font-display);
        }
        .skills-table ul {
            list-style-type: '» '; /* Robo-style list bullets */
            padding-left: 20px;
            margin: 0;
        }
        .skills-table li {
            margin-bottom: 5px;
        }
        /* Adding RGB values for accent-color-purple for opacity */
        :root {
            --accent-color-purple-rgb: 138, 99, 210;
        }


        .github-stats-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            justify-content: center;
        }
        .github-stats-grid img {
            border: 1px solid var(--border-color);
            border-radius: 8px;
            background-color: #0d1117; /* Match image background if possible */
            padding: 10px; /* Add padding if image itself has no bg */
            max-width: 100%; /* Ensure responsiveness */
        }
        
        .user-provided-image-container {
            margin-bottom: 20px;
            padding: 10px;
            border: 1px dashed var(--accent-color-secondary);
            border-radius: 8px;
            background-color: rgba(46, 160, 67, 0.05); /* Light green tint */
        }
        .user-provided-image-container img {
            max-width: 100%;
            height: auto;
            border-radius: 6px;
            display: block;
            margin: 0 auto;
        }
        .user-provided-image-container p {
            font-size: 0.9em;
            color: var(--secondary-text-color);
            text-align: center;
        }

        .footer-section p {
            font-size: 0.9em;
            color: var(--secondary-text-color);
        }
        .footer-section img {
            margin-top: 10px;
        }

        .ascii-art-container {
            background-color: #010101; /* Near black for terminal feel */
            border: 1px solid var(--accent-color-secondary);
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 30px;
            overflow-x: auto; /* For responsiveness if art is too wide */
            text-align: center; /* Center the pre block */
        }

        .ascii-art {
            font-family: 'Courier New', Courier, monospace; /* Classic terminal font */
            color: #39FF14; /* Neon green text */
            font-size: 0.9em; /* Adjust as needed */
            line-height: 1.2;
            white-space: pre;
            display: inline-block; /* Allow centering */
            text-align: left; /* Align text within pre block to left */
        }

    </style>
</head>
<body>
<div class="container">

  <div class="header-section">
    <h1>Animesh Mishra</h1>
    <p class="subtitle"><strong>Passionate Java Developer | Building Robust & Scalable Solutions <span style="color: var(--accent-color-secondary);">🚀</span></strong></p>
    <p class="social-badges">
      <a href="mailto:animeshmishra0567@gmail.com">
        <img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Gmail"/>
      </a>
      <a href="https://www.linkedin.com/in/animeshmishra0" target="_blank">
        <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"/>
      </a>
      <a href="https://github.com/amethystani" target="_blank">
        <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
      </a>
      <a href="https://twitter.com/yourusername" target="_blank"> <!-- Consider updating or removing if not active -->
        <img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=Twitter&logoColor=white" alt="Twitter"/>
      </a>
    </p>
    <p class="status-badges">
      <img src="https://img.shields.io/badge/Status-Open%20to%20Work-brightgreen?style=flat-square&colorA=30363D&colorB=3FB950" alt="Open to Work"/>
      <img src="https://img.shields.io/badge/Seeking-Collaboration-blue?style=flat-square&colorA=30363D&colorB=58A6FF" alt="Seeking Collaboration"/>
    </p>
  </div>

  <div class="ascii-art-container">
    <pre class="ascii-art">
&gt; i hate dejavs.
                 _           ___             _____________
          ,-----' |  ,    | &lt;_'_`)         ,'             `.
          | //  : | /   (() :-)-||        /    Tsk, tsk!    \\
          | //  : |  -  [:]  \\-_/`    ___/  The accents are  \\
          | //  : | \\   \\ \\__/:_\\     `.    on the "e" and    |
          `-----._|  `   \\__// ( \\|     |   the "a" and on    |
           _/___\_         //  | ||]    |   the "a" they're   |
     _____[_______]_[~~-_ (.L_/  ||      \\   the other way   /
    [____________________]' `\\_,/'/       \\      around     /
      ||| /          |||  ,___,'./         `._____________,'
      ||| \\          |||,'______|
      ||| /          /|| I==||
      ||| \\       __/_||  __||__
  -----||-/------`-._/||-o--o---o---
    ~~~~~'

Ool
    </pre>
  </div>

  <hr>

  <h2><span style="color: var(--accent-color-secondary);">▌</span><span style="color: var(--accent-color-purple);">█</span><span style="color: var(--accent-color-primary);">▍</span>🛠️ Technical Skills Matrix</h2>
  <table class="skills-table">
    <thead>
      <tr>
        <th colspan="2" style="text-align:center;">Core Competencies</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td valign="top" width="50%">
          <h3>Programming Languages</h3>
          <ul>
            <li>Java (Intermediate)</li>
            <li>Python (Intermediate)</li>
            <li>C (Intermediate)</li>
            <li>JavaScript (Basic)</li>
            <li>HTML5 (Intermediate)</li>
            <li>CSS3 (Basic)</li>
            <li>SQL (Intermediate)</li>
          </ul>
        </td>
        <td valign="top" width="50%">
          <h3>Frameworks & Libraries</h3>
          <ul>
            <li>Spring (Basic)</li>
            <li>Flutter (Intermediate)</li>
            <li>Bootstrap (Basic)</li>
            <li>jQuery (Basic)</li>
            <li>Hibernate (Basic)</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td valign="top" width="50%">
          <h3>Tools & Technologies</h3>
          <ul>
            <li>Git (Intermediate)</li>
            <li>Docker (Beginner)</li>
            <li>AWS (Beginner)</li>
            <li>Jenkins (Basic)</li>
            <li>Linux (Intermediate)</li>
            <li>Maven (Intermediate)</li>
            <li>Gradle (Basic)</li>
          </ul>
        </td>
        <td valign="top" width="50%">
          <h3>Databases</h3>
          <ul>
            <li>MySQL (Intermediate)</li>
            <li>PostgreSQL (Basic)</li>
            <li>MongoDB (Basic)</li>
            <li>SQLite (Basic)</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td colspan="2" valign="top">
          <h3>Development & Design Tools</h3>
          <ul>
            <li>IntelliJ IDEA (Intermediate)</li>
            <li>VS Code (Intermediate)</li>
            <li>Eclipse (Intermediate)</li>
            <li>Adobe Photoshop (Intermediate)</li>
            <li>Figma (Basic)</li>
            <li>Jira (Basic)</li>
            <li>Postman (Basic)</li>
          </ul>
        </td>
      </tr>
    </tbody>
  </table>

  <hr>

  <div class="stats-section">
    <h2><span style="color: var(--accent-color-secondary);">▌</span><span style="color: var(--accent-color-purple);">█</span><span style="color: var(--accent-color-primary);">▍</span>📊 GitHub Activity Nexus</h2>
    
    <div class="user-provided-image-container">
        <p><strong>GitHub Contribution Overview [2021-02-14 / 2022-02-13]</strong></p>
        <img src="https://user-images.githubusercontent.com/78784190/228073840-e7c54c04-2fd5-4e06-92d4-1a84e9c825cc.png" alt="GitHub Contributions Overview Image (Replace with your image URL if different)"/>
        <!-- 
            The image above is based on the visual provided in the prompt. 
            Replace the src URL with the actual, accessible URL of your generated image.
            This image appears to show:
            - Isometric contribution graph
            - Language donut chart (C, TypeScript, Kotlin, Shell, Perl, other)
            - Activity radar chart (Commit, Issue, PullReq, Review, Repo)
            - Stats: 1497 contributions, 135 stars, 14 forks
        -->
    </div>

    <div class="github-stats-grid">
      <img src="https://github-readme-stats.vercel.app/api?username=amethystani&show_icons=true&count_private=true&theme=radical&line_height=25&bg_color=0d1117&title_color=8A63D2&icon_color=8A63D2&text_color=C9D1D9&border_radius=10&border_color=30363D" width="48%" alt="Animesh's GitHub Stats"/>
      <img src="https://github-readme-streak-stats.herokuapp.com/?user=amethystani&theme=radical&hide_border=false&background=0d1117&stroke=8A63D2&ring=8A63D2&fire=8A63D2&currStreakNum=C9D1D9&sideNums=C9D1D9&currStreakLabel=C9D1D9&sideLabels=C9D1D9&dates=C9D1D9&border_radius=10&border=30363D" width="48%" alt="GitHub Streak"/>
      <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=amethystani&layout=compact&theme=radical&bg_color=0d1117&title_color=8A63D2&text_color=C9D1D9&border_radius=10&hide_border=false&langs_count=8&border_color=30363D" width="48%" alt="Top Languages"/>
      <img src="https://github-profile-trophy.vercel.app/?username=amethystani&theme=discord&column=7&margin-w=15&margin-h=15&no-bg=true&no-frame=false&border_radius=8&border_color=30363D" width="98%" alt="GitHub Trophies"/>
    </div>
    <p style="margin-top: 20px;">
      <img src="https://github-readme-activity-graph.vercel.app/graph?username=amethystani&bg_color=0d1117&color=8A63D2&line=58A6FF&point=3FB950&area=true&hide_border=false&area_color=161B22&border_radius=8" alt="Contribution Graph" width="98%"/>
    </p>
  </div>

  <hr>

  <div class="connect-section">
    <h2><span style="color: var(--accent-color-secondary);">▌</span><span style="color: var(--accent-color-purple);">█</span><span style="color: var(--accent-color-primary);">▍</span>💬 Initiate Connection</h2>
    <p>System online. Ready for interesting conversations, collaboration opportunities, and new network links. Transmit your signal.</p>
    <p class="social-badges">
      <a href="mailto:animeshmishra0567@gmail.com" style="text-decoration: none; margin: 0 10px;">
        <img src="https://img.shields.io/badge/Signal:_Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email"/>
      </a>
      <a href="https://www.linkedin.com/in/animeshmishra0" target="_blank" style="text-decoration: none; margin: 0 10px;">
        <img src="https://img.shields.io/badge/Link:_Professional_Network-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"/>
      </a>
      <a href="https://github.com/amethystani" target="_blank" style="text-decoration: none; margin: 0 10px;">
        <img src="https://img.shields.io/badge/Node:_Code_Repository-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
      </a>
      <a href="https://animeshmishra.me" target="_blank" style="text-decoration: none; margin: 0 10px;">
        <img src="https://img.shields.io/badge/Hub:_Personal_Portfolio-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Portfolio"/>
      </a>
    </p>
  </div>

  <hr>

  <div class="footer-section">
    <p>// Executed with ❤️ and a core directive for code //</p>
    <img src="https://visitor-badge.laobi.icu/badge?page_id=amethystani.amethystani&left_text=Active_Users&right_color=3FB950&style=flat-square&left_bg_color=161B22&right_bg_color=0D1117&left_color=C9D1D9&right_color=C9D1D9" alt="Visitors"/>
  </div>

</div>

<!--
SYSTEM LOG: Profile Initialized. User: Animesh Mishra (https://github.com/amethystani)
Thank you for interfacing with this profile. Standby for further interaction.
-->
</body>
</html>
