// Who you are. Everything the header, hero and footer reads from.
//
// Deliberately NOT here: phone number, date of birth, gender, home address.
// Those belong on a PDF you send to a named person, not on a public URL that
// Google will index. Recruiters who want your phone number will email first.

export const profile = {
  name: 'Dodda Krishna Murthy',
  shortName: 'Krishna', // shown as the navbar brand

  // One line, under 12 words, that says what you do. Not an "objective" —
  // objectives talk about what you want; this talks about what you are.
  role: 'Software Engineer',
  tagline: 'Networks, systems and the occasional machine learning model.',

  // The hero paragraph. Two sentences maximum. A recruiter reads this and
  // nothing else if it doesn't earn them.
  intro:
    'Computer Science graduate from Amrita School of Computing, working across ' +
    'networking, Linux systems and applied machine learning. I like problems ' +
    'where I have to understand the layer underneath the one I am working in.',

  location: 'Andhra Pradesh, India',

  email: 'dkmurthy32@gmail.com',

  links: {
    linkedin: 'https://www.linkedin.com/in/d-krishna-murthy-942b63257/',
    github: 'https://github.com/dkm1234567890',
    twitter: '', // leave empty and the icon won't render
  },

  resume: {
    file: 'resume.pdf', // goes in /public
    updated: 'July 2026',
  },
};

export const education = [
  {
    institution: 'Amrita School of Computing',
    qualification: 'B.Tech, Computer Science and Engineering',
    // TODO: 7.2 or 7.3? Your resumes disagree. Pick the true one and use it
    // everywhere — this gets checked during background verification.
    score: 'CGPA 7.2',
    start: '2021',
    end: '2025',
    note: 'Amrita Vishwa Vidyapeetham',
  },
  {
    institution: 'Happy Valley School',
    qualification: 'CBSE Class XII — Science, Mathematics, Computer Science',
    score: '91.2%',
    start: '2019',
    end: '2021',
  },
  {
    institution: 'Happy Valley School',
    qualification: 'CBSE Class X',
    score: '89.2%',
    start: '2016',
    end: '2019',
  },
];
