const state = {
  currentPage: 'today',
};

const nav = window.dashboardData.nav;
const tasks = window.dashboardData.tasks;
const packages = window.dashboardData.contentPackages;
const audits = window.dashboardData.audits;
const links = window.dashboardData.links;

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
  navEl.innerHTML = nav
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
      render();
    });
  });
}

function renderQuickLinks() {
  quickLinksEl.innerHTML = `
    <div class="quick-link-list">
      ${links
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
      ${window.dashboardData.metrics.today
        .map(
          (metric) => `
            <div class="metric-card">
              <div class="metric-label">${metric.label}</div>
              <div class="metric-value">${metric.value}</div>
            </div>
          `
        )
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

function renderTodayPage() {
  const activeTasks = tasks.filter((task) => task.status !== 'blocked');
  const needsOphelia = tasks.filter((task) => task.requiresOphelia && !task.blocked);
  const blockedTasks = tasks.filter((task) => task.blocked);

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
        ${packages.map(renderPackageCard).join('')}
      </div>
    </section>

    <section class="page-section">
      <div class="section-header">
        <h2>Website & SEO</h2>
      </div>
      <div class="card-grid">
        ${audits.map(renderAuditCard).join('')}
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
  `;
}

function renderContentPage() {
  return `
    <section class="page-section">
      <div class="section-header">
        <h2>Content packages</h2>
      </div>
      <div class="card-grid">
        ${packages.map(renderPackageCard).join('')}
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
            ${tasks.map(renderTaskCard).join('')}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderSeoPage() {
  return `
    <section class="page-section">
      <div class="section-header">
        <h2>Website, SEO & AI-searchability</h2>
      </div>
      <div class="card-grid">
        ${audits.map(renderAuditCard).join('')}
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
            ${tasks
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
          ${tasks
            .filter((task) => task.requiresOphelia)
            .map(renderTaskCard)
            .join('')}
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
          ${tasks
            .filter((task) => task.blocked || task.status === 'waiting')
            .map(renderTaskCard)
            .join('')}
        </div>
      </div>
    </section>
  `;
}

function getPlannerOutput() {
  const plannedTasks = [...tasks]
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

function renderPlannerOutput() {
  const planner = getPlannerOutput();

  return `
    <section class="page-section">
      <div class="planner-output">
        <h3>Suggested day plan</h3>
        <div class="schedule-list">
          ${planner
            .map(
              (item) => `
                <div class="schedule-item">
                  <time>${item.time}</time>
                  <div class="task-title">${item.title}</div>
                  <span class="chip">${item.type}</span>
                </div>
              `
            )
            .join('')}
        </div>
      </div>
    </section>
  `;
}

function renderPage() {
  const currentPage = state.currentPage;
  let html = '';

  pageTitleEl.textContent = nav.find((item) => item.id === currentPage)?.label || 'Today';

  if (currentPage === 'today') {
    html = renderTodayPage();
  } else if (currentPage === 'content') {
    html = renderContentPage();
  } else if (currentPage === 'tasks') {
    html = renderTasksPage();
  } else if (currentPage === 'seo') {
    html = renderSeoPage();
  } else if (currentPage === 'clients') {
    html = renderClientsPage();
  } else if (currentPage === 'revenue') {
    html = renderRevenuePage();
  } else if (currentPage === 'needs-ophelia') {
    html = renderNeedsOpheliaPage();
  } else if (currentPage === 'waiting') {
    html = renderWaitingPage();
  }

  pageContentEl.innerHTML = html + renderPlannerOutput();
}

function onPlanDay() {
  // Keep the simple planner output visible without adding duplicates.
  render();
}

function onAddAppointment() {
  const title = window.prompt('Appointment title');
  if (!title) return;
  const time = window.prompt('Time (e.g. 15:30)');
  if (!time) return;

  window.dashboardData.appointments.push({ time, title });
  alert(`Added: ${time} — ${title}`);
}

document.getElementById('plan-day').addEventListener('click', onPlanDay);
document.getElementById('add-appointment').addEventListener('click', onAddAppointment);

function render() {
  renderNav();
  renderQuickLinks();
  renderPage();
}

render();
