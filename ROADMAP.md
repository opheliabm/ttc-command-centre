# TTC Command Centre — Roadmap

## Product stance

TTC stays a **business ops command centre** (content, SEO, clients, revenue, approvals). Inspiration from Quiet Progress is limited to weekly cadence, visual completion, and mindset-aware planning — not a personal habit-spreadsheet clone.

## Phase 1 — Prototype (current)

This repo **is** Phase 1. Already shipping in the static demo:

- Today dashboard with metrics, priority tasks, Needs Ophelia, waiting/blocked
- Content package cards with stage + progress
- Tasks list + add-task form
- Planner with fixed appointments + “Plan my day”
- Website & SEO audit cards
- Quick links hub
- Nav stubs for Clients / Revenue / Leads
- `localStorage` persistence (demo-safe, no backend)

**Phase 1 gaps still open (light polish, not a rebuild):**

- Clients and Revenue pages are empty stubs
- Tasks cannot be marked complete / edited from the UI
- Planner is priority-sort only (no energy/mindset weighting)

## Quiet Progress — features worth borrowing

Extracted from the Quiet Progress Productivity Tracker Bundle (Facebook share resolves to that brand; reel itself was login-walled):

| Quiet Progress idea | Fit for TTC |
|---|---|
| Weekly Sun–Sat grid | Strong — ops cadence view |
| Overall + per-day completion rings | Strong — Today / Planner clarity |
| Energy / Mood / Focus check-in | Strong — feed “Plan my day” |
| Color-coded categories | Easy — map existing `area` values |
| Consistency / pressure-free tone | Easy — copy + roll-forward missed work |
| Recurring habits / streaks | Partial — as light **ops rituals** only |
| Mindset line charts / monthly deep analytics | Later / optional |
| Gym, savings, income trackers | Skip |
| Spreadsheet download product model | Skip |

## Phase 2 — Quiet Progress–inspired upgrades (next)

Build on the Phase 1 prototype; do not replace it.

1. **Today completion ring** — % of must-do tasks done today
2. **Planner weekly grid** — day columns + per-day rings (tasks, packages, appointments)
3. **Daily Energy / Mood / Focus check-in** — store in `localStorage`; weight `getPlannerOutput()` using existing task `energy` fields
4. **Pressure-free planner copy** — missed items roll forward without guilt framing
5. **Color-coded areas** in task/package UI
6. **Ops rituals** (habit-lite): publish cadence, GBP post, SEO spot-check — secondary to delivery/revenue work
7. **Weekly review panel** — shipped / blocked / Needs Ophelia next week
8. **Content package stage viz** — make existing `progress` feel ring/stage-driven

## Phase 3 — Ops completeness

1. Clients snapshot (status, next action, blocked-by)
2. Revenue / leads board (proposal → follow-up → won/lost)
3. Task complete / edit / archive with persistence
4. Stronger appointment create/edit flow (button already on Today)

## Explicitly out of scope for core

- Personal habit tracker as primary nav
- Dark OLED consumer aesthetic
- Bundle products unrelated to TTC ops (gym, savings, etc.)

## Suggested build order from here

1. Task complete toggle (unblocks honest completion rings)
2. Today completion ring
3. Energy / Mood / Focus check-in → smarter Plan my day
4. Planner weekly grid + day rings
5. Color-coded areas + pressure-free copy
6. Ops rituals + weekly review
7. Clients + Revenue stubs
