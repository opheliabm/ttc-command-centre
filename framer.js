/**
 * Framer Client Readiness Dashboard.
 * Learning plan, project tracker, and prospect pipeline — editable, saved locally.
 */
(function (global) {
  const STATUS_OPTIONS = ['not_started', 'in_progress', 'blocked', 'complete'];
  const STATUS_LABELS = {
    not_started: 'Not started',
    in_progress: 'In progress',
    blocked: 'Blocked',
    complete: 'Complete'
  };
  const PROJECT_STAGES = ['brief', 'desktop', 'mobile', 'seo', 'qa', 'published', 'caseStudy'];
  const PROJECT_STAGE_LABELS = {
    brief: 'Brief',
    desktop: 'Desktop',
    mobile: 'Mobile',
    seo: 'SEO',
    qa: 'QA',
    published: 'Published',
    caseStudy: 'Case study'
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function plan() {
    return global.framerPlanData || {};
  }

  function emptyWeeklyReview(week) {
    return {
      week,
      status: 'not_started',
      shipped: '',
      evidenceLinks: '',
      newCapability: '',
      obstacle: '',
      changeNextWeek: '',
      prospectsResearched: 0,
      messagesSent: 0,
      followUpsSent: 0,
      applicationsSubmitted: 0,
      replies: 0,
      callsBooked: 0,
      proposalsSent: 0,
      projectsWon: 0
    };
  }

  function seedWeeklyReviews() {
    const fromPlan = asArray(plan().weeklyReviews);
    const byWeek = {};
    fromPlan.forEach((row) => {
      if (row && Number(row.week)) byWeek[Number(row.week)] = row;
    });
    const weeks = [];
    for (let week = 1; week <= 8; week += 1) {
      weeks.push(byWeek[week] ? { ...emptyWeeklyReview(week), ...byWeek[week], week } : emptyWeeklyReview(week));
    }
    return weeks;
  }

  function asArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function seed() {
    const source = plan();
    return {
      currentPage: 'today',
      learningWeekFilter: 'all',
      learningStatusFilter: 'all',
      editingTaskId: null,
      editingProspectId: null,
      editingProjectId: null,
      editingReviewWeek: null,
      tasks: clone(asArray(source.tasks)),
      projects: clone(asArray(source.projects)),
      prospects: clone(asArray(source.prospects)),
      weeklyReviews: seedWeeklyReviews(),
      metricTargets: clone(source.metricTargets || {}),
      links: clone(asArray(source.links)),
      linkedInConnections: clone(asArray(source.linkedInConnections)),
      meta: clone(source.meta || {})
    };
  }

  function mergeTasks(rawTasks, defaults) {
    const incoming = asArray(rawTasks);
    if (!incoming.length) return defaults;
    const byId = {};
    incoming.forEach((task) => {
      if (task && task.id) byId[task.id] = task;
    });
    // Keep seed order and IDs; overlay saved fields. Append any custom tasks.
    const merged = defaults.map((task) => {
      const saved = byId[task.id];
      if (!saved) return task;
      delete byId[task.id];
      return {
        ...task,
        ...saved,
        id: task.id,
        week: Number(saved.week) || task.week,
        status: STATUS_OPTIONS.includes(saved.status) ? saved.status : task.status
      };
    });
    Object.keys(byId).forEach((id) => {
      merged.push(byId[id]);
    });
    return merged;
  }

  function merge(raw) {
    const defaults = seed();
    if (!raw || typeof raw !== 'object') return defaults;
    return {
      currentPage: typeof raw.currentPage === 'string' ? raw.currentPage : 'today',
      learningWeekFilter: raw.learningWeekFilter != null ? String(raw.learningWeekFilter) : 'all',
      learningStatusFilter: STATUS_OPTIONS.includes(raw.learningStatusFilter) || raw.learningStatusFilter === 'all'
        ? raw.learningStatusFilter
        : 'all',
      editingTaskId: null,
      editingProspectId: null,
      editingProjectId: null,
      editingReviewWeek: null,
      tasks: mergeTasks(raw.tasks, defaults.tasks),
      projects: asArray(raw.projects).length ? asArray(raw.projects) : defaults.projects,
      prospects: asArray(raw.prospects).length ? asArray(raw.prospects) : defaults.prospects,
      weeklyReviews: (() => {
        const saved = asArray(raw.weeklyReviews);
        if (!saved.length) return defaults.weeklyReviews;
        const byWeek = {};
        saved.forEach((row) => {
          if (row && Number(row.week)) byWeek[Number(row.week)] = row;
        });
        return defaults.weeklyReviews.map((row) => ({
          ...row,
          ...(byWeek[row.week] || {}),
          week: row.week
        }));
      })(),
      metricTargets: raw.metricTargets && typeof raw.metricTargets === 'object'
        ? { ...defaults.metricTargets, ...raw.metricTargets }
        : defaults.metricTargets,
      links: asArray(raw.links).length ? asArray(raw.links) : defaults.links,
      linkedInConnections: asArray(raw.linkedInConnections),
      meta: raw.meta && typeof raw.meta === 'object' ? { ...defaults.meta, ...raw.meta } : defaults.meta
    };
  }

  function navItems() {
    return asArray(plan().nav).length
      ? plan().nav
      : [
          { id: 'today', label: 'Today' },
          { id: 'learning', label: 'Learning' },
          { id: 'projects', label: 'Projects' },
          { id: 'pipeline', label: 'Pipeline' },
          { id: 'weekly', label: 'Weekly review' },
          { id: 'linkedin', label: 'LinkedIn' }
        ];
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function statusLabel(status) {
    return STATUS_LABELS[status] || status || 'Not started';
  }

  function optionList(values, selected) {
    return values
      .map((value) => {
        const label = typeof value === 'string' ? value : value.label;
        const id = typeof value === 'string' ? value : value.id;
        const isSelected = String(id) === String(selected);
        return `<option value="${escapeHtml(id)}" ${isSelected ? 'selected' : ''}>${escapeHtml(label)}</option>`;
      })
      .join('');
  }

  function statusOptionsHtml(selected) {
    return optionList(
      STATUS_OPTIONS.map((id) => ({ id, label: statusLabel(id) })),
      selected
    );
  }

  function weekdayName() {
    return new Date().toLocaleDateString('en-US', { weekday: 'long' });
  }

  function dayLabel() {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  function computeLiveMetrics(framer) {
    const tasks = asArray(framer.tasks);
    const prospects = asArray(framer.prospects);
    const projects = asArray(framer.projects);
    const reviews = asArray(framer.weeklyReviews);

    const completeTasks = tasks.filter((task) => task.status === 'complete').length;
    const researched = prospects.filter((p) => p.stage !== 'research' || (p.company && p.company.indexOf('Example') === -1)).length;
    const contacted = prospects.filter((p) =>
      ['contacted', 'replied', 'call_booked', 'proposal_sent', 'won', 'lost', 'nurture'].includes(p.stage)
    ).length;
    const calls = prospects.filter((p) => ['call_booked', 'proposal_sent', 'won'].includes(p.stage)).length;
    const won = prospects.filter((p) => p.stage === 'won').length;
    const published = projects.filter((p) => p.published === 'complete').length;
    const caseStudies = projects.filter((p) => p.caseStudy === 'complete').length;

    const reviewTotals = reviews.reduce(
      (acc, row) => {
        acc.messages += Number(row.messagesSent) || 0;
        acc.followUps += Number(row.followUpsSent) || 0;
        acc.applications += Number(row.applicationsSubmitted) || 0;
        acc.agency += Number(row.replies) || 0;
        return acc;
      },
      { messages: 0, followUps: 0, applications: 0, agency: 0 }
    );

    return {
      learningSessionsCompleted: completeTasks,
      responsivePagesPublished: published,
      portfolioCaseStudiesReady: caseStudies,
      prospectsResearched: Math.max(researched, reviews.reduce((n, r) => n + (Number(r.prospectsResearched) || 0), 0)),
      personalizedMessagesSent: Math.max(contacted, reviewTotals.messages),
      followUpsSent: reviewTotals.followUps,
      relevantJobsApplied: reviewTotals.applications,
      agencyOrReferralConversations: reviewTotals.agency,
      discoveryCallsBooked: calls,
      paidProjectsWon: won
    };
  }

  function metricRows(framer) {
    const targets = framer.metricTargets || {};
    const live = computeLiveMetrics(framer);
    const labels = [
      ['learningSessionsCompleted', 'Learning sessions completed'],
      ['responsivePagesPublished', 'Responsive pages published'],
      ['portfolioCaseStudiesReady', 'Portfolio case studies ready'],
      ['prospectsResearched', 'Prospects researched'],
      ['personalizedMessagesSent', 'Personalized messages sent'],
      ['followUpsSent', 'Follow-ups sent'],
      ['relevantJobsApplied', 'Relevant jobs applied to'],
      ['agencyOrReferralConversations', 'Agency or referral conversations'],
      ['discoveryCallsBooked', 'Discovery calls booked'],
      ['paidProjectsWon', 'Paid projects won']
    ];
    return labels.map(([key, label]) => ({
      key,
      label,
      target: Number(targets[key]) || 0,
      current: Number(live[key]) || 0
    }));
  }

  function intro(lede) {
    return `
      <div class="framer-intro">
        <p class="framer-intro-kicker">Framer readiness · 8 weeks</p>
        <p class="framer-intro-lede">${escapeHtml(lede)}</p>
      </div>
    `;
  }

  function taskCard(task, { expanded, editable }) {
    const editing = expanded && editable;
    return `
      <article class="task-card framer-task-card status-${escapeHtml(task.status || 'not_started')}" data-task-id="${escapeHtml(task.id)}">
        <div class="task-main">
          <div class="task-id-row">
            <span class="task-id">${escapeHtml(task.id)}</span>
            <span class="tag status-${escapeHtml(task.status || 'not_started')}">${escapeHtml(statusLabel(task.status))}</span>
          </div>
          <h3 class="task-title-text">${escapeHtml(task.title)}</h3>
          <div class="task-meta">
            <span class="meta-text">Week ${escapeHtml(task.week)}</span>
            <span class="meta-text">${escapeHtml(task.day)}</span>
            <span class="tag track-${escapeHtml(String(task.track || '').toLowerCase())}">${escapeHtml(task.track)}</span>
            <span class="meta-text">${escapeHtml(task.duration)} min</span>
          </div>
          ${task.output ? `<p class="task-note-preview"><strong>Output:</strong> ${escapeHtml(task.output)}</p>` : ''}
          ${task.blocker ? `<p class="task-blocker"><strong>Blocker:</strong> ${escapeHtml(task.blocker)}</p>` : ''}
          <div class="task-actions">
            <button class="secondary-button" type="button" data-framer-edit-task="${escapeHtml(task.id)}">
              ${editing ? 'Close' : 'Edit'}
            </button>
            ${task.status !== 'complete' ? `
              <button class="primary-button" type="button" data-framer-quick-complete="${escapeHtml(task.id)}">Mark complete</button>
            ` : ''}
          </div>
        </div>
        ${editing ? taskEditForm(task) : ''}
      </article>
    `;
  }

  function taskEditForm(task) {
    const meta = plan().meta || {};
    const days = asArray(meta.days);
    const tracks = asArray(meta.tracks);
    return `
      <form class="framer-edit-form" data-framer-task-form="${escapeHtml(task.id)}">
        <div class="form-grid">
          <div class="field">
            <label>Status</label>
            <select name="status">${statusOptionsHtml(task.status)}</select>
          </div>
          <div class="field">
            <label>Day</label>
            <select name="day">${optionList(days, task.day)}</select>
          </div>
          <div class="field">
            <label>Track</label>
            <select name="track">${optionList(tracks, task.track)}</select>
          </div>
          <div class="field">
            <label>Duration (min)</label>
            <input name="duration" type="number" min="5" max="240" value="${escapeHtml(task.duration || 40)}" />
          </div>
        </div>
        <div class="field">
          <label>Title</label>
          <input name="title" type="text" value="${escapeHtml(task.title)}" required />
        </div>
        <div class="field">
          <label>Output</label>
          <textarea name="output" rows="2">${escapeHtml(task.output || '')}</textarea>
        </div>
        <div class="field">
          <label>Evidence URL</label>
          <input name="evidence" type="url" placeholder="https://" value="${escapeHtml(task.evidence || '')}" />
        </div>
        <div class="field">
          <label>Notes</label>
          <textarea name="notes" rows="3">${escapeHtml(task.notes || '')}</textarea>
        </div>
        <div class="field">
          <label>Blocker</label>
          <input name="blocker" type="text" value="${escapeHtml(task.blocker || '')}" />
        </div>
        <div class="field">
          <label>Due date</label>
          <input name="dueDate" type="date" value="${escapeHtml(task.dueDate || '')}" />
        </div>
        <div class="form-actions">
          <button class="primary-button" type="submit">Save task</button>
        </div>
      </form>
    `;
  }

  function metricsPanel(framer) {
    const rows = metricRows(framer);
    return `
      <div class="framer-metrics">
        ${rows
          .map(
            (row) => `
          <div class="framer-metric">
            <div class="framer-metric-label">${escapeHtml(row.label)}</div>
            <div class="framer-metric-values">
              <span class="framer-metric-current">${escapeHtml(row.current)}</span>
              <span class="framer-metric-sep">/</span>
              <span class="framer-metric-target">${escapeHtml(row.target)}</span>
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    `;
  }

  function renderToday(framer) {
    const todayName = weekdayName();
    const open = asArray(framer.tasks).filter((task) => task.status !== 'complete');
    const dueToday = open.filter((task) => task.day === todayName);
    const inProgress = open.filter((task) => task.status === 'in_progress');
    const blocked = open.filter((task) => task.status === 'blocked');
    const overdueFollowUps = asArray(framer.prospects).filter((p) => {
      if (!p.nextFollowUp) return false;
      if (['won', 'lost'].includes(p.stage)) return false;
      const due = new Date(p.nextFollowUp);
      if (Number.isNaN(due.getTime())) return false;
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      return due <= end;
    });
    const nextBuild = open.find((task) => task.track === 'Build') || open[0];
    const editingId = framer.editingTaskId;

    return `
      ${intro('Build-first learning plus outreach. Track outputs, not hours watched.')}
      <section class="page-section">
        <div class="urgent-box framer-tone">
          <strong>Today:</strong> ${escapeHtml(dayLabel())} · study days Mon–Thu · Friday outreach.
        </div>
      </section>
      <section class="page-section">
        <div class="section-header"><h2>North-star metrics</h2></div>
        ${metricsPanel(framer)}
      </section>
      <section class="page-section">
        <div class="section-header"><h2>Due today (${escapeHtml(todayName)})</h2></div>
        <div class="list">
          ${dueToday.length
            ? dueToday.map((task) => taskCard(task, { expanded: editingId === task.id, editable: true })).join('')
            : '<div class="empty-state">No tasks scheduled for today. Pick the next build action below.</div>'}
        </div>
      </section>
      ${inProgress.length ? `
        <section class="page-section">
          <div class="section-header"><h2>In progress</h2></div>
          <div class="list">
            ${inProgress.map((task) => taskCard(task, { expanded: editingId === task.id, editable: true })).join('')}
          </div>
        </section>
      ` : ''}
      ${blocked.length ? `
        <section class="page-section">
          <div class="section-header"><h2>Blocked</h2></div>
          <div class="list">
            ${blocked.map((task) => taskCard(task, { expanded: editingId === task.id, editable: true })).join('')}
          </div>
        </section>
      ` : ''}
      <section class="page-section">
        <div class="section-header"><h2>Next build action</h2></div>
        <div class="list">
          ${nextBuild
            ? taskCard(nextBuild, { expanded: editingId === nextBuild.id, editable: true })
            : '<div class="empty-state">All learning tasks complete.</div>'}
        </div>
      </section>
      <section class="page-section">
        <div class="section-header"><h2>Overdue follow-ups</h2></div>
        <div class="panel-card">
          ${overdueFollowUps.length
            ? `<ul class="framer-followup-list">${overdueFollowUps
                .map(
                  (p) => `
              <li>
                <strong>${escapeHtml(p.name || p.company || p.id)}</strong>
                · ${escapeHtml(p.stage)} · due ${escapeHtml(p.nextFollowUp)}
              </li>`
                )
                .join('')}</ul>`
            : '<div class="empty-state">No follow-ups due.</div>'}
        </div>
      </section>
    `;
  }

  function renderLearning(framer) {
    const weekFilter = framer.learningWeekFilter || 'all';
    const statusFilter = framer.learningStatusFilter || 'all';
    let tasks = asArray(framer.tasks);
    if (weekFilter !== 'all') {
      tasks = tasks.filter((task) => String(task.week) === String(weekFilter));
    }
    if (statusFilter !== 'all') {
      tasks = tasks.filter((task) => task.status === statusFilter);
    }
    const byWeek = {};
    tasks.forEach((task) => {
      const key = task.week || 0;
      if (!byWeek[key]) byWeek[key] = [];
      byWeek[key].push(task);
    });
    const weeks = Object.keys(byWeek)
      .map(Number)
      .sort((a, b) => a - b);

    return `
      ${intro('Tasks grouped by week. Stable IDs stay fixed — edit status, output, and evidence.')}
      <section class="page-section">
        <div class="panel-card framer-filters">
          <div class="form-grid">
            <div class="field">
              <label for="framer-week-filter">Week</label>
              <select id="framer-week-filter">
                <option value="all" ${weekFilter === 'all' ? 'selected' : ''}>All weeks</option>
                ${[1, 2, 3, 4, 5, 6, 7, 8]
                  .map((w) => `<option value="${w}" ${String(weekFilter) === String(w) ? 'selected' : ''}>Week ${w}</option>`)
                  .join('')}
              </select>
            </div>
            <div class="field">
              <label for="framer-status-filter">Status</label>
              <select id="framer-status-filter">
                <option value="all" ${statusFilter === 'all' ? 'selected' : ''}>All statuses</option>
                ${STATUS_OPTIONS.map(
                  (s) => `<option value="${s}" ${statusFilter === s ? 'selected' : ''}>${escapeHtml(statusLabel(s))}</option>`
                ).join('')}
              </select>
            </div>
          </div>
        </div>
      </section>
      ${weeks.length
        ? weeks
            .map(
              (week) => `
        <section class="page-section">
          <div class="section-header"><h2>Week ${week}</h2></div>
          <div class="list">
            ${byWeek[week]
              .map((task) =>
                taskCard(task, {
                  expanded: framer.editingTaskId === task.id,
                  editable: true
                })
              )
              .join('')}
          </div>
        </section>`
            )
            .join('')
        : '<section class="page-section"><div class="empty-state">No tasks match these filters.</div></section>'}
    `;
  }

  function projectEditForm(project) {
    return `
      <form class="framer-edit-form" data-framer-project-form="${escapeHtml(project.id)}">
        <div class="form-grid">
          <div class="field">
            <label>Name</label>
            <input name="name" type="text" value="${escapeHtml(project.name)}" required />
          </div>
          <div class="field">
            <label>Type</label>
            <input name="type" type="text" value="${escapeHtml(project.type || '')}" />
          </div>
          <div class="field">
            <label>Kind</label>
            <input name="kind" type="text" value="${escapeHtml(project.kind || '')}" />
          </div>
          <div class="field">
            <label>Link</label>
            <input name="link" type="url" placeholder="https://" value="${escapeHtml(project.link || '')}" />
          </div>
        </div>
        <div class="form-grid framer-project-stages">
          ${PROJECT_STAGES.map(
            (stage) => `
            <div class="field">
              <label>${escapeHtml(PROJECT_STAGE_LABELS[stage])}</label>
              <select name="${stage}">
                ${stage === 'caseStudy'
                  ? optionList(
                      [
                        { id: 'not_required', label: 'Not required' },
                        ...STATUS_OPTIONS.map((id) => ({ id, label: statusLabel(id) }))
                      ],
                      project[stage]
                    )
                  : statusOptionsHtml(project[stage])}
              </select>
            </div>`
          ).join('')}
        </div>
        <div class="field">
          <label>Notes</label>
          <textarea name="notes" rows="2">${escapeHtml(project.notes || '')}</textarea>
        </div>
        <div class="form-actions">
          <button class="primary-button" type="submit">Save project</button>
        </div>
      </form>
    `;
  }

  function projectCard(project, editing) {
    return `
      <article class="panel-card framer-project-card">
        <div class="section-header">
          <h3>${escapeHtml(project.name)}</h3>
          <button class="secondary-button" type="button" data-framer-edit-project="${escapeHtml(project.id)}">
            ${editing ? 'Close' : 'Edit'}
          </button>
        </div>
        <p class="soft-note">${escapeHtml(project.type)} · ${escapeHtml(project.kind)}</p>
        <div class="framer-stage-strip">
          ${PROJECT_STAGES.map(
            (stage) => `
            <div class="framer-stage">
              <span class="framer-stage-label">${escapeHtml(PROJECT_STAGE_LABELS[stage])}</span>
              <span class="tag status-${escapeHtml(project[stage] || 'not_started')}">${escapeHtml(
                project[stage] === 'not_required' ? 'N/A' : statusLabel(project[stage])
              )}</span>
            </div>`
          ).join('')}
        </div>
        ${project.link ? `<p class="meta-text"><a href="${escapeHtml(project.link)}" target="_blank" rel="noreferrer">Open link</a></p>` : ''}
        ${editing ? projectEditForm(project) : ''}
      </article>
    `;
  }

  function renderProjects(framer) {
    return `
      ${intro('Concept, build, responsive QA, SEO, publication, and case-study status.')}
      <section class="page-section">
        <div class="framer-project-list">
          ${asArray(framer.projects)
            .map((project) => projectCard(project, framer.editingProjectId === project.id))
            .join('')}
        </div>
      </section>
    `;
  }

  function prospectEditForm(prospect, isNew) {
    const meta = plan().meta || {};
    return `
      <form class="framer-edit-form" data-framer-prospect-form="${escapeHtml(prospect.id)}" data-new="${isNew ? '1' : '0'}">
        <div class="form-grid">
          <div class="field">
            <label>Prospect ID</label>
            <input name="id" type="text" value="${escapeHtml(prospect.id)}" ${isNew ? '' : 'readonly'} required />
          </div>
          <div class="field">
            <label>Name</label>
            <input name="name" type="text" value="${escapeHtml(prospect.name || '')}" />
          </div>
          <div class="field">
            <label>Company</label>
            <input name="company" type="text" value="${escapeHtml(prospect.company || '')}" />
          </div>
          <div class="field">
            <label>URL</label>
            <input name="url" type="url" placeholder="https://" value="${escapeHtml(prospect.url || '')}" />
          </div>
          <div class="field">
            <label>Source</label>
            <select name="source">${optionList(asArray(meta.prospectSources), prospect.source)}</select>
          </div>
          <div class="field">
            <label>Prospect type</label>
            <select name="prospectType">${optionList(asArray(meta.prospectTypes), prospect.prospectType)}</select>
          </div>
          <div class="field">
            <label>Relationship</label>
            <select name="relationshipStrength">
              ${optionList(['cold', 'familiar', 'warm'], prospect.relationshipStrength || 'cold')}
            </select>
          </div>
          <div class="field">
            <label>Priority</label>
            <select name="priority">
              ${optionList(['high', 'medium', 'low'], prospect.priority || 'medium')}
            </select>
          </div>
          <div class="field">
            <label>Stage</label>
            <select name="stage">${optionList(asArray(meta.prospectStages), prospect.stage || 'research')}</select>
          </div>
          <div class="field">
            <label>Last contact</label>
            <input name="lastContact" type="date" value="${escapeHtml(prospect.lastContact || '')}" />
          </div>
          <div class="field">
            <label>Next follow-up</label>
            <input name="nextFollowUp" type="date" value="${escapeHtml(prospect.nextFollowUp || '')}" />
          </div>
        </div>
        <div class="field">
          <label>Observed problem</label>
          <textarea name="observedProblem" rows="2">${escapeHtml(prospect.observedProblem || '')}</textarea>
        </div>
        <div class="field">
          <label>Offer angle</label>
          <textarea name="offerAngle" rows="2">${escapeHtml(prospect.offerAngle || '')}</textarea>
        </div>
        <div class="field">
          <label>Message</label>
          <textarea name="message" rows="3">${escapeHtml(prospect.message || '')}</textarea>
        </div>
        <div class="field">
          <label>Notes</label>
          <textarea name="notes" rows="2">${escapeHtml(prospect.notes || '')}</textarea>
        </div>
        <div class="form-actions">
          <button class="primary-button" type="submit">${isNew ? 'Add prospect' : 'Save prospect'}</button>
          ${!isNew ? `<button class="secondary-button" type="button" data-framer-delete-prospect="${escapeHtml(prospect.id)}">Delete</button>` : ''}
        </div>
      </form>
    `;
  }

  function prospectCard(prospect, editing) {
    return `
      <article class="task-card framer-prospect-card stage-${escapeHtml(prospect.stage || 'research')}">
        <div class="task-main">
          <div class="task-id-row">
            <span class="task-id">${escapeHtml(prospect.id)}</span>
            <span class="tag priority-${escapeHtml(prospect.priority || 'medium')}">${escapeHtml(prospect.priority || 'medium')}</span>
            <span class="tag status-${escapeHtml(prospect.stage || 'research')}">${escapeHtml(prospect.stage || 'research')}</span>
          </div>
          <h3 class="task-title-text">${escapeHtml(prospect.name || prospect.company || 'Unnamed prospect')}</h3>
          <div class="task-meta">
            <span class="meta-text">${escapeHtml(prospect.company || '')}</span>
            <span class="meta-text">${escapeHtml(prospect.prospectType || '')}</span>
            <span class="meta-text">${escapeHtml(prospect.source || '')}</span>
            ${prospect.nextFollowUp ? `<span class="meta-text">Follow-up ${escapeHtml(prospect.nextFollowUp)}</span>` : ''}
          </div>
          ${prospect.observedProblem ? `<p class="task-note-preview">${escapeHtml(prospect.observedProblem)}</p>` : ''}
          <div class="task-actions">
            <button class="secondary-button" type="button" data-framer-edit-prospect="${escapeHtml(prospect.id)}">
              ${editing ? 'Close' : 'Edit'}
            </button>
          </div>
        </div>
        ${editing ? prospectEditForm(prospect, false) : ''}
      </article>
    `;
  }

  function renderPipeline(framer) {
    const stages = asArray((plan().meta || {}).prospectStages);
    const prospects = asArray(framer.prospects);
    const byStage = {};
    stages.forEach((stage) => {
      byStage[stage] = [];
    });
    prospects.forEach((p) => {
      const stage = stages.includes(p.stage) ? p.stage : 'research';
      if (!byStage[stage]) byStage[stage] = [];
      byStage[stage].push(p);
    });
    const blank = {
      id: nextProspectId(framer),
      name: '',
      company: '',
      url: '',
      source: 'Google Maps',
      prospectType: 'direct client',
      observedProblem: '',
      offerAngle: '',
      relationshipStrength: 'cold',
      priority: 'medium',
      stage: 'research',
      lastContact: '',
      nextFollowUp: '',
      message: '',
      notes: ''
    };

    return `
      ${intro('Prospects grouped by stage. Research and outreach run alongside learning.')}
      <section class="page-section">
        <div class="panel-card">
          <div class="section-header"><h2>Add prospect</h2></div>
          ${prospectEditForm(blank, true)}
        </div>
      </section>
      ${stages
        .map((stage) => {
          const list = byStage[stage] || [];
          if (!list.length) return '';
          return `
            <section class="page-section">
              <div class="section-header"><h2>${escapeHtml(stage)} (${list.length})</h2></div>
              <div class="list">
                ${list
                  .map((p) => prospectCard(p, framer.editingProspectId === p.id))
                  .join('')}
              </div>
            </section>`;
        })
        .join('')}
    `;
  }

  function nextProspectId(framer) {
    const ids = asArray(framer.prospects)
      .map((p) => p.id)
      .filter(Boolean);
    let max = 0;
    ids.forEach((id) => {
      const match = String(id).match(/PROS-(\d+)/i);
      if (match) max = Math.max(max, Number(match[1]));
    });
    return `PROS-${String(max + 1).padStart(3, '0')}`;
  }

  function reviewForm(review) {
    return `
      <form class="framer-edit-form" data-framer-review-form="${escapeHtml(review.week)}">
        <div class="form-grid">
          <div class="field">
            <label>Status</label>
            <select name="status">${statusOptionsHtml(review.status)}</select>
          </div>
        </div>
        <div class="field">
          <label>What I shipped</label>
          <textarea name="shipped" rows="2">${escapeHtml(review.shipped || '')}</textarea>
        </div>
        <div class="field">
          <label>Evidence links</label>
          <textarea name="evidenceLinks" rows="2">${escapeHtml(review.evidenceLinks || '')}</textarea>
        </div>
        <div class="field">
          <label>What I can do now that I could not do last week</label>
          <textarea name="newCapability" rows="2">${escapeHtml(review.newCapability || '')}</textarea>
        </div>
        <div class="field">
          <label>Biggest obstacle</label>
          <textarea name="obstacle" rows="2">${escapeHtml(review.obstacle || '')}</textarea>
        </div>
        <div class="field">
          <label>What I will change next week</label>
          <textarea name="changeNextWeek" rows="2">${escapeHtml(review.changeNextWeek || '')}</textarea>
        </div>
        <div class="form-grid">
          ${[
            ['prospectsResearched', 'Prospects researched'],
            ['messagesSent', 'Messages sent'],
            ['followUpsSent', 'Follow-ups sent'],
            ['applicationsSubmitted', 'Applications submitted'],
            ['replies', 'Replies'],
            ['callsBooked', 'Calls booked'],
            ['proposalsSent', 'Proposals sent'],
            ['projectsWon', 'Projects won']
          ]
            .map(
              ([name, label]) => `
            <div class="field">
              <label>${escapeHtml(label)}</label>
              <input name="${name}" type="number" min="0" value="${escapeHtml(review[name] || 0)}" />
            </div>`
            )
            .join('')}
        </div>
        <div class="form-actions">
          <button class="primary-button" type="submit">Save week ${escapeHtml(review.week)}</button>
        </div>
      </form>
    `;
  }

  function renderWeekly(framer) {
    return `
      ${intro('Weekly output, evidence, obstacles, and outreach numbers.')}
      ${asArray(framer.weeklyReviews)
        .map((review) => {
          const open = framer.editingReviewWeek === review.week;
          return `
            <section class="page-section">
              <article class="panel-card framer-review-card">
                <div class="section-header">
                  <h2>Week ${escapeHtml(review.week)}</h2>
                  <span class="tag status-${escapeHtml(review.status || 'not_started')}">${escapeHtml(statusLabel(review.status))}</span>
                  <button class="secondary-button" type="button" data-framer-edit-review="${escapeHtml(review.week)}">
                    ${open ? 'Close' : 'Edit'}
                  </button>
                </div>
                ${
                  review.shipped
                    ? `<p class="task-note-preview"><strong>Shipped:</strong> ${escapeHtml(review.shipped)}</p>`
                    : '<p class="soft-note">No review notes yet.</p>'
                }
                ${open ? reviewForm(review) : ''}
              </article>
            </section>`;
        })
        .join('')}
    `;
  }

  function renderLinkedIn() {
    return `
      ${intro('LinkedIn connections will be added later. Score each connection before writing the message.')}
      <section class="page-section">
        <div class="panel-card">
          <div class="section-header"><h2>Import placeholder</h2></div>
          <p class="soft-note">
            Planned fields: Name, Current role, Company, Relationship strength, Route,
            Relevant need, Warm detail, Priority, Next action, Status.
          </p>
          <div class="empty-state">No LinkedIn connections imported yet.</div>
        </div>
      </section>
    `;
  }

  function renderPage(framer, pageId) {
    switch (pageId) {
      case 'learning':
        return renderLearning(framer);
      case 'projects':
        return renderProjects(framer);
      case 'pipeline':
        return renderPipeline(framer);
      case 'weekly':
        return renderWeekly(framer);
      case 'linkedin':
        return renderLinkedIn();
      case 'today':
      default:
        return renderToday(framer);
    }
  }

  function findTask(framer, id) {
    return asArray(framer.tasks).find((task) => task.id === id) || null;
  }

  function findProspect(framer, id) {
    return asArray(framer.prospects).find((p) => p.id === id) || null;
  }

  function findProject(framer, id) {
    return asArray(framer.projects).find((p) => p.id === id) || null;
  }

  function bind(framer, { save, render }) {
    const root = document.getElementById('page-content');
    if (!root) return;

    const weekFilter = document.getElementById('framer-week-filter');
    if (weekFilter) {
      weekFilter.addEventListener('change', () => {
        framer.learningWeekFilter = weekFilter.value;
        save();
        render();
      });
    }
    const statusFilter = document.getElementById('framer-status-filter');
    if (statusFilter) {
      statusFilter.addEventListener('change', () => {
        framer.learningStatusFilter = statusFilter.value;
        save();
        render();
      });
    }

    root.querySelectorAll('[data-framer-edit-task]').forEach((button) => {
      button.addEventListener('click', () => {
        const id = button.dataset.framerEditTask;
        framer.editingTaskId = framer.editingTaskId === id ? null : id;
        render();
      });
    });

    root.querySelectorAll('[data-framer-quick-complete]').forEach((button) => {
      button.addEventListener('click', () => {
        const task = findTask(framer, button.dataset.framerQuickComplete);
        if (!task) return;
        task.status = 'complete';
        framer.editingTaskId = null;
        save();
        render();
      });
    });

    root.querySelectorAll('[data-framer-task-form]').forEach((form) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const id = form.dataset.framerTaskForm;
        const task = findTask(framer, id);
        if (!task) return;
        const data = new FormData(form);
        task.title = String(data.get('title') || '').trim() || task.title;
        task.status = STATUS_OPTIONS.includes(String(data.get('status')))
          ? String(data.get('status'))
          : task.status;
        task.day = String(data.get('day') || task.day);
        task.track = String(data.get('track') || task.track);
        task.duration = Number(data.get('duration')) || task.duration;
        task.output = String(data.get('output') || '').trim();
        task.evidence = String(data.get('evidence') || '').trim();
        task.notes = String(data.get('notes') || '').trim();
        task.blocker = String(data.get('blocker') || '').trim();
        task.dueDate = String(data.get('dueDate') || '').trim();
        framer.editingTaskId = null;
        save();
        render();
      });
    });

    root.querySelectorAll('[data-framer-edit-project]').forEach((button) => {
      button.addEventListener('click', () => {
        const id = button.dataset.framerEditProject;
        framer.editingProjectId = framer.editingProjectId === id ? null : id;
        render();
      });
    });

    root.querySelectorAll('[data-framer-project-form]').forEach((form) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const project = findProject(framer, form.dataset.framerProjectForm);
        if (!project) return;
        const data = new FormData(form);
        project.name = String(data.get('name') || '').trim() || project.name;
        project.type = String(data.get('type') || '').trim();
        project.kind = String(data.get('kind') || '').trim();
        project.link = String(data.get('link') || '').trim();
        project.notes = String(data.get('notes') || '').trim();
        PROJECT_STAGES.forEach((stage) => {
          const value = String(data.get(stage) || '');
          if (stage === 'caseStudy' && value === 'not_required') {
            project[stage] = 'not_required';
          } else if (STATUS_OPTIONS.includes(value)) {
            project[stage] = value;
          }
        });
        framer.editingProjectId = null;
        save();
        render();
      });
    });

    root.querySelectorAll('[data-framer-edit-prospect]').forEach((button) => {
      button.addEventListener('click', () => {
        const id = button.dataset.framerEditProspect;
        framer.editingProspectId = framer.editingProspectId === id ? null : id;
        render();
      });
    });

    root.querySelectorAll('[data-framer-prospect-form]').forEach((form) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const data = new FormData(form);
        const isNew = form.dataset.new === '1';
        const id = String(data.get('id') || '').trim();
        if (!id) return;

        const payload = {
          id,
          name: String(data.get('name') || '').trim(),
          company: String(data.get('company') || '').trim(),
          url: String(data.get('url') || '').trim(),
          source: String(data.get('source') || '').trim(),
          prospectType: String(data.get('prospectType') || '').trim(),
          observedProblem: String(data.get('observedProblem') || '').trim(),
          offerAngle: String(data.get('offerAngle') || '').trim(),
          relationshipStrength: String(data.get('relationshipStrength') || 'cold'),
          priority: String(data.get('priority') || 'medium'),
          stage: String(data.get('stage') || 'research'),
          lastContact: String(data.get('lastContact') || '').trim(),
          nextFollowUp: String(data.get('nextFollowUp') || '').trim(),
          message: String(data.get('message') || '').trim(),
          notes: String(data.get('notes') || '').trim()
        };

        if (isNew) {
          if (findProspect(framer, id)) {
            window.alert('A prospect with that ID already exists.');
            return;
          }
          framer.prospects.unshift(payload);
        } else {
          const existing = findProspect(framer, form.dataset.framerProspectForm);
          if (!existing) return;
          Object.assign(existing, payload, { id: existing.id });
        }
        framer.editingProspectId = null;
        save();
        render();
      });
    });

    root.querySelectorAll('[data-framer-delete-prospect]').forEach((button) => {
      button.addEventListener('click', () => {
        const id = button.dataset.framerDeleteProspect;
        if (!id || !window.confirm('Delete this prospect?')) return;
        framer.prospects = asArray(framer.prospects).filter((p) => p.id !== id);
        framer.editingProspectId = null;
        save();
        render();
      });
    });

    root.querySelectorAll('[data-framer-edit-review]').forEach((button) => {
      button.addEventListener('click', () => {
        const week = Number(button.dataset.framerEditReview);
        framer.editingReviewWeek = framer.editingReviewWeek === week ? null : week;
        render();
      });
    });

    root.querySelectorAll('[data-framer-review-form]').forEach((form) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const week = Number(form.dataset.framerReviewForm);
        const review = asArray(framer.weeklyReviews).find((row) => row.week === week);
        if (!review) return;
        const data = new FormData(form);
        const status = String(data.get('status') || '');
        if (STATUS_OPTIONS.includes(status)) review.status = status;
        review.shipped = String(data.get('shipped') || '').trim();
        review.evidenceLinks = String(data.get('evidenceLinks') || '').trim();
        review.newCapability = String(data.get('newCapability') || '').trim();
        review.obstacle = String(data.get('obstacle') || '').trim();
        review.changeNextWeek = String(data.get('changeNextWeek') || '').trim();
        [
          'prospectsResearched',
          'messagesSent',
          'followUpsSent',
          'applicationsSubmitted',
          'replies',
          'callsBooked',
          'proposalsSent',
          'projectsWon'
        ].forEach((key) => {
          review[key] = Number(data.get(key)) || 0;
        });
        framer.editingReviewWeek = null;
        save();
        render();
      });
    });
  }

  global.TTC_FRAMER = {
    seed,
    merge,
    navItems,
    renderPage,
    bind,
    computeLiveMetrics
  };
})(window);
