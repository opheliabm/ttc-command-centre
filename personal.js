/**
 * Personal Quiet Progress–style tracker.
 * Keeps habits / mindset separate from Business ops in app.js.
 */
(function (global) {
  const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function seed() {
    const source = (global.dashboardData && global.dashboardData.personal) || {};
    return JSON.parse(JSON.stringify({
      currentPage: 'today',
      habits: source.habits || [],
      tasks: source.tasks || [],
      links: source.links || [],
      completions: source.completions || {},
      mindsetByDay: source.mindsetByDay || [null, null, null, null, null, null, null]
    }));
  }

  function merge(raw) {
    const defaults = seed();
    if (!raw || typeof raw !== 'object') return defaults;
    return {
      currentPage: typeof raw.currentPage === 'string' ? raw.currentPage : 'today',
      habits: Array.isArray(raw.habits) && raw.habits.length ? raw.habits : defaults.habits,
      tasks: Array.isArray(raw.tasks) && raw.tasks.length ? raw.tasks : defaults.tasks,
      links: Array.isArray(raw.links) && raw.links.length ? raw.links : defaults.links,
      completions: raw.completions && typeof raw.completions === 'object' ? raw.completions : defaults.completions,
      mindsetByDay: Array.isArray(raw.mindsetByDay) ? raw.mindsetByDay : defaults.mindsetByDay
    };
  }

  function navItems() {
    return (global.dashboardData && global.dashboardData.personal && global.dashboardData.personal.nav) || [
      { id: 'today', label: 'Today' },
      { id: 'habits', label: 'Habits' },
      { id: 'weekly', label: 'Weekly grid' },
      { id: 'tasks', label: 'One-off tasks' },
      { id: 'mindset', label: 'Mindset' }
    ];
  }

  function todayIndex() {
    return new Date().getDay();
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function ringSvg(percent, size) {
    size = size || 72;
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

  function dayCompletion(personal, dayIndex) {
    const habits = personal.habits || [];
    if (!habits.length) return 0;
    const done = habits.filter((habit) => personal.completions[habit.id]?.[dayIndex]).length;
    return Math.round((done / habits.length) * 100);
  }

  function overallCompletion(personal) {
    const habits = personal.habits || [];
    if (!habits.length) return 0;
    let total = 0;
    let done = 0;
    habits.forEach((habit) => {
      (personal.completions[habit.id] || []).forEach((value) => {
        total += 1;
        if (value) done += 1;
      });
    });
    return total ? Math.round((done / total) * 100) : 0;
  }

  function habitRow(personal, habit, dayIndex) {
    const done = Boolean(personal.completions[habit.id]?.[dayIndex]);
    return `
      <label class="habit-row color-${escapeHtml(habit.color || 'teal')}">
        <input type="checkbox" data-habit-toggle="${escapeHtml(habit.id)}" data-day="${dayIndex}" ${done ? 'checked' : ''} />
        <span class="habit-swatch" aria-hidden="true"></span>
        <span class="habit-title">${escapeHtml(habit.title)}</span>
        <span class="habit-streak">${escapeHtml(habit.streak || 0)} day streak</span>
      </label>
    `;
  }

  function checkIn(personal, compact) {
    const today = todayIndex();
    const current = personal.mindsetByDay[today] || { energy: 3, mood: 3, focus: 3 };
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

  function simpleTaskCard(task) {
    return `
      <article class="task-card personal-task-card">
        <div class="task-main">
          <h3 class="task-title-text">${escapeHtml(task.title)}</h3>
          <p class="task-note-preview">${escapeHtml(task.notes || '')}</p>
          <div class="task-meta">
            <span class="tag priority-${escapeHtml(task.priority || 'medium')}">${escapeHtml(task.priority || 'medium')}</span>
            <span class="tag status-${escapeHtml(task.status || 'active')}">${escapeHtml(task.status || 'active')}</span>
            <span class="meta-text">${escapeHtml(task.area || '')}</span>
            <span class="meta-text">Due ${escapeHtml(task.due || '')}</span>
          </div>
        </div>
      </article>
    `;
  }

  function dayLabel() {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  function renderToday(personal) {
    const today = todayIndex();
    const openTasks = (personal.tasks || []).filter((task) => !task.done);
    return `
      <section class="page-section">
        <div class="urgent-box personal-tone">
          <strong>Today:</strong> ${escapeHtml(dayLabel())} · small consistent actions beat a perfect week.
        </div>
      </section>
      <section class="page-section">
        <div class="ring-summary">
          <div class="panel-card ring-card">
            <div class="ring-card-copy">
              <div class="metric-label">Today</div>
              <h3>Daily completion</h3>
              <p>${personal.habits.filter((h) => personal.completions[h.id]?.[today]).length} of ${personal.habits.length} habits</p>
            </div>
            ${ringSvg(dayCompletion(personal, today), 88)}
          </div>
          <div class="panel-card ring-card">
            <div class="ring-card-copy">
              <div class="metric-label">This week</div>
              <h3>Overall progress</h3>
              <p>Across all tracked habits</p>
            </div>
            ${ringSvg(overallCompletion(personal), 88)}
          </div>
        </div>
      </section>
      <section class="page-section">
        <div class="section-header"><h2>Today’s habits</h2></div>
        <div class="panel-card">
          <div class="habit-list">
            ${personal.habits.map((habit) => habitRow(personal, habit, today)).join('')}
          </div>
        </div>
      </section>
      <section class="page-section">
        <div class="panel-card">${checkIn(personal, true)}</div>
      </section>
      <section class="page-section">
        <div class="section-header"><h2>One-off tasks</h2></div>
        <div class="panel-card">
          <div class="list">
            ${openTasks.length ? openTasks.map(simpleTaskCard).join('') : '<div class="empty-state">No open one-off tasks.</div>'}
          </div>
        </div>
      </section>
    `;
  }

  function renderHabits(personal) {
    return `
      <section class="page-section">
        <div class="section-header"><h2>Habits</h2></div>
        <p class="soft-note">Recurring practices — separate from one-off personal tasks.</p>
        <div class="panel-card">
          <div class="habit-list">
            ${personal.habits.map((habit) => habitRow(personal, habit, todayIndex())).join('')}
          </div>
        </div>
      </section>
      <section class="page-section">
        <div class="task-form panel-card">
          <div class="section-header"><h2>Add a habit</h2></div>
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
                  <option value="teal" selected>Teal</option>
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

  function renderWeekly(personal) {
    return `
      <section class="page-section">
        <div class="section-header"><h2>Weekly grid</h2></div>
        <p class="soft-note">Plan the week without overwhelm. Tick what you did — leave the rest.</p>
        <div class="weekly-scroll">
          <div class="weekly-grid">
            <div class="weekly-corner"></div>
            ${DAY_LABELS.map((label, index) => `
              <div class="weekly-day-head ${index === todayIndex() ? 'is-today' : ''}">
                <div class="day-name">${label}</div>
                ${ringSvg(dayCompletion(personal, index), 54)}
              </div>
            `).join('')}
            ${personal.habits.map((habit) => `
              <div class="weekly-habit-label color-${escapeHtml(habit.color || 'teal')}">
                <span class="habit-swatch"></span>
                ${escapeHtml(habit.title)}
              </div>
              ${DAY_LABELS.map((_, dayIndex) => {
                const done = Boolean(personal.completions[habit.id]?.[dayIndex]);
                return `
                  <label class="weekly-cell">
                    <input type="checkbox" data-habit-toggle="${escapeHtml(habit.id)}" data-day="${dayIndex}" ${done ? 'checked' : ''} />
                  </label>
                `;
              }).join('')}
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  function renderTasks(personal) {
    return `
      <section class="page-section">
        <div class="section-header"><h2>One-off tasks</h2></div>
        <div class="panel-card">
          <div class="list">
            ${(personal.tasks || []).map(simpleTaskCard).join('') || '<div class="empty-state">No personal tasks yet.</div>'}
          </div>
        </div>
      </section>
      <section class="page-section">
        <div class="task-form panel-card">
          <div class="section-header"><h2>Add a one-off task</h2></div>
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

  function renderMindset(personal) {
    return `
      <section class="page-section">
        <div class="panel-card">${checkIn(personal, false)}</div>
      </section>
      <section class="page-section">
        <div class="section-header"><h2>This week’s mindset</h2></div>
        <div class="mindset-chart panel-card">
          ${DAY_LABELS.map((label, index) => {
            const day = personal.mindsetByDay[index];
            return `
              <div class="mindset-day ${index === todayIndex() ? 'is-today' : ''}">
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

  function renderPage(personal, pageId) {
    switch (pageId) {
      case 'habits':
        return renderHabits(personal);
      case 'weekly':
        return renderWeekly(personal);
      case 'tasks':
        return renderTasks(personal);
      case 'mindset':
        return renderMindset(personal);
      case 'today':
      default:
        return renderToday(personal);
    }
  }

  function bind(personal, { save, render }) {
    const root = document.getElementById('page-content');
    if (!root) return;

    root.querySelectorAll('[data-habit-toggle]').forEach((input) => {
      input.addEventListener('change', () => {
        const habitId = input.dataset.habitToggle;
        const day = Number(input.dataset.day);
        if (!personal.completions[habitId]) {
          personal.completions[habitId] = [false, false, false, false, false, false, false];
        }
        personal.completions[habitId][day] = input.checked;
        if (input.checked) {
          const habit = personal.habits.find((item) => item.id === habitId);
          if (habit && day === todayIndex()) habit.streak = (habit.streak || 0) + 1;
        }
        save();
        render();
      });
    });

    root.querySelectorAll('input[data-mindset]').forEach((input) => {
      input.addEventListener('input', () => {
        const key = input.dataset.mindset;
        const label = root.querySelector(`[data-range-for="${key}"]`);
        if (label) label.textContent = `${input.value} / 5`;
      });
    });

    const saveCheckin = document.getElementById('save-checkin');
    if (saveCheckin) {
      saveCheckin.addEventListener('click', () => {
        personal.mindsetByDay[todayIndex()] = {
          energy: Number(document.getElementById('checkin-energy').value),
          mood: Number(document.getElementById('checkin-mood').value),
          focus: Number(document.getElementById('checkin-focus').value)
        };
        save();
        render();
      });
    }

    const habitForm = document.getElementById('new-habit-form');
    if (habitForm) {
      habitForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(habitForm);
        const title = String(formData.get('title') || '').trim();
        if (!title) return;
        const id = `habit-${Date.now()}`;
        personal.habits.push({
          id,
          title,
          color: formData.get('color') || 'teal',
          streak: 0
        });
        personal.completions[id] = [false, false, false, false, false, false, false];
        save();
        render();
      });
    }

    const taskForm = document.getElementById('new-personal-task-form');
    if (taskForm) {
      taskForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(taskForm);
        const title = String(formData.get('title') || '').trim();
        if (!title) return;
        personal.tasks.unshift({
          id: `ptask-${Date.now()}`,
          title,
          area: formData.get('area') || 'Life admin',
          status: 'active',
          priority: 'medium',
          due: 'This week',
          notes: String(formData.get('notes') || '').trim() || 'Personal one-off task.',
          done: false
        });
        save();
        render();
      });
    }
  }

  global.TTC_PERSONAL = {
    seed,
    merge,
    navItems,
    renderPage,
    bind,
    todayIndex
  };
})(window);
