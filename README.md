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

- index.html
- styles.css
- data.js
- app.js
- README.md

## How to use

1. Open `index.html` in a browser.
2. Update the data in `data.js` to reflect your real tasks and content pipeline.
3. Refresh the page to see the updates.
4. Add tasks from the dashboard form or use the planner view.

## Included features

- **Business | Personal** workspace switcher (separate dashboards)
- Business: Today dashboard, content packages, SEO, planner, ops queues
- Personal: habits, weekly grid, completion rings, Energy/Mood/Focus check-in
- Quick links per workspace
- Local browser storage for persistence (workspaces stored separately)
- Simple task / habit creation forms

## Best use cases

- Daily **business** operations dashboard
- Separate **personal** habit + mindset tracker
- Content package tracker
- SEO and AI-searchability workspace
- Quick link hub to publishing and workflow tools
- Decision support for “what should I do next?” (business) vs “what keeps me consistent?” (personal)

## Notes

- Keep client or business data private and do not put private links or API keys in a public repo.
- This is a safe demo build and intentionally uses placeholder examples.
- This repo is the **Phase 1 business prototype** plus a **separate Personal tracker** workspace. See [ROADMAP.md](ROADMAP.md).

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
