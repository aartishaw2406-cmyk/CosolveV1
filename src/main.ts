import './style.css';



type View = 'home' | 'register' | 'organisation' | 'provider' | 'solver';

type Role = 'solver' | 'provider' | 'organisation';



let currentView: View = 'home';

let selectedRole: Role = 'solver';

let modalOpen = false;

let activeTab = 'Overview';

let adopted = new Set<number>();

let submittedIssues: string[] = [];

let authMode: 'login' | 'register' = 'register';

let challengeFilter = 'All';



const photos = {

  hero: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85',

  field: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=85',

  community: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1000&q=85',

  student: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=85',

  site: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=1000&q=85',

  school: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1000&q=85',

  flood: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1000&q=85',

  bus: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1000&q=85',

  hospital: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1000&q=85',

  footpath: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1000&q=85',

  learning: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=85',

  lights: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1000&q=85',

  water: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?auto=format&fit=crop&w=1000&q=85',

  lake: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1000&q=85',

  access: 'https://images.unsplash.com/photo-1573496358770-bb7c9b8b6e0a?auto=format&fit=crop&w=1000&q=85',

  food: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85'

};



type Challenge = {

category: string; title: string; location: string; description: string;

opportunity: string; role: string; urgency: string; grant: string; image: string;

};



const challenges: Challenge[] = [

  { category: 'Environment', title: 'Garbage gets collected, but the area becomes dirty again', location: 'Neighbourhoods & marketplaces', description: 'Overflowing bins, mixed waste and irregular collection can cause the same areas to become dirty again.', opportunity: 'Map recurring dumping spots, analyse when waste builds up, and coordinate residents, shopkeepers and waste collectors.', role: 'CO-SOLVE can match a student team with a local waste-management partner and track whether the hotspot improves.', urgency: 'Easy to pilot', grant: 'Partner support', image: photos.field },

  { category: 'Education', title: 'Schools have facilities that don’t reliably work', location: 'Schools & learning spaces', description: 'Drinking-water taps, fans, toilets and classroom infrastructure may be broken or poorly maintained.', opportunity: 'Conduct a facilities audit with permission, prioritise repairs, and design a maintenance-reporting process.', role: 'Connect student volunteers, school administrators, technical mentors and potential CSR support.', urgency: 'Community need', grant: 'CSR potential', image: photos.school },

  { category: 'Infrastructure', title: 'The same road floods after every heavy rain', location: 'Roads, drains & low-lying areas', description: 'Waterlogging can block access to schools, shops, homes and bus stops.', opportunity: 'Record where and when water accumulates, map blocked drains, and investigate causes with civil-engineering mentors.', role: 'Route the challenge to civil engineers, GIS students, civic groups and the relevant local authority.', urgency: 'Seasonal priority', grant: 'Civic partnership', image: photos.flood },

  { category: 'Transport', title: 'People don’t know when the next bus will arrive', location: 'Bus stops & commuter routes', description: 'Passengers may lack reliable arrival information, shelter, seating or clear route details.', opportunity: 'Survey commuters, document route-information gaps, and prototype a simple multilingual bus-information service.', role: 'Bring together IT students, transport operators, local commuters and accessibility experts.', urgency: 'Pilot-ready', grant: 'Mobility partner', image: photos.bus },

  { category: 'Healthcare', title: 'Patients lose time navigating hospital services', location: 'Hospitals & clinics', description: 'People may struggle to find the correct department, understand registration steps or locate available services.', opportunity: 'Observe the patient journey with hospital permission and prototype a clear navigation guide or queue-information system.', role: 'Match UX, computer-science and design students with hospital administrators. Patient privacy must be protected.', urgency: 'Needs permission', grant: 'Health partner', image: photos.hospital },

  { category: 'Accessibility', title: 'Footpaths exist but pedestrians cannot use them', location: 'Footpaths & public routes', description: 'Parked vehicles, damaged surfaces, vendor congestion and missing ramps can block walking routes.', opportunity: 'Audit a short route and identify barriers for wheelchair users, older adults and parents with prams.', role: 'Connect architecture, civil-engineering and accessibility students with residents and civic bodies.', urgency: 'Inclusive design', grant: 'Civic partnership', image: photos.footpath },

  { category: 'Digital Learning', title: 'Students lack access to useful digital learning resources', location: 'Schools & community learning centres', description: 'Some learners have limited access to computers, reliable internet or guidance on digital tools.', opportunity: 'Assess local needs and develop shared-device access, digital-literacy sessions or offline learning resources.', role: 'Coordinate student mentors, schools, NGOs, computer labs and corporate donors.', urgency: 'Mentor-friendly', grant: 'CSR potential', image: photos.learning },

  { category: 'Public Safety', title: 'Broken streetlights make everyday routes harder to use', location: 'Streets & public spaces', description: 'Poorly lit public routes can make walking and using public spaces after dark less comfortable.', opportunity: 'Create a verified lighting-gap map and track repair requests with community permission.', role: 'Coordinate residents, electrical experts and the responsible authority without exposing complainants’ private information.', urgency: 'Local action', grant: 'Civic partnership', image: photos.lights },

  { category: 'Water', title: 'Water supply is irregular or water quality is uncertain', location: 'Community water systems', description: 'Communities can face intermittent supply, unequal distribution, leakage or concerns about water quality.', opportunity: 'Map reported supply timings and leaks, and help residents find verified information about reporting issues and testing water.', role: 'Involve environmental and civil engineers, water-service providers and community representatives.', urgency: 'Needs verification', grant: 'Technical partner', image: photos.water },

  { category: 'Environment', title: 'Local lakes are polluted, but responsibility is fragmented', location: 'Lakes & shared water bodies', description: 'Waste dumping, declining water quality and unclear maintenance responsibilities can make lake restoration difficult.', opportunity: 'Document visible pollution, research stakeholders, and develop a monitoring or community-reporting pilot.', role: 'Connect environmental-science students, local groups, researchers and relevant authorities. Hazardous samples require qualified supervision.', urgency: 'Long-term impact', grant: 'Research partner', image: photos.lake },

  { category: 'Accessibility', title: 'Public services are difficult to access for people with disabilities', location: 'Websites, buildings & transport', description: 'Websites, forms, buildings and transport information may not be accessible to everyone.', opportunity: 'Conduct an accessibility audit with users’ consent and prototype a more accessible website, form or wayfinding guide.', role: 'Match students with disability organisations, accessibility specialists and service providers.', urgency: 'Inclusive design', grant: 'Expert partner', image: photos.access },

  { category: 'Food Security', title: 'Surplus food and people who need it don’t connect in time', location: 'Events, shops & cafeterias', description: 'Events, shops and cafeterias may have surplus food while community organisations need reliable supply.', opportunity: 'Design a safe workflow for reporting surplus, verifying recipients and arranging timely collection through approved partners.', role: 'Bring together food providers, NGOs, student coordinators and food-safety partners. Food safety and traceability are essential.', urgency: 'Time-sensitive', grant: 'NGO partnership', image: photos.food }

];



