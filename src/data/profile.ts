const publicAsset = (fileName: string) => `${import.meta.env.BASE_URL}${fileName}`;

export const profile = {
  name: 'Rohan Bahl',
  role: 'Founding Engineer',
  company: 'Cortex AI',
  location: 'Singapore',
  valueProp:
    'I’m Rohan, a founding engineer at Cortex AI. Right now I work on motion-data capture: timebases, mobile capture, resumable uploads, and the tools operators use in the field.',
  email: 'bnahor.dev@gmail.com',
  links: {
    github: 'https://github.com/bnahor',
    linkedin: 'https://www.linkedin.com/in/rohan-bahl',
    resume: publicAsset('rohan-bahl-resume.pdf'),
  },
} as const;
