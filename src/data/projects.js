// Every project, in the order the visitor meets them.
//
// Chronological on purpose. The river metaphor is a journey, and your work
// genuinely does progress: C -> web -> databases -> OOP -> ML -> theory ->
// networking -> full-stack -> systems -> ML again. A recruiter scrolling
// top to bottom watches you level up. Sorting by "most impressive first"
// would throw that away.
//
// Note there is no `anchor` field here. Task 5 works out each island's
// position along the river from its index in this array, so adding a
// project stays a one-object change instead of renumbering everything.

const GH = 'https://github.com/dkm1234567890';

export const projects = [
  {
    slug: 'battleship-game-c',
    name: 'Battleship Game',
    domain: 'C Programming',
    period: 'Semester 1 · 2021',
    problem: 'Turn a paper game into working code, starting from a flowchart.',
    detail: [
      'Built the classic two-player Battleship game in C.',
      'Designed the control flow in Flowgorithm before writing any code, then translated the flowchart into a working program.',
      'Handled grid state, hit detection and turn management with arrays and loops only — no external libraries.',
    ],
    tags: ['C', 'Flowgorithm', 'Game Logic'],
    repo: `${GH}/battleship-game-c`,
  },

  {
    slug: 'racers-edge',
    name: "Racer's Edge",
    domain: 'Front-end / UI',
    period: 'Semester 2 · 2022',
    problem: 'Build an automobile showcase with nothing but web fundamentals.',
    detail: [
      'A racing and automobile showcase site built with HTML, CSS and JavaScript.',
      'Focused on layout, responsive behaviour and interactive detail without reaching for a framework.',
      'First project where I had to think about how something felt to use, not just whether it ran.',
    ],
    tags: ['HTML', 'CSS', 'JavaScript', 'UI'],
    repo: `${GH}/racers-edge`,
  },

  {
    slug: 'farmer-irrigation-analysis',
    name: 'Farmer Irrigation Analysis',
    domain: 'DBMS',
    period: 'Aug 2022 – Jan 2023',
    problem: 'Which irrigation method suits a given soil type?',
    detail: [
      'An advisory system that matches soil types to the most suitable irrigation method.',
      'Built the relational schema and queries in SQL, with PHP handling database connectivity.',
      'Did the data modelling first — working out the entities and relationships before writing queries made the rest straightforward.',
    ],
    tags: ['DBMS', 'SQL', 'PHP', 'Data Modelling'],
    repo: `${GH}/farmer-irrigation-analysis`,
  },

  {
    slug: 'hotel-management-system',
    name: 'Hotel Management System',
    domain: 'Object-Oriented Design',
    period: 'Jan 2023 – May 2023',
    problem: 'Room booking, records and billing in one maintainable Java application.',
    detail: [
      'A modular Java application covering room booking, record management and billing.',
      'Structured with MVC so each concern stayed separate and the system could grow without rewrites.',
      'Used file handling and object persistence to keep state between runs.',
    ],
    tags: ['Java', 'OOP', 'MVC', 'File I/O'],
    repo: `${GH}/hotel-management-system`,
  },

  {
    slug: 'stock-market-prediction',
    name: 'Stock Market Prediction',
    domain: 'Time Series & Forecasting',
    period: 'Feb 2023 – May 2023',
    problem: 'Can three different models agree on where a stock is heading?',
    detail: [
      'Forecast Tesla stock movement using two years of historical price data.',
      'Implemented and compared Support Vector Regression, Linear Regression and Random Forest on the same dataset.',
      'Comparing three models on one problem taught me more than any single model would have — they disagree in informative ways.',
    ],
    tags: ['Python', 'Time Series', 'SVR', 'Random Forest', 'Linear Regression'],
    repo: `${GH}/stock-market-prediction`,
  },

  {
    slug: 'os-task-scheduler',
    name: 'Priority-Based Task Scheduler',
    domain: 'Theory of Computation',
    period: 'Semester 4 · 2023',
    problem: 'Model OS process scheduling as a formal machine, not just a queue.',
    detail: [
      'A priority-based process scheduling engine built on Turing Machine concepts from Theory of Computation.',
      'Modelled scheduling states and transitions formally, then implemented the resulting behaviour.',
      'The theory made the implementation shorter — once the state transitions were right, the code followed.',
    ],
    tags: ['Theory of Computation', 'Scheduling Algorithms', 'Operating Systems'],
    repo: `${GH}/os-task-scheduler`,
  },

  {
    slug: 'socket-communication-simulation',
    name: 'Socket Communication & Network Simulation',
    domain: 'Computer Networks',
    period: 'Aug 2023 – Dec 2023',
    problem: 'What actually happens on the wire between a client and a server?',
    detail: [
      'Wrote socket-based client-server programs in C for both TCP and UDP communication.',
      'Captured and analysed real packet transfer with Wireshark on Linux to see the protocol behaviour directly.',
      'Measured latency, throughput and packet loss under load — the difference between TCP and UDP stops being abstract once you watch the retransmissions.',
    ],
    tags: ['C', 'Linux', 'Wireshark', 'TCP/IP', 'Socket Programming'],
    repo: `${GH}/socket-communication-simulation`,
  },

  {
    slug: 'personalized-health-fitness',
    name: 'Personalized Health & Fitness',
    domain: 'Full-Stack Web',
    period: 'Nov 2023 – Jan 2024',
    problem: 'Turn a person\u2019s own health metrics into a fitness plan that fits them.',
    detail: [
      'Full-stack web application that builds fitness plans around user-specific health metrics.',
      'React.js and AngularJS on the front end, PHP on the back end, EmailJS for notifications.',
      'My first project with a real front-end/back-end split, which is where I learned why state management matters.',
    ],
    tags: ['React.js', 'AngularJS', 'PHP', 'EmailJS', 'Full-Stack'],
    repo: `${GH}/personalized-health-fitness`,
  },

  {
    slug: 'server-health-monitoring',
    name: 'Server Health Monitoring System',
    domain: 'Networking & Security',
    period: 'Jan 2024 – May 2024',
    problem: 'How does a web server behave when you deliberately try to break it?',
    detail: [
      'Simulated DoS and DDoS conditions against Apache and Nginx to test fault tolerance and load balancing.',
      'Designed and analysed network topologies in Cisco Packet Tracer and GNS3 to trace packet routing and data flow.',
      'Wrote Python scripts that monitored CPU usage and network latency in real time and visualised them while the load was running.',
      'The interesting part was watching where each server degraded first — the failure mode differed between Apache and Nginx.',
    ],
    tags: ['Python', 'Linux', 'Apache', 'Nginx', 'Cisco Packet Tracer', 'GNS3'],
    repo: `${GH}/server-health-monitoring`,
    featured: true,
  },

  {
    slug: 'disease-prediction',
    name: 'Disease Prediction',
    domain: 'Machine Learning',
    period: 'Aug 2024 – Dec 2024',
    problem: 'Support earlier diagnosis without drowning a clinician in false positives.',
    detail: [
      'Machine learning models for early disease detection from patient data.',
      'Built the full pipeline — data preprocessing, model training and evaluation — with Pandas and Scikit-learn.',
      'Optimised for precision and recall rather than raw accuracy, because in diagnosis a false negative and a false positive are not the same mistake.',
    ],
    tags: ['Python', 'Pandas', 'Scikit-learn', 'SQL', 'Machine Learning'],
    repo: `${GH}/disease-prediction`,
    featured: true,
  },

  {
    // TODO: this one came from your original brief, not from any of the four
    // resumes. Confirm it exists and fix the date, or delete this object.
    slug: 'touch-me-not-prolog',
    name: '"Touch Me Not" for Babies',
    domain: 'Artificial Intelligence',
    period: 'TODO: add dates',
    problem: 'Can a rule-based system reason about what is safe for an infant to touch?',
    detail: [
      'A Prolog expert system that classifies household objects as safe or unsafe for infants.',
      'Encoded the reasoning as facts and rules — electrical plugs and knives unsafe, age-appropriate soft toys safe.',
      'Writing the rules forced me to make the logic explicit in a way an if-else chain never would have.',
    ],
    tags: ['Prolog', 'Expert Systems', 'Artificial Intelligence'],
    repo: `${GH}/touch-me-not-prolog`,
  },
];

// Repo names to create on GitHub, so the links above resolve:
//
//   battleship-game-c
//   racers-edge
//   farmer-irrigation-analysis
//   hotel-management-system
//   stock-market-prediction
//   os-task-scheduler
//   socket-communication-simulation
//   personalized-health-fitness
//   server-health-monitoring
//   disease-prediction
//   touch-me-not-prolog
//
// Give each one a README before you launch. An empty repo behind a portfolio
// link is worse than no link — it tells a recruiter the work isn't real.
// Two paragraphs and a "how to run this" section is enough.
