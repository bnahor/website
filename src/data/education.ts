export type Education = {
  school: string;
  degree: string;
  start: string;
  end: string;
  details?: string[];
};

export const education: Education[] = [
  {
    school: 'National University of Singapore',
    degree:
      'Bachelor of Computing (Hons), Computer Science — Artificial Intelligence & Database Systems',
    start: 'Aug 2021',
    end: 'Jan 2026',
    details: ['NUS Overseas Colleges Toronto–Waterloo, AY 24/25 Semester 2 intake'],
  },
  {
    school: 'University of Toronto · Rotman Commerce',
    degree: 'NOC exchange semesters',
    start: 'Jan 2024',
    end: 'Dec 2024',
  },
  {
    school: 'UWC South East Asia',
    degree: 'IB Diploma, Bilingual',
    start: 'Aug 2017',
    end: 'May 2019',
    details: ['Higher Level: Mathematics, Physics, Chemistry'],
  },
];
