const STORAGE_KEY = 'ttc-command-centre-demo-v2';
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const businessSeed = window.dashboardData.business;
const personalSeed = window.dashboardData.personal;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

const initialState = {
  workspace: 'business',
  business: {
    currentPage: 'today',
    tasks: clone(businessSeed.tasks),
    contentPackages: clone(businessSeed.contentPackages),
    audits: clone(businessSeed.audits),
    links: clone(businessSeed.links),
    appointments: clone(businessSeed.appointments),
    metrics: clone(businessSeed.metrics)
  },
  personal: {
    currentPage: 'today',
    habits: clone(personalSeed.habits),
    tasks: clone(personalSeed.tasks),
    links: clone(personalSeed.links),
    completions: clone(personalSeed.completions),
    mindsetByDay: clone(personalSeed.mindsetByDay)
  }
};

const state = loadState();

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      // Migrate older business-only storage if present
      const legacy = localStorage.getItem('ttc-command-centre-demo-v1');
      if (legacy) {
        const parsed = JSON.parse(legacy);
        return {
          ...initialState,
          business: {
            ...initialState.business,
            currentPage: parsed.currentPage || 'today',
            tasks: parsed.tasks || initialState.business.tasks,
            contentPackages: parsed.contentPackages || initialState.business.contentPackages,
            audits: parsed.audits || initialState.business.audits,
            links: parsed.links || initialState.business.links,
            appointments: parsed.appointments || initialState.business.appointments,
            metrics: parsed.metrics || initialState.business.metrics
          }
        };
      }
      return clone(initialState);
    }
    const parsed = JSON.parse(saved);
    return {
      workspace: parsed.workspace === 'personal' ? 'personal' : 'business',
      business: {
        ...initialState.business,
        ...(parsed.business || {}),
        tasks: parsed.business?.tasks || initialState.business.tasks,
        contentPackages: parsed.business?.contentPackages || initialState.business.contentPackages,
        audits: parsed.business?.audits || initialState.business.audits,
        links: parsed.business?.links || initialState.business.links,
        appointments: parsed.business?.appointments || initialState.business.appointments,
        metrics: parsed.business?.metrics || initialState.business.metrics
      },
      personal: {
        ...initialState.personal,
        ...(parsed.personal || {}),
        habits: parsed.personal?.habits || initialState.personal.habits,
        tasks: parsed.personal?.tasks || initialState.personal.tasks,
        links: parsed.personal?.links || initialState.personal.links,
        completions: parsed.personal?.completions || initialState.personal.completions,
        mindsetByDay: parsed.personal?.mindsetByDay || initialState.personal.mindsetByDay
      }
    };
  } catch (error) {
    return clone(initialState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    workspace: state.workspace,
    business: state.business,
    personal: state.personal
  }));
}

const navEl = document.getElementById('nav');
const pageContentEl = document.getElementById('page-content');
const quickLinksEl = document.getElementById('quick-links');
const pageTitleEl = document.getElementById('page-title');
const eyebrowEl = document.getElementById('page-eyebrow');
const brandSubtitleEl = document.getElementById('brand-subtitle');
const topbarActionsEl = document.getElementById('topbar-actions');
const workspaceSwitchEl = document.getElementById('workspace-switch');
const quickLinksLabelEl = document.getElementById('quick-links-label');

function isPersonal() {
  return state.workspace === 'personal';
}

function getWorkspace() {
  return isPersonal() ? state.personal : state.business;
}

function getNavItems() {
  return isPersonal() ? personalSeed.nav : businessSeed.nav;
}

function getTodayIndex() {
  return new Date().getDay();
}

function getDayLabel() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

function ringSvg(percent, size = 72) {
  const p = Math.max(0, Math.min(100, Math.round(percent)));
  const stroke = 7;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (p / 100) * circumference;
  return `
    <div class="progress-ring" style="width:${size}px;height:${size}px;" aria-label="${p}% complete">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <circle class="ring-track" cx="${size / 2}" cy="${size / 2}" r="${radius}" stroke-width="${stroke}" />
        <circle class="ring-value" cx="${size / 2}" cy="${size / 2}" r="${radius}" stroke-width="${stroke}"
          stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" />
      </svg>
      <span class="ring-label">${p}%</span>
    </div>
  `;
}

function personalDayCompletion(dayIndex) {
  const habits = state.personal.habits;
  if (!habits.length) return 0;
  const done = habits.filter((habit) => state.personal.completions[habit.id]?.[dayIndex]).length;
  return Math.round((done / habits.length) * 100);
}

