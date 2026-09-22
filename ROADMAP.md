# TTC Command Centre — Roadmap

## Product stance

Two separate workspaces in one editorial shell:

- **Business** — ops command centre (editorial UI, Daily Gospel, Customise, task CRUD)
- **Personal** — Quiet Progress–style tracker (habits, weekly grid, rings, mindset)

They share chrome (sidebar switcher, theme) but keep **separate nav, data, and persistence fields**.

## Current stack

- Visual system from `feature/editorial-ui-design-liturgy` (see [DESIGN.md](DESIGN.md))
- Dual Business | Personal switcher
- Personal module: [personal.js](personal.js)
- Liturgy + illustrations for Business Dashboard

## Next

**Business**
1. Optional EMF-aware Plan my day
2. Clients + Revenue stubs filled
3. Ops rituals (publish cadence, GBP, SEO spot-check)

**Personal**
1. Habit edit / archive
2. Month view / longer streak history
3. Optional CSV export

## Explicitly out of scope

- Merging personal habits into Business Today
- Replacing Business with a habit-only product
