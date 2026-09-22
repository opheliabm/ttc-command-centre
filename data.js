window.dashboardData = {
  nav: [
    { id: "today", label: "Dashboard" },
    { id: "content", label: "Content packages" },
    { id: "tasks", label: "Tasks" },
    { id: "planner", label: "Planner" },
    { id: "seo", label: "Website & SEO" },
    { id: "clients", label: "Clients" },
    { id: "revenue", label: "Revenue / Leads" },
    { id: "needs-ophelia", label: "Needs Ophelia" },
    { id: "waiting", label: "Waiting / Blocked" }
  ],
  links: [
    { label: "Descript", url: "https://www.descript.com/" },
    { label: "GoHighLevel", url: "https://www.gohighlevel.com/" },
    { label: "YouTube Studio", url: "https://studio.youtube.com/" },
    { label: "LinkedIn", url: "https://www.linkedin.com/" },
    { label: "Google Business", url: "https://business.google.com/" },
    { label: "Spotify for Creators", url: "https://artists.spotify.com/" }
  ],
  metrics: {
    today: [
      { label: "Must do today", value: 5 },
      { label: "Needs Ophelia", value: 2 },
      { label: "Waiting on others", value: 3 },
      { label: "Revenue moves", value: 4 }
    ]
  },
  tasks: [
    {
      id: "task-001",
      title: "Clean edit — client episode draft",
      area: "Content production",
      status: "active",
      priority: "high",
      due: "Today",
      owner: "Ophelia",
      executor: "Editor workflow",
      notes: "Remove false starts and tighten the story before handoff to the next stage.",
      requiresOphelia: false,
      blocked: false,
      duration: 90,
      energy: "focused"
    },
    {
      id: "task-002",
      title: "Create thumbnail batch for this week",
      area: "Design",
      status: "waiting",
      priority: "medium",
      due: "Tomorrow",
      owner: "Ophelia",
      executor: "Visual workflow",
      notes: "Prepare thumbnails and confirm the brand treatment before publishing.",
      requiresOphelia: false,
      blocked: false,
      duration: 50,
      energy: "creative"
    },
    {
      id: "task-003",
      title: "Website audit — service page",
      area: "Website & SEO",
      status: "active",
      priority: "high",
      due: "Today",
      owner: "Ophelia",
      executor: "SEO checklist",
      notes: "Review headings, search intent, metadata and AI-search readability.",
      requiresOphelia: true,
      blocked: false,
      duration: 60,
      energy: "analysis"
    },
    {
      id: "task-004",
      title: "Follow up on proposal — new lead",
      area: "Revenue / leads",
      status: "waiting",
      priority: "high",
      due: "Today",
      owner: "Ophelia",
      executor: "CRM / email",
      notes: "Send a short follow-up and confirm the next action.",
      requiresOphelia: true,
      blocked: false,
      duration: 30,
      energy: "admin"
    },
    {
      id: "task-005",
      title: "Draft business profile post",
      area: "Publishing",
      status: "active",
      priority: "medium",
      due: "Tomorrow",
      owner: "Ophelia",
      executor: "Publishing checklist",
      notes: "Draft a post with CTA, proof and a service highlight.",
      requiresOphelia: false,
      blocked: false,
      duration: 35,
      energy: "creative"
    },
    {
      id: "task-006",
      title: "Confirm pipeline fields before import",
      area: "Operations",
      status: "blocked",
      priority: "medium",
      due: "This week",
      owner: "Ophelia",
      executor: "CRM setup",
      notes: "Wait for final pipeline structure and dedupe rules before beginning imports.",
      requiresOphelia: true,
      blocked: true,
      duration: 45,
      energy: "admin"
    }
  ],
  contentPackages: [
    {
      id: "pkg-001",
      title: "Client video package — episode draft",
      status: "In progress",
      caption: "Video edit + long-form + promotional assets",
      progress: 76,
      due: "Thu",
      owner: "Ophelia",
      stage: "Edit polish",
      next: "Handoff to finishing editor"
    },
    {
      id: "pkg-002",
      title: "Social content sprint",
      status: "Queued",
      caption: "Short-form assets, captions and promos",
      progress: 42,
      due: "Fri",
      owner: "Ophelia",
      stage: "Drafting",
      next: "Schedule and publish"
    },
    {
      id: "pkg-003",
      title: "Website refresh and SEO pass",
      status: "Needs review",
      caption: "Technical, on-page and AI-searchability improvements",
      progress: 58,
      due: "Next week",
      owner: "Ophelia",
      stage: "Audit",
      next: "Implementation and verification"
    }
  ],
  audits: [
    {
      id: "audit-001",
      title: "Service page audit",
      status: "In progress",
      level: "High",
      notes: "Check page headings, intent match, metadata and conversion logic."
    },
    {
      id: "audit-002",
      title: "Business profile scan",
      status: "Queued",
      level: "Medium",
      notes: "Review category accuracy, service descriptions and post cadence."
    },
    {
      id: "audit-003",
      title: "AI-search readability review",
      status: "Needs review",
      level: "High",
      notes: "Verify there are clear answers, topical authority and strong internal linking."
    }
  ],
  appointments: [
    { id: "appt-001", time: "10:00", title: "Client review call" },
    { id: "appt-002", time: "14:00", title: "Design checkpoint" }
  ],
  opsRituals: [
    { id: "ritual-001", title: "Publish cadence check", area: "Publishing" },
    { id: "ritual-002", title: "GBP post", area: "Publishing" },
    { id: "ritual-003", title: "SEO spot-check", area: "Website & SEO" }
  ],
  ritualCompletions: {
    "ritual-001": [true, true, false, false, false, false, false],
    "ritual-002": [false, true, false, false, false, false, false],
    "ritual-003": [true, false, true, false, false, false, false]
  },
  mindsetByDay: [
    { energy: 4, mood: 4, focus: 3 },
    { energy: 3, mood: 4, focus: 4 },
    { energy: 3, mood: 3, focus: 3 },
    null,
    null,
    null,
    null
  ],
  weeklyReview: {
    weekOf: "",
    shipped: "",
    blocked: "",
    needsOphelia: "",
    notes: ""
  },
  clients: [
    {
      id: "client-001",
      name: "Harbour Dental",
      status: "active",
      nextAction: "Send edited episode cut",
      blockedBy: "",
      notes: "Monthly video retainer"
    },
    {
      id: "client-002",
      name: "Northside Physio",
      status: "onboarding",
      nextAction: "Confirm brand assets",
      blockedBy: "Waiting on logo files",
      notes: "New website + GBP"
    },
    {
      id: "client-003",
      name: "Cedar Coaching",
      status: "paused",
      nextAction: "Re-engage for Q4 content",
      blockedBy: "Budget review on their side",
      notes: "Past SEO project"
    }
  ],
  revenueLeads: [
    {
      id: "lead-001",
      name: "Summit Law — proposal",
      stage: "proposal",
      value: "£2.4k",
      nextFollowUp: "Tomorrow",
      notes: "Landing page + content starter"
    },
    {
      id: "lead-002",
      name: "Bloom Cafe — follow-up",
      stage: "follow-up",
      value: "£900",
      nextFollowUp: "Today",
      notes: "GBP + short-form package"
    },
    {
      id: "lead-003",
      name: "Atlas Fitness — discovery",
      stage: "discovery",
      value: "£1.5k",
      nextFollowUp: "This week",
      notes: "Interested in video + SEO"
    },
    {
      id: "lead-004",
      name: "River Studio — won",
      stage: "won",
      value: "£1.2k",
      nextFollowUp: "",
      notes: "Kickoff scheduled"
    },
    {
      id: "lead-005",
      name: "Pine Retail — lost",
      stage: "lost",
      value: "£800",
      nextFollowUp: "",
      notes: "Went in-house"
    }
  ],
  personal: {
    nav: [
      { id: "today", label: "Today" },
      { id: "habits", label: "Habits" },
      { id: "weekly", label: "Weekly grid" },
      { id: "tasks", label: "One-off tasks" },
      { id: "mindset", label: "Mindset" }
    ],
    links: [
      { label: "Notes", url: "#" },
      { label: "Calendar", url: "#" },
      { label: "Journal", url: "#" }
    ],
    habits: [
      { id: "habit-001", title: "Morning stretch", color: "coral", streak: 4 },
      { id: "habit-002", title: "Read 20 minutes", color: "teal", streak: 7 },
      { id: "habit-003", title: "Drink water", color: "blue", streak: 12 },
      { id: "habit-004", title: "Evening wind-down", color: "violet", streak: 2 },
      { id: "habit-005", title: "No phone after 10", color: "amber", streak: 1 }
    ],
    tasks: [
      {
        id: "ptask-001",
        title: "Book dentist check-up",
        area: "Life admin",
        status: "active",
        priority: "medium",
        due: "This week",
        notes: "One-off — not a recurring habit.",
        done: false
      },
      {
        id: "ptask-002",
        title: "Order new notebooks",
        area: "Home",
        status: "active",
        priority: "low",
        due: "Whenever",
        notes: "Nice to have, not urgent.",
        done: false
      }
    ],
    // completions[habitId][dayIndex 0=Sun .. 6=Sat] = true/false for current week demo
    completions: {
      "habit-001": [true, true, true, true, false, false, false],
      "habit-002": [true, true, true, true, true, true, true],
      "habit-003": [true, true, false, true, true, true, true],
      "habit-004": [false, true, true, false, false, false, false],
      "habit-005": [true, false, false, false, false, false, false]
    },
    // mindsetByDay[dayIndex] = { energy, mood, focus } 1–5, null if not set
    mindsetByDay: [
      { energy: 4, mood: 4, focus: 3 },
      { energy: 3, mood: 4, focus: 4 },
      { energy: 2, mood: 3, focus: 2 },
      { energy: 4, mood: 5, focus: 4 },
      { energy: 3, mood: 3, focus: 3 },
      null,
      null
    ]
  }
};
