export type Project = {
  title: string;
  event: string;
  date: string;
  role: string;
  href?: string;
  demoHref?: string;
  description: string;
  impact: string;
  tech: string[];
};

export const projects: Project[] = [
  {
    title: 'StoryForge',
    event: 'Cursor Hackathon 2025',
    date: 'Oct–Nov 2025',
    role: 'ML Engineer · Team Lead',
    description:
      'A 2D AI-powered game engine that generates coherent worlds, narrative, visuals, and dynamic character audio.',
    impact: 'Finalist · Top 4% · 15 of 400 projects',
    tech: ['Google Gemini', 'fal.ai', 'ElevenLabs', 'Python', 'Generative AI'],
  },
  {
    title: 'GUI Murphy',
    event: 'TikTok TechJam 2025',
    date: 'Aug–Sep 2025',
    role: 'ML Engineer · Team Lead',
    href: 'https://github.com/bnahor/techjam-2025-final',
    description:
      'A multi-stage vision pipeline that identifies UI elements and detects visual inconsistencies across mobile interfaces.',
    impact: 'Finalist · Top 4% · 12 of 300 projects',
    tech: ['OmniParser', 'CLIP', 'Multimodal LLMs', 'Python'],
  },
  {
    title: 'Smart Storybook',
    event: 'ETHGlobal SF 2024',
    date: 'Oct 2024',
    role: 'Backend Engineer',
    href: 'https://github.com/imjwang/storybook',
    demoHref: 'https://storybook-three-omega.vercel.app',
    description:
      'A Web3 publishing platform for creator-owned intellectual property, backed by FastAPI and decentralised asset storage.',
    impact: '2nd place · Best AI Application',
    tech: ['FastAPI', 'Pinata', 'IPFS', 'Python', 'Web3'],
  },
  {
    title: 'sentiment.',
    event: 'GenAI Genesis 2024',
    date: 'Mar 2024',
    role: 'Full-stack Engineer',
    href: 'https://github.com/bnahor/GenAI',
    description:
      'A full-stack application for analysing sentiment in written text and voice notes.',
    impact: 'Text and voice analysis in one workflow',
    tech: ['React', 'Flask', 'OpenAI API', 'Python', 'TypeScript'],
  },
];
