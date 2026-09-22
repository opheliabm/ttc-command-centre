/**
 * TTC Command Centre — Phase 1
 * Centralised state, resilient storage, task CRUD / search / filter / modal.
 */

const STORAGE_KEY = 'ttc-command-centre-demo-v1';

const TASK_STATUSES = ['active', 'completed', 'waiting', 'blocked'];
const TASK_PRIORITIES = ['high', 'medium', 'low'];
const TASK_AREAS = [
  'Content production',
  'Design',
  'Website & SEO',
  'Publishing',
  'Revenue / leads',
  'Operations'
];

const DEFAULT_DASHBOARD_ORDER = [
  'must-do',
  'needs-review',
  'waiting',
  'revenue',
  'content',
  'seo',
  'schedule',
  'completed'
];

const DASHBOARD_PANEL_LABELS = {
  'must-do': 'Must do',
  'needs-review': 'Needs review',
  waiting: 'Waiting / blocked',
  revenue: 'Revenue / leads',
  content: 'Content packages',
  seo: 'Website & SEO',
  schedule: 'Schedule',
  completed: 'Completed'
};

const DEFAULT_COLOURS = {
  paper: '#fbfbfa',
  ink: '#080808',
  coral: '#851427',
  softLine: '#d8d8d4'
};

const LEGACY_ACCENT_REDS = new Set(['#ff5059', '#ff6b72']);

const COLOUR_PRESETS = [
  { id: 'editorial', label: 'Editorial', colours: { ...DEFAULT_COLOURS } },
  { id: 'ink-blue', label: 'Ink blue', colours: { paper: '#f7f8fb', ink: '#101820', coral: '#3d6bf3', softLine: '#d2d7e0' } },
  { id: 'soft-coral', label: 'Soft coral', colours: { paper: '#fff8f6', ink: '#1c1412', coral: '#e86b62', softLine: '#ead9d4' } },
  { id: 'forest', label: 'Forest', colours: { paper: '#f6f8f5', ink: '#14201a', coral: '#2f8f6b', softLine: '#d5ddd6' } }
];

const DUE_SORT_ORDER = {
  Today: 0,
  Tomorrow: 1,
  'This week': 2,
  Friday: 3,
  Thu: 4,
  Fri: 5,
  'Next week': 6
};

/* —— Storage helpers —— */

function storageAvailable() {
  try {
    const key = '__ttc_storage_probe__';
    window.localStorage.setItem(key, '1');
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    return false;
  }
}

const canUseStorage = storageAvailable();

function storageGet(key) {
  if (!canUseStorage) return null;
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function storageSet(key, value) {
  if (!canUseStorage) return false;
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch (error) {
    return false;
  }
}

function storageRemove(key) {
  if (!canUseStorage) return false;
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    return false;
  }
}

