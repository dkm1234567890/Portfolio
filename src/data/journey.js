// The non-project stops along the river.
//
// Task 5 stitches these together with projects.js into one ordered list:
// about -> activities -> experience -> skills -> [11 projects] -> next
//
// `kind` tells the RiverNode component which body layout to use.

export const journey = [
  {
    id: 'about',
    kind: 'story',
    icon: 'source',           // the spring where the river starts
    title: 'Where this starts',
    subtitle: 'Amrita School of Computing · B.Tech CSE · 2021–2025',
    body: [
      'I studied Computer Science at Amrita School of Computing, and spent most of it drawn to the layer below whatever I was working in. Writing a web app made me want to understand the requests; understanding the requests made me want to watch the packets in Wireshark.',
      'That is roughly the shape of everything downstream: eleven projects that keep moving toward the systems end of the stack — sockets, servers, Linux, load under stress — with a detour into machine learning that stuck.',
    ],
  },

  {
    id: 'activities',
    kind: 'list',
    icon: 'village',
    title: 'Off the coursework',
    subtitle: 'Events, coordination and certifications',
    // NOTE: your brief asked for "hackathons participated in". None of your
    // four resumes mention a hackathon, so this node is written around what
    // you actually did. If you have hackathons, tell me and I will rewrite it.
    // Inventing one is not an option — it is the easiest thing to get caught on.
    body: [
      'Public Relations volunteer, Anoka Tech Fest — Amrita Vishwa Vidyapeetham, March 2023.',
      'Student Coordinator, Gokulashtami Celebrations 2023 — received a Certificate of Appreciation for leading the team.',
      'OCI Generative AI Certification — Oracle, October 2024.',
      'BCG Strategy Consulting Virtual Experience.',
      'McKinsey Forward Program — in progress.',
    ],
    footnote:
      'Coordinating a festival is not a hackathon, but running logistics for a large event under a fixed deadline turned out to be closer to shipping software than I expected.',
  },

  {
    id: 'experience',
    kind: 'story',
    icon: 'harbour',
    title: 'TODO — this node is empty',
    subtitle: 'TODO',
    // ------------------------------------------------------------------
    // BLOCKED. This is the most important node on the page for a recruiter
    // and I have nothing to write it from.
    //
    // You said you are working as a trainee. None of your four resumes
    // mention it. Send me:
    //
    //   - company name (or "cannot name it" and I will write around it)
    //   - your title
    //   - start date, and whether you are still there
    //   - the stack you actually touch day to day
    //   - one thing you shipped or fixed that existed after you left
    //
    // That last item is what a recruiter reads. "Gained exposure to" is
    // filler; "fixed the retry logic that was dropping webhook events" is
    // a reason to call you.
    // ------------------------------------------------------------------
    body: [
      'TODO: replace this whole object once you send me the training details.',
    ],
  },

  {
    id: 'skills',
    kind: 'skills',   // renders skills.js
    icon: 'workshop',
    title: 'What I work with',
    subtitle: 'Grouped by what I have actually shipped with',
  },

  // ---- projects.js gets spliced in here by Task 5 ----

  {
    id: 'next',
    kind: 'story',
    icon: 'lighthouse',
    title: 'Where this is heading',
    subtitle: 'Open to roles',
    body: [
      'I am looking for a role where the work involves networked systems — backend services, infrastructure, network engineering, or anything where understanding Linux and the protocol layer is part of the job rather than a nice-to-have.',
      'Currently deepening the systems side: more C, more Linux internals, and closing the gap between "I have simulated this" and "I have run this in production".',
    ],
    cta: { label: 'Send me a message', target: '#contact' },
  },
];
