
import './style.css';

type View = 'home' | 'register' | 'organisation' | 'provider' | 'solver';

let currentView: View = 'home';
let selectedRole = 'solver';
let modalOpen = false;
let activeTab = 'Overview';
let adopted = new Set<number>();
let submittedIssues: string[] = [];

const photos = {
  hero: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85',
  field: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=85',
  community: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=85',
  student: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=85',
  site: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=900&q=85'
};

const challenges = [
  {
    category: 'SANITATION & RUNOFF',
    title: 'Municipal Compost Pit & Culvert Blockage',
    location: 'Ward 12, Jaipur',
    description: 'Improve drainage, manage organic waste and reduce monsoon flooding.',
    urgency: 'High Priority',
    grant: '₹50,000',
    image: photos.field
  },
  {
    category: 'WATER QUALITY',
    title: 'Drinking Water Filtration TDS Fluctuation',
    location: 'Community water station',
    description: 'Monitor water quality and design an affordable filtration solution.',
    urgency: 'In Progress',
    grant: '₹25,000',
    image: photos.site
  },
  {
    category: 'UNIVERSAL ACCESSIBILITY',
    title: 'Broken Wheelchair Ramp at Sector 2 Metro',
    location: 'Public transit',
    description: 'Audit accessibility and develop safer routes for commuters.',
    urgency: 'Medium Priority',
    grant: '₹15,000',
    image: photos.community
  },
  {
    category: 'PUBLIC LIGHTING',
    title: 'Flickering Solar Street Lamps',
    location: 'Canal Road',
    description: 'Investigate battery failures and improve street lighting reliability.',
    urgency: 'Open',
    grant: '₹20,000',
    image: photos.hero
  }
];

const icon = (symbol: string) => `<span class="icon">${symbol}</span>`;