/* —— Data helpers —— */

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix) {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now()}-${rand}`;
}

function cloneDemoData() {
  const source = window.dashboardData || {};
  return JSON.parse(JSON.stringify({
    tasks: source.tasks || [],
    contentPackages: source.contentPackages || [],
    audits: source.audits || [],
    links: source.links || [],
    appointments: source.appointments || [],
    metrics: source.metrics || { today: [] }
  }));
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function normaliseStatus(value, blocked) {
  const status = String(value || '').toLowerCase();
  if (TASK_STATUSES.includes(status)) return status;
  if (blocked) return 'blocked';
  return 'active';
}

function normalisePriority(value) {
  const priority = String(value || '').toLowerCase();
  return TASK_PRIORITIES.includes(priority) ? priority : 'medium';
}

function normaliseArea(value) {
  const area = String(value || '').trim();
  return area || 'Operations';
}

function normaliseTask(raw) {
  const task = asObject(raw);
  const status = normaliseStatus(task.status, Boolean(task.blocked));
  const stamp = nowIso();

  return {
    id: typeof task.id === 'string' && task.id ? task.id : createId('task'),
    title: String(task.title || 'Untitled task').trim() || 'Untitled task',
    area: normaliseArea(task.area),
    status,
    priority: normalisePriority(task.priority),
    due: String(task.due || 'Today').trim() || 'Today',
    owner: String(task.owner || 'Ophelia').trim() || 'Ophelia',
    executor: String(task.executor || 'Manual task').trim() || 'Manual task',
    notes: String(task.notes || '').trim(),
    requiresOphelia: Boolean(task.requiresOphelia),
    blocked: status === 'blocked',
    duration: Number.isFinite(Number(task.duration)) ? Math.max(5, Number(task.duration)) : 30,
    energy: String(task.energy || 'admin').trim() || 'admin',
    createdAt: typeof task.createdAt === 'string' && task.createdAt ? task.createdAt : stamp,
    updatedAt: typeof task.updatedAt === 'string' && task.updatedAt ? task.updatedAt : stamp
  };
}

function validateTaskTitle(title) {
  const trimmed = String(title || '').trim();
  if (!trimmed) return { ok: false, message: 'Title is required.' };
  if (trimmed.length > 160) return { ok: false, message: 'Title must be 160 characters or fewer.' };
  return { ok: true, value: trimmed };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}


function illustration(name, size) {
  if (window.TTC_ILLUSTRATIONS && typeof window.TTC_ILLUSTRATIONS.render === 'function') {
    return window.TTC_ILLUSTRATIONS.render(name, { size: size || 'section' });
  }
  return '';
}

function sectionTitle(label, scene) {
  const art = scene ? illustration(scene, 'section') : '';
  return `
    <div class="section-header-with-art">
      <div class="section-heading-block">
        <h2 class="section-heading">${escapeHtml(label)}</h2>
      </div>
      ${art}
    </div>
  `;
}

function pageHero(copyHtml, scene) {
  return `
    <div class="page-hero-art">
      <div class="page-hero-art-copy">${copyHtml}</div>
      ${illustration(scene || 'today', 'hero')}
    </div>
  `;
}

function truncateNote(notes, max = 72) {
  const value = String(notes || '').trim();
  if (!value) return '';
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.theme === 'dark' ? 'dark' : 'light');
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;
  const toDark = state.theme !== 'dark';
  const label = toDark ? 'Switch to dark theme' : 'Switch to light theme';
  toggle.setAttribute('aria-label', label);
  toggle.setAttribute('title', label);
  const moon = toggle.querySelector('.theme-icon-moon');
  const sun = toggle.querySelector('.theme-icon-sun');
  if (moon) moon.hidden = state.theme === 'dark';
  if (sun) sun.hidden = state.theme !== 'dark';
}

function applyColourVars(colours) {
  const c = colours || DEFAULT_COLOURS;
  const root = document.documentElement;
  const isDark = state.theme === 'dark';

  // Inline custom colours beat CSS. In dark mode, keep the dark palette for
  // paper/ink/lines so text stays readable; only carry over a custom accent.
  if (isDark) {
    root.style.removeProperty('--paper');
    root.style.removeProperty('--bg');
    root.style.removeProperty('--ink');
    root.style.removeProperty('--soft-line');
    root.style.removeProperty('--muted');
    root.style.removeProperty('--muted-ink');
    root.style.removeProperty('--panel');
    root.style.removeProperty('--panel-alt');
    root.style.removeProperty('--line');

    const coral = c.coral || DEFAULT_COLOURS.coral;
    if (coral && coral.toLowerCase() !== DEFAULT_COLOURS.coral.toLowerCase()) {
      root.style.setProperty('--coral', coral);
      root.style.setProperty('--accent', coral);
    } else {
      root.style.removeProperty('--coral');
      root.style.removeProperty('--accent');
    }
    return;
  }

  root.style.setProperty('--paper', c.paper || DEFAULT_COLOURS.paper);
  root.style.setProperty('--bg', c.paper || DEFAULT_COLOURS.paper);
  root.style.setProperty('--ink', c.ink || DEFAULT_COLOURS.ink);
  root.style.setProperty('--coral', c.coral || DEFAULT_COLOURS.coral);
  root.style.setProperty('--accent', c.coral || DEFAULT_COLOURS.coral);
  root.style.setProperty('--soft-line', c.softLine || DEFAULT_COLOURS.softLine);
}

function normaliseDashboardOrder(order) {
  const incoming = asArray(order).filter((id) => DASHBOARD_PANEL_LABELS[id]);
  const merged = [...incoming];
  DEFAULT_DASHBOARD_ORDER.forEach((id) => {
    if (!merged.includes(id)) merged.push(id);
  });
  return merged;
}

function triggerArt(mood, options) {
  if (window.TTC_ILLUSTRATIONS && typeof window.TTC_ILLUSTRATIONS.react === 'function') {
    window.TTC_ILLUSTRATIONS.react(mood, options);
  }
}

function updatePageTitleArt() {
  const host = document.getElementById('page-title-art');
  if (!host || !window.TTC_ILLUSTRATIONS) return;
  // Avoid stacking the same doodle next to a page intro that already shows it
  if (isPersonal() || state.currentPage === 'today') {
    host.innerHTML = '';
    return;
  }
  const name = window.TTC_ILLUSTRATIONS.pageMap[state.currentPage] || 'empty';
  host.setAttribute('aria-hidden', 'true');
  host.className = 'illustration illustration--compact illustration--title';
  const markup = window.TTC_ILLUSTRATIONS.render(name, { size: 'compact' });
  const match = markup.match(/<svg[\s\S]*<\/svg>/i);
  host.innerHTML = match ? match[0] : '';
}

function renderSidebarCompanion() {
  const host = document.getElementById('sidebar-companion');
  if (!host || !window.TTC_ILLUSTRATIONS) return;
  // Dedicated mascot — different from every page scene
  host.innerHTML = window.TTC_ILLUSTRATIONS.render('mascot', {
    size: 'section',
    className: 'sidebar-companion-art'
  });
}


function computeMetrics(tasks) {
  const list = asArray(tasks);
  return {
    today: [
      {
        label: 'Must do today',
        value: list.filter((task) => task.status === 'active' && (task.due === 'Today' || task.priority === 'high')).length
      },
      {
        label: 'Needs Ophelia',
        value: list.filter((task) => task.requiresOphelia && task.status !== 'completed').length
      },
      {
        label: 'Waiting on others',
        value: list.filter((task) => task.status === 'waiting' || task.status === 'blocked').length
      },
      {
        label: 'Revenue moves',
        value: list.filter((task) => task.area === 'Revenue / leads' && task.status !== 'completed').length
      }
    ]
  };
}

function createDefaultState() {
  const demo = cloneDemoData();
  const tasks = demo.tasks.map(normaliseTask);

  return {
    workspace: 'business',
    currentPage: 'today',
    theme: 'light',
    tasks,
    contentPackages: asArray(demo.contentPackages),
    audits: asArray(demo.audits),
    links: asArray(demo.links),
    appointments: asArray(demo.appointments),
    metrics: computeMetrics(tasks),
    filters: {
      status: 'all',
      priority: 'all',
      area: 'all'
    },
    searchQuery: '',
    sortBy: 'priority',
    selectedItemId: null,
    modalMode: null,
    storageHealthy: canUseStorage,
    colours: { ...DEFAULT_COLOURS },
    dashboardOrder: [...DEFAULT_DASHBOARD_ORDER],
    liturgyLang: 'AM',
    liturgy: null,
    liturgyStatus: 'idle',
    liturgyError: '',
    personal: window.TTC_PERSONAL ? window.TTC_PERSONAL.seed() : { currentPage: 'today', habits: [], tasks: [], links: [], completions: {}, mindsetByDay: [] }
  };
}

function mergeLoadedState(parsed) {
  const defaults = createDefaultState();
  const data = asObject(parsed);

  const tasks = asArray(data.tasks).map(normaliseTask);
  const filters = asObject(data.filters);

  const colours = asObject(data.colours);
  return {
    ...defaults,
    workspace: data.workspace === 'personal' ? 'personal' : 'business',
    currentPage: typeof data.currentPage === 'string' ? data.currentPage : defaults.currentPage,
    theme: data.theme === 'dark' ? 'dark' : 'light',
    tasks: tasks.length ? tasks : defaults.tasks,
    contentPackages: asArray(data.contentPackages).length ? asArray(data.contentPackages) : defaults.contentPackages,
    audits: asArray(data.audits).length ? asArray(data.audits) : defaults.audits,
    links: asArray(data.links).length ? asArray(data.links) : defaults.links,
    appointments: asArray(data.appointments).length ? asArray(data.appointments) : defaults.appointments,
    filters: {
      status: TASK_STATUSES.includes(filters.status) || filters.status === 'all' ? (filters.status || 'all') : 'all',
      priority: TASK_PRIORITIES.includes(filters.priority) || filters.priority === 'all' ? (filters.priority || 'all') : 'all',
      area: typeof filters.area === 'string' ? filters.area : 'all'
    },
    searchQuery: typeof data.searchQuery === 'string' ? data.searchQuery : '',
    sortBy: data.sortBy === 'due' ? 'due' : 'priority',
    selectedItemId: null,
    modalMode: null,
    storageHealthy: canUseStorage,
    colours: {
      paper: typeof colours.paper === 'string' ? colours.paper : DEFAULT_COLOURS.paper,
      ink: typeof colours.ink === 'string' ? colours.ink : DEFAULT_COLOURS.ink,
      coral: (() => {
        const value = typeof colours.coral === 'string' ? colours.coral : DEFAULT_COLOURS.coral;
        return LEGACY_ACCENT_REDS.has(value.toLowerCase()) ? DEFAULT_COLOURS.coral : value;
      })(),
      softLine: typeof colours.softLine === 'string' ? colours.softLine : DEFAULT_COLOURS.softLine
    },
    dashboardOrder: normaliseDashboardOrder(data.dashboardOrder),
    liturgyLang: typeof data.liturgyLang === 'string' ? data.liturgyLang : 'AM',
    liturgy: null,
    liturgyStatus: 'idle',
    liturgyError: '',
    personal: window.TTC_PERSONAL ? window.TTC_PERSONAL.merge(data.personal) : defaults.personal
  };
}

function loadState() {
  const raw = storageGet(STORAGE_KEY);
  if (!raw) return createDefaultState();

  try {
    const parsed = JSON.parse(raw);
    const merged = mergeLoadedState(parsed);
    merged.metrics = computeMetrics(merged.tasks);
    return merged;
  } catch (error) {
    return createDefaultState();
  }
}

function persistableState(current) {
  return {
    workspace: current.workspace,
    currentPage: current.currentPage,
    theme: current.theme,
    tasks: current.tasks,
    contentPackages: current.contentPackages,
    audits: current.audits,
    links: current.links,
    appointments: current.appointments,
    metrics: current.metrics,
    filters: current.filters,
    searchQuery: current.searchQuery,
    sortBy: current.sortBy,
    colours: current.colours,
    dashboardOrder: current.dashboardOrder,
    liturgyLang: current.liturgyLang,
    personal: current.personal
  };
}

function saveState() {
  state.metrics = computeMetrics(state.tasks);
  const ok = storageSet(STORAGE_KEY, JSON.stringify(persistableState(state)));
  state.storageHealthy = canUseStorage ? ok : false;
  updateStorageBanner();
}

function resetDemoData() {
  const confirmed = window.confirm('Reset demo data? This clears saved tasks and restores the starter demo set.');
  if (!confirmed) return;

  storageRemove(STORAGE_KEY);
  const fresh = createDefaultState();
  Object.keys(state).forEach((key) => {
    delete state[key];
  });
  Object.assign(state, fresh);
  saveState();
  closeTaskModal({ restoreFocus: false });
  render();
}

/* —— App state —— */

const state = loadState();
let modalLastFocus = null;
let pendingDeleteId = null;

const navEl = document.getElementById('nav');
const pageContentEl = document.getElementById('page-content');
const quickLinksEl = document.getElementById('quick-links');
const pageTitleEl = document.getElementById('page-title');
const modalRootEl = document.getElementById('modal-root');
const storageBannerEl = document.getElementById('storage-banner');
const workspaceSwitchEl = document.getElementById('workspace-switch');
const brandSubtitleEl = document.getElementById('brand-subtitle');
const pageEyebrowEl = document.getElementById('page-eyebrow');
const topbarActionsEl = document.getElementById('topbar-actions');
const quickLinksLabelEl = document.getElementById('quick-links-label');

function isPersonal() {
  return state.workspace === 'personal';
}

function renderWorkspaceSwitch() {
  if (!workspaceSwitchEl) return;
  workspaceSwitchEl.innerHTML = `
    <button type="button" class="workspace-btn ${state.workspace === 'business' ? 'active' : ''}" data-workspace="business">
      Business
    </button>
    <button type="button" class="workspace-btn ${state.workspace === 'personal' ? 'active' : ''}" data-workspace="personal">
      Personal
    </button>
  `;
}

function switchWorkspace(next) {
  if (!next || next === state.workspace) return;
  state.workspace = next;
  saveState();
  render();
}

if (workspaceSwitchEl) {
  workspaceSwitchEl.addEventListener('click', (event) => {
    const button = event.target.closest('[data-workspace]');
    if (!button) return;
    switchWorkspace(button.dataset.workspace);
  });
}

function renderShellChrome() {
  document.body.dataset.workspace = state.workspace || 'business';
  if (brandSubtitleEl) {
    brandSubtitleEl.textContent = isPersonal() ? 'Personal tracker' : 'Business ops';
  }
  if (pageEyebrowEl) {
    pageEyebrowEl.textContent = isPersonal() ? 'Quiet progress · personal' : 'Command overview';
  }
  if (!topbarActionsEl) return;

  const themeToggleHtml = `
    <button class="icon-button" id="theme-toggle" type="button" title="Switch to dark theme" aria-label="Switch to dark theme">
      <span class="theme-icon theme-icon-moon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14.5A7.5 7.5 0 0 1 9.5 5 6.8 6.8 0 0 0 8 5a8 8 0 1 0 11 9.5Z"/></svg>
      </span>
      <span class="theme-icon theme-icon-sun" aria-hidden="true" hidden>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M17.2 6.8l1.6-1.6M5.2 18.8l1.6-1.6"/></svg>
      </span>
    </button>
  `;

  if (isPersonal()) {
    topbarActionsEl.innerHTML = `
      ${themeToggleHtml}
      <button class="secondary-button" id="open-weekly" type="button">Weekly grid</button>
      <button class="primary-button" id="check-in-today" type="button">Check in</button>
    `;
    document.getElementById('open-weekly')?.addEventListener('click', () => {
      state.personal.currentPage = 'weekly';
      saveState();
      render();
    });
    document.getElementById('check-in-today')?.addEventListener('click', () => {
      state.personal.currentPage = 'mindset';
      saveState();
      render();
    });
  } else {
    topbarActionsEl.innerHTML = `
      ${themeToggleHtml}
      <button class="secondary-button" id="customise-btn" type="button">Customise</button>
      <button class="secondary-button" id="plan-day" type="button">Planner</button>
      <button class="primary-button" id="add-appointment" type="button">Add appointment</button>
    `;
    document.getElementById('plan-day')?.addEventListener('click', handlePlanDay);
    document.getElementById('add-appointment')?.addEventListener('click', handleAddAppointment);
    const customiseBtn = document.getElementById('customise-btn');
    if (customiseBtn) customiseBtn.addEventListener('click', () => openCustomiseModal(customiseBtn));
  }

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) themeToggle.addEventListener('click', handleThemeToggle);
  applyTheme();
}

function updateStorageBanner() {
  if (!storageBannerEl) return;
  if (canUseStorage && state.storageHealthy !== false) {
    storageBannerEl.hidden = true;
    storageBannerEl.textContent = '';
    return;
  }
  storageBannerEl.hidden = false;
  storageBannerEl.textContent = canUseStorage
    ? 'Could not save to browser storage. Changes may not persist after refresh.'
    : 'Browser storage is unavailable. Changes work for this session only and will not persist after refresh.';
}

function getDayLabel() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

function findTask(id) {
  return state.tasks.find((task) => task.id === id) || null;
}

function dueSortValue(due) {
  const label = String(due || '');
  if (Object.prototype.hasOwnProperty.call(DUE_SORT_ORDER, label)) return DUE_SORT_ORDER[label];
  return 50;
}

function getFilteredTasks(sourceTasks) {
  const query = state.searchQuery.trim().toLowerCase();
  const priorityOrder = { high: 0, medium: 1, low: 2 };

  let list = asArray(sourceTasks).slice();

  if (state.filters.status !== 'all') {
    list = list.filter((task) => task.status === state.filters.status);
  }
  if (state.filters.priority !== 'all') {
    list = list.filter((task) => task.priority === state.filters.priority);
  }
  if (state.filters.area !== 'all') {
    list = list.filter((task) => task.area === state.filters.area);
  }
  if (query) {
    list = list.filter((task) => {
      const haystack = `${task.title} ${task.area} ${task.notes}`.toLowerCase();
      return haystack.includes(query);
    });
  }

  list.sort((a, b) => {
    if (state.sortBy === 'due') {
      const dueDiff = dueSortValue(a.due) - dueSortValue(b.due);
      if (dueDiff !== 0) return dueDiff;
    }
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return String(a.title).localeCompare(String(b.title));
  });

  return list;
}

/* —— Render helpers —— */

function renderNav() {
  if (isPersonal() && window.TTC_PERSONAL) {
    const items = window.TTC_PERSONAL.navItems();
    const current = state.personal?.currentPage || 'today';
    navEl.innerHTML = `
      <div class="nav-group">
        <div class="nav-group-label">Personal</div>
        ${items.map((item) => {
          const active = item.id === current ? 'active' : '';
          return `
            <button class="nav-item ${active}" type="button" data-page="${escapeHtml(item.id)}">
              <span class="dot" aria-hidden="true"></span>
              ${escapeHtml(item.label)}
            </button>
          `;
        }).join('')}
      </div>
    `;
    return;
  }

  const items = window.dashboardData.nav || [];
  const groups = [
    { label: 'Start', ids: ['today', 'needs-ophelia', 'waiting'] },
    { label: 'Work', ids: ['tasks', 'content', 'seo', 'planner'] },
    { label: 'Business', ids: ['clients', 'revenue'] }
  ];

  navEl.innerHTML = groups.map((group) => {
    const buttons = items
      .filter((item) => group.ids.includes(item.id))
      .map((item) => {
        const active = item.id === state.currentPage ? 'active' : '';
        return `
          <button class="nav-item ${active}" type="button" data-page="${escapeHtml(item.id)}">
            <span class="dot" aria-hidden="true"></span>
            ${escapeHtml(item.label)}
          </button>
        `;
      })
      .join('');
    return `<div class="nav-group"><div class="nav-group-label">${escapeHtml(group.label)}</div>${buttons}</div>`;
  }).join('');
}

function renderQuickLinks() {
  const links = isPersonal() ? (state.personal?.links || []) : state.links;
  if (quickLinksLabelEl) {
    quickLinksLabelEl.textContent = isPersonal() ? 'Personal links' : 'Quick links';
  }
  quickLinksEl.innerHTML = `
    <div class="quick-link-list">
      ${links
        .map(
          (link) => `
            <a class="quick-link" href="${escapeHtml(link.url)}" ${link.url === '#' ? '' : 'target="_blank" rel="noreferrer"'}>
              ${escapeHtml(link.label)}
            </a>
          `
        )
        .join('')}
    </div>
    <button class="secondary-button reset-demo-button" type="button" data-action="reset-demo">
      Reset demo data
    </button>
  `;
}

function renderMetrics() {
  return `
    <div class="metric-strip" aria-label="Daily summary">
      ${state.metrics.today
        .map(
          (metric) => `
          <div class="metric-chip">
            <div class="metric-value">${escapeHtml(metric.value)}</div>
            <div class="metric-label">${escapeHtml(metric.label)}</div>
          </div>
        `
        )
        .join('')}
    </div>
  `;
}

function renderTaskActions(task) {
  const completeLabel = task.status === 'completed' ? 'Reopen' : 'Complete';
  return `
    <div class="task-actions">
      <button class="inline-button" type="button" data-action="edit-task" data-id="${escapeHtml(task.id)}">Edit</button>
      <button class="inline-button" type="button" data-action="toggle-complete" data-id="${escapeHtml(task.id)}">${completeLabel}</button>
      <button class="inline-button danger-button" type="button" data-action="delete-task" data-id="${escapeHtml(task.id)}">Delete</button>
    </div>
  `;
}

function renderTaskCard(task) {
  const priorityClass = `priority-${task.priority}`;
  const statusClass = `status-${task.status}`;
  const note = truncateNote(task.notes);
  const done = task.status === 'completed';

  return `
    <article class="task-card ${done ? 'is-completed' : ''}" data-task-id="${escapeHtml(task.id)}">
      <button
        class="task-check ${done ? 'is-done' : ''}"
        type="button"
        data-action="toggle-complete"
        data-id="${escapeHtml(task.id)}"
        aria-label="${done ? 'Reopen task' : 'Complete task'}"
      >${done ? '<span class="task-check-mark" aria-hidden="true">✓</span>' : ''}</button>
      <div class="task-main">
        <button class="task-title-button" type="button" data-action="edit-task" data-id="${escapeHtml(task.id)}">
          <h3 class="task-title-text">${escapeHtml(task.title)}</h3>
        </button>
        ${note ? `<p class="task-note-preview">${escapeHtml(note)}</p>` : ''}
        <div class="task-meta">
          <span class="meta-dot ${priorityClass}" aria-hidden="true"></span>
          <span class="meta-text">${escapeHtml(task.priority)}</span>
          <span class="tag ${statusClass}">${escapeHtml(task.status)}</span>
          <span class="meta-text">${escapeHtml(task.area)}</span>
          <span class="meta-text">Due ${escapeHtml(task.due)}</span>
          ${task.requiresOphelia ? '<span class="tag priority-high">Needs review</span>' : ''}
        </div>
      </div>
      ${renderTaskActions(task)}
    </article>
  `;
}

function renderPackageCard(pkg) {
  return `
    <article class="content-card" data-package-id="${escapeHtml(pkg.id)}">
      <div class="content-card-header">
        <h3>${escapeHtml(pkg.title)}</h3>
        <span class="tag status-active">${escapeHtml(pkg.status)}</span>
      </div>
      <p>${escapeHtml(pkg.caption)}</p>
      <div class="progress-bar" aria-hidden="true">
        <div class="progress-fill" style="width: ${Number(pkg.progress) || 0}%"></div>
      </div>
      <div class="task-meta">
        <span class="meta-text">Due ${escapeHtml(pkg.due)}</span>
        <span class="meta-text">${escapeHtml(pkg.stage)}</span>
        <span class="next-action"><span class="next-action-arrow" aria-hidden="true">→</span><span>${escapeHtml(pkg.next)}</span></span>
      </div>
      <div class="card-footer-actions">
        <button class="inline-button danger-button" type="button" data-action="delete-package" data-id="${escapeHtml(pkg.id)}">Delete</button>
      </div>
    </article>
  `;
}

function renderAuditCard(audit) {
  return `
    <article class="audit-card" data-audit-id="${escapeHtml(audit.id)}">
      <div class="content-card-header">
        <h3>${escapeHtml(audit.title)}</h3>
        <span class="tag ${audit.level === 'High' ? 'priority-high' : audit.level === 'Medium' ? 'priority-medium' : 'priority-low'}">
          ${escapeHtml(audit.level)}
        </span>
      </div>
      <p>${escapeHtml(audit.notes)}</p>
      <div class="task-meta">
        <span class="tag">${escapeHtml(audit.status)}</span>
      </div>
      <div class="card-footer-actions">
        <button class="inline-button danger-button" type="button" data-action="delete-audit" data-id="${escapeHtml(audit.id)}">Delete</button>
      </div>
    </article>
  `;
}

function renderAppointmentCard(appointment, index) {
  const key = appointment.id || `appt-${index}`;
  return `
    <div class="schedule-item" data-appointment-id="${escapeHtml(key)}">
      <time>${escapeHtml(appointment.time)}</time>
      <div class="task-title">${escapeHtml(appointment.title)}</div>
      <button class="inline-button danger-button" type="button" data-action="delete-appointment" data-id="${escapeHtml(key)}" aria-label="Delete appointment ${escapeHtml(appointment.title)}">Delete</button>
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
          ${planner
            .map(
              (item) => `
            <div class="schedule-item">
              <time>${escapeHtml(item.time)}</time>
              <div class="task-title">${escapeHtml(item.title)}</div>
              <span class="chip">${escapeHtml(item.type)}</span>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    </section>
  `;
}

function getPlannerOutput() {
  const plannedTasks = [...state.tasks]
    .filter((task) => task.status === 'active')
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

  return [...plannedTasks, { time: '16:00', title: 'Review and set tomorrow', type: 'Admin' }];
}

function renderTaskForm(options = {}) {
  const variant = options.variant || 'compact';
  const isDashboard = variant === 'dashboard';
  const wrapClass = isDashboard
    ? 'task-compose task-compose--dashboard'
    : 'task-compose task-compose--compact';

  const detailFields = `
    <div class="compose-fields">
      <label class="compose-field">
        <span>Area</span>
        <select id="task-area" name="area" title="Area">
          ${TASK_AREAS.map((area) => `<option value="${escapeHtml(area)}">${escapeHtml(area)}</option>`).join('')}
        </select>
      </label>
      <label class="compose-field">
        <span>Priority</span>
        <select id="task-priority" name="priority" title="Priority">
          <option value="high">High</option>
          <option value="medium" selected>Medium</option>
          <option value="low">Low</option>
        </select>
      </label>
      <label class="compose-field">
        <span>Status</span>
        <select id="task-status" name="status" title="Status">
          <option value="active" selected>Active</option>
          <option value="waiting">Waiting</option>
          <option value="blocked">Blocked</option>
        </select>
      </label>
      <label class="compose-field">
        <span>Schedule</span>
        <input id="task-due" name="due" type="text" title="Schedule / due" placeholder="Today / Tomorrow / Fri" value="Today" />
      </label>
    </div>
  `;

  return `
    <section class="page-section compose-section">
      <div class="${wrapClass}" id="task-compose">
        <form id="new-task-form" class="compose-form" autocomplete="off">
          <div class="compose-main">
            <label class="visually-hidden" for="task-title">Task title</label>
            <input
              id="task-title"
              name="title"
              type="text"
              class="compose-title"
              placeholder="${isDashboard ? 'Quick add a task…' : 'Add a task…'}"
              required
              maxlength="160"
            />
            <button class="primary-button compose-submit" type="submit">Add</button>
          </div>
          <div class="compose-details ${isDashboard ? '' : 'compose-details--always'}">
            ${detailFields}
            ${
              isDashboard
                ? `
              <label class="compose-field compose-field--notes">
                <span>Notes</span>
                <textarea id="task-notes" name="notes" rows="2" placeholder="Optional details"></textarea>
              </label>
            `
                : `
              <details class="compose-notes">
                <summary>Notes</summary>
                <label class="visually-hidden" for="task-notes">Notes</label>
                <textarea id="task-notes" name="notes" rows="2" placeholder="Optional notes"></textarea>
              </details>
            `
            }
          </div>
        </form>
      </div>
    </section>
  `;
}

function renderTaskToolbar() {
  const areas = ['all', ...TASK_AREAS];

  return `
    <div class="task-toolbar">
      <div class="field">
        <label for="task-search">Search</label>
        <input id="task-search" type="search" placeholder="Search title, area, or notes" value="${escapeHtml(state.searchQuery)}" />
      </div>
      <div class="field">
        <label for="filter-status">Status</label>
        <select id="filter-status">
          <option value="all"${state.filters.status === 'all' ? ' selected' : ''}>All</option>
          ${TASK_STATUSES.map((status) => `
            <option value="${status}"${state.filters.status === status ? ' selected' : ''}>${status}</option>
          `).join('')}
        </select>
      </div>
      <div class="field">
        <label for="filter-priority">Priority</label>
        <select id="filter-priority">
          <option value="all"${state.filters.priority === 'all' ? ' selected' : ''}>All</option>
          ${TASK_PRIORITIES.map((priority) => `
            <option value="${priority}"${state.filters.priority === priority ? ' selected' : ''}>${priority}</option>
          `).join('')}
        </select>
      </div>
      <div class="field">
        <label for="filter-area">Area</label>
        <select id="filter-area">
          ${areas
            .map((area) => `
            <option value="${escapeHtml(area)}"${state.filters.area === area ? ' selected' : ''}>
              ${area === 'all' ? 'All areas' : escapeHtml(area)}
            </option>
          `)
            .join('')}
        </select>
      </div>
      <div class="field">
        <label for="sort-by">Sort</label>
        <select id="sort-by">
          <option value="priority"${state.sortBy === 'priority' ? ' selected' : ''}>Priority</option>
          <option value="due"${state.sortBy === 'due' ? ' selected' : ''}>Due</option>
        </select>
      </div>
    </div>
  `;
}

function renderTaskList(tasks, emptyMessage) {
  if (!tasks.length) {
    if (window.TTC_ILLUSTRATIONS) {
      return window.TTC_ILLUSTRATIONS.emptyState(escapeHtml(emptyMessage));
    }
    return `<div class="empty-state"><div>${escapeHtml(emptyMessage)}</div></div>`;
  }
  return `<div class="list">${tasks.map(renderTaskCard).join('')}</div>`;
}

function renderCompactTaskRow(task) {
  const done = task.status === 'completed';
  return `
    <article class="dash-row ${done ? 'is-completed' : ''}" data-task-id="${escapeHtml(task.id)}">
      <button
        class="task-check ${done ? 'is-done' : ''}"
        type="button"
        data-action="toggle-complete"
        data-id="${escapeHtml(task.id)}"
        aria-label="${done ? 'Reopen task' : 'Complete task'}"
      >${done ? '<span class="task-check-mark" aria-hidden="true">✓</span>' : ''}</button>
      <button class="dash-row-main" type="button" data-action="edit-task" data-id="${escapeHtml(task.id)}">
        <span class="dash-row-title">${escapeHtml(task.title)}</span>
        <span class="dash-row-meta">
          <span class="meta-dot priority-${escapeHtml(task.priority)}" aria-hidden="true"></span>
          <span>${escapeHtml(task.priority)}</span>
          <span>${escapeHtml(task.due)}</span>
          ${task.requiresOphelia ? '<span class="dash-flag">review</span>' : ''}
        </span>
      </button>
      <button
        class="inline-button danger-button dash-row-delete"
        type="button"
        data-action="delete-task"
        data-id="${escapeHtml(task.id)}"
        aria-label="Delete ${escapeHtml(task.title)}"
      >Delete</button>
    </article>
  `;
}

function renderCompactTaskList(tasks, emptyMessage) {
  if (!tasks.length) {
    return `<div class="dash-empty">${escapeHtml(emptyMessage)}</div>`;
  }
  return `<div class="dash-list">${tasks.map(renderCompactTaskRow).join('')}</div>`;
}

function feastCelebrateKey(dateKey) {
  return `ttc-feast-celebrated-${dateKey || 'unknown'}`;
}

function maybeCelebrateFeast(liturgy) {
  if (!liturgy || !liturgy.saint) return;
  const key = feastCelebrateKey(liturgy.dateKey);
  try {
    if (sessionStorage.getItem(key) === '1') return;
    sessionStorage.setItem(key, '1');
  } catch (error) {
    /* sessionStorage may be blocked */
  }
  triggerArt('celebrate', { duration: 1800 });
}

function renderLiturgyStrip() {
  const status = state.liturgyStatus || 'idle';
  const liturgy = state.liturgy;
  const sourceUrl = (window.TTC_LITURGY && window.TTC_LITURGY.dailyGospelUrl()) || 'https://dailygospel.org/';

  let body = '';
  if (status === 'loading' || status === 'idle') {
    body = `<p class="liturgy-status">Loading today’s readings…</p>`;
  } else if (status === 'error') {
    body = `
      <p class="liturgy-status">Couldn’t load today’s readings right now. You can still open Daily Gospel.</p>
      ${state.liturgyError ? `<p class="liturgy-error-detail">${escapeHtml(state.liturgyError)}</p>` : ''}
    `;
  } else if (liturgy) {
    const feast = liturgy.saint
      ? `<p class="liturgy-feast"><span class="liturgy-feast-label">Feast / saint</span> ${escapeHtml(liturgy.saint)}</p>`
      : '';
    const reading = liturgy.readingRef
      ? `<p class="liturgy-line"><span class="liturgy-label">Reading</span> <strong>${escapeHtml(liturgy.readingRef)}</strong>${
          liturgy.readingExcerpt ? ` — ${escapeHtml(liturgy.readingExcerpt)}` : ''
        }</p>`
      : '';
    const psalm = liturgy.psalmRef
      ? `<p class="liturgy-line"><span class="liturgy-label">Psalm</span> ${escapeHtml(liturgy.psalmRef)}</p>`
      : '';
    const gospel = liturgy.gospelRef
      ? `<p class="liturgy-line"><span class="liturgy-label">Gospel</span> <strong>${escapeHtml(liturgy.gospelRef)}</strong>${
          liturgy.gospelExcerpt ? ` — ${escapeHtml(liturgy.gospelExcerpt)}` : ''
        }</p>`
      : '';
    body = `
      <div class="liturgy-meta">
        <p class="liturgy-date">${escapeHtml(liturgy.dateLabel || '')}</p>
        ${liturgy.liturgicalTitle ? `<p class="liturgy-title">${escapeHtml(liturgy.liturgicalTitle)}</p>` : ''}
        ${feast}
      </div>
      <div class="liturgy-readings">
        ${reading}
        ${psalm}
        ${gospel}
      </div>
    `;
  }

  return `
    <section class="liturgy-strip" id="liturgy-strip" aria-live="polite">
      <div class="liturgy-strip-main">
        <div class="liturgy-strip-copy">
          <p class="liturgy-kicker">Daily Gospel</p>
          ${body}
        </div>
        ${illustration('today', 'compact')}
      </div>
      <div class="liturgy-footer">
        <span class="liturgy-source">Source: Daily Gospel / Evangelizo</span>
        <a class="secondary-button liturgy-link" href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer">Read on dailygospel.org</a>
      </div>
    </section>
  `;
}

let liturgyFetchToken = 0;

function ensureLiturgyLoaded() {
  if (isPersonal()) return;
  if (!window.TTC_LITURGY || typeof window.TTC_LITURGY.fetchToday !== 'function') return;
  if (state.currentPage !== 'today') return;

  const todayKey = window.TTC_LITURGY.todayStamp().ymd;
  const lang = state.liturgyLang || 'AM';
  if (
    state.liturgyStatus === 'ready' &&
    state.liturgy &&
    state.liturgy.dateKey === todayKey &&
    state.liturgy.lang === lang
  ) {
    maybeCelebrateFeast(state.liturgy);
    return;
  }
  if (state.liturgyStatus === 'loading' || state.liturgyStatus === 'error') return;

  state.liturgyStatus = 'loading';
  state.liturgyError = '';
  const token = ++liturgyFetchToken;

  window.TTC_LITURGY.fetchToday(lang)
    .then((data) => {
      if (token !== liturgyFetchToken) return;
      state.liturgy = data;
      state.liturgyStatus = 'ready';
      state.liturgyError = '';
      if (state.currentPage === 'today') {
        const host = document.getElementById('liturgy-strip');
        if (host) {
          host.outerHTML = renderLiturgyStrip();
        } else {
          render();
          return;
        }
        maybeCelebrateFeast(data);
      }
    })
    .catch((error) => {
      if (token !== liturgyFetchToken) return;
      state.liturgyStatus = 'error';
      state.liturgyError = error && error.message ? error.message : 'Feed unavailable';
      if (state.currentPage === 'today') {
        const host = document.getElementById('liturgy-strip');
        if (host) host.outerHTML = renderLiturgyStrip();
        else render();
      }
    });
}

function renderCompactPackageRow(pkg) {
  return `
    <article class="dash-item">
      <div class="dash-item-top">
        <strong>${escapeHtml(pkg.title)}</strong>
        <span class="meta-text">${escapeHtml(pkg.status)}</span>
      </div>
      <div class="progress-bar" aria-hidden="true">
        <div class="progress-fill" style="width: ${Number(pkg.progress) || 0}%"></div>
      </div>
      <div class="dash-item-meta">
        <span>${escapeHtml(pkg.stage)}</span>
        <span>Due ${escapeHtml(pkg.due)}</span>
      </div>
      <div class="next-action"><span class="next-action-arrow" aria-hidden="true">→</span>${escapeHtml(pkg.next)}</div>
      <div class="card-footer-actions">
        <button class="inline-button danger-button" type="button" data-action="delete-package" data-id="${escapeHtml(pkg.id)}">Delete</button>
      </div>
    </article>
  `;
}

function renderCompactAuditRow(audit) {
  return `
    <article class="dash-item">
      <div class="dash-item-top">
        <strong>${escapeHtml(audit.title)}</strong>
        <span class="tag ${audit.level === 'High' ? 'priority-high' : audit.level === 'Medium' ? 'priority-medium' : 'priority-low'}">${escapeHtml(audit.level)}</span>
      </div>
      <p class="dash-item-note">${escapeHtml(audit.notes)}</p>
      <div class="card-footer-actions">
        <button class="inline-button danger-button" type="button" data-action="delete-audit" data-id="${escapeHtml(audit.id)}">Delete</button>
      </div>
    </article>
  `;
}

function renderDashboardPanel(title, bodyHtml, pageId, options = {}) {
  let more = '';
  if (pageId) {
    const filterAttr = options.filterStatus
      ? ` data-filter-status="${escapeHtml(options.filterStatus)}"`
      : '';
    more = `<button class="dash-more" type="button" data-page="${escapeHtml(pageId)}"${filterAttr}>Open →</button>`;
  }
  return `
    <section class="dash-panel">
      <div class="dash-panel-header">
        <h3>${escapeHtml(title)}</h3>
        ${more}
      </div>
      ${bodyHtml}
    </section>
  `;
}

function renderTodayPage() {
  const mustDo = state.tasks
    .filter((task) => task.status === 'active' && (task.due === 'Today' || task.priority === 'high'))
    .slice(0, 5);
  const needsOphelia = state.tasks
    .filter((task) => task.requiresOphelia && task.status !== 'completed' && task.status !== 'blocked')
    .slice(0, 4);
  const blockedTasks = state.tasks
    .filter((task) => task.status === 'blocked' || task.status === 'waiting')
    .slice(0, 4);
  const revenueTasks = state.tasks
    .filter((task) => (task.area === 'Revenue / leads' || task.area === 'Operations') && task.status !== 'completed')
    .slice(0, 4);
  const packages = state.contentPackages.slice(0, 3);
  const audits = state.audits.slice(0, 3);
  const appointments = state.appointments.slice(0, 4);
  const completed = state.tasks
    .filter((task) => task.status === 'completed')
    .slice(0, 5);

  const panels = {
    'must-do': () =>
      renderDashboardPanel('Must do', renderCompactTaskList(mustDo, 'Nothing urgent marked for today.'), 'tasks'),
    'needs-review': () =>
      renderDashboardPanel('Needs review', renderCompactTaskList(needsOphelia, 'Nothing waiting on Ophelia.'), 'needs-ophelia'),
    waiting: () =>
      renderDashboardPanel('Waiting / blocked', renderCompactTaskList(blockedTasks, 'No blocked items.'), 'waiting'),
    revenue: () =>
      renderDashboardPanel('Revenue / leads', renderCompactTaskList(revenueTasks, 'No open revenue moves.'), 'revenue'),
    content: () =>
      renderDashboardPanel(
        'Content packages',
        packages.length
          ? `<div class="dash-list">${packages.map(renderCompactPackageRow).join('')}</div>`
          : '<div class="dash-empty">No content packages yet.</div>',
        'content'
      ),
    seo: () =>
      renderDashboardPanel(
        'Website & SEO',
        audits.length
          ? `<div class="dash-list">${audits.map(renderCompactAuditRow).join('')}</div>`
          : '<div class="dash-empty">No SEO items yet.</div>',
        'seo'
      ),
    schedule: () =>
      renderDashboardPanel(
        'Schedule',
        appointments.length
          ? `<div class="dash-list">${appointments.map((appointment, index) => renderAppointmentCard(appointment, index)).join('')}</div>`
          : '<div class="dash-empty">No fixed appointments.</div>',
        'planner'
      ),
    completed: () =>
      renderDashboardPanel(
        'Completed',
        completed.length
          ? `${renderCompactTaskList(completed, '')}
             <p class="dash-hint">Tick again to reopen. Full list: Tasks → status “completed”.</p>`
          : `<div class="dash-empty">Nothing completed yet. Ticked tasks will land here.</div>`,
        'tasks',
        { filterStatus: 'completed' }
      )
  };

  const boardHtml = normaliseDashboardOrder(state.dashboardOrder)
    .map((id) => (panels[id] ? panels[id]() : ''))
    .join('');

  return `
    <section class="dashboard-overview">
      <div class="dashboard-intro">
        <div class="dashboard-intro-copy">
          <p class="dashboard-kicker">${escapeHtml(getDayLabel())}</p>
          <p class="dashboard-lede">One-screen overview — priorities, reviews, content, SEO, and waiting items. Ticked tasks move to Completed (still in Tasks).</p>
        </div>
        ${illustration('today', 'section')}
      </div>

      ${renderLiturgyStrip()}

      ${renderMetrics()}

      <div class="dashboard-board">
        ${boardHtml}
      </div>
    </section>
  `;
}

function renderContentPage() {
  return `
    <section class="page-section">
      ${sectionTitle('Content packages', 'content')}
      <div class="card-grid">
        ${state.contentPackages.map(renderPackageCard).join('')}
      </div>
    </section>
  `;
}

function renderTasksPage() {
  const filtered = getFilteredTasks(state.tasks);

  return `
    <section class="page-section">
      ${sectionTitle('All work', 'today')}
      ${renderTaskToolbar()}
      <div class="panel-card">
        ${renderTaskList(filtered, 'No tasks match this search or filter.')}
      </div>
    </section>
  `;
}

function renderPlannerPage() {
  return `
    <section class="page-section">
      ${sectionTitle('Daily planner', 'planner')}
      <div class="planner-output">
        <div class="scheduler">
          <div class="task-meta">
            <span class="tag">Fixed appointments</span>
          </div>
          <div class="schedule-list">
            ${state.appointments.map((appointment, index) => renderAppointmentCard(appointment, index)).join('')}
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
      ${sectionTitle('Website, SEO & AI-searchability', 'seo')}
      <div class="card-grid">
        ${state.audits.map(renderAuditCard).join('')}
      </div>
    </section>
  `;
}

function renderClientsPage() {
  return `
    <section class="page-section">
      ${sectionTitle('Clients', 'empty')}
      <div class="panel-card">
        ${
          window.TTC_ILLUSTRATIONS
            ? window.TTC_ILLUSTRATIONS.emptyState(
                'Client snapshot view will be added here. This is intentionally minimal to keep the dashboard light and calm.'
              )
            : `<div class="empty-state"><div>Client snapshot view will be added here.</div></div>`
        }
      </div>
    </section>
  `;
}

function renderRevenuePage() {
  const revenueTasks = getFilteredTasks(
    state.tasks.filter((task) => task.area === 'Revenue / leads' || task.area === 'Operations')
  );

  return `
    <section class="page-section">
      ${sectionTitle('Revenue / Leads', 'revenue')}
      ${renderTaskToolbar()}
      <div class="panel-card">
        ${renderTaskList(revenueTasks, 'No revenue or operations tasks match this filter.')}
      </div>
    </section>
  `;
}

function renderNeedsOpheliaPage() {
  const tasks = getFilteredTasks(state.tasks.filter((task) => task.requiresOphelia && task.status !== 'completed'));

  return `
    <section class="page-section">
      ${sectionTitle('Needs Ophelia', 'success')}
      ${renderTaskToolbar()}
      <div class="panel-card">
        ${renderTaskList(tasks, 'Nothing currently needs Ophelia review.')}
      </div>
    </section>
  `;
}

function renderWaitingPage() {
  const tasks = getFilteredTasks(
    state.tasks.filter((task) => task.status === 'waiting' || task.status === 'blocked')
  );

  return `
    <section class="page-section">
      ${sectionTitle('Waiting / Blocked', 'waiting')}
      ${renderTaskToolbar()}
      <div class="panel-card">
        ${renderTaskList(tasks, 'No waiting or blocked tasks right now.')}
      </div>
    </section>
  `;
}

function renderPage() {
  let html = '';

  if (isPersonal() && window.TTC_PERSONAL) {
    const pageId = state.personal?.currentPage || 'today';
    pageTitleEl.textContent =
      window.TTC_PERSONAL.navItems().find((item) => item.id === pageId)?.label || 'Today';

    document.body.className = document.body.className
      .split(/\s+/)
      .filter((cls) => cls && cls !== 'modal-open' && !cls.startsWith('page-'))
      .concat(`page-personal-${pageId}`)
      .concat(document.body.classList.contains('modal-open') ? 'modal-open' : [])
      .join(' ')
      .trim();

    pageContentEl.innerHTML = window.TTC_PERSONAL.renderPage(state.personal, pageId);
    window.TTC_PERSONAL.bind(state.personal, {
      save: saveState,
      render
    });
    return;
  }

  pageTitleEl.textContent =
    (window.dashboardData.nav || []).find((item) => item.id === state.currentPage)?.label || 'Dashboard';

  document.body.className = document.body.className
    .split(/\s+/)
    .filter((cls) => cls && cls !== 'modal-open' && !cls.startsWith('page-'))
    .concat(`page-${state.currentPage}`)
    .concat(document.body.classList.contains('modal-open') ? 'modal-open' : [])
    .join(' ')
    .trim();

  switch (state.currentPage) {
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

  const composeVariant = state.currentPage === 'today' ? 'dashboard' : 'compact';
  pageContentEl.innerHTML = `${renderTaskForm({ variant: composeVariant })}${html}`;
}

/* —— Modal —— */

function optionList(values, selected) {
  return values
    .map((value) => `<option value="${escapeHtml(value)}"${value === selected ? ' selected' : ''}>${escapeHtml(value)}</option>`)
    .join('');
}

function openCustomiseModal(triggerEl) {
  modalLastFocus = triggerEl || document.activeElement;
  pendingDeleteId = null;
  state.selectedItemId = null;
  state.modalMode = 'customise';
  renderTaskModal();
}

function renderCustomiseModal() {
  const colours = state.colours || DEFAULT_COLOURS;
  const order = normaliseDashboardOrder(state.dashboardOrder);

  modalRootEl.hidden = false;
  document.body.classList.add('modal-open');
  modalRootEl.innerHTML = `
    <div class="modal-backdrop" data-action="close-modal"></div>
    <div class="modal-dialog customise-dialog" role="dialog" aria-modal="true" aria-labelledby="customise-modal-title" tabindex="-1">
      <div class="modal-header">
        <h2 id="customise-modal-title">Customise</h2>
        <button class="inline-button" type="button" data-action="close-modal" aria-label="Close">Close</button>
      </div>
      <div class="modal-body customise-body">
        <section class="customise-section">
          <h3>Colours</h3>
          <div class="colour-presets">
            ${COLOUR_PRESETS.map(
              (preset) => `
              <button
                type="button"
                class="colour-preset"
                data-action="apply-colour-preset"
                data-preset="${escapeHtml(preset.id)}"
                title="${escapeHtml(preset.label)}"
              >
                <span class="colour-preset-swatches" aria-hidden="true">
                  <i style="background:${escapeHtml(preset.colours.paper)}"></i>
                  <i style="background:${escapeHtml(preset.colours.coral)}"></i>
                  <i style="background:${escapeHtml(preset.colours.ink)}"></i>
                </span>
                <span>${escapeHtml(preset.label)}</span>
              </button>
            `
            ).join('')}
          </div>
          <div class="colour-inputs">
            <label>Paper <input type="color" id="colour-paper" value="${escapeHtml(colours.paper)}" data-colour-key="paper" /></label>
            <label>Ink <input type="color" id="colour-ink" value="${escapeHtml(colours.ink)}" data-colour-key="ink" /></label>
            <label>Accent <input type="color" id="colour-coral" value="${escapeHtml(colours.coral)}" data-colour-key="coral" /></label>
            <label>Lines <input type="color" id="colour-soft" value="${escapeHtml(colours.softLine)}" data-colour-key="softLine" /></label>
          </div>
        </section>

        <section class="customise-section">
          <h3>Dashboard cards</h3>
          <p class="customise-hint">Drag to reorder. Liturgy strip stays at the top. Arrow buttons or ↑/↓ on a focused row also work.</p>
          <ul class="dnd-list" id="dashboard-order-list">
            ${order
              .map(
                (id, index) => `
              <li
                class="dnd-item"
                draggable="true"
                tabindex="0"
                data-panel-id="${escapeHtml(id)}"
                data-index="${index}"
              >
                <span class="dnd-handle" aria-hidden="true">⋮⋮</span>
                <span class="dnd-label">${escapeHtml(DASHBOARD_PANEL_LABELS[id] || id)}</span>
                <span class="dnd-actions">
                  <button type="button" class="inline-button" data-action="move-panel" data-panel-id="${escapeHtml(id)}" data-dir="up" aria-label="Move ${escapeHtml(DASHBOARD_PANEL_LABELS[id] || id)} up">↑</button>
                  <button type="button" class="inline-button" data-action="move-panel" data-panel-id="${escapeHtml(id)}" data-dir="down" aria-label="Move ${escapeHtml(DASHBOARD_PANEL_LABELS[id] || id)} down">↓</button>
                </span>
              </li>
            `
              )
              .join('')}
          </ul>
        </section>

        <section class="customise-section">
          <h3>Daily Gospel language</h3>
          <p class="customise-hint">Feed language from Evangelizo (powers dailygospel.org). Default is American English.</p>
          <label class="customise-select-label" for="liturgy-lang">Language code
            <select id="liturgy-lang">
              ${[
                { code: 'AM', label: 'AM — American English' },
                { code: 'EN', label: 'EN — English' },
                { code: 'FR', label: 'FR — Français' },
                { code: 'SP', label: 'SP — Español' },
                { code: 'IT', label: 'IT — Italiano' }
              ]
                .map(
                  (opt) =>
                    `<option value="${opt.code}"${(state.liturgyLang || 'AM') === opt.code ? ' selected' : ''}>${opt.label}</option>`
                )
                .join('')}
            </select>
          </label>
        </section>

        <div class="modal-actions">
          <button class="secondary-button" type="button" data-action="reset-appearance">Reset appearance</button>
          <button class="primary-button" type="button" data-action="close-modal">Done</button>
        </div>
      </div>
    </div>
  `;

  const dialog = modalRootEl.querySelector('.modal-dialog');
  const firstFocus = modalRootEl.querySelector('[data-action="close-modal"]');
  if (dialog) dialog.focus({ preventScroll: true });
  if (firstFocus) firstFocus.focus({ preventScroll: true });
  bindCustomiseEvents();
}

function bindCustomiseEvents() {
  modalRootEl.querySelectorAll('input[data-colour-key]').forEach((input) => {
    input.addEventListener('input', () => {
      const key = input.getAttribute('data-colour-key');
      if (!key) return;
      state.colours = { ...state.colours, [key]: input.value };
      applyColourVars(state.colours);
      saveState();
    });
  });

  const langSelect = modalRootEl.querySelector('#liturgy-lang');
  if (langSelect) {
    langSelect.addEventListener('change', () => {
      state.liturgyLang = langSelect.value || 'AM';
      state.liturgy = null;
      state.liturgyStatus = 'idle';
      state.liturgyError = '';
      liturgyFetchToken += 1;
      saveState();
    });
  }

  const list = modalRootEl.querySelector('#dashboard-order-list');
  if (!list) return;

  let dragId = null;

  list.querySelectorAll('.dnd-item').forEach((item) => {
    item.addEventListener('dragstart', (event) => {
      dragId = item.getAttribute('data-panel-id');
      item.classList.add('is-dragging');
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', dragId || '');
      }
    });
    item.addEventListener('dragend', () => {
      item.classList.remove('is-dragging');
      list.querySelectorAll('.dnd-item').forEach((el) => el.classList.remove('drag-over'));
      dragId = null;
    });
    item.addEventListener('dragover', (event) => {
      event.preventDefault();
      item.classList.add('drag-over');
    });
    item.addEventListener('dragleave', () => item.classList.remove('drag-over'));
    item.addEventListener('drop', (event) => {
      event.preventDefault();
      item.classList.remove('drag-over');
      const fromId = dragId || (event.dataTransfer && event.dataTransfer.getData('text/plain'));
      const toId = item.getAttribute('data-panel-id');
      if (!fromId || !toId || fromId === toId) return;
      movePanelBefore(fromId, toId);
    });
    item.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
      if (event.target !== item) return;
      event.preventDefault();
      const panelId = item.getAttribute('data-panel-id');
      if (!panelId) return;
      movePanelByDir(panelId, event.key === 'ArrowUp' ? 'up' : 'down');
      window.requestAnimationFrame(() => {
        const next = modalRootEl.querySelector(`.dnd-item[data-panel-id="${CSS.escape(panelId)}"]`);
        if (next) next.focus();
      });
    });
  });
}

