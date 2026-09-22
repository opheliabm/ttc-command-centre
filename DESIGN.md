# TTC Command Centre — Design & layout

Plain-English guide to how the interface looks and how the screen is put together. For product behaviour and setup, see `README.md`.

Controlling styles live in `styles.css`, `illustrations.css`, and token defaults in `app.js` (Customise colours).

---

## What it should feel like

An **editorial newsletter on paper**, not a busy SaaS dashboard.

- Calm paper canvas, strong ink, one accent colour
- Oversized display titles, small mono labels for metadata
- Thin hard outlines, almost no shadow, nearly square corners
- Friendly local SVG doodles as accents — never the main content
- One overview screen on Dashboard; other pages stay list-and-card simple

---

## Colour

### Light mode (default)

| Token | Hex | Role |
| --- | --- | --- |
| `--paper` | `#fbfbfa` | Page background |
| `--paper-warm` | `#f7f6f3` | Soft alternate panels (e.g. liturgy strip) |
| `--ink` | `#080808` | Primary text and outlines |
| `--muted-ink` / `--muted` | `#3f3f3f` | Secondary text |
| `--line` | `#111111` | Strong borders |
| `--soft-line` | `#d8d8d4` | Dividers |
| `--coral` / `--accent` | `#851427` | **Burgundy** accent (links emphasis, active nav, checks, kickers) |
| `--coral-soft` | `#f0d5da` | Soft burgundy wash |
| `--panel` | `#ffffff` | Cards / elevated surfaces |
| Supporting illustration fills | yellow `#ffe100`, teal `#62c7bd`, blue `#8fb8ff`, lavender `#c9a8e8` | Sparingly in SVGs only |

### Dark mode

| Token | Hex | Role |
| --- | --- | --- |
| `--paper` / `--bg` | `#121212` | Page background |
| `--panel` | `#181818` | Cards |
| `--ink` | `#f5f5f2` | Primary text |
| `--muted` | `#b0b0a8` | Secondary text |
| `--line` | `#f0f0ea` | Borders (light on dark) |
| `--soft-line` | `#3a3a36` | Dividers |
| `--coral` / `--accent` | `#e9a76f` | **Apricot** accent |
| `--coral-soft` | `#3a2e24` | Soft apricot wash |

Toggle: sun / moon icon in the top bar (`aria-label` / `title` switch with theme).

### Customise overrides

Users can change paper, ink, accent, and line colours in **Customise**. In dark mode, custom paper/ink/lines are ignored so text stays readable; only a *non-default* accent is kept. **Reset appearance** restores the tokens above.

---

## Typography

| Role | Family | Where it shows |
| --- | --- | --- |
| Display | **Fraunces** | Page title (`h1`), section headings, liturgy title, brand name |
| UI | **Figtree** | Body, buttons, form fields, task titles |
| Meta | **IBM Plex Mono** | Eyebrows, kickers, nav labels, chip text, dates, footer attribution |

Base body size ≈ `0.9rem`, line-height `1.5`.

Page title scale: roughly `clamp(2.4rem, 5vw, 3.4rem)` (slightly smaller on the Today page so more fits above the fold).

---

## App shell layout

```
┌─────────────┬──────────────────────────────────────────────┐
│  Sidebar    │  Top bar (title + actions)                    │
│  220px      │──────────────────────────────────────────────│
│  Brand      │                                              │
│  Nav        │  Page content (max ~1280px + padding)        │
│  Quick links│                                              │
└─────────────┴──────────────────────────────────────────────┘
```

- **`.app-shell`**: CSS grid — `220px` sidebar + fluid main
- **`.main-panel`**: top bar + `#page-content`
- **Content max**: `--content-max: 1280px` (main column can sit a little wider with padding)
- **Corners**: `--radius: 4px` / `--radius-sm: 2px` — nearly square
- **Shadow**: none by default (`--shadow: none`)

### Sidebar

- Brand mark `TTC` + “Command Centre” + “Demo workspace”
- Vertical nav (mono-ish items; active state uses a left accent bar)
- Quick links block at the bottom of the sidebar column

### Top bar

- Eyebrow (“Command overview”)
- Large page title + optional compact illustration (desktop only)
- Actions: theme icon, Customise, Planner, Add appointment

### Modal layer

`#modal-root` overlays the shell for task edit / delete confirm / Customise. Escape closes; focus returns to the control that opened it.

---

## Dashboard (Today) layout

Top-to-bottom, single scroll:

