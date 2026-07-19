const publicAsset = (fileName: string) => `${import.meta.env.BASE_URL}${fileName}`;

export const profile = {
  name: 'Rohan Bahl',
  role: 'Founding Engineer',
  company: 'Cortex AI',
  location: 'Singapore',
  valueProp:
    'I build software that stays useful under pressure—from multi-camera robotics capture stacks to the operational systems behind high-stakes teams.',
  email: 'bnahor.dev@gmail.com',
  links: {
    github: 'https://github.com/bnahor',
    linkedin: 'https://www.linkedin.com/in/rohan-bahl',
    resume: publicAsset('rohan-bahl-resume.pdf'),
  },
} as const;