function personalOverallCompletion() {
  const habits = state.personal.habits;
  if (!habits.length) return 0;
  let total = 0;
  let done = 0;
  habits.forEach((habit) => {
    const week = state.personal.completions[habit.id] || [];
    week.forEach((value) => {
      total += 1;
      if (value) done += 1;
    });
  });
  return total ? Math.round((done / total) * 100) : 0;
}

function renderWorkspaceSwitch() {
  workspaceSwitchEl.innerHTML = `
    <button type="button" class="workspace-btn ${state.workspace === 'business' ? 'active' : ''}" data-workspace="business">
      Business
    </button>
    <button type="button" class="workspace-btn ${state.workspace === 'personal' ? 'active' : ''}" data-workspace="personal">
      Personal
    </button>
  `;

  workspaceSwitchEl.querySelectorAll('.workspace-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const next = button.dataset.workspace;
      if (next === state.workspace) return;
      state.workspace = next;
      saveState();
      render();
    });
  });
}

function renderNav() {
  const currentPage = getWorkspace().currentPage;
  navEl.innerHTML = getNavItems()
    .map((item) => {
      const active = item.id === currentPage ? 'active' : '';
      return `
        <button class="nav-item ${active}" data-page="${item.id}">
          <span class="dot"></span>
          ${item.label}
        </button>
      `;
    })
    .join('');

  navEl.querySelectorAll('.nav-item').forEach((button) => {
    button.addEventListener('click', () => {
      getWorkspace().currentPage = button.dataset.page;
      saveState();
      render();
    });
  });
}

function renderQuickLinks() {
  const links = getWorkspace().links;
  quickLinksLabelEl.textContent = isPersonal() ? 'Personal links' : 'Quick links';
  quickLinksEl.innerHTML = `
    <div class="quick-link-list">
      ${links
        .map(
          (link) => `
            <a class="quick-link" href="${link.url}" ${link.url === '#' ? '' : 'target="_blank" rel="noreferrer"'}>
              ${link.label}
            </a>
          `
        )
        .join('')}
    </div>
  `;
}

function renderTopbarActions() {
  if (isPersonal()) {
    topbarActionsEl.innerHTML = `
      <button class="secondary-button" id="open-weekly">Weekly grid</button>
      <button class="primary-button" id="check-in-today">Check in</button>
    `;
    document.getElementById('open-weekly').addEventListener('click', () => {
      state.personal.currentPage = 'weekly';
      saveState();
      render();
    });
    document.getElementById('check-in-today').addEventListener('click', () => {
      state.personal.currentPage = 'mindset';
      saveState();
      render();
    });
  } else {
    topbarActionsEl.innerHTML = `
      <button class="secondary-button" id="plan-day">Plan my day</button>
      <button class="primary-button" id="add-appointment">Add appointment</button>
    `;
    document.getElementById('plan-day').addEventListener('click', handlePlanDay);
    document.getElementById('add-appointment').addEventListener('click', handleAddAppointment);
  }
}

function renderShellChrome() {
  document.body.dataset.workspace = state.workspace;
  if (isPersonal()) {
    brandSubtitleEl.textContent = 'Personal tracker';
    eyebrowEl.textContent = 'Quiet progress · personal';
  } else {
    brandSubtitleEl.textContent = 'Business ops';
    eyebrowEl.textContent = 'Daily operations';
  }
}

function renderMetrics() {
  return `
    <div class="metric-grid">
      ${state.business.metrics.today
        .map((metric) => `
          <div class="metric-card">
            <div class="metric-label">${metric.label}</div>
            <div class="metric-value">${metric.value}</div>
          </div>
        `)
        .join('')}
    </div>
  `;
}

function renderTaskCard(task) {
  const priorityClass = `priority-${task.priority}`;
  const statusClass = `status-${task.status}`;

  return `
    <article class="task-card">
      <div class="content-card-header">
        <h3>${task.title}</h3>
      </div>
      <div class="task-meta">
        <span class="tag ${priorityClass}">${task.priority}</span>
        <span class="tag ${statusClass}">${task.status}</span>
        <span class="tag">${task.area}</span>
      </div>
      <p>${task.notes}</p>
      <div class="task-meta">
        <span class="tag">Due: ${task.due}</span>
        ${task.owner ? `<span class="tag">Owner: ${task.owner}</span>` : ''}
        ${task.executor ? `<span class="tag">Executor: ${task.executor}</span>` : ''}
      </div>
    </article>
  `;
}

