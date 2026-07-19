export type Experience = {
  company: string;
  role: string;
  location: string;
  start: string;
  end: string;
  current?: boolean;
  summary: string;
  metrics: string[];
  bullets: string[];
  tech: string[];
};

export const experience: Experience[] = [
  {
    company: 'Cortex AI',
    role: 'Founding Engineer',
    location: 'Singapore',
    start: 'Jan 2026',
    end: 'Present',
    current: true,
    summary:
      'Building the capture, planning, and data infrastructure behind large-scale human-motion datasets.',
    metrics: ['1.5 months unblocked', '20 min → <2 min sync', '50+ operators'],
    bullets: [
      'Diagnosed and resolved a client-blocking pose jitter regression within three hours, re-stabilizing forward-kinematics reconstruction with raw-derivative 1-Euro filtering, inter-MCP distance constraints, and Jakobsen relaxation.',
      'Replaced three weeks of manual hierarchical planning with a sub-minute annotation allocation workflow across a four-level Environment → Scene → Task → Operator hierarchy.',
      'Built a cross-platform mobile capture app in under a week, integrating native Swift/ARKit and Kotlin/CameraX/ARCore modules behind one Dart interface with resumable GCS uploads.',
      'Designed a VLM-based temporal alignment algorithm for three unsynchronized cameras, cutting session sync time by 90% with consensus voting, transition detection, and a cross-correlation fallback.',
      'Architected the clock-authority layer for a Vive Tracker and ZED Box capture stack on Jetson Orin, eliminating drift across video, tracker poses, and IMU samples for 50+ operators and 1,000+ hours of data.',
      'Engineered browser-side GCS resumable uploads with retry, duplicate detection, and offset recovery, eliminating daily failures across 3–4K-file batches in low-connectivity regions.',
    ],
    tech: [
      'Python',
      'FastAPI',
      'Flutter',
      'Swift',
      'Kotlin',
      'ARKit',
      'ARCore',
      'GCP',
      'PySide6',
      'Jetson Orin',
    ],
  },
  {
    company: 'The Tudor Group',
    role: 'Software Engineer Intern',
    location: 'Singapore',
    start: 'May 2025',
    end: 'Aug 2025',
    summary:
      'Shipped real-time reliability tooling for Site Reliability and global TradeOps teams.',
    metrics: ['4 services', '99% less Grafana toil', '95% faster retrieval'],
    bullets: [
      'Architected and shipped a horizontally scalable alerting platform using four Spring Boot microservices, ActiveMQ, Redis, and WebSockets, delivering sub-second updates across high-volume Grafana streams.',
      'Reduced Grafana infrastructure management time by 99%—from ten hours to five minutes—with an Ansible and Python automation framework spanning dev, staging, and production.',
      'Cut FIX log extraction time by 95%—from 60 seconds to three—and eliminated legacy licensing costs with a React and Spring Boot viewer adopted by 50+ TradeOps users.',
    ],
    tech: ['Spring Boot', 'ActiveMQ', 'Redis', 'React', 'TypeScript', 'Ansible', 'Grafana'],
  },
  {
    company: 'Upside Robotics',
    role: 'Software Engineer Intern',
    location: 'Waterloo',
    start: 'Aug 2024',
    end: 'Mar 2025',
    summary:
      'Built telemetry infrastructure and field tooling for production autonomous robot fleets.',
    metrics: ['5M+ records / run', '30% fewer diagnostics', '40% more reliable data'],
    bullets: [
      'Architected and deployed a serverless event-driven telemetry pipeline with Lambda, S3, and DynamoDB, validating and processing 5M+ sensor records per run.',
      'Reduced manual field diagnostics by 30% with a Next.js, TypeScript, and Mapbox operations dashboard for live telemetry and geospatial tracking.',
      'Improved field data reliability by 40% over intermittent LTE by designing batching and offline caching with hardware engineers.',
    ],
    tech: ['AWS Lambda', 'S3', 'DynamoDB', 'Next.js', 'TypeScript', 'Mapbox'],
  },
  {
    company: 'CUCU Covers',
    role: 'Software Developer Intern',
    location: 'Toronto',
    start: 'Jan 2024',
    end: 'Aug 2024',
    summary:
      'Automated analytics, order operations, and incident-prone data workflows for an e-commerce team.',
    metrics: ['40% faster decisions', '2× throughput', '55% fewer incidents'],
    bullets: [
      'Built a Slack analytics bot aggregating Shopify, Instagram, TikTok, and Sendlane data into MongoDB, automating KPI reports with Python and Flask.',
      'Converted manual order parsing and image cleaning into an automated Python pipeline with CI/CD on Vercel, more than doubling throughput.',
      'Reduced production incidents by 55% by fixing schema mismatches, API failures, and timestamp processing errors while enabling two new product lines.',
    ],
    tech: ['Python', 'Flask', 'MongoDB', 'Slack API', 'Vercel', 'CI/CD'],
  },
  {
    company: 'Accenture',
    role: 'Quality Engineering Intern',
    location: 'Singapore',
    start: 'May 2023',
    end: 'Aug 2023',
    summary:
      'Improved regression coverage and defect resolution inside a 300-member global QA programme.',
    metrics: ['60+ tests automated', '40% less manual QA', '30% faster resolution'],
    bullets: [
      'Logged and tracked 100+ SAP defects in JIRA while executing regression testing in a 300-member global QA team.',
      'Automated 60+ end-to-end test cases with Tricentis Tosca, expanding coverage and reducing manual effort by 40%.',
      'Worked across development and support teams to prioritise defects and define test plans, accelerating average resolution time by 30%.',
    ],
    tech: ['Tricentis Tosca', 'JIRA', 'SAP'],
  },
];