function movePanelBefore(fromId, toId) {
  const order = normaliseDashboardOrder(state.dashboardOrder).filter((id) => id !== fromId);
  const toIndex = order.indexOf(toId);
  if (toIndex < 0) return;
  order.splice(toIndex, 0, fromId);
  state.dashboardOrder = order;
  saveState();
  renderTaskModal();
}

function movePanelByDir(panelId, dir) {
  const order = normaliseDashboardOrder(state.dashboardOrder);
  const index = order.indexOf(panelId);
  if (index < 0) return;
  const next = dir === 'up' ? index - 1 : index + 1;
  if (next < 0 || next >= order.length) return;
  const copy = order.slice();
  const [item] = copy.splice(index, 1);
  copy.splice(next, 0, item);
  state.dashboardOrder = copy;
  saveState();
  renderTaskModal();
}

function applyColourPreset(presetId) {
  const preset = COLOUR_PRESETS.find((item) => item.id === presetId);
  if (!preset) return;
  state.colours = { ...preset.colours };
  applyColourVars(state.colours);
  saveState();
  renderTaskModal();
}

function resetAppearance() {
  state.colours = { ...DEFAULT_COLOURS };
  state.dashboardOrder = [...DEFAULT_DASHBOARD_ORDER];
  state.liturgyLang = 'AM';
  state.liturgy = null;
  state.liturgyStatus = 'idle';
  state.liturgyError = '';
  liturgyFetchToken += 1;
  applyColourVars(state.colours);
  saveState();
  render();
}