function renderPackageCard(pkg) {
  return `
    <article class="content-card">
      <div class="content-card-header">
        <h3>${pkg.title}</h3>
        <span class="tag status-active">${pkg.status}</span>
      </div>
      <p>${pkg.caption}</p>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${pkg.progress}%"></div>
      </div>
      <div class="task-meta">
        <span class="tag">Due: ${pkg.due}</span>
        <span class="tag">Stage: ${pkg.stage}</span>
        <span class="tag">Next: ${pkg.next}</span>
      </div>
    </article>
  `;
}

function renderAuditCard(audit) {
  return `
    <article class="audit-card">
      <div class="content-card-header">
        <h3>${audit.title}</h3>
        <span class="tag ${audit.level === 'High' ? 'priority-high' : audit.level === 'Medium' ? 'priority-medium' : 'priority-low'}">
          ${audit.level}
        </span>
      </div>
      <p>${audit.notes}</p>
      <div class="task-meta">
        <span class="tag">${audit.status}</span>
      </div>
    </article>
  `;
}

function renderAppointmentCard(appointment) {
  return `
    <div class="schedule-item">
      <time>${appointment.time}</time>
      <div class="task-title">${appointment.title}</div>
      <span class="chip">Fixed</span>
    </div>
  `;
}

function renderPlannerOutput() {
  const planner = getPlannerOutput();

  return `
    <section class="page-section">
      <div class="planner-output">
        <h3>Suggested day plan</h3>
        <p class="soft-note">Consistency over a perfect day — unfinished work can roll forward.</p>
        <div class="schedule-list">
          ${planner.map((item) => `
            <div class="schedule-item">
              <time>${item.time}</time>
              <div class="task-title">${item.title}</div>
              <span class="chip">${item.type}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function getPlannerOutput() {
  const plannedTasks = [...state.business.tasks]
    .sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.priority] - order[b.priority];
    })
    .slice(0, 4)
    .map((task, index) => ({
      time: ['09:00', '10:30', '13:00', '15:00'][index],
      title: task.title,
      type: task.area
    }));

  return [
    ...plannedTasks,
    { time: '16:00', title: 'Review and set tomorrow', type: 'Admin' }
  ];
}

function renderTaskForm() {
  return `
    <section class="page-section">
      <div class="task-form">
        <div class="section-header">
          <h2>Add a task</h2>
        </div>
        <form id="new-task-form">
          <div class="form-grid">
            <div class="field">
              <label for="task-title">Title</label>
              <input id="task-title" name="title" type="text" placeholder="Example: Publish YouTube short" required />
            </div>
            <div class="field">
              <label for="task-area">Area</label>
              <select id="task-area" name="area">
                <option>Content production</option>
                <option>Design</option>
                <option>Website & SEO</option>
                <option>Publishing</option>
                <option>Revenue / leads</option>
                <option>Operations</option>
              </select>
            </div>
            <div class="field">
              <label for="task-priority">Priority</label>
              <select id="task-priority" name="priority">
                <option value="high">High</option>
                <option value="medium" selected>Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div class="field">
              <label for="task-due">Due</label>
              <input id="task-due" name="due" type="text" placeholder="Today / Tomorrow / Friday" value="Today" />
            </div>
          </div>
          <div class="field">
            <label for="task-notes">Notes</label>
            <textarea id="task-notes" name="notes" placeholder="What needs to happen and why?"></textarea>
          </div>
          <button class="primary-button" type="submit">Add task</button>
        </form>
      </div>
    </section>
  `;
}