const icon = (symbol: string) => `<span class="icon" aria-hidden="true">${symbol}</span>`;



function go(view: View) {

currentView = view;

modalOpen = false;

  render();

window.scrollTo({ top: 0, behavior: 'smooth' });

}



function header() {
  return `
    <header class="topbar">
      <div class="topbar-main">
        <div class="brand-lockup">
          <a href="#home" class="brand-name" data-view="home" aria-label="CO-SOLVE home">Co-Solve</a>
          <p class="brand-tagline">Ideas today. Impact tomorrow.</p>
        </div>
        <div class="header-actions">
          <button class="button button-dark nav-start" data-view="register">Get Started ↗</button>
          <button class="button button-outline nav-login" data-action="signin">Login</button>
        </div>
      </div>
      <nav class="desktop-actions site-links" aria-label="Main navigation">
        <button class="nav-link" data-scroll="who-we-are">Who are we?</button>
        <button class="nav-link" data-scroll="challenges">Explore</button>
        <button class="nav-link" data-scroll="solved-problems">Solved problems</button>
        <button class="nav-link" data-scroll="impact">Impact</button>
      </nav>
    </header>`;
}

function nav() {

  const items: { label: string; view: View; symbol: string }[] = [

    { label: 'PUBLIC', view: 'home', symbol: '◉' },

    { label: 'SOLVER', view: 'solver', symbol: '◎' },

    { label: 'PROVIDER', view: 'provider', symbol: '♧' },

    { label: 'ORG', view: 'organisation', symbol: '⌂' }

  ];

  return `<nav class="bottom-nav">${items.map(item => `

    <button class="${currentView === item.view ? 'active' : ''}" data-view="${item.view}">

      <span>${item.symbol}</span><small>${item.label}</small>

    </button>`).join('')}</nav>`;

}