function renderTaskModal() {
  if (state.modalMode === 'customise') {
    renderCustomiseModal();
    return;
  }

  if (!state.selectedItemId || !state.modalMode) {
    modalRootEl.innerHTML = '';
    modalRootEl.hidden = true;
    document.body.classList.remove('modal-open');
    return;
  }

  const task = findTask(state.selectedItemId);
  if (!task) {
    closeTaskModal({ restoreFocus: false });
    return;
  }

  const isDeleteConfirm = pendingDeleteId === task.id;

  modalRootEl.hidden = false;
  document.body.classList.add('modal-open');
  modalRootEl.innerHTML = `
    <div class="modal-backdrop" data-action="close-modal"></div>
    <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="task-modal-title" tabindex="-1">
      <div class="modal-header">
        <h2 id="task-modal-title">${isDeleteConfirm ? 'Delete task' : 'Edit task'}</h2>
        <button class="inline-button" type="button" data-action="close-modal" aria-label="Close">Close</button>
      </div>
      ${
        isDeleteConfirm
          ? `
        <div class="modal-body">
          <p class="confirm-copy">Delete <strong>${escapeHtml(task.title)}</strong>? This cannot be undone in this browser.</p>
          <div class="modal-actions">
            <button class="secondary-button" type="button" data-action="cancel-delete">Cancel</button>
            <button class="primary-button danger-fill" type="button" data-action="confirm-delete" data-id="${escapeHtml(task.id)}">Delete task</button>
          </div>
        </div>
      `
          : `
        <form id="edit-task-form" class="modal-body">
          <p id="edit-task-error" class="form-error" hidden></p>
          <div class="form-grid">
            <div class="field" style="grid-column: 1 / -1;">
              <label for="edit-title">Title</label>
              <input id="edit-title" name="title" type="text" value="${escapeHtml(task.title)}" required maxlength="160" />
            </div>
            <div class="field">
              <label for="edit-area">Area</label>
              <select id="edit-area" name="area">${optionList(TASK_AREAS, task.area)}</select>
            </div>
            <div class="field">
              <label for="edit-priority">Priority</label>
              <select id="edit-priority" name="priority">${optionList(TASK_PRIORITIES, task.priority)}</select>
            </div>
            <div class="field">
              <label for="edit-status">Status</label>
              <select id="edit-status" name="status">${optionList(TASK_STATUSES, task.status)}</select>
            </div>
            <div class="field">
              <label for="edit-due">Due</label>
              <input id="edit-due" name="due" type="text" value="${escapeHtml(task.due)}" />
            </div>
            <div class="field">
              <label for="edit-duration">Duration (minutes)</label>
              <input id="edit-duration" name="duration" type="number" min="5" step="5" value="${escapeHtml(String(task.duration))}" />
            </div>
            <div class="field">
              <label for="edit-owner">Owner</label>
              <input id="edit-owner" name="owner" type="text" value="${escapeHtml(task.owner)}" />
            </div>
            <div class="field">
              <label for="edit-executor">Executor</label>
              <input id="edit-executor" name="executor" type="text" value="${escapeHtml(task.executor)}" />
            </div>
            <div class="field checkbox-field" style="grid-column: 1 / -1;">
              <label for="edit-requires">
                <input id="edit-requires" name="requiresOphelia" type="checkbox"${task.requiresOphelia ? ' checked' : ''} />
                Requires Ophelia review
              </label>
            </div>
            <div class="field" style="grid-column: 1 / -1;">
              <label for="edit-notes">Notes</label>
              <textarea id="edit-notes" name="notes">${escapeHtml(task.notes)}</textarea>
            </div>
          </div>
          <div class="modal-actions">
            <button class="secondary-button" type="button" data-action="close-modal">Cancel</button>
            <button class="inline-button danger-button" type="button" data-action="delete-task" data-id="${escapeHtml(task.id)}">Delete</button>
            <button class="primary-button" type="submit">Save changes</button>
          </div>
        </form>
      `
      }
    </div>
  `;

  const dialog = modalRootEl.querySelector('.modal-dialog');
  const firstFocus = modalRootEl.querySelector('#edit-title, [data-action="cancel-delete"], [data-action="close-modal"]');
  if (dialog) dialog.focus({ preventScroll: true });
  if (firstFocus) firstFocus.focus({ preventScroll: true });
}

