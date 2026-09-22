# TTC Command Centre — Roadmap

## Product stance

Two separate workspaces in one shell:

- **Business** — ops command centre (content, SEO, clients, revenue, approvals)
- **Personal** — Quiet Progress–style tracker (habits, weekly grid, rings, mindset)

They share chrome (sidebar switcher) but keep **separate nav, data, and localStorage trees**. No mixing business delivery work with personal habits.

## Phase 1 — Business prototype (shipped)

Business workspace already includes:

- Today dashboard with metrics, priority tasks, Needs Ophelia, waiting/blocked
- Content package cards with stage + progress
- Tasks list + add-task form
- Planner with fixed appointments + “Plan my day”
- Website & SEO audit cards
- Quick links hub
- Nav stubs for Clients / Revenue / Leads
- Persistence via `localStorage`

## Phase 1b — Dual workspace + Personal tracker (current)

- Business | Personal switcher in the sidebar
- Personal nav: Today, Habits, Weekly grid, One-off tasks, Mindset
- Habit checkboxes with color categories + streaks
- Overall + per-day completion rings
- Sun–Sat weekly grid
- Energy / Mood / Focus check-in with weekly bars
- Pressure-free copy (“miss a day, pick up where you are”)
- Separate personal links + demo seed data
- Migrates older `ttc-command-centre-demo-v1` business data into the new storage shape

## Phase 2 — Deepen each workspace

**Business**
1. Task complete toggle (unblocks honest completion rings on ops Today)
2. Today completion ring for must-dos
3. Optional EMF-aware Plan my day for ops energy
4. Clients + Revenue stubs filled
5. Ops rituals (publish cadence, GBP, SEO spot-check)

**Personal**
1. Month view / longer streak history
2. Habit edit / archive
3. Optional export (CSV) if you want a Sheets-like backup
4. Personal calendar sync (later)

## Explicitly out of scope for core

- Merging personal habits into Business Today
- Replacing Business with a habit-only product
- Gym / savings / income trackers as first-class business pages