function challengeCard(c: Challenge, i: number) {

  return `

    <article class="challenge-card reveal">

      <div class="challenge-media">

        <img class="challenge-image" src="${c.image}" alt="${escapeHTML(c.title)}" loading="lazy">

        <span class="image-index">${String(i + 1).padStart(2, '0')}</span>

      </div>

      <div class="challenge-body">

        <div class="chips"><span class="tag">${c.category}</span><span class="priority">${c.urgency}</span></div>

        <h3>${c.title}</h3>

        <p>${c.description}</p>

        <details class="challenge-details">

          <summary>Student opportunity + CO-SOLVE role</summary>

          <p><strong>Student opportunity:</strong> ${c.opportunity}</p>

          <p><strong>How CO-SOLVE helps:</strong> ${c.role}</p>

        </details>

        <div class="muted-line">⌖ ${c.location} · ${c.grant}</div>

        <button class="button ${adopted.has(i) ? 'button-soft' : 'button-dark'}" data-adopt="${i}">

          ${adopted.has(i) ? 'Added to workspace ✓' : 'View / Adopt Challenge ↗'}

        </button>

      </div>

    </article>`;

}



function challengeSection() {

  const categories = ['All', ...Array.from(new Set(challenges.map(c => c.category)))];

  const visible = challenges.map((c, i) => ({ c, i })).filter(({ c }) => challengeFilter === 'All' || c.category === challengeFilter);

  return `

    <section class="section section-pad tinted" id="challenges">

      <div class="eyebrow">OPEN IN THE FIELD · 12 REAL-WORLD EXAMPLES</div>

      <h2>Active civic challenges</h2>

      <p>Real problems. Practical student opportunities. Measurable outcomes.</p>

      <div class="filter-row" aria-label="Filter challenges">

        ${categories.map(category => `<button class="filter-chip ${challengeFilter === category ? 'selected' : ''}" data-filter="${category}">${category}</button>`).join('')}

      </div>

      <div class="challenge-list">${visible.map(({ c, i }) => challengeCard(c, i)).join('')}</div>

    </section>`;

}