function openTaskModal(taskId, triggerEl) {
  const task = findTask(taskId);
  if (!task) return;

  modalLastFocus = triggerEl || document.activeElement;
  pendingDeleteId = null;
  state.selectedItemId = taskId;
  state.modalMode = 'edit';
  renderTaskModal();
}

function closeTaskModal(options = {}) {
  const restoreFocus = options.restoreFocus !== false;
  state.selectedItemId = null;
  state.modalMode = null;
  pendingDeleteId = null;
  renderTaskModal();

  if (restoreFocus && modalLastFocus && typeof modalLastFocus.focus === 'function') {
    modalLastFocus.focus({ preventScroll: true });
  }
  modalLastFocus = null;
}

/* —— Mutations —— */

function upsertTaskFromForm(formData, existing) {
  const titleCheck = validateTaskTitle(formData.get('title'));
  if (!titleCheck.ok) return { ok: false, message: titleCheck.message };

  const status = normaliseStatus(formData.get('status') || existing?.status || 'active');
  const stamp = nowIso();

  return {
    ok: true,
    task: normaliseTask({
      ...(existing || {}),
      id: existing?.id || createId('task'),
      title: titleCheck.value,
      area: formData.get('area') || existing?.area || 'Operations',
      priority: formData.get('priority') || existing?.priority || 'medium',
      status,
      due: formData.get('due') || existing?.due || 'Today',
      owner: formData.get('owner') || existing?.owner || 'Ophelia',
      executor: formData.get('executor') || existing?.executor || 'Manual task',
      notes: (formData.get('notes') || '').toString().trim(),
      requiresOphelia: formData.get('requiresOphelia') === 'on' || formData.get('requiresOphelia') === true,
      duration: formData.get('duration') || existing?.duration || 30,
      energy: existing?.energy || 'admin',
      createdAt: existing?.createdAt || stamp,
      updatedAt: stamp,
      blocked: status === 'blocked'
    })
  };
}

