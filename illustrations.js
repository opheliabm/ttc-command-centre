/**
 * Cute, distinct local SVG doodles for TTC Command Centre.
 * Each scene has its own character — not the same face recycled.
 * Editorial outlines + limited colour. Decorative (aria-hidden).
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
  const PEACH = '#ffd0b5';
  const MINT = '#b8e0d2';
  const CREAM = '#fff6da';
  const SOFT_LINE = '#d8d8d4';
  const OUTLINE = INK;
  const VB = '0 0 200 160';

  function wrap(inner, animClass) {
    return `
      <svg class="illustration-svg ${animClass || ''}" viewBox="${VB}" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
        ${inner}
      </svg>
    `;
  }

  /* Shared tiny helpers for cute eyes */
  function eyes(cx, cy, gap, r) {
    const g = gap || 10;
    const er = r || 2.4;
    return `
      <circle class="illustration-blink" cx="${cx - g / 2}" cy="${cy}" r="${er}" fill="${OUTLINE}"/>
      <circle class="illustration-blink" cx="${cx + g / 2}" cy="${cy}" r="${er}" fill="${OUTLINE}"/>
      <circle cx="${cx - g / 2 + 0.7}" cy="${cy - 0.8}" r="${er * 0.35}" fill="${PAPER}"/>
      <circle cx="${cx + g / 2 + 0.7}" cy="${cy - 0.8}" r="${er * 0.35}" fill="${PAPER}"/>
    `;
  }

  const scenes = {
    /* —— MASCOT: sidebar-only bean buddy (never reused as page art) —— */
    mascot: () =>
      wrap(
        `
      <ellipse class="ill-blob illustration-breathe" cx="160" cy="128" rx="24" ry="10" fill="${CREAM}"/>
      <g class="illustration-breathe illustration-sway">
        <!-- bean body -->
        <ellipse cx="100" cy="96" rx="40" ry="46" fill="${LAVENDER}" stroke="${OUTLINE}" stroke-width="2.4"/>
        <!-- belly -->
        <ellipse cx="100" cy="108" rx="22" ry="18" fill="${PAPER}" opacity="0.55"/>
        ${eyes(100, 88, 18, 3)}
        <path d="M90 102 Q100 112 110 102" fill="none" stroke="${OUTLINE}" stroke-width="2.2" stroke-linecap="round"/>
        <ellipse cx="82" cy="96" rx="5" ry="3" fill="${CORAL}" opacity="0.4"/>
        <ellipse cx="118" cy="96" rx="5" ry="3" fill="${CORAL}" opacity="0.4"/>
        <!-- arms -->
        <path class="illustration-wave-arm" d="M64 96 Q48 84 42 70" fill="none" stroke="${OUTLINE}" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M136 96 Q152 88 160 76" fill="none" stroke="${OUTLINE}" stroke-width="2.4" stroke-linecap="round"/>
        <!-- tiny feet -->
        <ellipse cx="84" cy="140" rx="10" ry="6" fill="${LAVENDER}" stroke="${OUTLINE}" stroke-width="2"/>
        <ellipse cx="116" cy="140" rx="10" ry="6" fill="${LAVENDER}" stroke="${OUTLINE}" stroke-width="2"/>
        <!-- heart balloon -->
        <g class="illustration-bounce">
          <path d="M148 48 C148 40, 158 36, 162 44 C166 36, 176 40, 176 48 C176 60, 162 70, 162 70 C162 70, 148 60, 148 48Z" fill="${CORAL}" stroke="${OUTLINE}" stroke-width="1.8"/>
          <path d="M162 70 V88" stroke="${OUTLINE}" stroke-width="1.6" stroke-linecap="round"/>
        </g>
      </g>
    `,
        'illustration-scene--mascot'
      ),

    /* —— BUSINESS: coffee mug buddy at a desk —— */
    today: () =>
      wrap(
        `
      <ellipse class="ill-blob illustration-breathe" cx="168" cy="128" rx="28" ry="12" fill="${YELLOW}" opacity="0.7"/>
      <path class="ill-blob" d="M12 40 C28 18, 58 28, 52 52 C46 70, 8 62, 12 40Z" fill="${MINT}" opacity="0.8"/>

      <!-- sticky stack -->
      <g class="illustration-float" style="--ill-delay:0.15s">
        <rect x="118" y="42" width="40" height="34" rx="4" fill="${YELLOW}" stroke="${OUTLINE}" stroke-width="2" transform="rotate(6 138 59)"/>
        <path d="M126 54 H146 M126 62 H140" stroke="${OUTLINE}" stroke-width="1.5" stroke-linecap="round"/>
      </g>
      <g class="illustration-float" style="--ill-delay:0.55s">
        <rect x="138" y="72" width="36" height="30" rx="4" fill="${LAVENDER}" stroke="${OUTLINE}" stroke-width="2" transform="rotate(-8 156 87)"/>
        <path d="M146 84 H162" stroke="${OUTLINE}" stroke-width="1.5" stroke-linecap="round"/>
      </g>

      <!-- desk -->
      <path d="M24 118 H176" stroke="${OUTLINE}" stroke-width="2.4" stroke-linecap="round"/>

      <!-- cute coffee mug (big face) -->
      <g class="illustration-breathe illustration-sway">
        <path d="M62 70 H118 C122 70, 124 74, 124 78 V112 C124 118, 118 122, 112 122 H68 C62 122, 58 118, 58 112 V78 C58 74, 60 70, 62 70Z" fill="${CORAL_SOFT}" stroke="${OUTLINE}" stroke-width="2.3"/>
        <path d="M124 84 H136 C142 84, 146 90, 146 96 C146 102, 142 108, 136 108 H124" fill="none" stroke="${OUTLINE}" stroke-width="2.3" stroke-linecap="round"/>
        ${eyes(90, 92, 16, 2.8)}
        <path d="M84 102 Q90 108 96 102" fill="none" stroke="${OUTLINE}" stroke-width="2" stroke-linecap="round"/>
        <ellipse cx="78" cy="96" rx="3.5" ry="2.2" fill="${CORAL}" opacity="0.35"/>
        <ellipse cx="102" cy="96" rx="3.5" ry="2.2" fill="${CORAL}" opacity="0.35"/>
        <!-- steam -->
        <path class="illustration-float" d="M78 58 Q74 48 80 42" fill="none" stroke="${OUTLINE}" stroke-width="1.8" stroke-linecap="round"/>
        <path class="illustration-float" style="--ill-delay:0.4s" d="M92 56 Q96 46 90 40" fill="none" stroke="${OUTLINE}" stroke-width="1.8" stroke-linecap="round"/>
        <path class="illustration-float" style="--ill-delay:0.8s" d="M104 58 Q108 50 102 44" fill="none" stroke="${OUTLINE}" stroke-width="1.8" stroke-linecap="round"/>
      </g>

      <g class="illustration-sparkle">
        <circle cx="48" cy="78" r="3" fill="${TEAL}"/>
        <circle cx="160" cy="48" r="2.5" fill="${CORAL}"/>
      </g>
    `,
        'illustration-scene--today'
      ),

    /* —— CONTENT: little camera toad —— */
    content: () =>
      wrap(
        `
      <ellipse class="ill-blob" cx="36" cy="120" rx="30" ry="14" fill="${LAVENDER}" opacity="0.75"/>
      <ellipse class="ill-blob illustration-breathe" cx="170" cy="36" rx="22" ry="16" fill="${YELLOW}"/>

      <!-- film strip -->
      <g class="illustration-float">
        <rect x="24" y="44" width="28" height="72" rx="4" fill="${INK}" stroke="${OUTLINE}" stroke-width="1.5"/>
        <rect x="28" y="50" width="20" height="12" rx="2" fill="${YELLOW}"/>
        <rect x="28" y="68" width="20" height="12" rx="2" fill="${TEAL}"/>
        <rect x="28" y="86" width="20" height="12" rx="2" fill="${BLUE}"/>
      </g>

      <!-- camera body with face -->
      <g class="illustration-breathe illustration-sway">
        <rect x="70" y="58" width="90" height="62" rx="16" fill="${BLUE}" stroke="${OUTLINE}" stroke-width="2.4"/>
        <rect x="78" y="48" width="28" height="14" rx="5" fill="${PAPER}" stroke="${OUTLINE}" stroke-width="2"/>
        <!-- lens = big eye -->
        <circle cx="128" cy="88" r="22" fill="${PAPER}" stroke="${OUTLINE}" stroke-width="2.4"/>
        <circle cx="128" cy="88" r="14" fill="${INK}"/>
        <circle class="illustration-blink" cx="128" cy="88" r="7" fill="${TEAL}"/>
        <circle cx="133" cy="82" r="3.5" fill="${PAPER}"/>
        <!-- little smile eye -->
        <circle class="illustration-blink" cx="92" cy="84" r="4" fill="${OUTLINE}"/>
        <circle cx="93.5" cy="82.5" r="1.4" fill="${PAPER}"/>
        <path d="M86 98 Q92 104 98 98" fill="none" stroke="${OUTLINE}" stroke-width="2" stroke-linecap="round"/>
        <!-- blush -->
        <ellipse cx="86" cy="92" rx="4" ry="2.5" fill="${CORAL}" opacity="0.4"/>
      </g>

      <g class="illustration-bounce">
        <circle cx="168" cy="96" r="8" fill="${CORAL}" stroke="${OUTLINE}" stroke-width="1.8"/>
        <path d="M168 88 V80" stroke="${OUTLINE}" stroke-width="2" stroke-linecap="round"/>
      </g>
    `,
        'illustration-scene--content'
      ),

    /* —— PLANNER: calendar kitten —— */
    planner: () =>
      wrap(
        `
      <ellipse class="ill-blob illustration-breathe" cx="40" cy="36" rx="26" ry="16" fill="${MINT}"/>
      <ellipse class="ill-blob" cx="168" cy="128" rx="28" ry="12" fill="${CREAM}"/>

      <!-- calendar board -->
      <rect x="78" y="36" width="96" height="88" rx="10" fill="${PAPER}" stroke="${OUTLINE}" stroke-width="2.4"/>
      <rect x="78" y="36" width="96" height="18" rx="10" fill="${CORAL}"/>
      <path d="M98 32 V44 M134 32 V44 M154 32 V44" stroke="${OUTLINE}" stroke-width="2.2" stroke-linecap="round"/>
      <g class="illustration-float">
        <rect x="90" y="66" width="20" height="16" rx="4" fill="${TEAL}" stroke="${OUTLINE}" stroke-width="1.4"/>
        <rect x="118" y="66" width="20" height="16" rx="4" fill="${YELLOW}" stroke="${OUTLINE}" stroke-width="1.4"/>
        <rect x="146" y="66" width="16" height="16" rx="4" fill="${LAVENDER}" stroke="${OUTLINE}" stroke-width="1.4"/>
      </g>
      <g class="illustration-float" style="--ill-delay:0.4s">
        <rect x="90" y="90" width="28" height="16" rx="4" fill="${BLUE}" stroke="${OUTLINE}" stroke-width="1.4"/>
        <rect x="128" y="90" width="20" height="16" rx="4" fill="${CORAL_SOFT}" stroke="${OUTLINE}" stroke-width="1.4"/>
      </g>

      <!-- kitten -->
      <g class="illustration-breathe illustration-sway">
        <ellipse cx="48" cy="118" rx="26" ry="18" fill="${PEACH}" stroke="${OUTLINE}" stroke-width="2.2"/>
        <!-- ears -->
        <path d="M28 104 L34 86 L44 100Z" fill="${PEACH}" stroke="${OUTLINE}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M52 100 L62 84 L70 104Z" fill="${PEACH}" stroke="${OUTLINE}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M32 100 L36 90 L40 98" fill="${CORAL}" opacity="0.45"/>
        <path d="M58 98 L62 88 L66 100" fill="${CORAL}" opacity="0.45"/>
        <!-- face -->
        <circle cx="48" cy="112" r="18" fill="${PEACH}" stroke="${OUTLINE}" stroke-width="2.2"/>
        ${eyes(48, 110, 14, 2.6)}
        <ellipse cx="48" cy="116" rx="3" ry="2" fill="${CORAL}"/>
        <path d="M48 118 L48 122 M42 122 Q48 126 54 122" fill="none" stroke="${OUTLINE}" stroke-width="1.6" stroke-linecap="round"/>
        <!-- whiskers -->
        <path d="M28 114 H38 M28 120 H36 M58 114 H68 M62 120 H70" stroke="${OUTLINE}" stroke-width="1.3" stroke-linecap="round"/>
        <path class="illustration-wave-arm" d="M70 118 Q86 108 96 114" fill="none" stroke="${OUTLINE}" stroke-width="2.2" stroke-linecap="round"/>
      </g>
    `,
        'illustration-scene--planner'
      ),

    /* —— SEO: curious snail with magnifier —— */
    seo: () =>
      wrap(
        `
      <ellipse class="ill-blob illustration-breathe" cx="160" cy="40" rx="28" ry="18" fill="${LAVENDER}"/>
      <path class="ill-blob" d="M16 100 C30 78, 60 88, 52 112 C46 130, 8 122, 16 100Z" fill="${YELLOW}" opacity="0.75"/>

      <!-- browser window -->
      <g class="illustration-float">
        <rect x="88" y="36" width="92" height="70" rx="10" fill="${PAPER}" stroke="${OUTLINE}" stroke-width="2.3"/>
        <rect x="88" y="36" width="92" height="14" rx="10" fill="${MINT}"/>
        <circle cx="98" cy="43" r="2.5" fill="${CORAL}"/>
        <circle cx="108" cy="43" r="2.5" fill="${YELLOW}"/>
        <circle cx="118" cy="43" r="2.5" fill="${TEAL}"/>
        <path d="M102 64 H160 M102 74 H148 M102 84 H154" stroke="${OUTLINE}" stroke-width="1.6" stroke-linecap="round"/>
      </g>

      <!-- snail -->
      <g class="illustration-breathe illustration-sway">
        <!-- shell -->
        <circle cx="56" cy="108" r="24" fill="${CORAL_SOFT}" stroke="${OUTLINE}" stroke-width="2.3"/>
        <path d="M56 108 Q44 100 48 88 Q64 84 68 98 Q70 110 56 108" fill="none" stroke="${OUTLINE}" stroke-width="2" stroke-linecap="round"/>
        <!-- body -->
        <ellipse cx="78" cy="128" rx="34" ry="14" fill="${TEAL}" stroke="${OUTLINE}" stroke-width="2.2"/>
        <!-- face -->
        <circle cx="104" cy="118" r="12" fill="${TEAL}" stroke="${OUTLINE}" stroke-width="2"/>
        ${eyes(104, 116, 10, 2.2)}
        <path d="M100 124 Q104 127 108 124" fill="none" stroke="${OUTLINE}" stroke-width="1.5" stroke-linecap="round"/>
        <!-- antennas -->
        <path d="M98 108 L92 92" stroke="${OUTLINE}" stroke-width="2" stroke-linecap="round"/>
        <path d="M110 108 L116 90" stroke="${OUTLINE}" stroke-width="2" stroke-linecap="round"/>
        <circle class="illustration-bounce" cx="92" cy="90" r="3.5" fill="${CORAL}" stroke="${OUTLINE}" stroke-width="1.4"/>
        <circle class="illustration-bounce" style="--ill-delay:0.3s" cx="116" cy="88" r="3.5" fill="${CORAL}" stroke="${OUTLINE}" stroke-width="1.4"/>
      </g>

      <!-- magnifier -->
      <g class="illustration-float" style="--ill-delay:0.35s">
        <circle cx="150" cy="108" r="16" fill="${PAPER}" fill-opacity="0.7" stroke="${OUTLINE}" stroke-width="2.4"/>
        <path d="M162 120 L176 136" stroke="${OUTLINE}" stroke-width="3.2" stroke-linecap="round"/>
      </g>
    `,
        'illustration-scene--seo'
      ),

    /* —— REVENUE: piggy bank —— */
    revenue: () =>
      wrap(
        `
      <ellipse class="ill-blob" cx="36" cy="40" rx="24" ry="16" fill="${YELLOW}"/>
      <ellipse class="ill-blob illustration-breathe" cx="168" cy="120" rx="30" ry="14" fill="${MINT}"/>

      <!-- coins -->
      <g class="illustration-bounce">
        <circle cx="44" cy="96" r="14" fill="${YELLOW}" stroke="${OUTLINE}" stroke-width="2.2"/>
        <text x="44" y="101" text-anchor="middle" font-size="12" font-weight="700" fill="${OUTLINE}">$</text>
      </g>
      <g class="illustration-bounce" style="--ill-delay:0.35s">
        <circle cx="58" cy="118" r="11" fill="${YELLOW}" stroke="${OUTLINE}" stroke-width="2"/>
        <text x="58" y="122" text-anchor="middle" font-size="10" font-weight="700" fill="${OUTLINE}">$</text>
      </g>

      <!-- piggy -->
      <g class="illustration-breathe illustration-sway">
        <ellipse cx="120" cy="100" rx="48" ry="36" fill="${CORAL_SOFT}" stroke="${OUTLINE}" stroke-width="2.4"/>
        <!-- snout -->
        <ellipse cx="156" cy="104" rx="14" ry="11" fill="${PEACH}" stroke="${OUTLINE}" stroke-width="2"/>
        <circle cx="151" cy="104" r="2.2" fill="${OUTLINE}"/>
        <circle cx="161" cy="104" r="2.2" fill="${OUTLINE}"/>
        <!-- ear -->
        <path d="M90 78 L98 58 L112 74Z" fill="${CORAL_SOFT}" stroke="${OUTLINE}" stroke-width="2" stroke-linejoin="round"/>
        ${eyes(118, 92, 18, 3)}
        <path d="M110 108 Q118 114 126 108" fill="none" stroke="${OUTLINE}" stroke-width="2" stroke-linecap="round"/>
        <!-- coin slot -->
        <path d="M108 72 H132" stroke="${OUTLINE}" stroke-width="2.4" stroke-linecap="round"/>
        <!-- legs -->
        <path d="M96 130 V142 M112 132 V144 M128 132 V144 M144 130 V142" stroke="${OUTLINE}" stroke-width="2.4" stroke-linecap="round"/>
        <!-- tail curl -->
        <path class="illustration-wave-arm" d="M74 100 Q60 88 66 76" fill="none" stroke="${OUTLINE}" stroke-width="2.2" stroke-linecap="round"/>
      </g>

      <g class="illustration-sparkle">
        <path d="M168 56 L170 62 L176 64 L170 66 L168 72 L166 66 L160 64 L166 62 Z" fill="${YELLOW}" stroke="${OUTLINE}" stroke-width="1"/>
      </g>
    `,
        'illustration-scene--revenue'
      ),

    /* —— EMPTY: sleepy cloud —— */
    empty: () =>
      wrap(
        `
      <ellipse class="ill-blob" cx="40" cy="120" rx="28" ry="12" fill="${CREAM}"/>
      <ellipse class="ill-blob illustration-breathe" cx="170" cy="48" rx="22" ry="14" fill="${LAVENDER}"/>

      <g class="illustration-float">
        <!-- cloud body -->
        <path d="M54 96 C54 74, 74 62, 94 68 C100 52, 128 52, 136 70 C156 68, 168 88, 156 104 C168 118, 148 134, 124 128 C110 142, 78 138, 70 120 C52 124, 44 110, 54 96Z"
          fill="${PAPER}" stroke="${OUTLINE}" stroke-width="2.4"/>
        ${eyes(100, 96, 22, 3)}
        <!-- sleepy smile -->
        <path d="M92 110 Q100 106 108 110" fill="none" stroke="${OUTLINE}" stroke-width="2" stroke-linecap="round"/>
        <ellipse cx="84" cy="102" rx="5" ry="3" fill="${CORAL}" opacity="0.35"/>
        <ellipse cx="116" cy="102" rx="5" ry="3" fill="${CORAL}" opacity="0.35"/>
        <!-- zzz -->
        <g class="illustration-bounce">
          <text x="148" y="78" font-size="14" font-weight="700" fill="${OUTLINE}">z</text>
          <text x="160" y="64" font-size="18" font-weight="700" fill="${OUTLINE}">z</text>
          <text x="174" y="48" font-size="22" font-weight="700" fill="${CORAL}">z</text>
        </g>
      </g>
    `,
        'illustration-scene--empty'
      ),

    /* —— WAITING: tortoise with tea —— */
    waiting: () =>
      wrap(
        `
      <ellipse class="ill-blob illustration-breathe" cx="168" cy="40" rx="24" ry="16" fill="${YELLOW}"/>
      <ellipse class="ill-blob" cx="36" cy="128" rx="28" ry="12" fill="${MINT}"/>

      <!-- hourglass -->
      <g class="illustration-float">
        <path d="M148 48 H180 L170 78 L180 108 H148 L158 78 Z" fill="${PAPER}" stroke="${OUTLINE}" stroke-width="2.2" stroke-linejoin="round"/>
        <path d="M156 56 H172 L164 72 Z" fill="${CORAL}"/>
        <path class="illustration-bounce" d="M160 96 H168" stroke="${CORAL}" stroke-width="3" stroke-linecap="round"/>
      </g>

      <!-- tortoise -->
      <g class="illustration-breathe illustration-sway">
        <ellipse cx="78" cy="108" rx="42" ry="28" fill="${TEAL}" stroke="${OUTLINE}" stroke-width="2.4"/>
        <!-- shell pattern -->
        <path d="M56 100 H100 M78 88 V124 M62 92 L94 120 M94 92 L62 120" stroke="${OUTLINE}" stroke-width="1.6" opacity="0.5"/>
        <!-- head -->
        <circle cx="122" cy="100" r="16" fill="${MINT}" stroke="${OUTLINE}" stroke-width="2.2"/>
        ${eyes(124, 98, 12, 2.4)}
        <path d="M118 108 Q124 112 130 108" fill="none" stroke="${OUTLINE}" stroke-width="1.7" stroke-linecap="round"/>
        <!-- tiny legs -->
        <ellipse cx="52" cy="128" rx="10" ry="6" fill="${MINT}" stroke="${OUTLINE}" stroke-width="1.8"/>
        <ellipse cx="78" cy="132" rx="10" ry="6" fill="${MINT}" stroke="${OUTLINE}" stroke-width="1.8"/>
        <ellipse cx="104" cy="128" rx="10" ry="6" fill="${MINT}" stroke="${OUTLINE}" stroke-width="1.8"/>
        <!-- flower on shell -->
        <g class="illustration-sparkle">
          <circle cx="70" cy="96" r="5" fill="${CORAL}"/>
          <circle cx="66" cy="92" r="3.5" fill="${YELLOW}"/>
          <circle cx="74" cy="92" r="3.5" fill="${YELLOW}"/>
          <circle cx="70" cy="96" r="2.2" fill="${PAPER}"/>
        </g>
      </g>
    `,
        'illustration-scene--waiting'
      ),

    /* —— SUCCESS: party star blob —— */
    success: () =>
      wrap(
        `
      <ellipse class="ill-blob illustration-breathe" cx="36" cy="120" rx="26" ry="12" fill="${TEAL}" opacity="0.7"/>
      <ellipse class="ill-blob" cx="168" cy="44" rx="22" ry="14" fill="${LAVENDER}"/>

      <!-- confetti -->
      <g class="illustration-bounce">
        <rect x="28" y="48" width="8" height="8" rx="1" fill="${CORAL}" transform="rotate(18 32 52)"/>
        <rect x="168" y="72" width="7" height="7" rx="1" fill="${TEAL}" transform="rotate(-20 171 75)"/>
        <circle cx="48" cy="72" r="3" fill="${YELLOW}"/>
        <circle cx="160" cy="100" r="3.5" fill="${BLUE}"/>
      </g>

      <!-- big star face -->
      <g class="illustration-pop illustration-sway">
        <path d="M100 28 L112 68 L154 68 L120 92 L132 132 L100 108 L68 132 L80 92 L46 68 L88 68 Z"
          fill="${YELLOW}" stroke="${OUTLINE}" stroke-width="2.4" stroke-linejoin="round"/>
        ${eyes(100, 78, 20, 3.2)}
        <path d="M90 92 Q100 102 110 92" fill="none" stroke="${OUTLINE}" stroke-width="2.4" stroke-linecap="round"/>
        <ellipse cx="84" cy="84" rx="5" ry="3" fill="${CORAL}" opacity="0.4"/>
        <ellipse cx="116" cy="84" rx="5" ry="3" fill="${CORAL}" opacity="0.4"/>
      </g>

      <g class="illustration-sparkle">
        <path d="M36 88 L38 94 L44 96 L38 98 L36 104 L34 98 L28 96 L34 94 Z" fill="${CORAL}" stroke="${OUTLINE}" stroke-width="1"/>
        <path d="M164 48 L166 54 L172 56 L166 58 L164 64 L162 58 L156 56 L162 54 Z" fill="${TEAL}" stroke="${OUTLINE}" stroke-width="1"/>
      </g>
    `,
        'illustration-scene--success'
      ),

    /* —— PERSONAL: sprout buddy —— */
    personal: () =>
      wrap(
        `
      <ellipse class="ill-blob illustration-breathe" cx="168" cy="128" rx="26" ry="12" fill="${MINT}"/>
      <path class="ill-blob" d="M16 48 C32 24, 58 36, 48 58 C40 74, 6 68, 16 48Z" fill="${CREAM}"/>

      <!-- pot -->
      <g class="illustration-float">
        <path d="M78 104 H138 L130 140 H86 Z" fill="${CORAL_SOFT}" stroke="${OUTLINE}" stroke-width="2.3" stroke-linejoin="round"/>
        <rect x="72" y="96" width="72" height="12" rx="4" fill="${PEACH}" stroke="${OUTLINE}" stroke-width="2"/>
        <!-- pot face -->
        ${eyes(108, 122, 16, 2.4)}
        <path d="M102 130 Q108 134 114 130" fill="none" stroke="${OUTLINE}" stroke-width="1.8" stroke-linecap="round"/>
      </g>

      <!-- sprout -->
      <g class="illustration-bounce">
        <path d="M108 96 V62" stroke="${OUTLINE}" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M108 72 Q88 58 78 66 Q90 78 108 72" fill="${TEAL}" stroke="${OUTLINE}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M108 66 Q128 50 142 60 Q128 74 108 66" fill="${MINT}" stroke="${OUTLINE}" stroke-width="2" stroke-linejoin="round"/>
        <!-- leaf eyes -->
        <circle class="illustration-blink" cx="92" cy="66" r="2" fill="${OUTLINE}"/>
        <circle class="illustration-blink" cx="126" cy="60" r="2" fill="${OUTLINE}"/>
      </g>

      <!-- watering can -->
      <g class="illustration-float" style="--ill-delay:0.4s">
        <path d="M148 78 H176 L172 98 H152 Z" fill="${BLUE}" stroke="${OUTLINE}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M176 84 Q188 80 190 92" fill="none" stroke="${OUTLINE}" stroke-width="2.2" stroke-linecap="round"/>
        <path class="illustration-draw" d="M188 94 L176 110" stroke="${BLUE}" stroke-width="2" stroke-linecap="round"/>
      </g>

      <g class="illustration-sparkle">
        <circle cx="56" cy="88" r="3" fill="${YELLOW}"/>
        <circle cx="44" cy="100" r="2" fill="${CORAL}"/>
      </g>
    `,
        'illustration-scene--personal'
      ),

    /* —— HABITS: fox with scarf streak —— */
    habits: () =>
      wrap(
        `
      <ellipse class="ill-blob" cx="40" cy="36" rx="24" ry="16" fill="${LAVENDER}"/>
      <ellipse class="ill-blob illustration-breathe" cx="168" cy="120" rx="28" ry="12" fill="${CREAM}"/>

      <!-- checklist card behind -->
      <g class="illustration-float">
        <rect x="128" y="40" width="52" height="64" rx="8" fill="${PAPER}" stroke="${OUTLINE}" stroke-width="2.2"/>
        <path class="illustration-check-pop" d="M138 58 L144 64 L156 50" fill="none" stroke="${TEAL}" stroke-width="2.4" stroke-linecap="round"/>
        <path class="illustration-check-pop" style="--ill-delay:0.4s" d="M138 78 L144 84 L154 72" fill="none" stroke="${CORAL}" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M138 98 H162" stroke="${SOFT_LINE}" stroke-width="2" stroke-linecap="round"/>
      </g>

      <!-- fox -->
      <g class="illustration-breathe illustration-sway">
        <!-- body -->
        <ellipse cx="78" cy="118" rx="34" ry="24" fill="${PEACH}" stroke="${OUTLINE}" stroke-width="2.3"/>
        <!-- head -->
        <path d="M48 88 L78 60 L108 88 Q108 112 78 118 Q48 112 48 88Z" fill="${PEACH}" stroke="${OUTLINE}" stroke-width="2.3" stroke-linejoin="round"/>
        <!-- ears -->
        <path d="M58 72 L64 44 L78 68Z" fill="${PEACH}" stroke="${OUTLINE}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M78 68 L92 42 L100 72Z" fill="${PEACH}" stroke="${OUTLINE}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M62 64 L66 50 L72 64" fill="${CORAL}" opacity="0.5"/>
        <path d="M86 64 L92 48 L96 66" fill="${CORAL}" opacity="0.5"/>
        <!-- face -->
        ${eyes(78, 86, 18, 2.8)}
        <ellipse cx="78" cy="96" rx="5" ry="3.5" fill="${PAPER}" stroke="${OUTLINE}" stroke-width="1.5"/>
        <circle cx="78" cy="96" r="1.6" fill="${OUTLINE}"/>
        <path d="M70 104 Q78 110 86 104" fill="none" stroke="${OUTLINE}" stroke-width="1.8" stroke-linecap="round"/>
        <!-- blush -->
        <ellipse cx="62" cy="96" rx="4" ry="2.5" fill="${CORAL}" opacity="0.35"/>
        <ellipse cx="94" cy="96" rx="4" ry="2.5" fill="${CORAL}" opacity="0.35"/>
        <!-- scarf -->
        <path d="M58 108 Q78 118 98 108" fill="none" stroke="${CORAL}" stroke-width="5" stroke-linecap="round"/>
        <path class="illustration-wave-arm" d="M98 110 Q118 118 122 132" fill="none" stroke="${CORAL}" stroke-width="5" stroke-linecap="round"/>
        <!-- tail -->
        <path class="illustration-bounce" d="M48 120 Q28 108 32 88 Q48 96 52 112" fill="${PEACH}" stroke="${OUTLINE}" stroke-width="2.2" stroke-linejoin="round"/>
        <path d="M36 96 Q42 100 40 108" fill="${PAPER}" opacity="0.7"/>
      </g>
    `,
        'illustration-scene--habits'
      ),

    /* —— WEEKLY: chick hopping on days —— */
    weekly: () =>
      wrap(
        `
      <ellipse class="ill-blob illustration-breathe" cx="36" cy="40" rx="24" ry="14" fill="${BLUE}"/>
      <ellipse class="ill-blob" cx="168" cy="120" rx="26" ry="12" fill="${YELLOW}" opacity="0.7"/>

      <!-- day pads -->
      ${[0, 1, 2, 3, 4, 5, 6]
        .map((i) => {
          const x = 28 + i * 22;
          const delay = (i * 0.1).toFixed(2);
          const fills = [TEAL, CORAL_SOFT, BLUE, YELLOW, LAVENDER, MINT, PEACH];
          return `
            <g class="illustration-float" style="--ill-delay:${delay}s">
              <rect x="${x}" y="108" width="18" height="22" rx="5" fill="${fills[i]}" stroke="${OUTLINE}" stroke-width="1.7"/>
            </g>
          `;
        })
        .join('')}

      <!-- chick -->
      <g class="illustration-bounce illustration-sway">
        <ellipse cx="100" cy="78" rx="28" ry="24" fill="${YELLOW}" stroke="${OUTLINE}" stroke-width="2.3"/>
        <!-- wing -->
        <path class="illustration-wave-arm" d="M78 78 Q64 70 62 84 Q72 90 80 84" fill="${CREAM}" stroke="${OUTLINE}" stroke-width="2" stroke-linejoin="round"/>
        ${eyes(104, 74, 14, 2.8)}
        <!-- beak -->
        <path d="M112 82 L124 86 L112 90Z" fill="${CORAL}" stroke="${OUTLINE}" stroke-width="1.5" stroke-linejoin="round"/>
        <!-- blush -->
        <ellipse cx="92" cy="82" rx="4" ry="2.5" fill="${CORAL}" opacity="0.35"/>
        <!-- crest -->
        <path d="M92 58 Q96 48 100 56 Q104 46 108 56" fill="none" stroke="${CORAL}" stroke-width="2.2" stroke-linecap="round"/>
        <!-- feet -->
        <path d="M90 100 L86 112 M90 100 L94 112 M110 100 L106 112 M110 100 L114 112" stroke="${OUTLINE}" stroke-width="2" stroke-linecap="round"/>
      </g>

      <g class="illustration-sparkle">
        <circle cx="148" cy="56" r="3" fill="${TEAL}"/>
        <circle cx="56" cy="64" r="2.5" fill="${CORAL}"/>
      </g>
    `,
        'illustration-scene--weekly'
      ),

    /* —— MINDSET: three mood blobs —— */
    mindset: () =>
      wrap(
        `
      <ellipse class="ill-blob" cx="100" cy="136" rx="60" ry="12" fill="${CREAM}" opacity="0.8"/>

      <!-- energy (spicy) -->
      <g class="illustration-bounce" style="--ill-delay:0s">
        <circle cx="48" cy="78" r="28" fill="${CORAL_SOFT}" stroke="${OUTLINE}" stroke-width="2.3"/>
        ${eyes(48, 74, 14, 2.6)}
        <path d="M40 88 Q48 96 56 88" fill="none" stroke="${OUTLINE}" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M28 58 L32 48 M48 52 L48 42 M68 58 L64 48" stroke="${CORAL}" stroke-width="2" stroke-linecap="round"/>
        <text x="48" y="124" text-anchor="middle" font-size="9" font-family="IBM Plex Mono, monospace" fill="${OUTLINE}">energy</text>
      </g>

      <!-- mood (calm) -->
      <g class="illustration-float" style="--ill-delay:0.25s">
        <circle cx="100" cy="70" r="30" fill="${BLUE}" stroke="${OUTLINE}" stroke-width="2.3"/>
        <!-- happy closed eyes -->
        <path class="illustration-blink" d="M88 68 Q94 62 100 68" fill="none" stroke="${OUTLINE}" stroke-width="2.2" stroke-linecap="round"/>
        <path class="illustration-blink" d="M100 68 Q106 62 112 68" fill="none" stroke="${OUTLINE}" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M90 80 Q100 90 110 80" fill="none" stroke="${OUTLINE}" stroke-width="2.2" stroke-linecap="round"/>
        <ellipse cx="86" cy="76" rx="4" ry="2.5" fill="${CORAL}" opacity="0.35"/>
        <ellipse cx="114" cy="76" rx="4" ry="2.5" fill="${CORAL}" opacity="0.35"/>
        <text x="100" y="124" text-anchor="middle" font-size="9" font-family="IBM Plex Mono, monospace" fill="${OUTLINE}">mood</text>
      </g>

      <!-- focus (tiny glasses) -->
      <g class="illustration-pop" style="--ill-delay:0.15s">
        <circle cx="152" cy="78" r="28" fill="${MINT}" stroke="${OUTLINE}" stroke-width="2.3"/>
        <!-- glasses -->
        <circle cx="142" cy="74" r="8" fill="none" stroke="${OUTLINE}" stroke-width="2"/>
        <circle cx="162" cy="74" r="8" fill="none" stroke="${OUTLINE}" stroke-width="2"/>
        <path d="M150 74 H154" stroke="${OUTLINE}" stroke-width="2"/>
        <circle cx="142" cy="74" r="2.2" fill="${OUTLINE}"/>
        <circle cx="162" cy="74" r="2.2" fill="${OUTLINE}"/>
        <path d="M146 88 Q152 92 158 88" fill="none" stroke="${OUTLINE}" stroke-width="1.8" stroke-linecap="round"/>
        <text x="152" y="124" text-anchor="middle" font-size="9" font-family="IBM Plex Mono, monospace" fill="${OUTLINE}">focus</text>
      </g>
    `,
        'illustration-scene--mindset'
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
    waiting: 'waiting',
    personal: 'personal',
    habits: 'habits',
    weekly: 'weekly',
    mindset: 'mindset',
    'personal-today': 'personal',
    'personal-habits': 'habits',
    'personal-weekly': 'weekly',
    'personal-tasks': 'personal',
    'personal-mindset': 'mindset'
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
      document.getElementById('sidebar-companion'),
      document.querySelector('.dashboard-intro .illustration'),
      document.querySelector('.personal-intro .illustration'),
      document.querySelector('.page-hero-art .illustration'),
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

  let idleWaveTimer = null;
  function startIdleWaves() {
    if (idleWaveTimer) return;
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    idleWaveTimer = window.setInterval(() => {
      react('wave', { duration: 900 });
    }, 11000);
    window.setTimeout(() => react('wave', { duration: 900 }), 1800);
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', startIdleWaves);
    } else {
      startIdleWaves();
    }
  }
})();
