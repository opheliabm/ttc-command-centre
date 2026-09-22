/**
 * Original local SVG illustrations for TTC Command Centre.
 * Minimal editorial / newsletter style — coral annotations on monochrome paper.
 * No external assets. Decorative by default (aria-hidden).
 */
(function () {
  const INK = '#080808';
  const CORAL = 'var(--coral, #851427)';
  const PAPER = '#ffffff';
  const WARM = '#f7f6f3';
  const YELLOW = '#ffe100';
  const TEAL = '#62c7bd';
  const BLUE = '#8fb8ff';
  const LAVENDER = '#c9a8e8';
  const CORAL_SOFT = 'var(--coral-soft, #f0d5da)';
  const OUTLINE = INK;
  const VB = '0 0 200 160';

  function wrap(inner, animClass) {
    return `
      <svg class="illustration-svg ${animClass || ''}" viewBox="${VB}" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
        ${inner}
      </svg>
    `;
  }

  const scenes = {
    today: () =>
      wrap(
        `
      <ellipse class="ill-blob illustration-breathe" cx="42" cy="118" rx="38" ry="22" fill="${YELLOW}"/>
      <ellipse class="ill-blob" cx="168" cy="36" rx="28" ry="20" fill="${BLUE}"/>
      <path class="ill-blob" d="M148 108 C168 98, 186 118, 172 136 C156 152, 128 140, 132 120 C134 110, 140 112, 148 108Z" fill="${CORAL_SOFT}"/>

      <!-- desk cards -->
      <g class="illustration-float" style="--ill-delay:0s">
        <rect x="108" y="78" width="36" height="28" rx="6" fill="${PAPER}" stroke="${OUTLINE}" stroke-width="2.2"/>
        <path d="M116 88 H132 M116 95 H128" stroke="${OUTLINE}" stroke-width="1.6" stroke-linecap="round"/>
        <circle cx="136" cy="88" r="3.2" fill="${CORAL}"/>
      </g>
      <g class="illustration-float" style="--ill-delay:0.4s">
        <rect x="128" y="58" width="34" height="26" rx="6" fill="${LAVENDER}" stroke="${OUTLINE}" stroke-width="2.2" transform="rotate(8 145 71)"/>
        <path d="M136 68 H150 M136 75 H146" stroke="${OUTLINE}" stroke-width="1.5" stroke-linecap="round"/>
      </g>
      <g class="illustration-float" style="--ill-delay:0.8s">
        <rect x="96" y="98" width="32" height="24" rx="6" fill="${TEAL}" stroke="${OUTLINE}" stroke-width="2.2" transform="rotate(-6 112 110)"/>
        <path d="M104 108 H118" stroke="${OUTLINE}" stroke-width="1.5" stroke-linecap="round"/>
      </g>

      <!-- calendar -->
      <g>
        <rect x="28" y="52" width="44" height="46" rx="8" fill="${PAPER}" stroke="${OUTLINE}" stroke-width="2.3"/>
        <rect x="28" y="52" width="44" height="12" rx="8" fill="${CORAL}"/>
        <path d="M40 48 V56 M60 48 V56" stroke="${OUTLINE}" stroke-width="2" stroke-linecap="round"/>
        <circle cx="40" cy="78" r="3" fill="${YELLOW}"/>
        <circle cx="52" cy="78" r="3" fill="${TEAL}"/>
        <circle cx="64" cy="78" r="3" fill="${BLUE}"/>
        <rect x="38" y="86" width="8" height="6" rx="1.5" fill="${CORAL}"/>
      </g>

      <!-- character -->
      <g class="illustration-breathe illustration-sway">
        <ellipse cx="86" cy="128" rx="22" ry="8" fill="${WARM}" opacity="0.7"/>
        <path d="M74 98 C74 82, 98 80, 100 96 C102 110, 78 114, 74 98Z" fill="${BLUE}" stroke="${OUTLINE}" stroke-width="2.2"/>
        <circle cx="88" cy="72" r="17" fill="${CORAL_SOFT}" stroke="${OUTLINE}" stroke-width="2.2"/>
        <circle cx="78" cy="76" r="3.2" fill="${CORAL}" opacity="0.35"/>
        <circle cx="98" cy="76" r="3.2" fill="${CORAL}" opacity="0.35"/>
        <circle class="illustration-blink" cx="82" cy="70" r="2.3" fill="${OUTLINE}"/>
        <circle class="illustration-blink" cx="94" cy="70" r="2.3" fill="${OUTLINE}"/>
        <path d="M83 79 Q88 85 94 79" fill="none" stroke="${OUTLINE}" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M72 64 Q78 57 84 62" fill="none" stroke="${OUTLINE}" stroke-width="2" stroke-linecap="round"/>
        <path d="M96 62 Q102 57 106 64" fill="none" stroke="${OUTLINE}" stroke-width="2" stroke-linecap="round"/>
        <path class="illustration-wave-arm" d="M68 104 Q56 94 48 84" fill="none" stroke="${OUTLINE}" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M102 102 Q118 94 128 82" fill="none" stroke="${OUTLINE}" stroke-width="2.2" stroke-linecap="round"/>
      </g>

      <g class="illustration-sparkle">
        <path d="M156 58 L158 64 L164 66 L158 68 L156 74 L154 68 L148 66 L154 64 Z" fill="${YELLOW}" stroke="${OUTLINE}" stroke-width="1.2"/>
        <circle cx="172" cy="72" r="2.2" fill="${TEAL}"/>
        <circle cx="148" cy="48" r="1.8" fill="${CORAL}"/>
      </g>
      <path class="illustration-draw" d="M18 40 C28 28, 44 34, 48 24" fill="none" stroke="${CORAL}" stroke-width="2" stroke-linecap="round"/>
    `,
        'illustration-scene--today'
      ),

    content: () =>
      wrap(
        `
      <ellipse class="ill-blob illustration-breathe" cx="36" cy="40" rx="30" ry="24" fill="${LAVENDER}"/>
      <ellipse class="ill-blob" cx="170" cy="120" rx="34" ry="22" fill="${YELLOW}"/>

      <!-- media card -->
      <g class="illustration-float">
        <rect x="108" y="48" width="64" height="52" rx="10" fill="${PAPER}" stroke="${OUTLINE}" stroke-width="2.3"/>
        <rect x="116" y="56" width="48" height="28" rx="6" fill="${BLUE}" stroke="${OUTLINE}" stroke-width="1.6"/>
        <path d="M134 64 L146 70 L134 76 Z" fill="${CORAL}" stroke="${OUTLINE}" stroke-width="1.4" stroke-linejoin="round"/>
        <path d="M118 92 H152" stroke="${OUTLINE}" stroke-width="1.6" stroke-linecap="round"/>
      </g>

      <!-- document -->
      <g class="illustration-float" style="--ill-delay:0.5s">
        <path d="M28 58 H58 L68 68 V118 H28 Z" fill="${PAPER}" stroke="${OUTLINE}" stroke-width="2.2" stroke-linejoin="round"/>
        <path d="M58 58 V68 H68" fill="none" stroke="${OUTLINE}" stroke-width="2"/>
        <path d="M36 80 H56 M36 88 H52 M36 96 H58" stroke="${OUTLINE}" stroke-width="1.5" stroke-linecap="round"/>
      </g>

      <!-- mic -->
      <g>
        <rect x="82" y="70" width="18" height="28" rx="9" fill="${LAVENDER}" stroke="${OUTLINE}" stroke-width="2"/>
        <path d="M78 88 Q78 102 91 102 Q104 102 104 88" fill="none" stroke="${OUTLINE}" stroke-width="2" stroke-linecap="round"/>
        <path d="M91 102 V114 M84 114 H98" stroke="${OUTLINE}" stroke-width="2" stroke-linecap="round"/>
      </g>

      <!-- character head peek -->
      <g class="illustration-breathe illustration-sway">
        <circle cx="58" cy="128" r="18" fill="${CORAL_SOFT}" stroke="${OUTLINE}" stroke-width="2.2"/>
        <circle cx="49" cy="132" r="2.8" fill="${CORAL}" opacity="0.35"/>
        <circle cx="67" cy="132" r="2.8" fill="${CORAL}" opacity="0.35"/>
        <circle class="illustration-blink" cx="52" cy="126" r="2.2" fill="${OUTLINE}"/>
        <circle class="illustration-blink" cx="64" cy="126" r="2.2" fill="${OUTLINE}"/>
        <path d="M53 135 Q58 140 64 135" fill="none" stroke="${OUTLINE}" stroke-width="1.7" stroke-linecap="round"/>
        <path d="M44 118 Q50 111 56 116" fill="none" stroke="${OUTLINE}" stroke-width="2" stroke-linecap="round"/>
      </g>

      <g class="illustration-sparkle" style="--ill-delay:0.3s">
        <circle cx="150" cy="36" r="4" fill="${YELLOW}" stroke="${OUTLINE}" stroke-width="1.3"/>
        <circle cx="164" cy="48" r="2.5" fill="${BLUE}"/>
      </g>
    `,
        'illustration-scene--content'
      ),

    planner: () =>
      wrap(
        `
      <ellipse class="ill-blob" cx="160" cy="42" rx="32" ry="24" fill="${TEAL}"/>
      <ellipse class="ill-blob illustration-breathe" cx="40" cy="120" rx="36" ry="20" fill="${BLUE}"/>

      <!-- calendar board -->
      <rect x="70" y="36" width="100" height="88" rx="12" fill="${PAPER}" stroke="${OUTLINE}" stroke-width="2.4"/>
      <path d="M70 56 H170" stroke="${OUTLINE}" stroke-width="2"/>
      <g class="illustration-float">
        <rect x="82" y="66" width="28" height="16" rx="4" fill="${TEAL}" stroke="${OUTLINE}" stroke-width="1.5"/>
        <rect x="118" y="66" width="36" height="16" rx="4" fill="${YELLOW}" stroke="${OUTLINE}" stroke-width="1.5"/>
      </g>
      <g class="illustration-float" style="--ill-delay:0.45s">
        <rect x="82" y="90" width="44" height="16" rx="4" fill="${BLUE}" stroke="${OUTLINE}" stroke-width="1.5"/>
        <rect x="134" y="90" width="22" height="16" rx="4" fill="${CORAL}" stroke="${OUTLINE}" stroke-width="1.5"/>
      </g>

      <!-- clock -->
      <g class="illustration-breathe">
        <circle cx="44" cy="58" r="22" fill="${PAPER}" stroke="${OUTLINE}" stroke-width="2.3"/>
        <circle cx="44" cy="58" r="2.5" fill="${OUTLINE}"/>
        <path d="M44 58 L44 44 M44 58 L56 62" stroke="${OUTLINE}" stroke-width="2.2" stroke-linecap="round"/>
      </g>

      <!-- character -->
      <g>
        <circle cx="48" cy="118" r="14" fill="${CORAL_SOFT}" stroke="${OUTLINE}" stroke-width="2"/>
        <circle class="illustration-blink" cx="43" cy="116" r="1.8" fill="${OUTLINE}"/>
        <circle class="illustration-blink" cx="53" cy="116" r="1.8" fill="${OUTLINE}"/>
        <path d="M45 124 Q48 126 52 124" fill="none" stroke="${OUTLINE}" stroke-width="1.4" stroke-linecap="round"/>
        <path d="M48 132 V148" stroke="${OUTLINE}" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M48 138 L62 128" stroke="${OUTLINE}" stroke-width="2.2" stroke-linecap="round"/>
      </g>

      <path class="illustration-draw" d="M24 28 C34 18, 50 22, 58 14" fill="none" stroke="${CORAL}" stroke-width="2" stroke-linecap="round"/>
    `,
        'illustration-scene--planner'
      ),

    seo: () =>
      wrap(
        `
      <ellipse class="ill-blob illustration-breathe" cx="48" cy="36" rx="34" ry="22" fill="${LAVENDER}"/>
      <ellipse class="ill-blob" cx="168" cy="128" rx="28" ry="18" fill="${YELLOW}"/>

      <!-- browser -->
      <g class="illustration-float">
        <rect x="36" y="48" width="108" height="78" rx="10" fill="${PAPER}" stroke="${OUTLINE}" stroke-width="2.4"/>
        <rect x="36" y="48" width="108" height="16" rx="10" fill="${BLUE}"/>
        <circle cx="48" cy="56" r="3" fill="${CORAL}"/>
        <circle cx="58" cy="56" r="3" fill="${YELLOW}"/>
        <circle cx="68" cy="56" r="3" fill="${CORAL}"/>
        <rect x="80" y="52" width="52" height="8" rx="4" fill="${PAPER}" stroke="${OUTLINE}" stroke-width="1.3"/>
        <!-- chart bars -->
        <rect x="52" y="96" width="12" height="20" rx="2" fill="${BLUE}" stroke="${OUTLINE}" stroke-width="1.3"/>
        <rect x="70" y="86" width="12" height="30" rx="2" fill="${LAVENDER}" stroke="${OUTLINE}" stroke-width="1.3"/>
        <rect x="88" y="78" width="12" height="38" rx="2" fill="${TEAL}" stroke="${OUTLINE}" stroke-width="1.3"/>
        <rect x="106" y="90" width="12" height="26" rx="2" fill="${YELLOW}" stroke="${OUTLINE}" stroke-width="1.3"/>
      </g>

      <!-- magnifier -->
      <g class="illustration-breathe">
        <circle cx="148" cy="78" r="22" fill="${PAPER}" stroke="${OUTLINE}" stroke-width="2.4" fill-opacity="0.85"/>
        <circle cx="148" cy="78" r="12" fill="none" stroke="${OUTLINE}" stroke-width="2.2"/>
        <path d="M162 94 L176 112" stroke="${OUTLINE}" stroke-width="3.2" stroke-linecap="round"/>
      </g>

      <g class="illustration-sparkle">
        <path d="M28 92 L30 98 L36 100 L30 102 L28 108 L26 102 L20 100 L26 98 Z" fill="${CORAL}" stroke="${OUTLINE}" stroke-width="1"/>
      </g>
    `,
        'illustration-scene--seo'
      ),

    revenue: () =>
      wrap(
        `
      <ellipse class="ill-blob" cx="40" cy="120" rx="32" ry="20" fill="${TEAL}"/>
      <ellipse class="ill-blob illustration-breathe" cx="160" cy="40" rx="30" ry="22" fill="${YELLOW}"/>

      <!-- pipeline cards -->
      <g class="illustration-float">
        <rect x="28" y="58" width="42" height="30" rx="8" fill="${PAPER}" stroke="${OUTLINE}" stroke-width="2.2"/>
        <circle cx="40" cy="73" r="6" fill="${TEAL}" stroke="${OUTLINE}" stroke-width="1.4"/>
        <path d="M50 68 H62 M50 76 H58" stroke="${OUTLINE}" stroke-width="1.4" stroke-linecap="round"/>
      </g>
      <g class="illustration-float" style="--ill-delay:0.35s">
        <rect x="86" y="48" width="42" height="30" rx="8" fill="${PAPER}" stroke="${OUTLINE}" stroke-width="2.2"/>
        <path d="M98 58 H116 M98 66 H110" stroke="${OUTLINE}" stroke-width="1.4" stroke-linecap="round"/>
        <circle cx="116" cy="62" r="5" fill="${YELLOW}" stroke="${OUTLINE}" stroke-width="1.3"/>
      </g>
      <g class="illustration-float" style="--ill-delay:0.7s">
        <rect x="140" y="68" width="42" height="30" rx="8" fill="${PAPER}" stroke="${OUTLINE}" stroke-width="2.2"/>
        <path d="M152 80 Q160 72 170 82" fill="none" stroke="${CORAL}" stroke-width="2.2" stroke-linecap="round"/>
      </g>

      <!-- connectors / arrow -->
      <path class="illustration-draw" d="M70 72 H86" stroke="${CORAL}" stroke-width="2" stroke-linecap="round"/>
      <path class="illustration-draw" d="M128 64 H140" stroke="${CORAL}" stroke-width="2" stroke-linecap="round" style="--ill-delay:0.2s"/>
      <path class="illustration-float" d="M156 112 L168 96 L180 112 Z" fill="${CORAL}" stroke="${OUTLINE}" stroke-width="1.8" stroke-linejoin="round"/>

      <!-- bubbles -->
      <g class="illustration-sparkle">
        <ellipse cx="64" cy="112" rx="16" ry="12" fill="${BLUE}" stroke="${OUTLINE}" stroke-width="1.8"/>
        <ellipse cx="96" cy="128" rx="12" ry="9" fill="${CORAL_SOFT}" stroke="${OUTLINE}" stroke-width="1.6"/>
      </g>
    `,
        'illustration-scene--revenue'
      ),

    empty: () =>
      wrap(
        `
      <ellipse class="ill-blob illustration-breathe" cx="100" cy="128" rx="56" ry="16" fill="${WARM}" opacity="0.55"/>
      <ellipse class="ill-blob" cx="160" cy="48" rx="24" ry="18" fill="${BLUE}"/>

      <!-- empty page -->
      <g class="illustration-float">
        <path d="M78 44 H122 L138 60 V124 H78 Z" fill="${PAPER}" stroke="${OUTLINE}" stroke-width="2.3" stroke-linejoin="round"/>
        <path d="M122 44 V60 H138" fill="none" stroke="${OUTLINE}" stroke-width="2.2"/>
        <path d="M90 78 H118 M90 88 H112 M90 98 H120" stroke="${WARM}" stroke-width="2" stroke-linecap="round"/>
      </g>

      <!-- character -->
      <g class="illustration-breathe">
        <circle cx="52" cy="98" r="18" fill="${CORAL_SOFT}" stroke="${OUTLINE}" stroke-width="2.2"/>
        <circle class="illustration-blink" cx="46" cy="96" r="2" fill="${OUTLINE}"/>
        <circle class="illustration-blink" cx="58" cy="96" r="2" fill="${OUTLINE}"/>
        <path d="M48 106 Q52 104 56 106" fill="none" stroke="${OUTLINE}" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M52 116 V140" stroke="${OUTLINE}" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M52 124 L68 112" stroke="${OUTLINE}" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M40 86 Q46 80 52 84" fill="none" stroke="${OUTLINE}" stroke-width="2" stroke-linecap="round"/>
      </g>

      <g class="illustration-sparkle">
        <circle cx="148" cy="88" r="3" fill="${LAVENDER}"/>
        <circle cx="158" cy="100" r="2" fill="${YELLOW}"/>
      </g>
    `,
        'illustration-scene--empty'
      ),

    waiting: () =>
      wrap(
        `
      <ellipse class="ill-blob" cx="48" cy="40" rx="28" ry="20" fill="${YELLOW}"/>
      <ellipse class="ill-blob illustration-breathe" cx="160" cy="120" rx="30" ry="18" fill="${CORAL_SOFT}"/>

      <!-- blocked path -->
      <path d="M36 118 H164" stroke="${OUTLINE}" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="8 6"/>
      <g>
        <rect x="88" y="100" width="24" height="36" rx="4" fill="${CORAL}" stroke="${OUTLINE}" stroke-width="2" transform="rotate(12 100 118)"/>
        <path d="M94 112 H106 M100 106 V118" stroke="${PAPER}" stroke-width="2.2" stroke-linecap="round"/>
      </g>

      <!-- clock -->
      <g class="illustration-breathe">
        <circle cx="140" cy="56" r="26" fill="${PAPER}" stroke="${OUTLINE}" stroke-width="2.4"/>
        <circle cx="140" cy="56" r="3" fill="${OUTLINE}"/>
        <path d="M140 56 L140 40" stroke="${OUTLINE}" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M140 56 L152 62" stroke="${YELLOW}" stroke-width="2.4" stroke-linecap="round"/>
      </g>

      <!-- paused character -->
      <g>
        <circle cx="56" cy="78" r="16" fill="${CORAL_SOFT}" stroke="${OUTLINE}" stroke-width="2.2"/>
        <circle class="illustration-blink" cx="50" cy="76" r="2" fill="${OUTLINE}"/>
        <circle class="illustration-blink" cx="62" cy="76" r="2" fill="${OUTLINE}"/>
        <path d="M52 86 Q56 84 60 86" fill="none" stroke="${OUTLINE}" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M56 94 V118" stroke="${OUTLINE}" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M56 102 L44 110 M56 102 L68 108" stroke="${OUTLINE}" stroke-width="2.1" stroke-linecap="round"/>
        <!-- pause marks -->
        <rect x="72" y="68" width="4" height="14" rx="1.5" fill="${CORAL}"/>
        <rect x="80" y="68" width="4" height="14" rx="1.5" fill="${CORAL}"/>
      </g>
    `,
        'illustration-scene--waiting'
      ),

    success: () =>
      wrap(
        `
      <ellipse class="ill-blob illustration-breathe" cx="100" cy="130" rx="50" ry="14" fill="${TEAL}" opacity="0.7"/>
      <ellipse class="ill-blob" cx="40" cy="44" rx="22" ry="16" fill="${YELLOW}"/>

      <!-- completed card -->
      <g class="illustration-float">
        <rect x="62" y="52" width="76" height="56" rx="12" fill="${PAPER}" stroke="${OUTLINE}" stroke-width="2.4"/>
        <circle cx="100" cy="80" r="18" fill="${TEAL}" stroke="${OUTLINE}" stroke-width="2"/>
        <path class="illustration-draw" d="M90 80 L98 88 L114 70" fill="none" stroke="${CORAL}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </g>

      <g class="illustration-sparkle">
        <path d="M42 72 L45 80 L53 83 L45 86 L42 94 L39 86 L31 83 L39 80 Z" fill="${YELLOW}" stroke="${OUTLINE}" stroke-width="1.2"/>
        <path d="M156 60 L158 66 L164 68 L158 70 L156 76 L154 70 L148 68 L154 66 Z" fill="${CORAL}" stroke="${OUTLINE}" stroke-width="1.2"/>
        <circle cx="148" cy="100" r="3.5" fill="${LAVENDER}" stroke="${OUTLINE}" stroke-width="1.1"/>
      </g>

      <!-- happy face -->
      <g class="illustration-breathe illustration-sway">
        <circle cx="36" cy="112" r="15" fill="${CORAL_SOFT}" stroke="${OUTLINE}" stroke-width="2"/>
        <circle cx="28" cy="116" r="2.6" fill="${CORAL}" opacity="0.35"/>
        <circle cx="44" cy="116" r="2.6" fill="${CORAL}" opacity="0.35"/>
        <circle class="illustration-blink" cx="31" cy="110" r="1.9" fill="${OUTLINE}"/>
        <circle class="illustration-blink" cx="41" cy="110" r="1.9" fill="${OUTLINE}"/>
        <path d="M31 119 Q36 124 42 119" fill="none" stroke="${OUTLINE}" stroke-width="1.7" stroke-linecap="round"/>
      </g>
    `,
        'illustration-scene--success'
      )
  };

  const sizeMap = {
    hero: 'illustration--hero',
    section: 'illustration--section',
    empty: 'illustration--empty',
    compact: 'illustration--compact'
  };

  const pageMap = {
    today: 'today',
    content: 'content',
    tasks: 'today',
    planner: 'planner',
    seo: 'seo',
    clients: 'empty',
    revenue: 'revenue',
    'needs-ophelia': 'success',
    waiting: 'waiting'
  };

  function render(name, options) {
    const opts = options || {};
    const key = scenes[name] ? name : 'empty';
    const sizeClass = sizeMap[opts.size] || sizeMap.section;
    const decorative = opts.decorative !== false;
    const label = opts.label || '';
    const extra = opts.className || '';
    const svg = scenes[key]();

    if (decorative) {
      return `<div class="illustration ${sizeClass} ${extra}" aria-hidden="true">${svg}</div>`;
    }

    return `
      <figure class="illustration ${sizeClass} ${extra}">
        ${svg.replace('aria-hidden="true"', '')}
        ${label ? `<figcaption class="illustration-caption">${label}</figcaption>` : ''}
      </figure>
    `;
  }

  function forPage(pageId, size) {
    return render(pageMap[pageId] || 'empty', { size: size || 'hero' });
  }

  function emptyState(messageHtml) {
    return `
      <div class="empty-state">
        ${render('empty', { size: 'empty' })}
        <div class="empty-state-copy">${messageHtml}</div>
      </div>
    `;
  }

  let reactTimer = null;

  function react(mood, options) {
    const opts = options || {};
    const name = mood || 'happy';
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const hosts = [
      document.getElementById('page-title-art'),
      document.querySelector('.dashboard-intro .illustration'),
      document.querySelector('.liturgy-strip .illustration')
    ].filter(Boolean);

    hosts.forEach((host) => {
      host.classList.remove(
        'is-reacting-happy',
        'is-reacting-celebrate',
        'is-reacting-wave',
        'is-reacting-nod'
      );
      if (name === 'idle') return;
      if (reduced && name !== 'happy') return;
      host.classList.add(`is-reacting-${name}`);
    });

    if (opts.anchor && !reduced) {
      const anchor = typeof opts.anchor === 'string' ? document.querySelector(opts.anchor) : opts.anchor;
      if (anchor) {
        const burst = document.createElement('span');
        burst.className = 'task-react-burst';
        burst.setAttribute('aria-hidden', 'true');
        burst.innerHTML =
          '<svg viewBox="0 0 40 40" width="28" height="28"><path d="M20 4 L22 14 L32 16 L22 18 L20 28 L18 18 L8 16 L18 14 Z" fill="var(--coral, #851427)"/><circle cx="30" cy="10" r="2.2" fill="#ffe100"/><circle cx="8" cy="24" r="1.8" fill="#62c7bd"/></svg>';
        anchor.style.position = anchor.style.position || 'relative';
        anchor.appendChild(burst);
        window.setTimeout(() => burst.remove(), 1200);
      }
    }

    if (reactTimer) window.clearTimeout(reactTimer);
    if (name !== 'idle') {
      reactTimer = window.setTimeout(() => {
        hosts.forEach((host) => {
          host.classList.remove(
            'is-reacting-happy',
            'is-reacting-celebrate',
            'is-reacting-wave',
            'is-reacting-nod'
          );
        });
      }, opts.duration || 1400);
    }
  }

  window.TTC_ILLUSTRATIONS = {
    scenes: Object.keys(scenes),
    render,
    forPage,
    emptyState,
    pageMap,
    react
  };
})();