function homePage() {
  return `
    <section class="section section-pad mission-section" id="our-mission">
      <div class="mission-copy reveal">
        <h1 class="mission-title">OUR MISSION</h1>
        <p>To transform concerns into collaboration, and student potential into enduring societal value.</p>
      </div>
      <div class="mission-photo-wrap reveal"><img class="mission-photo" src="${photos.student}" alt="Students looking toward a city at sunset"></div>
    </section>

    <section class="section section-pad who-section" id="who-we-are">
      <div class="who-heading reveal"><h2>WHO ARE WE?</h2></div>
      <div class="who-copy reveal"><p>We are a community of students, mentors, and changemakers working together to understand real-world challenges and build meaningful solutions.</p><p>We turn ideas into action and student potential into solutions that matter.</p></div>
    </section>
    <section class="section section-pad process-section">
      <div class="eyebrow">FROM CONCERN TO CHANGE</div><h2>How CO-SOLVE works.</h2>
      <div class="stage-list">
        <article class="stage reveal"><b>01</b><div><h3>Explore</h3><p>Discover real-world challenges shared by communities.</p></div></article>
        <article class="stage reveal"><b>02</b><div><h3>Connect</h3><p>Bring students, mentors and organisations together.</p></div></article>
        <article class="stage reveal"><b>03</b><div><h3>Build</h3><p>Turn ideas into practical software, services or prototypes.</p></div></article>
        <article class="stage reveal"><b>04</b><div><h3>Show impact</h3><p>Track progress and document outcomes transparently.</p></div></article>
      </div>
    </section>

    ${challengeSection()}

    <section class="section section-pad solved-section" id="solved-problems">
      <div class="solved-heading reveal"><div><div class="eyebrow">SOLVED PROBLEMS</div><h2>From problem to solution.</h2><p>Explore practical ways students can turn real needs into action—through software, community work and tested prototypes.</p></div><span class="section-stamp">PROBLEM → ACTION → IMPACT</span></div>
      <div class="solved-grid">
        <article class="solved-card reveal"><span class="solved-number">01</span><div class="solved-type">SOFTWARE / DIGITAL</div><h3>Digital solutions</h3><p>Web platforms, reporting tools and accessible services that help people solve everyday problems.</p></article>
        <article class="solved-card reveal"><span class="solved-number">02</span><div class="solved-type">COMMUNITY / FIELD</div><h3>Community-led action</h3><p>Local audits, coordinated volunteers and practical pilots designed around community needs.</p></article>
        <article class="solved-card reveal"><span class="solved-number">03</span><div class="solved-type">RESEARCH / PROTOTYPE</div><h3>Tested ideas</h3><p>Research and prototypes developed with mentors, partners and the people affected by the challenge.</p></article>
      </div>
      <p class="section-footnote">These are solution pathways, not claims of completed or independently verified projects.</p>
    </section>

    <section class="section section-pad impact-band impact-layout" id="impact">
      <div class="impact-stat">
        <h2>Impact</h2>
        <div class="impact-number">1403</div>
      </div>
      <p class="impact-quote">We turn ideas into action and student potential into solutions that matter.</p>
      <div class="impact-action">
        <button class="button button-dark" data-view="register">Be Part of Change <span aria-hidden="true">→</span></button>
      </div>
    </section>

    <section class="section section-pad pillars-section">
      <div class="eyebrow">THREE PILLARS. ONE PURPOSE.</div><h2>Better, together.</h2>
      <div class="pillar-grid">
        <article class="pillar reveal"><span class="pillar-icon">♧</span><b>Citizens & providers</b><p>Share local problems and help define what needs to change.</p><button class="text-action" data-view="provider">Report a problem ↗</button></article>
        <article class="pillar reveal"><span class="pillar-icon">✳</span><b>Student solvers</b><p>Use your skills, curiosity and creativity to build solutions.</p><button class="text-action" data-view="solver">Explore solver space ↗</button></article>
        <article class="pillar reveal"><span class="pillar-icon">⌂</span><b>Organisations</b><p>Support teams, offer mentorship and help validate outcomes.</p><button class="text-action" data-view="organisation">Partner with us ↗</button></article>
      </div>
      <button class="button button-dark full" data-view="register">Join CO-SOLVE ↗</button>
    </section>`;
}

function roleFields() {

  if (selectedRole === 'solver') return `

    <label class="field">College / Institution<input name="institution" placeholder="Your college or university" required></label>

    <div class="field-grid">

      <label class="field">Course / discipline<input name="course" placeholder="e.g. B.Tech CSE" required></label>

      <label class="field">Year of study<select name="year"><option>Year 1</option><option>Year 2</option><option>Year 3</option><option>Year 4</option><option>Graduate / Other</option></select></label>

    </div>

    <label class="field">Skills and interests<input name="skills" placeholder="e.g. web development, GIS, design"></label>

    <label class="field">Portfolio / LinkedIn (optional)<input name="portfolio" type="url" placeholder="https://"></label>

    <label class="field">Weekly availability<select name="availability"><option>1–3 hours</option><option>4–6 hours</option><option>7–10 hours</option><option>10+ hours</option></select></label>`;

  if (selectedRole === 'provider') return `

    <label class="field">Community / locality<input name="institution" placeholder="Neighbourhood, ward or community group" required></label>

    <label class="field">Problem area<select name="focus"><option>Environment & sanitation</option><option>Education</option><option>Infrastructure</option><option>Transport</option><option>Healthcare</option><option>Accessibility</option><option>Water</option><option>Food security</option><option>Other</option></select></label>

    <label class="field">City / location<input name="location" placeholder="City, area or landmark" required></label>

    <label class="field">Contact preference<select name="contact"><option>Email</option><option>Phone</option><option>Through community organisation</option></select></label>`;

  return `

    <label class="field">Organisation name<input name="institution" placeholder="Official organisation name" required></label>

    <div class="field-grid">

      <label class="field">Organisation type<select name="orgType"><option>NGO / Non-profit</option><option>University / College</option><option>Community group</option><option>Government / Civic body</option><option>CSR / Corporate</option><option>Research institution</option><option>Other</option></select></label>

      <label class="field">Team size<select name="teamSize"><option>1–5</option><option>6–20</option><option>21–50</option><option>50+</option></select></label>

    </div>

    <label class="field">Website (optional)<input name="website" type="url" placeholder="https://"></label>

    <label class="field">Focus areas<input name="focus" placeholder="e.g. education, environment, accessibility"></label>

    <label class="field">City / operating region<input name="location" placeholder="City or region" required></label>`;

}