function renderTodayPage() {
  const activeTasks = state.business.tasks.filter((task) => task.status !== 'blocked');
  const needsOphelia = state.business.tasks.filter((task) => task.requiresOphelia && !task.blocked);
  const blockedTasks = state.business.tasks.filter((task) => task.blocked);

  return `
    <section class="page-section">
      <div class="urgent-box">
        <strong>Today:</strong> ${getDayLabel()} · focus on work that blocks delivery, revenue or approval.
      </div>
    </section>

    <section class="page-section">
      ${renderMetrics()}
    </section>

    <section class="page-section">
      <div class="section-header">
        <h2>Must do today</h2>
      </div>
      <div class="card-grid">
        <div class="panel-card">
          <div class="panel-header">
            <h3>Priority tasks</h3>
          </div>
          <div class="list">
            ${activeTasks.slice(0, 4).map(renderTaskCard).join('')}
          </div>
        </div>

        <div class="panel-card">
          <div class="panel-header">
            <h3>Needs Ophelia</h3>
          </div>
          <div class="list">
            ${needsOphelia.length ? needsOphelia.map(renderTaskCard).join('') : '<div class="empty-state">Nothing currently requires Ophelia review.</div>'}
          </div>
        </div>
      </div>
    </section>

    <section class="page-section">
      <div class="section-header">
        <h2>Content packages</h2>
      </div>
      <div class="card-grid">
        ${state.business.contentPackages.map(renderPackageCard).join('')}
      </div>
    </section>

    <section class="page-section">
      <div class="section-header">
        <h2>Website & SEO</h2>
      </div>
      <div class="card-grid">
        ${state.business.audits.map(renderAuditCard).join('')}
      </div>
    </section>

    <section class="page-section">
      <div class="section-header">
        <h2>Waiting / blocked</h2>
      </div>
      <div class="panel-card">
        <div class="list">
          ${blockedTasks.length ? blockedTasks.map(renderTaskCard).join('') : '<div class="empty-state">No blocked items right now.</div>'}
        </div>
      </div>
    </section>

    ${renderTaskForm()}
  `;
}

function renderContentPage() {
  return `
    <section class="page-section">
      <div class="section-header">
        <h2>Content packages</h2>
      </div>
      <div class="card-grid">
        ${state.business.contentPackages.map(renderPackageCard).join('')}
      </div>
    </section>
  `;
}

function renderBusinessTasksPage() {
  return `
    <section class="page-section">
      <div class="section-header">
        <h2>All active work</h2>
      </div>
      <div class="card-grid">
        <div class="panel-card" style="grid-column: 1 / -1;">
          <div class="list">
            ${state.business.tasks.map(renderTaskCard).join('')}
          </div>
        </div>
      </div>
    </section>
    ${renderTaskForm()}
  `;
}

function renderPlannerPage() {
  return `
    <section class="page-section">
      <div class="planner-output">
        <h3>Daily planner</h3>
        <div class="scheduler">
          <div class="task-meta">
            <span class="tag">Fixed appointments</span>
          </div>
          <div class="schedule-list">
            ${state.business.appointments.map(renderAppointmentCard).join('')}
          </div>
        </div>
      </div>
    </section>
    ${renderPlannerOutput()}
  `;
}

function renderSeoPage() {
  return `
    <section class="page-section">
      <div class="section-header">
        <h2>Website, SEO & AI-searchability</h2>
      </div>
      <div class="card-grid">
        ${state.business.audits.map(renderAuditCard).join('')}
      </div>
    </section>
  `;
}

function renderClientsPage() {
  return `
    <section class="page-section">
      <div class="section-header">
        <h2>Clients</h2>
      </div>
      <div class="panel-card">
        <div class="empty-state">
          Client snapshot view will be added here. This is intentionally minimal to keep the dashboard light and calm.
        </div>
      </div>
    </section>
  `;
}