1. **Intro** — day kicker + short lede + section illustration  
2. **Daily Gospel strip** — fixed at top of the working area (not reorderable)  
3. **Metrics strip** — compact count chips  
4. **Dashboard board** — reorderable cards in a **4-column** grid  

### Liturgy strip

- Bordered block on warm paper
- Kicker “Daily Gospel”, date, liturgical title, feast when present
- Short reading / psalm / gospel lines (titles + brief excerpt)
- Footer: source line + “Read on dailygospel.org”
- Compact illustration on the right (stacks under copy on narrow screens)

### Dashboard cards

Default order (Customise can drag to change; saved in localStorage):

1. Must do  
2. Needs review  
3. Waiting / blocked  
4. Revenue / leads  
5. Content packages  
6. Website & SEO  
7. Schedule  
8. Completed  

Each card: header + “Open →”, then compact rows (checkbox + title + meta, or package/audit blocks).

### Quick-add compose

On Dashboard, the add-task bar stays compact until focused / expanded; other tabs can show a fuller compose form.

---

## Other pages (layout pattern)

Shared pattern:

- Section heading (+ optional illustration)
- Toolbar or filters when needed
- List or card grid inside a panel

| Page | Main pattern |
| --- | --- |
| Tasks | Search / filters / sort → task list |
| Content | Card grid of packages |
| Website & SEO | Audit-style cards |
| Planner | Suggestion / schedule panels (appointments still via prompts) |
| Revenue / Needs review / Waiting | Filtered task lists |

---

## Components (visual rules)

| Element | Look |
| --- | --- |
| Primary button | Filled ink (dark mode: ink fill; hover can use accent) |
| Secondary / icon button | Outline, paper fill |
| Danger | Accent-tinted or danger class on delete |
| Tags / priority | Small mono chips; high priority leans on accent |
| Progress bar | Thin track; fill uses accent |
| Task check | Square outline; filled when done |
| Cards / panels | 1px line border, paper/panel fill, light internal spacing |
| Forms | Mono labels, outlined inputs, 2-column grids where space allows |

---

## Illustrations

- Original local SVGs in `illustrations.js` (no remote art packs)
- Accent strokes use CSS `var(--coral)` so they follow burgundy / apricot
- Decorative (`aria-hidden`) unless labelled otherwise
- Sizes: hero / section / compact / empty
- Scenes: `today`, `content`, `planner`, `seo`, `revenue`, `empty`, `waiting`, `success`

### Motion

Idle: soft float, breathe, sway, blink, sparkle, draw — few elements only.

Reactions (`TTC_ILLUSTRATIONS.react`):

| Mood | Typical trigger |
| --- | --- |
| `happy` | Task completed (+ brief sparkle on the row) |
| `nod` | Task added |
| `celebrate` | Feast / saint on liturgy strip (once per session day) |
| `wave` / `idle` | Available for UI cues |

If the user prefers reduced motion (`prefers-reduced-motion: reduce`), idle loops and reaction motion are effectively off.

---

## Breakpoints

| Width | Behaviour |
| --- | --- |
| **> 980px** | Sidebar + main; dashboard **4** columns; title art visible |
| **≤ 980px** | Sidebar stacks above content; dashboard **2** columns; top actions wrap |
| **≤ 720px** | Liturgy illustration stacks under copy |
| **≤ 520px** | Dashboard **1** column; denser task rows; compose / forms go single-column |

---

## Spacing & density

- Base unit: `--space: 8px`
- Dashboard aims to read as a **one-screen overview** on a laptop: tight gaps (`~10–14px`), compact rows, smaller Today title
- Prefer borders over shadows to separate regions
- Last cards keep a clear bottom border (no “missing edge” at the end of a list)

---

## Accessibility notes (design-related)

- Theme control is icon-only but always has a text `aria-label` / `title`
- Customise order: drag-and-drop plus ↑/↓ buttons and Arrow keys on a focused row
- Liturgy strip uses `aria-live="polite"` for load / error updates
- Focus rings use the accent colour
- Don’t rely on colour alone for completed state — checkmark + struck / completed styling

---

## Files to edit for visual changes

| Change | Start here |
| --- | --- |
| Colours, shell, cards, forms | `styles.css` |
| Illustration motion | `illustrations.css` |
| Illustration artwork | `illustrations.js` |
| Default / preset colours | `app.js` (`DEFAULT_COLOURS`, `COLOUR_PRESETS`) |
| Shell HTML structure | `index.html` |

Keep this document in sync when the visual system changes in a lasting way.