function registerPage() {

  const roles: [Role, string, string, string][] = [

    ['provider', 'Problem Provider', 'Citizens and communities reporting issues', '♧'],

    ['solver', 'Individual Solver', 'Students and experts building solutions', '✳'],

    ['organisation', 'Organisation', 'Universities, NGOs and civic partners', '⌂']

  ];

  return `

    <section class="section section-pad register-layout">

      <div class="register-intro">

        <div class="eyebrow">CIVIC REGISTRY</div>

        <h1 class="small-title">Join the<br>Coordination Network</h1>

        <p>Select your role to enter your CO-SOLVE workspace.</p>

        <div class="register-visual"><img src="${photos.student}" alt="Students collaborating"><div><strong>Many perspectives.</strong><br>One shared purpose.</div></div>

      </div>

      <div class="register-panel">

        <div class="segmented">

          <button class="${authMode === 'login' ? 'selected' : ''}" data-auth-mode="login">Login</button>

          <button class="${authMode === 'register' ? 'selected' : ''}" data-auth-mode="register">Create account</button>

        </div>

        <form id="register-form">

          <div class="form-heading">STEP 01 — SELECT YOUR ROLE</div>

          <div class="role-list">

            ${roles.map(([id, name, desc, symbol]) => `

              <label class="role-card ${selectedRole === id ? 'chosen' : ''}">

                <input type="radio" name="role" value="${id}" ${selectedRole === id ? 'checked' : ''}>

                <span class="role-symbol">${symbol}</span><span class="role-copy"><b>${name}</b><small>${desc}</small></span>

              </label>`).join('')}

          </div>

          <div class="form-heading">STEP 02 — ${authMode === 'login' ? 'SIGN IN DETAILS' : 'YOUR DETAILS'}</div>

          ${authMode === 'register' ? `<label class="field">Full name<input name="name" autocomplete="name" placeholder="Enter your full name" required></label>` : ''}

          <label class="field">Email address<input name="email" type="email" autocomplete="email" placeholder="you@example.com" required></label>

          <label class="field">Password<input name="password" type="password" autocomplete="${authMode === 'login' ? 'current-password' : 'new-password'}" placeholder="${authMode === 'login' ? 'Enter your password' : 'At least 8 characters'}" minlength="8" required></label>

          ${authMode === 'register' ? roleFields() + `<label class="consent"><input type="checkbox" required> I agree to follow CO-SOLVE’s community, privacy and verification guidelines.</label>` : ''}

          <button class="button button-dark full" type="submit">${authMode === 'login' ? 'Continue to Workspace →' : 'Create account & continue →'}</button>

        </form>

        <p class="fine-print">Prototype only: this form does not create a real account or securely store credentials. Connect a backend authentication provider before public launch.</p>

      </div>

    </section>`;

}



function organisationPage() {

  return `

    <section class="section section-pad dashboard">

      <div class="dashboard-cover org-cover">

        <img src="${photos.student}" alt="Students collaborating on a project">

        <div class="cover-overlay"><span class="tag">DEMO ORGANISATION</span><h1 class="small-title">Delhi Technological University</h1><p>Academic innovation partner · North NCR</p></div>

      </div>

      <div class="stats-grid">

        <div class="stat"><strong>14</strong><small>ADOPTED CHALLENGES</small></div><div class="stat"><strong>48</strong><small>ACTIVE STUDENTS</small></div><div class="stat"><strong>94.2%</strong><small>RESOLUTION RATE</small></div><div class="stat"><strong>06</strong><small>GRANT POOLS</small></div>

      </div>

      <div class="tabs">${['Overview', 'Adopt Challenges', 'Student Pods'].map(t => `<button class="${activeTab === t ? 'tab-active' : ''}" data-tab="${t}">${t}</button>`).join('')}</div>

      ${activeTab === 'Overview' ? `<div class="dashboard-welcome"><div><div class="eyebrow">PARTNERSHIP WORKSPACE</div><h2>Make collaboration count.</h2><p>Coordinate student teams, review field progress and document verified impact.</p></div><img src="${photos.community}" alt="Community partnership"></div><div class="dashboard-actions"><button class="button button-dark" data-tab="Adopt Challenges">Browse Challenges ↗</button><button class="button button-outline" data-tab="Student Pods">View Student Pods</button></div><div class="mini-grid"><article class="mini-card"><span>↗</span><b>Challenge matching</b><p>Find a community problem that fits your teams.</p></article><article class="mini-card"><span>◎</span><b>Impact verification</b><p>Keep project evidence and progress visible.</p></article></div>` : ''}

      ${activeTab === 'Adopt Challenges' ? `<h2>Available challenges</h2><div class="challenge-list">${challenges.map(challengeCard).join('')}</div>` : ''}

      ${activeTab === 'Student Pods' ? `<h2>Active student pods</h2>${[['Enactus Eco-Cell', 'Neighbourhood waste mapping', photos.field], ['Civic Sensing Lab', 'Water supply reporting pilot', photos.site], ['Urban Inclusion Collective', 'Footpath accessibility audit', photos.community]].map(([team, project, image]) => `<article class="pod-card reveal"><img src="${image}" alt="${team}" loading="lazy"><div><b>${team}</b><p>${project}</p><span class="tag">Field deployment</span></div></article>`).join('')}` : ''}

    </section>`;

}