function handleTaskForm(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const result = upsertTaskFromForm(formData, null);
  if (!result.ok) return;

  state.tasks.unshift(result.task);
  saveState();
  form.reset();
  const due = form.querySelector('#task-due');
  if (due) due.value = 'Today';
  const priority = form.querySelector('#task-priority');
  if (priority) priority.value = 'medium';
  const status = form.querySelector('#task-status');
  if (status) status.value = 'active';
  const compose = document.getElementById('task-compose');
  if (compose) compose.classList.remove('is-expanded');
  triggerArt('nod');
  render();
}

let composeOutsideBound = false;

function onComposeOutsidePointer(event) {
  const compose = document.getElementById('task-compose');
  if (!compose || !compose.classList.contains('task-compose--dashboard')) return;
  if (compose.contains(event.target)) return;
  const title = document.getElementById('task-title');
  const notes = document.getElementById('task-notes');
  const hasContent = Boolean(title?.value.trim() || notes?.value.trim());
  if (!hasContent) compose.classList.remove('is-expanded');
}

function bindPageEvents() {
  const form = document.getElementById('new-task-form');
  if (form) form.addEventListener('submit', handleTaskForm);

  const compose = document.getElementById('task-compose');
  if (compose && compose.classList.contains('task-compose--dashboard')) {
    const expand = () => compose.classList.add('is-expanded');
    compose.addEventListener('focusin', expand);
    compose.addEventListener('click', expand);
    if (!composeOutsideBound) {
      document.addEventListener('pointerdown', onComposeOutsidePointer);
      composeOutsideBound = true;
    }
  }
}

