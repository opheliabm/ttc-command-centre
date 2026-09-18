const STORAGE_KEY = 'ttc-command-centre-demo-v1';

const initialState = {
  currentPage: 'today',
  tasks: window.dashboardData.tasks,
  contentPackages: window.dashboardData.contentPackages,
  audits: window.dashboardData.audits,
  links: window.dashboardData.links,
  appointments: window.dashboardData.appointments,
  metrics: window.dashboardData.metrics
};

const state = loadState();

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return { ...initialState };
    const parsed = JSON.parse(saved);
    return {
      ...initialState,
      ...parsed,
      tasks: parsed.tasks || initialState.tasks,
      contentPackages: parsed.contentPackages || initialState.contentPackages,
      audits: parsed.audits || initialState.audits,
      links: parsed.links || initialState.links,
      appointments: parsed.appointments || initialState.appointments,
      metrics: parsed.metrics || initialState.metrics
    };
  } catch (error) {
    return { ...initialState };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    currentPage: state.currentPage,
    tasks: state.tasks,
    contentPackages: state.contentPackages,
    audits: state.audits,
    links: state.links,
    appointments: state.appointments,
    metrics: state.metrics
  }));
}

const navEl = document.getElementById('nav');
const pageContentEl = document.getElementById('page-content');
const quickLinksEl = document.getElementById('quick-links');
const pageTitleEl = document.getElementById('page-title');

function getDayLabel() {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

function renderNav() {
  navEl.innerHTML = window.dashboardData.nav
    .map((item) => {
      const active = item.id === state.currentPage ? 'active' : '';
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
      state.currentPage = button.dataset.page;
      saveState();
      render();
    });
  });
}

function renderQuickLinks() {
  quickLinksEl.innerHTML = `
    <div class="quick-link-list">
      ${state.links
        .map(
          (link) => `
            <a class="quick-link" href="${link.url}" target="_blank" rel="noreferrer">
              ${link.label}
            </a>
          `
        )
        .join('')}
    </div>
  `;
}

function renderMetrics() {
  return `
    <div class="metric-grid">
      ${state.metrics.today
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
        <span class="tag">Owner: ${task.owner}</span>
        <span class="tag">Executor: ${task.executor}</span>
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
  const plannedTasks = [...state.tasks]
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
  const activeTasks = state.tasks.filter((task) => task.status !== 'blocked');
  const needsOphelia = state.tasks.filter((task) => task.requiresOphelia && !task.blocked);
  const blockedTasks = state.tasks.filter((task) => task.blocked);

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
        ${state.contentPackages.map(renderPackageCard).join('')}
      </div>
    </section>

    <section class="page-section">
      <div class="section-header">
        <h2>Website & SEO</h2>
      </div>
      <div class="card-grid">
        ${state.audits.map(renderAuditCard).join('')}
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
        ${state.contentPackages.map(renderPackageCard).join('')}
      </div>
    </section>
  `;
}

function renderTasksPage() {
  return `
    <section class="page-section">
      <div class="section-header">
        <h2>All active work</h2>
      </div>
      <div class="card-grid">
        <div class="panel-card" style="grid-column: 1 / -1;">
          <div class="list">
            ${state.tasks.map(renderTaskCard).join('')}
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
            ${state.appointments.map(renderAppointmentCard).join('')}
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
        ${state.audits.map(renderAuditCard).join('')}
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
            ${state.tasks
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
          ${state.tasks.filter((task) => task.requiresOphelia).map(renderTaskCard).join('')}
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
          ${state.tasks.filter((task) => task.blocked || task.status === 'waiting').map(renderTaskCard).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderPage() {
  const currentPage = state.currentPage;
  let html = '';

  pageTitleEl.textContent = window.dashboardData.nav.find((item) => item.id === currentPage)?.label || 'Today';

  switch (currentPage) {
    case 'today':
      html = renderTodayPage();
      break;
    case 'content':
      html = renderContentPage();
      break;
    case 'tasks':
      html = renderTasksPage();
      break;
    case 'planner':
      html = renderPlannerPage();
      break;
    case 'seo':
      html = renderSeoPage();
      break;
    case 'clients':
      html = renderClientsPage();
      break;
    case 'revenue':
      html = renderRevenuePage();
      break;
    case 'needs-ophelia':
      html = renderNeedsOpheliaPage();
      break;
    case 'waiting':
      html = renderWaitingPage();
      break;
    default:
      html = renderTodayPage();
  }

  pageContentEl.innerHTML = html;
}

function handleTaskForm(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const formData = new FormData(form);

  const title = (formData.get('title') || '').toString().trim();
  if (!title) return;

  const newTask = {
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
  };

  state.tasks.unshift(newTask);
  saveState();
  form.reset();
  render();
}

function handlePlanDay() {
  state.currentPage = 'planner';
  saveState();
  render();
}

function handleAddAppointment() {
  const title = window.prompt('Appointment title');
  if (!title) return;
  const time = window.prompt('Time (e.g. 15:30)');
  if (!time) return;

  state.appointments.push({ time, title });
  saveState();
  render();
}

document.getElementById('plan-day').addEventListener('click', handlePlanDay);
document.getElementById('add-appointment').addEventListener('click', handleAddAppointment);

document.addEventListener('submit', (event) => {
  if (event.target && event.target.id === 'new-task-form') {
    handleTaskForm(event);
  }
});

function render() {
  renderNav();
  renderQuickLinks();
  renderPage();
}

render();