function providerPage() {

  return `

    <section class="section section-pad dashboard">

      <div class="eyebrow">COMMUNITY ISSUE DESK · DEMO</div>

      <h1 class="small-title">Your community, heard.</h1>

      <p>Report problems, add context and follow the progress of local solutions.</p>

      <div class="dashboard-welcome"><div><h2>Every improvement starts with evidence.</h2><p>Share the location and impact so the right people can help.</p></div><img src="${photos.community}" alt="Community members working together"></div>

      <div class="stats-grid"><div class="stat"><strong>${6 + submittedIssues.length}</strong><small>LOGGED</small></div><div class="stat"><strong>2</strong><small>MATCHED</small></div><div class="stat"><strong>3</strong><small>IN FIELD</small></div><div class="stat"><strong>1</strong><small>VERIFIED</small></div></div>

      <div class="notice"><div class="eyebrow">CIVIC LEDGER</div><p>Document local problems with clear evidence so the right teams can help. Avoid sharing personal or sensitive information publicly.</p></div>

      <form id="issue-form" class="form-panel">

        <div class="form-heading">SUBMIT A CIVIC PROBLEM</div>

        <label class="field">Problem title<input name="title" required placeholder="What needs to be solved?"></label>

        <div class="field-grid"><label class="field">Category<select name="category">${['Environment & sanitation','Education','Infrastructure','Transport','Healthcare','Accessibility','Digital learning','Public lighting','Water','Food security','Other'].map(x => `<option>${x}</option>`).join('')}</select></label><label class="field">Urgency<select name="urgency"><option>Normal</option><option>Time-sensitive</option><option>Urgent</option></select></label></div>

        <label class="field">Location<input name="location" required placeholder="Ward, street or landmark"></label>

        <label class="field">Short description<textarea name="description" required rows="3" placeholder="Describe the issue and its impact"></textarea></label>

        <label class="field">Evidence link (optional)<input name="evidence" type="url" placeholder="Link to a photo or public report"></label>

        <button class="button button-dark full" type="submit">Submit Problem →</button>

      </form>

      <h2>Your issue pipeline</h2>

      ${submittedIssues.length ? submittedIssues.map(issue => `<div class="pillar"><b>${escapeHTML(issue)}</b><p>Submitted · Awaiting review</p></div>`).join('') : `<div class="empty-state"><span>✳</span><b>Your submitted issues will appear here.</b><p>Start by reporting a local problem above.</p></div>`}

      <h2>Challenges needing community context</h2><div class="challenge-list">${challenges.slice(0, 3).map(challengeCard).join('')}</div>

    </section>`;

}



