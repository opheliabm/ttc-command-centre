/**
 * Framer Client Readiness Dashboard — seed data.
 * Stable task IDs, status options, metrics, projects, and prospect pipeline
 * from the Framer Client Readiness Dashboard Plan.
 */
window.framerPlanData = {
  meta: {
    title: 'Framer Client Readiness',
    durationWeeks: 8,
    studyDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    sessionMinutes: '30-45',
    primaryGoal: 'Become ready to sell and deliver a responsive Framer landing page with basic SEO',
    statusOptions: ['not_started', 'in_progress', 'blocked', 'complete'],
    tracks: ['Build', 'SEO', 'Portfolio', 'Outreach', 'Audit', 'GEO'],
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    prospectStages: [
      'research',
      'ready',
      'contacted',
      'replied',
      'call_booked',
      'proposal_sent',
      'won',
      'lost',
      'nurture'
    ],
    prospectSources: ['LinkedIn', 'referral', 'Google Maps', 'Instagram', 'directory', 'marketplace'],
    prospectTypes: ['direct client', 'agency', 'referral partner', 'job']
  },
  nav: [
    { id: 'today', label: 'Today' },
    { id: 'learning', label: 'Learning' },
    { id: 'projects', label: 'Projects' },
    { id: 'pipeline', label: 'Pipeline' },
    { id: 'weekly', label: 'Weekly review' },
    { id: 'linkedin', label: 'LinkedIn' }
  ],
  links: [
    { label: 'Framer', url: 'https://www.framer.com/' },
    { label: 'Figma', url: 'https://www.figma.com/' },
    { label: 'Search Console', url: 'https://search.google.com/search-console' },
    { label: 'Bing Webmaster', url: 'https://www.bing.com/webmasters' }
  ],
  metricTargets: {
    learningSessionsCompleted: 32,
    responsivePagesPublished: 3,
    portfolioCaseStudiesReady: 3,
    prospectsResearched: 60,
    personalizedMessagesSent: 40,
    followUpsSent: 20,
    relevantJobsApplied: 12,
    agencyOrReferralConversations: 5,
    discoveryCallsBooked: 2,
    paidProjectsWon: 1
  },
  tasks: [
    { id: 'W1-MON-01', title: 'Learn the Framer workspace', week: 1, day: 'Monday', track: 'Build', duration: 40, status: 'not_started', output: 'One rough hero section.', evidence: '', notes: 'Practice frames, sections, stacks, padding, gaps, alignment, and preview.', blocker: '', dueDate: '' },
    { id: 'W1-TUE-01', title: 'Map the anatomy of a landing page', week: 1, day: 'Tuesday', track: 'Build', duration: 40, status: 'not_started', output: 'Annotated section list for the page being recreated.', evidence: '', notes: 'Identify navigation, hero, proof, benefits, process, FAQ, CTA, and footer on three real sites.', blocker: '', dueDate: '' },
    { id: 'W1-WED-01', title: 'Recreate the first half of a landing page', week: 1, day: 'Wednesday', track: 'Build', duration: 40, status: 'not_started', output: 'Hero plus at least two sections.', evidence: '', notes: "Match the reference's hierarchy, width, spacing, type scale, and CTA placement.", blocker: '', dueDate: '' },
    { id: 'W1-THU-01', title: 'Complete the desktop recreation', week: 1, day: 'Thursday', track: 'Build', duration: 40, status: 'not_started', output: 'Complete desktop page with a Framer preview link.', evidence: '', notes: 'Finish the page and compare it side by side with the reference.', blocker: '', dueDate: '' },
    { id: 'W1-FRI-01', title: 'Create the first prospect watchlist', week: 1, day: 'Friday', track: 'Outreach', duration: 30, status: 'not_started', output: 'Five prospect records with one specific website problem each.', evidence: '', notes: 'Save five businesses with weak, dated, confusing, or poorly mobile-optimized websites. Do not contact them yet.', blocker: '', dueDate: '' },
    { id: 'W2-MON-01', title: 'Create mobile and tablet breakpoints', week: 2, day: 'Monday', track: 'Build', duration: 40, status: 'not_started', output: 'Responsive Week 1 recreation.', evidence: '', notes: 'Convert the Week 1 page into a readable mobile layout.', blocker: '', dueDate: '' },
    { id: 'W2-TUE-01', title: 'Apply basic page structure and metadata', week: 2, day: 'Tuesday', track: 'SEO', duration: 40, status: 'not_started', output: 'SEO settings completed on the practice page.', evidence: '', notes: 'Add one clear H1, logical H2s, a useful page title, a concise meta description, descriptive link text, and image alt text.', blocker: '', dueDate: '' },
    { id: 'W2-WED-01', title: 'Start a second landing-page recreation', week: 2, day: 'Wednesday', track: 'Build', duration: 40, status: 'not_started', output: 'Second page at least 70 percent complete.', evidence: '', notes: 'Choose a reference from a different business category. Add navigation, CTA, form, and reusable components.', blocker: '', dueDate: '' },
    { id: 'W2-THU-01', title: 'Finish, test, and publish the second recreation', week: 2, day: 'Thursday', track: 'Build', duration: 40, status: 'not_started', output: 'Published Framer preview link.', evidence: '', notes: 'Test desktop and mobile, links, form behavior, overflow, spacing, and basic metadata.', blocker: '', dueDate: '' },
    { id: 'W2-FRI-01', title: 'Draft the starter service', week: 2, day: 'Friday', track: 'Outreach', duration: 30, status: 'not_started', output: 'First service description and exclusions.', evidence: '', notes: 'Define a one-page offer using existing client content, one revision round, responsive design, Framer build, contact form, basic SEO settings, and domain connection.', blocker: '', dueDate: '' },
    { id: 'W3-MON-01', title: 'Write the project brief and page outline', week: 3, day: 'Monday', track: 'Portfolio', duration: 40, status: 'not_started', output: 'One-page brief and wireframe.', evidence: '', notes: 'Define the customer, problem, primary action, required sections, proof, and content available.', blocker: '', dueDate: '' },
    { id: 'W3-TUE-01', title: 'Draft page copy around one clear intent', week: 3, day: 'Tuesday', track: 'SEO', duration: 40, status: 'not_started', output: 'Complete landing-page copy.', evidence: '', notes: 'Write a specific headline, supporting copy, service or benefit sections, proof, FAQs, and CTA. Avoid placeholder copy.', blocker: '', dueDate: '' },
    { id: 'W3-WED-01', title: 'Build the original desktop page', week: 3, day: 'Wednesday', track: 'Build', duration: 40, status: 'not_started', output: 'Complete desktop version.', evidence: '', notes: 'Use the brief and copy to build without tracing a single reference.', blocker: '', dueDate: '' },
    { id: 'W3-THU-01', title: 'Build mobile, test, and publish', week: 3, day: 'Thursday', track: 'Build', duration: 40, status: 'not_started', output: 'Published original concept.', evidence: '', notes: 'Fix wrapping, stacking, tap targets, content order, overflow, and spacing.', blocker: '', dueDate: '' },
    { id: 'W3-FRI-01', title: 'Begin targeted outreach', week: 3, day: 'Friday', track: 'Outreach', duration: 40, status: 'not_started', output: 'Messages logged with follow-up dates.', evidence: '', notes: "Send three to five personalized messages based on a real problem visible on each prospect's site.", blocker: '', dueDate: '' },
    { id: 'W4-MON-01', title: 'Turn the original project into a short case study', week: 4, day: 'Monday', track: 'Portfolio', duration: 40, status: 'not_started', output: 'Case-study draft.', evidence: '', notes: 'Include context, observed problem, page goal, three design decisions, responsive approach, and final link. State clearly that it is concept work if it was not commissioned.', blocker: '', dueDate: '' },
    { id: 'W4-TUE-01', title: 'Run the foundational SEO checklist', week: 4, day: 'Tuesday', track: 'SEO', duration: 40, status: 'not_started', output: 'Completed SEO checklist and fixes.', evidence: '', notes: 'Check title, meta description, one H1, heading order, descriptive URLs, alt text, internal links, sitemap or indexing settings, and mobile usability.', blocker: '', dueDate: '' },
    { id: 'W4-WED-01', title: 'Polish and package two to three projects', week: 4, day: 'Wednesday', track: 'Portfolio', duration: 40, status: 'not_started', output: 'Portfolio-ready project set.', evidence: '', notes: 'Use consistent thumbnails, accurate labels, live links, concise explanations, and no invented results.', blocker: '', dueDate: '' },
    { id: 'W4-THU-01', title: 'Create proposal and intake basics', week: 4, day: 'Thursday', track: 'Outreach', duration: 40, status: 'not_started', output: 'Reusable starter proposal outline.', evidence: '', notes: 'Draft the project scope, exclusions, timeline, revision policy, content responsibilities, payment stages, and handoff.', blocker: '', dueDate: '' },
    { id: 'W4-FRI-01', title: 'Run the first full pipeline session', week: 4, day: 'Friday', track: 'Outreach', duration: 50, status: 'not_started', output: 'Updated pipeline and application records.', evidence: '', notes: 'Research five prospects, send three to five personalized messages, apply to two relevant roles, and follow up on Week 3 outreach.', blocker: '', dueDate: '' },
    { id: 'W5-MON-01', title: 'Create a reusable component set', week: 5, day: 'Monday', track: 'Build', duration: 40, status: 'not_started', output: 'Navigation, buttons, form fields, cards, FAQ, CTA, and footer components.', evidence: '', notes: '', blocker: '', dueDate: '' },
    { id: 'W5-TUE-01', title: 'Review accessibility and interaction basics', week: 5, day: 'Tuesday', track: 'Build', duration: 40, status: 'not_started', output: 'Fixed contrast, type size, focus states, labels, tap targets, and reduced unnecessary motion.', evidence: '', notes: '', blocker: '', dueDate: '' },
    { id: 'W5-WED-01', title: 'Improve one project using the component set', week: 5, day: 'Wednesday', track: 'Build', duration: 40, status: 'not_started', output: 'Faster, more consistent build.', evidence: '', notes: '', blocker: '', dueDate: '' },
    { id: 'W5-THU-01', title: 'Write the handoff and launch checklist', week: 5, day: 'Thursday', track: 'Portfolio', duration: 40, status: 'not_started', output: 'Reusable pre-launch and client-handoff checklist.', evidence: '', notes: '', blocker: '', dueDate: '' },
    { id: 'W5-FRI-01', title: 'Prospect and follow up', week: 5, day: 'Friday', track: 'Outreach', duration: 40, status: 'not_started', output: 'Five researched prospects, three to five messages, and all due follow-ups sent.', evidence: '', notes: '', blocker: '', dueDate: '' },
    { id: 'W6-MON-01', title: 'Learn crawl index and sitemap basics', week: 6, day: 'Monday', track: 'SEO', duration: 40, status: 'not_started', output: 'Notes applied to one live practice site.', evidence: '', notes: '', blocker: '', dueDate: '' },
    { id: 'W6-TUE-01', title: 'Learn Search Console and Bing Webmaster Tools basics', week: 6, day: 'Tuesday', track: 'SEO', duration: 40, status: 'not_started', output: 'Measurement setup checklist; connect a suitable owned site when available.', evidence: '', notes: '', blocker: '', dueDate: '' },
    { id: 'W6-WED-01', title: 'Audit one practice site', week: 6, day: 'Wednesday', track: 'Audit', duration: 40, status: 'not_started', output: 'Prioritized issue list.', evidence: '', notes: 'Review hierarchy, mobile UX, messaging, on-page SEO, crawl/index settings, page speed basics, and content gaps.', blocker: '', dueDate: '' },
    { id: 'W6-THU-01', title: 'Turn the audit into a client-facing document', week: 6, day: 'Thursday', track: 'Audit', duration: 40, status: 'not_started', output: 'One-page audit with issue, evidence, consequence, recommendation, and priority.', evidence: '', notes: '', blocker: '', dueDate: '' },
    { id: 'W6-FRI-01', title: 'Send one useful mini-audit', week: 6, day: 'Friday', track: 'Outreach', duration: 40, status: 'not_started', output: 'One concise mini-audit sent to a well-matched prospect; avoid giving away a full strategy.', evidence: '', notes: '', blocker: '', dueDate: '' },
    { id: 'W7-MON-01', title: 'Learn AI search fundamentals without hack language', week: 7, day: 'Monday', track: 'GEO', duration: 40, status: 'not_started', output: 'Practical checklist.', evidence: '', notes: 'Focus on crawlability, clear entities, direct answers, original experience, credible sourcing, and useful page structure.', blocker: '', dueDate: '' },
    { id: 'W7-TUE-01', title: 'Improve one page for clarity and evidence', week: 7, day: 'Tuesday', track: 'GEO', duration: 40, status: 'not_started', output: 'Revised definitions, claims, supporting evidence, author or business identity, and FAQs where useful.', evidence: '', notes: '', blocker: '', dueDate: '' },
    { id: 'W7-WED-01', title: 'Learn structured data boundaries', week: 7, day: 'Wednesday', track: 'SEO', duration: 40, status: 'not_started', output: 'One valid, relevant implementation or a documented reason not to add it.', evidence: '', notes: 'Understand that markup must match visible content and is not a guaranteed ranking or citation mechanism.', blocker: '', dueDate: '' },
    { id: 'W7-THU-01', title: 'Add AI-search checks to the audit', week: 7, day: 'Thursday', track: 'Audit', duration: 40, status: 'not_started', output: 'Revised audit template covering entity clarity, sourcing, answerability, and content gaps.', evidence: '', notes: '', blocker: '', dueDate: '' },
    { id: 'W7-FRI-01', title: 'Apply and follow up', week: 7, day: 'Friday', track: 'Outreach', duration: 40, status: 'not_started', output: 'Two relevant applications, three personalized messages, and due follow-ups.', evidence: '', notes: '', blocker: '', dueDate: '' },
    { id: 'W8-MON-01', title: 'Select a real prospect or realistic brief', week: 8, day: 'Monday', track: 'Portfolio', duration: 40, status: 'not_started', output: 'Approved brief, fixed scope, and success criteria.', evidence: '', notes: '', blocker: '', dueDate: '' },
    { id: 'W8-TUE-01', title: 'Audit and plan the page', week: 8, day: 'Tuesday', track: 'Audit', duration: 40, status: 'not_started', output: 'Prioritized recommendations, outline, and copy needs.', evidence: '', notes: '', blocker: '', dueDate: '' },
    { id: 'W8-WED-01', title: 'Build the page', week: 8, day: 'Wednesday', track: 'Build', duration: 40, status: 'not_started', output: 'Desktop and mobile build.', evidence: '', notes: '', blocker: '', dueDate: '' },
    { id: 'W8-THU-01', title: 'QA publish and package', week: 8, day: 'Thursday', track: 'Build', duration: 40, status: 'not_started', output: 'Published page, QA checklist, and case-study notes.', evidence: '', notes: '', blocker: '', dueDate: '' },
    { id: 'W8-FRI-01', title: 'Review the full system', week: 8, day: 'Friday', track: 'Outreach', duration: 45, status: 'not_started', output: 'Updated numbers, strongest proof, weak spots, next-month priorities, and every due follow-up sent.', evidence: '', notes: '', blocker: '', dueDate: '' }
  ],
  projects: [
    { id: 'proj-recreation-1', name: 'Recreation 1', type: 'Landing page', kind: 'Practice', brief: 'not_started', desktop: 'not_started', mobile: 'not_started', seo: 'not_started', qa: 'not_started', published: 'not_started', caseStudy: 'not_required', link: '', notes: '' },
    { id: 'proj-recreation-2', name: 'Recreation 2', type: 'Landing page', kind: 'Practice', brief: 'not_started', desktop: 'not_started', mobile: 'not_started', seo: 'not_started', qa: 'not_started', published: 'not_started', caseStudy: 'not_required', link: '', notes: '' },
    { id: 'proj-original', name: 'Original concept', type: 'Client-style site', kind: 'Concept', brief: 'not_started', desktop: 'not_started', mobile: 'not_started', seo: 'not_started', qa: 'not_started', published: 'not_started', caseStudy: 'not_started', link: '', notes: '' },
    { id: 'proj-sprint', name: 'Real-world sprint', type: 'Client or concept', kind: 'TBD', brief: 'not_started', desktop: 'not_started', mobile: 'not_started', seo: 'not_started', qa: 'not_started', published: 'not_started', caseStudy: 'not_started', link: '', notes: '' }
  ],
  prospects: [
    {
      id: 'PROS-001',
      name: '',
      company: 'Example — replace with a real prospect',
      url: '',
      source: 'Google Maps',
      prospectType: 'direct client',
      observedProblem: 'Placeholder. Add one specific website problem after research.',
      offerAngle: 'Responsive Framer landing page refresh',
      relationshipStrength: 'cold',
      priority: 'medium',
      stage: 'research',
      lastContact: '',
      nextFollowUp: '',
      message: '',
      notes: ''
    }
  ],
  weeklyReviews: [
    {
      week: 1,
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
    }
  ],
  linkedInConnections: []
};
