import { JobPosting } from '../types/matching';

export const SEED_JOBS: JobPosting[] = [
  {
    id: 'seed-job-1',
    title: 'Backend Engineer — Node.js',
    location: 'Remote (US)',
    companyName: 'TalentConnect Core Systems',
    description: "We're looking for a backend engineer to own our core service layer. You'll design and maintain the APIs that power our mobile and web clients, work closely with the data team on schema design, and help us scale from 50K to 500K users.",
    requirements: '3+ years building production backend services. Strong with Node.js or a similar server-side runtime. Experience with relational databases (Postgres preferred) and API design (REST or GraphQL). Comfortable owning a service end-to-end, from design through on-call.',
    status: 'open',
    employerId: 'mock-user-123',
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-job-2',
    title: 'Frontend Engineer — React',
    location: 'New York, NY (Hybrid)',
    companyName: 'FinPulse Technologies',
    description: "Join our product team to build the customer-facing interfaces for our fintech platform. You'll work with design to ship pixel-perfect, accessible UI, and collaborate with backend engineers to define clean API contracts.",
    requirements: '2+ years with React or a comparable component-based framework. Solid CSS/layout skills. Experience with state management (Redux, Zustand, or similar) and TypeScript. Bonus: experience in regulated industries (finance, healthcare).',
    status: 'open',
    employerId: 'mock-user-123',
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-job-3',
    title: 'Data Scientist — ML/NLP',
    location: 'Remote (Global)',
    companyName: 'Nexus AI Labs',
    description: "You'll build and deploy models that power our recommendation and search systems, including NLP models for semantic text matching — similar in spirit to this project.",
    requirements: 'MS or equivalent experience in ML/statistics. Python, with hands-on experience in PyTorch or TensorFlow. Experience with embeddings, vector search, or transformer-based NLP models. Ability to communicate model behavior to non-technical stakeholders.',
    status: 'open',
    employerId: 'mock-user-123',
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-job-4',
    title: 'DevOps / Platform Engineer',
    location: 'Austin, TX (Hybrid)',
    companyName: 'CloudScale Infrastructure',
    description: "Own our CI/CD pipelines and cloud infrastructure. You'll be the person who makes deploys boring — fast, safe, and reversible.",
    requirements: 'Experience with AWS or GCP. Infrastructure as code (Terraform preferred). Kubernetes or container orchestration experience. Scripting in Python or Bash.',
    status: 'open',
    employerId: 'mock-user-123',
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-job-5',
    title: 'Product Designer',
    location: 'San Francisco, CA (On-site)',
    companyName: 'Crafted Studio',
    description: "Design end-to-end product experiences for our hiring platform, from early concept sketches through high-fidelity prototypes and handoff.",
    requirements: '3+ years of product design experience. Strong portfolio showing end-to-end process. Figma fluency. Experience conducting or synthesizing user research.',
    status: 'open',
    employerId: 'mock-user-123',
    createdAt: new Date().toISOString()
  }
];

export interface SampleResume {
  id: string;
  name: string;
  roleTitle: string;
  expectedFit: string;
  text: string;
}

export const SAMPLE_RESUMES: SampleResume[] = [
  {
    id: 'resume-a',
    name: 'Alex Rivers (Resume A)',
    roleTitle: 'Senior Systems & Backend Specialist',
    expectedFit: 'Ranks High on Backend Engineer (Node.js), Low on Product Designer',
    text: `Software engineer with 4 years of experience building and operating server-side systems for a logistics startup. Designed and shipped internal and external REST APIs handling 2M+ requests/day. Migrated a monolithic service into smaller services backed by PostgreSQL. Led on-call rotation and reduced incident response time by 40%. Comfortable across the stack but spend most of my time in Node.js and Express. Some exposure to React for internal tooling.`
  },
  {
    id: 'resume-b',
    name: 'Dana Kim (Resume B)',
    roleTitle: 'Applied Machine Learning Engineer',
    expectedFit: 'Ranks High on Data Scientist (ML/NLP), Moderate on Backend Engineer',
    text: `Applied ML engineer, 3 years post-grad. Built a search relevance model using sentence embeddings and cosine similarity to improve internal document retrieval by 25%. Fine-tuned transformer models for text classification in PyTorch. Comfortable writing production Python and have shipped models behind a Flask API for internal consumers. Presented model tradeoffs to non-technical product stakeholders monthly.`
  },
  {
    id: 'resume-c',
    name: 'Jordan Lee (Resume C)',
    roleTitle: 'Lead Product & UI/UX Designer',
    expectedFit: 'Ranks High on Product Designer, Low on Backend / DevOps',
    text: `Product designer with 4 years of experience crafting user-centric SaaS interfaces and mobile workflows. Led end-to-end design systems and conducted over 40 user research interviews to synthesize actionable product requirements. Expert in Figma component architecture, interactive prototypes, and cross-functional handoff with engineering. Passionate about accessibility, usability, and iterative design.`
  }
];

export interface SeedCandidateApplication {
  candidateId: string;
  candidateName: string;
  resumeText: string;
  appliedAt: string;
}

export const SEED_CANDIDATE_APPLICATIONS: SeedCandidateApplication[] = [
  {
    candidateId: 'cand-alex-1',
    candidateName: 'Alex Rivers',
    resumeText: SAMPLE_RESUMES[0].text,
    appliedAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
  },
  {
    candidateId: 'cand-dana-2',
    candidateName: 'Dana Kim',
    resumeText: SAMPLE_RESUMES[1].text,
    appliedAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    candidateId: 'cand-jordan-3',
    candidateName: 'Jordan Lee',
    resumeText: SAMPLE_RESUMES[2].text,
    appliedAt: new Date(Date.now() - 3600000 * 12).toISOString()
  }
];

/**
 * Initializes localStorage with seed jobs if not already present,
 * or overwrites if force is true.
 */
export function initializeSeedData(force = false): void {
  const existingJobs = localStorage.getItem('mock_jobs');
  if (!existingJobs || force) {
    localStorage.setItem('mock_jobs', JSON.stringify(SEED_JOBS));
  }
}