function handleEditTaskForm(event) {
  event.preventDefault();
  const form = event.target;
  if (!form || form.id !== 'edit-task-form') return;

  const task = findTask(state.selectedItemId);
  if (!task) return;

  const formData = new FormData(form);
  if (form.querySelector('#edit-requires')?.checked) {
    formData.set('requiresOphelia', 'on');
  } else {
    formData.delete('requiresOphelia');
  }

  const result = upsertTaskFromForm(formData, task);
  const errorEl = document.getElementById('edit-task-error');

  if (!result.ok) {
    if (errorEl) {
      errorEl.hidden = false;
      errorEl.textContent = result.message;
    }
    document.getElementById('edit-title')?.focus();
    return;
  }

  const index = state.tasks.findIndex((item) => item.id === task.id);
  if (index >= 0) state.tasks[index] = result.task;
  saveState();
  closeTaskModal();
  render();
}

function toggleTaskComplete(taskId) {
  const task = findTask(taskId);
  if (!task) return;

  const completing = task.status !== 'completed';
  if (completing) {
    task.status = 'completed';
    task.blocked = false;
  } else {
    task.status = 'active';
    task.blocked = false;
  }
  task.updatedAt = nowIso();
  saveState();
  render();

  if (completing) {
    window.requestAnimationFrame(() => {
      const row =
        document.querySelector(`.dash-row[data-task-id="${CSS.escape(taskId)}"]`) ||
        document.querySelector(`[data-action="toggle-complete"][data-id="${CSS.escape(taskId)}"]`)?.closest('article, .task-card, .list-item');
      triggerArt('happy', { anchor: row || undefined, duration: 1200 });
    });
  }
}

