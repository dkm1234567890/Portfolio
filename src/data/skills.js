// Skills, grouped, with an honest tier on each.
//
// No percentages. "Python 92%" invites an interviewer to find the 8%, and
// it means nothing anyway. These three tiers are defensible:
//
//   core     - used in two or more projects, could be dropped into it today
//   working  - used in one project, would need a day to warm up
//   learning - reading about it, not yet shipped with it
//
// Every `core` entry below is backed by an actual project in projects.js.
// If you promote something to `core`, be ready to talk about where you used it.

export const skills = [
  {
    group: 'Languages',
    items: [
      { name: 'Python', tier: 'core' },      // server monitoring, disease prediction, stock
      { name: 'C', tier: 'core' },           // battleship, socket programming
      { name: 'SQL', tier: 'core' },         // irrigation, disease prediction
      { name: 'Java', tier: 'working' },     // hotel management
      { name: 'PHP', tier: 'working' },      // irrigation, health & fitness
      { name: 'JavaScript', tier: 'working' },
      { name: 'C++', tier: 'working' },
      { name: 'Prolog', tier: 'working' },
      { name: 'Bash', tier: 'working' },
    ],
  },
  {
    group: 'Web',
    items: [
      { name: 'HTML', tier: 'core' },
      { name: 'CSS', tier: 'core' },
      { name: 'React.js', tier: 'working' },
      { name: 'AngularJS', tier: 'working' },
    ],
  },
  {
    group: 'Networking',
    items: [
      { name: 'TCP/IP', tier: 'core' },
      { name: 'Socket Programming', tier: 'core' },
      { name: 'OSI Model', tier: 'core' },
      { name: 'Routing & Bridging', tier: 'working' },
      { name: 'L2/L3 Protocols', tier: 'working' },
    ],
  },
  {
    group: 'Systems',
    items: [
      { name: 'Linux', tier: 'core' },
      { name: 'Apache', tier: 'working' },
      { name: 'Nginx', tier: 'working' },
      { name: 'Multithreading', tier: 'working' },
      // TODO: your resume lists "Linux Kernel", "Embedded Systems",
      // "Real-Time Systems" and "Cloud (AWS/Azure)". None of your eleven
      // projects touch any of them. Either add a project that does, or leave
      // them off — an interviewer WILL ask "tell me about your kernel work",
      // and having nothing to point at costs you more than the line gained.
    ],
  },
  {
    group: 'Data & ML',
    items: [
      { name: 'Pandas', tier: 'core' },
      { name: 'Scikit-learn', tier: 'core' },
      { name: 'MySQL', tier: 'core' },
      { name: 'Oracle SQL', tier: 'working' },
      { name: 'Time-Series Forecasting', tier: 'working' },
    ],
  },
  {
    group: 'Tools',
    items: [
      { name: 'Wireshark', tier: 'core' },
      { name: 'Cisco Packet Tracer', tier: 'core' },
      { name: 'GNS3', tier: 'core' },
      { name: 'Git & GitHub', tier: 'core' },
      { name: 'VS Code', tier: 'core' },
      { name: 'Jupyter', tier: 'working' },
    ],
  },
  {
    group: 'Concepts',
    items: [
      { name: 'Data Structures & Algorithms', tier: 'core' },
      { name: 'Operating Systems', tier: 'core' },
      { name: 'Computer Networks', tier: 'core' },
      { name: 'DBMS', tier: 'core' },
      { name: 'OOP & MVC', tier: 'working' },
      { name: 'Theory of Computation', tier: 'working' },
    ],
  },
];

// How the tiers render, so the visitor knows what they mean. Put this in the
// UI as a small legend next to the tag groups in Task 7.
export const tierLabels = {
  core: 'Used across projects',
  working: 'Used in a project',
  learning: 'Currently learning',
};
