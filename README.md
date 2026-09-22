# TTC Command Centre

A lightweight, Notion-inspired operations dashboard prototype.

## What this is

This project is a demo workspace for tracking work, content packages and SEO tasks in a calm, low-memory system.

## Why this approach

- Works as a static HTML app
- Very light on RAM
- No build step
- No required backend
- Easy to customise in browser or code
- Good for a private operations dashboard or a public demo version

## Files

- `index.html`
- `styles.css`
- `illustrations.css`
- `illustrations.js`
- `liturgy.js` — Daily Gospel / Evangelizo feed helper
- `personal.js` — Personal tracker (habits, weekly grid, mindset)
- `data.js`
- `app.js`
- `README.md`
- `DESIGN.md` — design system and layout
- `ROADMAP.md` — Business | Personal roadmap

## Workspaces

- **Business** — editorial ops dashboard (Dashboard, tasks, content, SEO, liturgy, Customise)
- **Personal** — separate habit / mindset tracker (Today, Habits, Weekly grid, One-off tasks, Mindset)

Switch with the Business | Personal control in the sidebar.
## Visual system

- Minimal editorial newsletter layout (paper canvas, oversized display type, mono metadata)
- Thin black outlines, square corners, restrained colour
- Coral-red hand-drawn illustration accents (not a colourful dashboard)
- Original local SVG illustrations in `illustrations.js`
- Subtle CSS animation on selected illustration parts only
- Light/dark theme toggle via sun/moon icons (`aria-label` / `title`)

### Colour palette

```css
--paper: #fbfbfa;
--paper-warm: #f7f6f3;
--ink: #080808;
--muted-ink: #3f3f3f;
--line: #111111;
--soft-line: #d8d8d4;
--coral: #851427;
--coral-soft: #f0d5da;
--yellow: #ffe100;
--teal: #62c7bd;
--blue: #8fb8ff;
--lavender: #c9a8e8;
```

Accent follows theme: **burgundy (`#851427`) in light mode**, **apricot (`#e9a76f`) in dark mode**.

### Illustrations (original local assets)

The scene illustrations in `illustrations.js` are **original local SVG artwork** created for this project.

They follow a minimal editorial style: black structural lines, coral annotation strokes, and very limited supporting colour. They are inspired by the general language of friendly editorial illustration — not copied from Figma community files, stock packs, or remote libraries.

- No external image URLs
- No remote Figma assets
- No third-party illustration runtime dependencies
- Decorative by default (`aria-hidden`)
- Motion respects `prefers-reduced-motion`
- Reactions via `TTC_ILLUSTRATIONS.react(mood)`: `happy`, `celebrate`, `wave`, `nod`, `idle`

Scenes available: `today`, `content`, `planner`, `seo`, `revenue`, `empty`, `waiting`, `success`.

### Typography

- Display: Fraunces (page and section titles)
- UI: Figtree
- Supporting / meta: IBM Plex Mono

### Customise panel

Top-bar **Customise** opens an accessible modal (Escape closes; focus returns):

- Colour presets plus live paper / ink / accent / line pickers (saved in localStorage)
- Drag-and-drop Dashboard card order (native HTML5 DnD; ↑/↓ buttons and Arrow keys as fallback)
- Liturgy strip stays fixed at the top of the Dashboard (not reorderable)
- Optional Daily Gospel language code (default `AM`)
- **Reset appearance** restores colours, card order, and liturgy language

Appointments are still added via browser prompts (unchanged).

### Daily Gospel / Evangelizo

The Dashboard shows a **Daily Gospel** strip above the metrics. Readings are fetched at runtime from the public Evangelizo reader that powers [dailygospel.org](https://dailygospel.org/):

```text
https://feed.evangelizo.org/v2/reader.php?date=YYYYMMDD&type=xml&lang=AM
```

- Titles and short excerpts only in the UI; full text via the “Read on dailygospel.org” link
- Attribution: “Source: Daily Gospel / Evangelizo”
- Offline / fetch failure: calm message + link still offered
- Do **not** vendor copyrighted full lectionary text into the repo
- When a saint / feast is present, art celebrates once per day (session flag)

### Reactive art

- Complete a task → happy reaction + brief sparkle on the row
- Add a task → nod
- Feast / saint on the liturgy strip → celebrate once per browser session day
- All motion honours `prefers-reduced-motion`

## How to use

1. Open `index.html` in a browser, or serve locally (see Quick start).
2. Update starter data in `data.js` if you want different demo defaults.
3. Use the dashboard to add, edit, complete, search and filter tasks.
4. Use **Reset demo data** in the sidebar to restore the starter set.

## Included features

- Today dashboard with Daily Gospel strip, metrics, and reorderable cards
- Content package cards
- SEO + website audit section
- Quick links to common tools
- Planner view for daily suggestions
- Local browser storage for persistence
- Task creation form
- Task edit modal (accessible)
- Task complete / reopen and delete (with confirmation)
- Search by title, area and notes
- Filters for status, priority and area
- Sort by priority or due label
- Resilient localStorage handling + storage-unavailable banner
- Reset demo data action
- Animated local illustrations with reaction moods
- Theme icons + Customise (colours, card order, liturgy language)

## Task management (Phase 1)

- Centralised app state (page, theme, tasks, packages, audits, appointments, filters, search, selected item)
- Stable IDs plus `createdAt` / `updatedAt` on new or edited tasks
- Existing demo records without timestamps still load safely
- Edit via modal: title, area, priority, status, due, notes, duration, owner, executor, requires-review
- Escape closes the modal; Cancel closes without saving; focus returns to the control that opened it

## Safety

- This repository remains demo-safe and intentionally uses placeholder examples
- Do not put private client data, private links, or API keys in a public repo
- Planner rewrite is not part of this update
- Appointment entry remains prompt-based (Phase 2 planner is out of scope)

## Quick start

Open the project in a browser:

```bash
open index.html
```

Or serve it locally:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```