function renderRevenuePage() {
  return `
    <section class="page-section">
      <div class="section-header">
        <h2>Revenue / Leads</h2>
      </div>
      <div class="card-grid">
        <div class="panel-card">
          <div class="list">
            ${state.business.tasks
              .filter((task) => task.area === 'Revenue / leads' || task.area === 'Operations')
              .map(renderTaskCard)
              .join('')}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderNeedsOpheliaPage() {
  return `
    <section class="page-section">
      <div class="section-header">
        <h2>Needs Ophelia</h2>
      </div>
      <div class="panel-card">
        <div class="list">
          ${state.business.tasks.filter((task) => task.requiresOphelia).map(renderTaskCard).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderWaitingPage() {
  return `
    <section class="page-section">
      <div class="section-header">
        <h2>Waiting / Blocked</h2>
      </div>
      <div class="panel-card">
        <div class="list">
          ${state.business.tasks.filter((task) => task.blocked || task.status === 'waiting').map(renderTaskCard).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderPersonalCheckIn(compact = false) {
  const today = getTodayIndex();
  const current = state.personal.mindsetByDay[today] || { energy: 3, mood: 3, focus: 3 };

  return `
    <div class="checkin-panel ${compact ? 'compact' : ''}">
      <div class="section-header">
        <h2>${compact ? 'Today’s check-in' : 'Energy · Mood · Focus'}</h2>
      </div>
      <p class="soft-note">Missed a day? No guilt — just pick up where you are.</p>
      <div class="checkin-grid">
        ${['energy', 'mood', 'focus'].map((key) => `
          <div class="field">
            <label for="checkin-${key}">${key.charAt(0).toUpperCase() + key.slice(1)}</label>
            <input id="checkin-${key}" type="range" min="1" max="5" value="${current[key]}" data-mindset="${key}" />
            <div class="range-value" data-range-for="${key}">${current[key]} / 5</div>
          </div>
        `).join('')}
      </div>
      <button class="primary-button" type="button" id="save-checkin">Save check-in</button>
    </div>
  `;
}

function renderHabitRow(habit, dayIndex = getTodayIndex()) {
  const done = Boolean(state.personal.completions[habit.id]?.[dayIndex]);
  return `
    <label class="habit-row color-${habit.color}">
      <input type="checkbox" data-habit-toggle="${habit.id}" data-day="${dayIndex}" ${done ? 'checked' : ''} />
      <span class="habit-swatch"></span>
      <span class="habit-title">${habit.title}</span>
      <span class="habit-streak">${habit.streak} day streak</span>
    </label>
  `;
}

function renderPersonalTodayPage() {
  const today = getTodayIndex();
  const todayPct = personalDayCompletion(today);
  const overallPct = personalOverallCompletion();
  const openTasks = state.personal.tasks.filter((task) => !task.done);

  return `
    <section class="page-section">
      <div class="urgent-box personal-tone">
        <strong>Today:</strong> ${getDayLabel()} · small consistent actions beat a perfect week.
      </div>
    </section>

    <section class="page-section">
      <div class="ring-summary">
        <div class="panel-card ring-card">
          <div class="ring-card-copy">
            <div class="metric-label">Today</div>
            <h3>Daily completion</h3>
            <p>${state.personal.habits.filter((h) => state.personal.completions[h.id]?.[today]).length} of ${state.personal.habits.length} habits</p>
          </div>
          ${ringSvg(todayPct, 88)}
        </div>
        <div class="panel-card ring-card">
          <div class="ring-card-copy">
            <div class="metric-label">This week</div>
            <h3>Overall progress</h3>
            <p>Across all tracked habits</p>
          </div>
          ${ringSvg(overallPct, 88)}
        </div>
      </div>
    </section>

    <section class="page-section">
      <div class="section-header">
        <h2>Today’s habits</h2>
      </div>
      <div class="panel-card">
        <div class="habit-list">
          ${state.personal.habits.map((habit) => renderHabitRow(habit, today)).join('')}
        </div>
      </div>
    </section>

    <section class="page-section">
      <div class="panel-card">
        ${renderPersonalCheckIn(true)}
      </div>
    </section>

    <section class="page-section">
      <div class="section-header">
        <h2>One-off tasks</h2>
      </div>
      <div class="panel-card">
        <div class="list">
          ${openTasks.length ? openTasks.map(renderTaskCard).join('') : '<div class="empty-state">No open one-off tasks.</div>'}
        </div>
      </div>
    </section>
  `;
}

function renderHabitsPage() {
  return `
    <section class="page-section">
      <div class="section-header">
        <h2>Habits</h2>
      </div>
      <p class="soft-note">Recurring practices — separate from one-off personal tasks.</p>
      <div class="panel-card">
        <div class="habit-list">
          ${state.personal.habits.map((habit) => renderHabitRow(habit)).join('')}
        </div>
      </div>
    </section>
    <section class="page-section">
      <div class="task-form">
        <div class="section-header">
          <h2>Add a habit</h2>
        </div>
        <form id="new-habit-form">
          <div class="form-grid">
            <div class="field">
              <label for="habit-title">Title</label>
              <input id="habit-title" name="title" type="text" placeholder="Example: Walk after lunch" required />
            </div>
            <div class="field">
              <label for="habit-color">Color</label>
              <select id="habit-color" name="color">
                <option value="coral">Coral</option>
                <option value="teal">Teal</option>
                <option value="blue">Blue</option>
                <option value="violet">Violet</option>
                <option value="amber">Amber</option>
                <option value="green">Green</option>
              </select>
            </div>
          </div>
          <button class="primary-button" type="submit">Add habit</button>
        </form>
      </div>
    </section>
  `;
}

function renderWeeklyPage() {
  return `
    <section class="page-section">
      <div class="section-header">
        <h2>Weekly grid</h2>
      </div>
      <p class="soft-note">Plan the week without overwhelm. Tick what you did — leave the rest.</p>
      <div class="weekly-scroll">
        <div class="weekly-grid">
          <div class="weekly-corner"></div>
          ${DAY_LABELS.map((label, index) => `
            <div class="weekly-day-head ${index === getTodayIndex() ? 'is-today' : ''}">
              <div class="day-name">${label}</div>
              ${ringSvg(personalDayCompletion(index), 54)}
            </div>
          `).join('')}
          ${state.personal.habits.map((habit) => `
            <div class="weekly-habit-label color-${habit.color}">
              <span class="habit-swatch"></span>
              ${habit.title}
            </div>
            ${DAY_LABELS.map((_, dayIndex) => {
              const done = Boolean(state.personal.completions[habit.id]?.[dayIndex]);
              return `
                <label class="weekly-cell">
                  <input type="checkbox" data-habit-toggle="${habit.id}" data-day="${dayIndex}" ${done ? 'checked' : ''} />
                </label>
              `;
            }).join('')}
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderPersonalTasksPage() {
  return `
    <section class="page-section">
      <div class="section-header">
        <h2>One-off tasks</h2>
      </div>
      <div class="panel-card">
        <div class="list">
          ${state.personal.tasks.map(renderTaskCard).join('')}
        </div>
      </div>
    </section>
    <section class="page-section">
      <div class="task-form">
        <div class="section-header">
          <h2>Add a one-off task</h2>
        </div>
        <form id="new-personal-task-form">
          <div class="form-grid">
            <div class="field">
              <label for="ptask-title">Title</label>
              <input id="ptask-title" name="title" type="text" placeholder="Example: Renew passport" required />
            </div>
            <div class="field">
              <label for="ptask-area">Area</label>
              <select id="ptask-area" name="area">
                <option>Life admin</option>
                <option>Home</option>
                <option>Health</option>
                <option>Learning</option>
                <option>Relationships</option>
              </select>
            </div>
          </div>
          <div class="field">
            <label for="ptask-notes">Notes</label>
            <textarea id="ptask-notes" name="notes" placeholder="Optional detail"></textarea>
          </div>
          <button class="primary-button" type="submit">Add task</button>
        </form>
      </div>
    </section>
  `;
}

function renderMindsetPage() {
  return `
    <section class="page-section">
      <div class="panel-card">
        ${renderPersonalCheckIn(false)}
      </div>
    </section>
    <section class="page-section">
      <div class="section-header">
        <h2>This week’s mindset</h2>
      </div>
      <div class="mindset-chart panel-card">
        ${DAY_LABELS.map((label, index) => {
          const day = state.personal.mindsetByDay[index];
          return `
            <div class="mindset-day ${index === getTodayIndex() ? 'is-today' : ''}">
              <div class="day-name">${label}</div>
              <div class="mindset-bars">
                <div class="mbar energy" style="height:${day ? day.energy * 18 : 4}px" title="Energy"></div>
                <div class="mbar mood" style="height:${day ? day.mood * 18 : 4}px" title="Mood"></div>
                <div class="mbar focus" style="height:${day ? day.focus * 18 : 4}px" title="Focus"></div>
              </div>
              <div class="mindset-legend">${day ? `${day.energy}/${day.mood}/${day.focus}` : '—'}</div>
            </div>
          `;
        }).join('')}
      </div>
      <p class="soft-note">Bars show Energy / Mood / Focus (1–5). Empty days stay blank — no catch-up pressure.</p>
    </section>
  `;
}

function renderBusinessPage(currentPage) {
  switch (currentPage) {
    case 'today':
      return renderTodayPage();
    case 'content':
      return renderContentPage();
    case 'tasks':
      return renderBusinessTasksPage();
    case 'planner':
      return renderPlannerPage();
    case 'seo':
      return renderSeoPage();
    case 'clients':
      return renderClientsPage();
    case 'revenue':
      return renderRevenuePage();
    case 'needs-ophelia':
      return renderNeedsOpheliaPage();
    case 'waiting':
      return renderWaitingPage();
    default:
      return renderTodayPage();
  }
}

function renderPersonalPage(currentPage) {
  switch (currentPage) {
    case 'today':
      return renderPersonalTodayPage();
    case 'habits':
      return renderHabitsPage();
    case 'weekly':
      return renderWeeklyPage();
    case 'tasks':
      return renderPersonalTasksPage();
    case 'mindset':
      return renderMindsetPage();
    default:
      return renderPersonalTodayPage();
  }
}

function renderPage() {
  const currentPage = getWorkspace().currentPage;
  const navItem = getNavItems().find((item) => item.id === currentPage);
  pageTitleEl.textContent = navItem?.label || 'Today';
  pageContentEl.innerHTML = isPersonal()
    ? renderPersonalPage(currentPage)
    : renderBusinessPage(currentPage);
  bindPageEvents();
}

function bindPageEvents() {
  pageContentEl.querySelectorAll('[data-habit-toggle]').forEach((input) => {
    input.addEventListener('change', () => {
      const habitId = input.dataset.habitToggle;
      const day = Number(input.dataset.day);
      if (!state.personal.completions[habitId]) {
        state.personal.completions[habitId] = [false, false, false, false, false, false, false];
      }
      state.personal.completions[habitId][day] = input.checked;
      if (input.checked) {
        const habit = state.personal.habits.find((item) => item.id === habitId);
        if (habit) habit.streak = (habit.streak || 0) + (day === getTodayIndex() ? 1 : 0);
      }
      saveState();
      render();
    });
  });

  pageContentEl.querySelectorAll('input[data-mindset]').forEach((input) => {
    input.addEventListener('input', () => {
      const key = input.dataset.mindset;
      const label = pageContentEl.querySelector(`[data-range-for="${key}"]`);
      if (label) label.textContent = `${input.value} / 5`;
    });
  });

  const saveCheckin = document.getElementById('save-checkin');
  if (saveCheckin) {
    saveCheckin.addEventListener('click', () => {
      const today = getTodayIndex();
      state.personal.mindsetByDay[today] = {
        energy: Number(document.getElementById('checkin-energy').value),
        mood: Number(document.getElementById('checkin-mood').value),
        focus: Number(document.getElementById('checkin-focus').value)
      };
      saveState();
      render();
    });
  }
}

function handleTaskForm(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const title = (formData.get('title') || '').toString().trim();
  if (!title) return;

  state.business.tasks.unshift({
    id: `task-${Date.now()}`,
    title,
    area: formData.get('area') || 'Content production',
    status: 'active',
    priority: formData.get('priority') || 'medium',
    due: formData.get('due') || 'Today',
    owner: 'Ophelia',
    executor: 'Manual task',
    notes: (formData.get('notes') || '').toString().trim() || 'New task added from the dashboard.',
    requiresOphelia: false,
    blocked: false,
    duration: 30,
    energy: 'admin'
  });
  saveState();
  form.reset();
  render();
}

function handleHabitForm(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const title = (formData.get('title') || '').toString().trim();
  if (!title) return;
  const id = `habit-${Date.now()}`;
  state.personal.habits.push({
    id,
    title,
    color: formData.get('color') || 'teal',
    streak: 0
  });
  state.personal.completions[id] = [false, false, false, false, false, false, false];
  saveState();
  form.reset();
  render();
}

function handlePersonalTaskForm(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const title = (formData.get('title') || '').toString().trim();
  if (!title) return;

  state.personal.tasks.unshift({
    id: `ptask-${Date.now()}`,
    title,
    area: formData.get('area') || 'Life admin',
    status: 'active',
    priority: 'medium',
    due: 'This week',
    notes: (formData.get('notes') || '').toString().trim() || 'Personal one-off task.',
    done: false
  });
  saveState();
  form.reset();
  render();
}

function handlePlanDay() {
  state.business.currentPage = 'planner';
  saveState();
  render();
}

function handleAddAppointment() {
  const title = window.prompt('Appointment title');
  if (!title) return;
  const time = window.prompt('Time (e.g. 15:30)');
  if (!time) return;
  state.business.appointments.push({ time, title });
  saveState();
  render();
}

document.addEventListener('submit', (event) => {
  if (!event.target) return;
  if (event.target.id === 'new-task-form') handleTaskForm(event);
  if (event.target.id === 'new-habit-form') handleHabitForm(event);
  if (event.target.id === 'new-personal-task-form') handlePersonalTaskForm(event);
});

function render() {
  renderShellChrome();
  renderWorkspaceSwitch();
  renderNav();
  renderQuickLinks();
  renderTopbarActions();
  renderPage();
}

render();