function solverPage() {

  return `

    <section class="section section-pad dashboard">

      <div class="eyebrow">STUDENT SOLVER · DEMO PROFILE</div>

      <div class="profile-heading"><img class="avatar" src="${photos.student}" alt="Student profile"><div><h1 class="small-title">Priya Sharma</h1><p>B.Tech Environmental Engineering · Year 4</p><p>Delhi Technological University</p></div><button class="icon-button" data-action="profile" aria-label="View student profile">↗</button></div>

      <button class="profile-link" data-action="profile">View full student profile ↗</button>

      <div class="skills-row"><span class="tag">Environmental Engineering</span><span class="tag">GIS Mapping</span><span class="tag">IoT</span><span class="tag">Field Research</span></div>

      <div class="stats-grid"><div class="stat"><strong>4</strong><small>ISSUES RESOLVED</small></div><div class="stat"><strong>120 hrs</strong><small>FIELD IMPACT</small></div><div class="stat"><strong>₹65k</strong><small>GRANTS MANAGED</small></div><div class="stat"><strong>12</strong><small>CIVIC CONTRIBUTIONS</small></div></div>

      <button class="button button-outline full" data-action="transcript">Export Impact Transcript ↓</button>

    </section>

    <section class="section section-pad tinted">

      <div class="eyebrow">ACTIVE ENGINEERING SPRINT</div><h2>Current deployment</h2>

      <article class="project-card reveal"><img class="wide-image" src="${photos.field}" alt="Community field project"><div class="project-content"><span class="tag">92% COMPLETE</span><h3>Neighbourhood waste mapping pilot</h3><p>Community-led · Civic environment</p><div class="progress"><span style="width:92%"></span></div><p>Milestone 3 of 3 · Awaiting final review.</p><button class="button button-dark full" data-action="milestone">View Milestones ↗</button></div></article>

    </section>

    <section class="section section-pad"><div class="eyebrow">DISCOVER CIVIC CHALLENGES</div><h2>Find your next project</h2><p>Choose a challenge that matches your skills and curiosity.</p>${challengeSectionInner()}</section>

    <section class="section section-pad tinted"><h2>Credentials & portfolio</h2><div class="mini-grid"><article class="mini-card"><span>✳</span><b>Municipal Impact Certificate</b><p>Field inspection verified · Demo credential</p></article><article class="mini-card"><span>↗</span><b>Community Engineering Project</b><p>Project evidence and team contribution record.</p></article></div><button class="button button-outline full" data-action="profile">Open Student Profile ↗</button></section>`;

}



function challengeSectionInner() {

  const visible = challenges.map((c, i) => ({ c, i })).filter(({ c }) => challengeFilter === 'All' || c.category === challengeFilter);

  return `<div class="filter-row">${['All', ...Array.from(new Set(challenges.map(c => c.category)))].map(category => `<button class="filter-chip ${challengeFilter === category ? 'selected' : ''}" data-filter="${category}">${category}</button>`).join('')}</div><div class="challenge-list">${visible.map(({ c, i }) => challengeCard(c, i)).join('')}</div>`;

}



function profileModal() {

  if (!modalOpen) return '';

  return `

    <div class="modal-backdrop" data-action="close-modal">

      <section class="profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-title">

        <button class="modal-close" data-action="close-modal" aria-label="Close profile">×</button>

        <img class="profile-cover" src="${photos.student}" alt="Student project team">

        <div class="modal-content"><span class="tag">VERIFIED STUDENT · DEMO</span><h2 id="profile-title">Priya Sharma</h2><p>B.Tech Environmental Engineering · Year 4</p><p>Delhi Technological University</p>

          <div class="stats-grid"><div class="stat"><strong>04</strong><small>RESOLVED</small></div><div class="stat"><strong>120h</strong><small>FIELD WORK</small></div></div>

          <h3>Skills & focus</h3><div class="chips"><span class="tag">Environmental Engineering</span><span class="tag">IoT</span><span class="tag">GIS Mapping</span></div>

          <h3>Current project</h3><p>Neighbourhood waste mapping pilot</p><button class="button button-dark full" data-action="milestone">View Project Milestones ↗</button>

        </div>

      </section>

    </div>`;

}



function escapeHTML(value: string) {

  return value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] || c));

}



function render() {

  const pages: Record<View, () => string> = { home: homePage, register: registerPage, organisation: organisationPage, provider: providerPage, solver: solverPage };

  const app = document.querySelector<HTMLDivElement>('#app');

  if (!app) return;

app.innerHTML = `

    ${header()}<main>${pages[currentView]()}</main>

    <footer class="footer"><p>Real problems. Verified solutions.</p><small>© 2026 · Civic Innovation Platform</small></footer>

    ${nav()}${profileModal()}<div class="toast" id="toast" aria-live="polite"></div>`;

  setupRevealAnimations();

}