function go(view: View) {
  currentView = view;
  modalOpen = false;
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function header() {
  return `
    <header class="topbar">
      <a href="#home" class="brand" data-view="home">
        <span class="brand-mark">C</span>
        <span><strong>Cosolve</strong><small>CIVIC INNOVATION PLATFORM</small></span>
      </a>
      <button class="icon-button" data-action="profile" aria-label="Open profile">◎</button>
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
    </button>`).join('')}
  </nav>`;
}

function challengeCard(c: typeof challenges[number], i: number) {
  return `
    <article class="challenge-card">
      <img class="challenge-image" src="${c.image}" alt="${c.title}" loading="lazy">
      <div class="challenge-body">
        <div class="chips">
          <span class="tag">${c.category}</span>
          <span class="priority">${c.urgency}</span>
        </div>
        <h3>${c.title}</h3>
        <p>${c.description}</p>
        <div class="muted-line">⌖ ${c.location} · Grant: ${c.grant}</div>
        <button class="button ${adopted.has(i) ? 'button-soft' : 'button-dark'}"
          data-adopt="${i}">
          ${adopted.has(i) ? 'Challenge Adopted ✓' : 'View Challenge ↗'}
        </button>
      </div>
    </article>`;
}

function homePage() {
  return `
    <div class="announcement">● OPEN CIVIC INNOVATION · BUILT FOR PUBLIC GOOD</div>
    <section class="hero section-pad">
      <div class="eyebrow">A MORE ACCOUNTABLE CIVIC FUTURE</div>
      <h1>Real problems<br>deserve real<br><em>solutions.</em></h1>
      <p>Cosolve connects citizens, student innovators and organisations to solve local problems—with progress you can verify.</p>
      <div class="actions">
        <button class="button button-dark" data-view="register">Get Started ↗</button>
        <button class="button button-outline" data-scroll="challenges">Explore Challenges</button>
      </div>
      <img class="hero-image" src="${photos.hero}" alt="Modern city buildings">
      <div class="stats-grid">
        <div class="stat"><strong>1,420</strong><small>ISSUES RESOLVED</small></div>
        <div class="stat"><strong>380</strong><small>PARTNER INSTITUTIONS</small></div>
        <div class="stat"><strong>18.4k</strong><small>FIELD HOURS</small></div>
        <div class="stat"><strong>₹42.8L</strong><small>GRANTS TRACKED</small></div>
      </div>
    </section>

    <section class="section section-pad">
      <div class="eyebrow">HOW IT WORKS</div>
      <h2>From problem to proof.</h2>
      <div class="stage-list">
        <article class="stage"><b>01</b><div><h3>Report</h3><p>Communities submit local problems with evidence.</p></div></article>
        <article class="stage"><b>02</b><div><h3>Match</h3><p>Students, experts and institutions form a team.</p></div></article>
        <article class="stage"><b>03</b><div><h3>Build</h3><p>Teams test solutions in the real world.</p></div></article>
        <article class="stage"><b>04</b><div><h3>Verify</h3><p>Document results and confirm impact.</p></div></article>
      </div>
    </section>

    <section class="section section-pad tinted" id="challenges">
      <div class="eyebrow">OPEN IN THE FIELD</div>
      <h2>Active civic challenges</h2>
      <p>Real problems. Measurable outcomes.</p>
      <div class="challenge-list">${challenges.map(challengeCard).join('')}</div>
    </section>

    <section class="section section-pad">
      <img class="wide-image" src="${photos.community}" alt="Community members working together" loading="lazy">
      <div class="eyebrow">THREE PILLARS. ONE PURPOSE.</div>
      <h2>Better, together.</h2>
      <div class="pillar"><b>Citizens</b><p>Report issues and follow progress.</p></div>
      <div class="pillar"><b>Student solvers</b><p>Build real projects and demonstrate impact.</p></div>
      <div class="pillar"><b>Organisations</b><p>Fund, coordinate and verify solutions.</p></div>
      <button class="button button-dark full" data-view="register">Join Cosolve ↗</button>
    </section>`;
}

function registerPage() {
  const roles = [
    ['provider', 'Problem Provider', 'Citizens and communities reporting issues'],
    ['solver', 'Individual Solver', 'Students and experts building solutions'],
    ['organisation', 'Organisation', 'Universities, NGOs and civic partners']
  ];

  return `
    <section class="section section-pad">
      <div class="eyebrow">CIVIC REGISTRY</div>
      <h1 class="small-title">Join the<br>Coordination Network</h1>
      <p>Select your role to enter your Cosolve workspace.</p>
      <div class="segmented">
        <button class="selected" data-action="signin">Sign In</button>
        <button data-action="register">Register</button>
      </div>
      <form id="register-form">
        <div class="form-heading">STEP 01 — SELECT YOUR ROLE</div>
        <div class="role-list">
          ${roles.map(([id, name, desc]) => `
            <label class="role-card ${selectedRole === id ? 'chosen' : ''}">
              <input type="radio" name="role" value="${id}" ${selectedRole === id ? 'checked' : ''}>
              <span><b>${name}</b><small>${desc}</small></span>
            </label>`).join('')}
        </div>
        <div class="form-heading">STEP 02 — YOUR DETAILS</div>
        <label class="field">Full name<input name="name" placeholder="Enter your full name" required></label>
        <label class="field">Institution / Community<input name="institution" placeholder="College, NGO or community"></label>
        <label class="field">Email address<input name="email" type="email" placeholder="you@example.com" required></label>
        <label class="field">Password<input name="password" type="password" placeholder="At least 8 characters" minlength="8" required></label>
        <label class="consent"><input type="checkbox" required> I agree to follow Cosolve's community and verification guidelines.</label>
        <button class="button button-orange full" type="submit">Continue to Workspace →</button>
      </form>
      <p class="fine-print">Prototype registration only. No real identity verification or account is created.</p>
    </section>`;
}

function organisationPage() {
  return `
    <section class="section section-pad">
      <div class="eyebrow">VERIFIED ORGANISATION · DEMO</div>
      <h1 class="small-title">Delhi Technological University</h1>
      <p>Academic innovation partner · North NCR</p>
      <img class="wide-image" src="${photos.student}" alt="Students collaborating on a project">
      <div class="stats-grid">
        <div class="stat"><strong>14</strong><small>ADOPTED CHALLENGES</small></div>
        <div class="stat"><strong>48</strong><small>ACTIVE STUDENTS</small></div>
        <div class="stat"><strong>94.2%</strong><small>RESOLUTION RATE</small></div>
        <div class="stat"><strong>06</strong><small>GRANT POOLS</small></div>
      </div>
      <div class="tabs">
        ${['Overview', 'Adopt Challenges', 'Student Pods'].map(t =>
          `<button class="${activeTab === t ? 'tab-active' : ''}" data-tab="${t}">${t}</button>`).join('')}
      </div>
      ${activeTab === 'Overview' ? `
        <div class="notice"><b>Organisation overview</b><p>Coordinate student teams, review field progress and document verified impact.</p></div>
        <button class="button button-dark full" data-tab="Adopt Challenges">Browse Challenges ↗</button>
        <button class="button button-outline full" data-tab="Student Pods">View Student Pods</button>` : ''}
      ${activeTab === 'Adopt Challenges' ? `
        <h2>Available challenges</h2>
        <div class="challenge-list">${challenges.map(challengeCard).join('')}</div>` : ''}
      ${activeTab === 'Student Pods' ? `
        <h2>Active student pods</h2>
        ${[
          ['Enactus DTU Eco-Cell', 'Compost Pit Odour Abatement', photos.student],
          ['IoT Civic Sensing Lab', 'Water TDS Telemetry', photos.site],
          ['Urban Inclusion Collective', 'Wheelchair Accessibility Audit', photos.community]
        ].map(([team, project, image]) => `
          <article class="pod-card"><img src="${image}" alt="${team}" loading="lazy"><div><b>${team}</b><p>${project}</p><span class="tag">Field deployment</span></div></article>
        `).join('')}` : ''}
    </section>`;
}

function providerPage() {
  return `
    <section class="section section-pad">
      <div class="eyebrow">VERIFIED COMMUNITY STEWARD · DEMO</div>
      <h1 class="small-title">Community issue desk</h1>
      <p>Report problems and track their progress.</p>
      <div class="stats-grid">
        <div class="stat"><strong>6</strong><small>LOGGED</small></div>
        <div class="stat"><strong>2</strong><small>MATCHED</small></div>
        <div class="stat"><strong>3</strong><small>IN FIELD</small></div>
        <div class="stat"><strong>1</strong><small>VERIFIED</small></div>
      </div>
      <div class="notice"><div class="eyebrow">CIVIC LEDGER</div><p>Document local problems with clear evidence so the right teams can help.</p></div>
      <form id="issue-form">
        <div class="form-heading">SUBMIT A CIVIC PROBLEM</div>
        <label class="field">Problem title<input name="title" required placeholder="What needs to be solved?"></label>
        <label class="field">Category<select name="category"><option>Sanitation & Runoff</option><option>Water Quality</option><option>Accessibility</option><option>Public Lighting</option><option>Other</option></select></label>
        <label class="field">Location<input name="location" required placeholder="Ward, street or landmark"></label>
        <label class="field">Short description<textarea name="description" required rows="3" placeholder="Describe the issue and its impact"></textarea></label>
        <button class="button button-orange full" type="submit">Submit Problem →</button>
      </form>
      <h2>Your issue pipeline</h2>
      ${submittedIssues.map(issue => `<div class="pillar"><b>${escapeHTML(issue)}</b><p>Submitted · Awaiting review</p></div>`).join('')}
      ${challenges.slice(0, 3).map(challengeCard).join('')}
    </section>`;
}

function solverPage() {
  return `
    <section class="section section-pad">
      <div class="eyebrow">VERIFIED STUDENT SOLVER · DEMO</div>
      <div class="profile-heading">
        <img class="avatar" src="${photos.student}" alt="Student profile">
        <div><h1 class="small-title">Priya Sharma</h1><p>B.Tech Environmental Engineering · Year 4</p><p>Delhi Technological University</p></div>
        <button class="icon-button" data-action="profile" aria-label="View student profile">↗</button>
      </div>
      <button class="profile-link" data-action="profile">View full student profile ↗</button>
      <div class="stats-grid">
        <div class="stat"><strong>4</strong><small>ISSUES RESOLVED</small></div>
        <div class="stat"><strong>120 hrs</strong><small>FIELD IMPACT</small></div>
        <div class="stat"><strong>₹65k</strong><small>GRANTS MANAGED</small></div>
        <div class="stat"><strong>12</strong><small>CIVIC INNOVATOR</small></div>
      </div>
      <button class="button button-outline full" data-action="transcript">Export Impact Transcript ↓</button>
    </section>
    <section class="section section-pad tinted">
      <div class="eyebrow">ACTIVE ENGINEERING SPRINT</div>
      <h2>Current deployment</h2>
      <article class="project-card">
        <img class="wide-image" src="${photos.field}" alt="Community field project">
        <div class="project-content">
          <span class="tag">92% COMPLETE</span>
          <h3>Municipal Compost Pit & Drainage Blockage</h3>
          <p>Ward 12 · Civic sanitation</p>
          <div class="progress"><span style="width:92%"></span></div>
          <p>Milestone 3 of 3 · Awaiting final review.</p>
          <button class="button button-dark full" data-action="milestone">View Milestones ↗</button>
        </div>
      </article>
    </section>
    <section class="section section-pad">
      <div class="eyebrow">DISCOVER CIVIC CHALLENGES</div>
      <h2>Find your next project</h2>
      <div class="challenge-list">${challenges.map(challengeCard).join('')}</div>
    </section>
    <section class="section section-pad tinted">
      <h2>Credentials & portfolio</h2>
      <div class="notice"><b>Municipal Impact Certificate</b><p>Field inspection verified · Demo credential</p></div>
      <div class="notice"><b>Community Engineering Project</b><p>Project evidence and team contribution record.</p></div>
      <button class="button button-outline full" data-action="profile">Open Student Profile ↗</button>
    </section>`;
}

function profileModal() {
  if (!modalOpen) return '';
  return `
    <div class="modal-backdrop" data-action="close-modal">
      <section class="profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-title">
        <button class="modal-close" data-action="close-modal" aria-label="Close profile">×</button>
        <img class="profile-cover" src="${photos.student}" alt="Student project team">
        <div class="modal-content">
          <span class="tag">VERIFIED STUDENT · DEMO</span>
          <h2 id="profile-title">Priya Sharma</h2>
          <p>B.Tech Environmental Engineering · Year 4</p>
          <p>Delhi Technological University</p>
          <div class="stats-grid">
            <div class="stat"><strong>04</strong><small>RESOLVED</small></div>
            <div class="stat"><strong>120h</strong><small>FIELD WORK</small></div>
          </div>
          <h3>Skills & focus</h3>
          <div class="chips"><span class="tag">Environmental Engineering</span><span class="tag">IoT</span><span class="tag">GIS Mapping</span></div>
          <h3>Current project</h3>
          <p>Municipal Compost Pit & Drainage Blockage</p>
          <button class="button button-dark full" data-action="milestone">View Project Milestones ↗</button>
        </div>
      </section>
    </div>`;
}

function escapeHTML(value: string) {
  return value.replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;',
    '"': '&quot;', "'": '&#39;'
  })[c] || c);
}

function render() {
  const pages: Record<View, () => string> = {
    home: homePage,
    register: registerPage,
    organisation: organisationPage,
    provider: providerPage,
    solver: solverPage
  };

  const app = document.querySelector<HTMLDivElement>('#app');
  if (!app) return;

  app.innerHTML = `
    ${header()}
    <main>${pages[currentView]()}</main>
    <footer class="footer">
      <a class="brand" href="#home" data-view="home"><span class="brand-mark">C</span><strong>Cosolve</strong></a>
      <p>Real problems. Verified solutions.</p>
      <small>© 2026 Cosolve · Civic Innovation Platform</small>
    </footer>
    ${nav()}
    ${profileModal()}
    <div class="toast" id="toast" aria-live="polite"></div>`;
}

function showToast(message: string) {
  const toast = document.querySelector<HTMLDivElement>('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('visible');
  window.setTimeout(() => toast.classList.remove('visible'), 2600);
}

document.addEventListener('click', event => {
  const target = event.target as HTMLElement;
  const viewButton = target.closest<HTMLElement>('[data-view]');
  const actionButton = target.closest<HTMLElement>('[data-action]');
  const tabButton = target.closest<HTMLElement>('[data-tab]');
  const adoptButton = target.closest<HTMLElement>('[data-adopt]');
  const scrollButton = target.closest<HTMLElement>('[data-scroll]');

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
    document.getElementById(scrollButton.dataset.scroll || '')?.scrollIntoView({ behavior: 'smooth' });
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
      modalOpen = true;
      render();
    } else if (action === 'close-modal') {
      if (target.closest('.profile-modal') && !target.closest('.modal-close')) return;
      modalOpen = false;
      render();
    } else if (action === 'register') {
      selectedRole = 'solver';
      go('register');
    } else if (action === 'signin') {
      showToast('Sign-in will be connected to authentication later.');
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
    selectedRole = target.value;
    document.querySelectorAll('.role-card').forEach(card => {
      card.classList.toggle('chosen', card.querySelector('input')?.value === selectedRole);
    });
  }
});

document.addEventListener('submit', event => {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const data = new FormData(form);

  if (form.id === 'register-form') {
    selectedRole = String(data.get('role') || selectedRole);
    const destination: Record<string, View> = {
      provider: 'provider',
      solver: 'solver',
      organisation: 'organisation'
    };
    go(destination[selectedRole] || 'solver');
    showToast('Demo workspace opened. No account was created.');
  }

  if (form.id === 'issue-form') {
    submittedIssues.unshift(String(data.get('title') || 'New civic problem'));
    go('provider');
    showToast('Problem saved in this browser session.');
  }
});

render();