function requestDeleteTask(taskId, triggerEl) {
  const task = findTask(taskId);
  if (!task) return;
  pendingDeleteId = taskId;
  state.selectedItemId = taskId;
  state.modalMode = 'edit';
  modalLastFocus = triggerEl || document.activeElement;
  renderTaskModal();
}

function confirmDeleteTask(taskId) {
  state.tasks = state.tasks.filter((task) => task.id !== taskId);
  saveState();
  closeTaskModal({ restoreFocus: false });
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

  state.appointments.push({ id: createId('appt'), time, title });
  saveState();
  render();
}

/* —— Events —— */

function bindToolbarEvents() {
  const search = document.getElementById('task-search');
  const status = document.getElementById('filter-status');
  const priority = document.getElementById('filter-priority');
  const area = document.getElementById('filter-area');
  const sortBy = document.getElementById('sort-by');

  if (search) {
    search.addEventListener('input', () => {
      state.searchQuery = search.value;
      saveState();
      renderPage();
      bindToolbarEvents();
      bindPageEvents();
      const next = document.getElementById('task-search');
      if (next) {
        next.focus();
        const end = next.value.length;
        next.setSelectionRange(end, end);
      }
    });
  }

  const bindSelect = (el, apply) => {
    if (!el) return;
    el.addEventListener('change', () => {
      apply(el.value);
      saveState();
      render();
    });
  };

  bindSelect(status, (value) => {
    state.filters.status = value;
  });
  bindSelect(priority, (value) => {
    state.filters.priority = value;
  });
  bindSelect(area, (value) => {
    state.filters.area = value;
  });
  bindSelect(sortBy, (value) => {
    state.sortBy = value === 'due' ? 'due' : 'priority';
  });
}

function onDocumentClick(event) {
  const target = event.target.closest('[data-action], [data-page]');
  if (!target) return;

  if (target.dataset.page) {
    if (isPersonal()) {
      if (!state.personal) state.personal = window.TTC_PERSONAL ? window.TTC_PERSONAL.seed() : {};
      state.personal.currentPage = target.dataset.page;
    } else {
      state.currentPage = target.dataset.page;
      if (target.dataset.filterStatus) {
        state.filters.status = target.dataset.filterStatus;
      }
    }
    saveState();
    render();
    return;
  }

  const action = target.dataset.action;
  const id = target.dataset.id;

  switch (action) {
    case 'edit-task':
      openTaskModal(id, target);
      break;
    case 'toggle-complete':
      toggleTaskComplete(id);
      break;
    case 'delete-task':
      requestDeleteTask(id, target);
      break;
    case 'delete-package':
      if (id && window.confirm('Delete this content package?')) {
        state.contentPackages = state.contentPackages.filter((pkg) => pkg.id !== id);
        saveState();
        render();
      }
      break;
    case 'delete-audit':
      if (id && window.confirm('Delete this SEO item?')) {
        state.audits = state.audits.filter((audit) => audit.id !== id);
        saveState();
        render();
      }
      break;
    case 'delete-appointment':
      if (id && window.confirm('Delete this appointment?')) {
        state.appointments = state.appointments.filter((appt, index) => (appt.id || `appt-${index}`) !== id);
        saveState();
        render();
      }
      break;
    case 'close-modal': {
      const wasCustomise = state.modalMode === 'customise';
      closeTaskModal();
      if (wasCustomise) render();
      break;
    }
    case 'cancel-delete':
      pendingDeleteId = null;
      renderTaskModal();
      break;
    case 'confirm-delete':
      confirmDeleteTask(id);
      break;
    case 'reset-demo':
      resetDemoData();
      break;
    case 'apply-colour-preset':
      applyColourPreset(target.dataset.preset);
      break;
    case 'reset-appearance':
      resetAppearance();
      break;
    case 'move-panel':
      movePanelByDir(target.dataset.panelId, target.dataset.dir);
      break;
    default:
      break;
  }
}

function onDocumentSubmit(event) {
  if (event.target && event.target.id === 'edit-task-form') {
    handleEditTaskForm(event);
  }
}

function onDocumentKeydown(event) {
  if (event.key === 'Escape' && state.modalMode) {
    event.preventDefault();
    closeTaskModal();
    return;
  }

  if (event.key !== 'Tab' || !state.modalMode) return;

  const dialog = modalRootEl.querySelector('.modal-dialog');
  if (!dialog) return;

  const focusable = [...dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
    .filter((el) => !el.hasAttribute('disabled') && el.type !== 'hidden');
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function render() {
  applyTheme();
  applyColourVars(state.colours);
  renderWorkspaceSwitch();
  renderShellChrome();
  renderNav();
  renderQuickLinks();
  renderSidebarCompanion();
  renderPage();
  updatePageTitleArt();
  if (!isPersonal()) {
    bindToolbarEvents();
    bindPageEvents();
  }
  renderTaskModal();
  updateStorageBanner();
  ensureLiturgyLoaded();
}

function handleThemeToggle() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  saveState();
  applyTheme();
  applyColourVars(state.colours);
}

document.getElementById('plan-day').addEventListener('click', handlePlanDay);
document.getElementById('add-appointment').addEventListener('click', handleAddAppointment);
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) themeToggle.addEventListener('click', handleThemeToggle);
const customiseBtn = document.getElementById('customise-btn');
if (customiseBtn) {
  customiseBtn.addEventListener('click', () => openCustomiseModal(customiseBtn));
}
document.addEventListener('click', onDocumentClick);
document.addEventListener('submit', onDocumentSubmit);
document.addEventListener('keydown', onDocumentKeydown);

render();