function setupRevealAnimations() {
  const elements = Array.from(new Set(document.querySelectorAll<HTMLElement>(
    '.reveal, .mission-copy, .mission-photo-wrap, .who-heading, .who-copy, .solved-heading, .solved-card, .impact-band > *:not(.section-stamp)'
  )));

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || reduceMotion) {
    elements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  elements.forEach((el, index) => {
    el.classList.add('reveal');
    el.classList.remove('is-visible');
    el.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 100}ms`);

    if (el.classList.contains('mission-photo-wrap') || el.classList.contains('who-copy')) {
      el.dataset.revealDirection = 'right';
    } else if (el.classList.contains('who-heading')) {
      el.dataset.revealDirection = 'left';
    } else {
      delete el.dataset.revealDirection;
    }
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        (entry.target as HTMLElement).classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -45px 0px' });

  elements.forEach(el => observer.observe(el));
}


function showToast(message: string) {

  const toast = document.querySelector<HTMLDivElement>('#toast');

  if (!toast) return;

toast.textContent = message;

toast.classList.add('visible');

window.setTimeout(() => toast.classList.remove('visible'), 2800);

}



document.addEventListener('click', event => {

  const target = event.target as HTMLElement;

  const viewButton = target.closest<HTMLElement>('[data-view]');

  const actionButton = target.closest<HTMLElement>('[data-action]');

  const tabButton = target.closest<HTMLElement>('[data-tab]');

  const adoptButton = target.closest<HTMLElement>('[data-adopt]');

  const scrollButton = target.closest<HTMLElement>('[data-scroll]');

  const authButton = target.closest<HTMLElement>('[data-auth-mode]');

  const filterButton = target.closest<HTMLElement>('[data-filter]');



  if (viewButton) {

event.preventDefault();

    go(viewButton.dataset.view as View);

    return;

  }

  if (tabButton) {

activeTab = tabButton.dataset.tab || 'Overview';

    render();

    return;

  }

  if (scrollButton) {
    const sectionId = scrollButton.dataset.scroll || '';
    const scrollToSection = () => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start'
      });
    };

    // The section links live on the home page. If clicked from Login/Register,
    // render the home page first, then scroll once its sections exist in the DOM.
    if (currentView !== 'home' || !document.getElementById(sectionId)) {
      currentView = 'home';
      modalOpen = false;
      render();
      window.requestAnimationFrame(scrollToSection);
    } else {
      scrollToSection();
    }
    return;
  }

  if (authButton) {

authMode = authButton.dataset.authMode as 'login' | 'register';

    render();

    return;

  }

  if (filterButton) {

challengeFilter = filterButton.dataset.filter || 'All';

    render();

    if (document.getElementById('challenges')) document.getElementById('challenges')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    return;

  }

  if (adoptButton) {

    const index = Number(adoptButton.dataset.adopt);

adopted.add(index);

    render();

    showToast('Challenge added to your demo workspace.');

    return;

  }

  if (actionButton) {

    const action = actionButton.dataset.action;

    if (action === 'profile') {

modalOpen = true; render();

    } else if (action === 'close-modal') {

      if (target.closest('.profile-modal') && !target.closest('.modal-close')) return;

modalOpen = false; render();

    } else if (action === 'signin') {

authMode = 'login'; go('register');

    } else if (action === 'register') {

authMode = 'register'; selectedRole = 'solver'; go('register');

    } else if (action === 'transcript') {

      showToast('Transcript export requires verified account data.');

    } else if (action === 'milestone') {

      showToast('Milestone details are shown in the active project card.');

    }

  }

});



document.addEventListener('change', event => {

  const target = event.target as HTMLInputElement;

  if (target.name === 'role') {

selectedRole = target.value as Role;

    render();

  }

});



document.addEventListener('submit', event => {

event.preventDefault();

  const form = event.target as HTMLFormElement;

  const data = new FormData(form);

  if (form.id === 'register-form') {

selectedRole = String(data.get('role') || selectedRole) as Role;

    if (authMode === 'login') {

      showToast('Demo sign-in only. Authentication is not connected yet.');

    } else {

      const destination: Record<Role, View> = { provider: 'provider', solver: 'solver', organisation: 'organisation' };

      go(destination[selectedRole] || 'solver');

      showToast('Demo workspace opened. No account was created.');

    }

  }

  if (form.id === 'issue-form') {

submittedIssues.unshift(String(data.get('title') || 'New civic problem'));

    go('provider');

    showToast('Problem saved in this browser session.');

  }

});



render();
