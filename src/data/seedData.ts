import { JobPosting } from '../types/matching';

export const SEED_JOBS: JobPosting[] = [
  {
    id: 'seed-job-1',
    title: 'Senior Backend Engineer — Node.js & Distributed Systems',
    location: 'Remote (US)',
    companyName: 'TalentConnect Core Systems',
    description: "We are seeking a Senior Backend Engineer to architect, build, and scale our core service tier handling high-throughput semantic matching requests. You will design resilient distributed microservices, maintain clean REST and GraphQL contracts, optimize PostgreSQL query performance, and lead reliability engineering for 500,000+ active users.",
    requirements: '4+ years of production experience designing and deploying scalable server-side systems. Strong proficiency with Node.js / TypeScript. Deep expertise in PostgreSQL, Redis caching, schema migrations, and event-driven architectures. Experience with containerized environments (Docker, Kubernetes) and CI/CD pipelines.',
    status: 'open',
    employerId: 'mock-user-123',
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-job-2',
    title: 'Senior Frontend Engineer — React & Next.js',
    location: 'New York, NY (Hybrid)',
    companyName: 'FinPulse Technologies',
    description: "Join our core UI engineering group to build high-performance, accessible, and responsive user experiences for our next-generation financial platform. You will collaborate directly with design systems leads, write type-safe React/TypeScript components, implement real-time data visualization feeds, and optimize web vitals.",
    requirements: '3+ years of professional web application engineering with React, Next.js, and TypeScript. Mastery of modern CSS, Tailwind CSS, component modularity, and Web Accessibility (WCAG 2.1). Experience managing client-side state (Zustand, TanStack Query, Redux) and integrating with backend REST/GraphQL endpoints.',
    status: 'open',
    employerId: 'mock-user-123',
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-job-3',
    title: 'Lead Machine Learning & NLP Scientist',
    location: 'San Francisco, CA (Hybrid)',
    companyName: 'Nexus AI Labs',
    description: "Lead the development of semantic embedding pipelines, vector search retrieval, and LLM fine-tuning for candidate-job compatibility scoring. You will build and evaluate dense retrieval models, design multi-task evaluation benchmarks, optimize inference latency, and ship production ML services.",
    requirements: 'MS or PhD in Computer Science, Machine Learning, or Computational Linguistics. 3+ years hands-on production experience in PyTorch or TensorFlow, Hugging Face Transformers, sentence embeddings, and vector databases (Pinecone, Milvus, Qdrant). Strong Python software engineering skills and experience deploying models behind containerized APIs.',
    status: 'open',
    employerId: 'mock-user-123',
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-job-4',
    title: 'Principal DevOps & Cloud Infrastructure Architect',
    location: 'Austin, TX (Hybrid)',
    companyName: 'CloudScale Infrastructure',
    description: "Lead the architecture and operation of our multi-region AWS cloud infrastructure. You will define and manage Infrastructure-as-Code via Terraform, maintain our production Kubernetes clusters, harden network security perimeters, and engineer automated zero-downtime deployment pipelines.",
    requirements: '5+ years managing high-availability cloud platforms on AWS or GCP. Expert proficiency with Terraform, Kubernetes (EKS/GKE), Docker, and Helm. Strong background in observability with Prometheus, Grafana, and Datadog. Deep comfort with Linux internals, networking protocols, and Python/Bash scripting.',
    status: 'open',
    employerId: 'mock-user-123',
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-job-5',
    title: 'Lead Product Designer — Design Systems',
    location: 'San Francisco, CA (On-site)',
    companyName: 'Crafted Studio',
    description: "Drive end-to-end product design across our enterprise talent intelligence platform. You will formulate product design strategy, maintain and evolve our cross-platform design token system in Figma, conduct user discovery interviews with hiring managers and candidates, and partner closely with engineers to ensure pixel-perfect delivery.",
    requirements: '4+ years of product design experience designing complex B2B SaaS workflows or consumer web products. Advanced mastery of Figma component architecture, auto-layout, interactive prototyping, and design tokens. Proven track record conducting generative and evaluative user research with measurable product impact.',
    status: 'open',
    employerId: 'mock-user-123',
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-job-6',
    title: 'Staff Site Reliability Engineer (SRE)',
    location: 'Seattle, WA (Hybrid)',
    companyName: 'Datadog Platforms',
    description: "As a Staff SRE, you will champion platform availability, disaster recovery, and latency optimization across distributed microservices. You will build automated remediation tooling, conduct chaotic resilience testing, define SLOs/SLIs, and lead high-severity incident management and post-mortems.",
    requirements: '5+ years in SRE or Systems Engineering supporting large-scale distributed cloud systems. Strong programming skills in Go or Python. Production experience with distributed tracing, latency profiling, and service meshes (Istio/Envoy). Demonstrated leadership in incident response and post-incident reviews.',
    status: 'open',
    employerId: 'mock-user-123',
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-job-7',
    title: 'Senior Full Stack Engineer — TypeScript & Microservices',
    location: 'Remote (US)',
    companyName: 'Stripe Payments',
    description: "Build mission-critical checkout workflows and merchant dashboards. You will work across both client-side React codebases and backend TypeScript microservices, ensuring transactions execute reliably with sub-second response times and robust idempotency guarantees.",
    requirements: '4+ years of full stack software engineering experience with TypeScript, React, and Node.js. Strong knowledge of relational database modeling, transactions, and event streaming (Kafka/RabbitMQ). Experience building developer-facing APIs with rigorous backwards-compatibility and security controls.',
    status: 'open',
    employerId: 'mock-user-123',
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-job-8',
    title: 'Senior Cybersecurity & AppSec Architect',
    location: 'Austin, TX (Remote US)',
    companyName: 'Cloudflare Security',
    description: "Own application security architecture, vulnerability management, and threat modeling across our global services. You will conduct secure code reviews, build automated SAST/DAST pipeline integrations, manage penetration testing engagements, and enforce Zero Trust access controls.",
    requirements: '4+ years focused on application security, cryptography, or security engineering. Familiarity with OWASP Top 10, OAuth2, OpenID Connect, and TLS 1.3. Practical experience with security auditing tools and cloud security compliance (SOC 2, ISO 27001). Strong scripting skills in Python or Go.',
    status: 'open',
    employerId: 'mock-user-123',
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-job-9',
    title: 'Distributed Data Platform Engineer — Apache Kafka & Spark',
    location: 'San Jose, CA (Hybrid)',
    companyName: 'Snowflake Analytics',
    description: "Design and maintain streaming and batch data processing pipelines powering real-time analytics and predictive ML features. You will manage large-scale data ingestion using Apache Kafka, write Spark transformations, and optimize analytical queries in modern data lakes.",
    requirements: '3+ years of data engineering experience with Apache Kafka, Spark, and SQL. Proficiency in Python, Scala, or Java. Experience designing data warehousing schemas (Snowflake, BigQuery, ClickHouse) and data quality verification pipelines (dbt, Great Expectations).',
    status: 'open',
    employerId: 'mock-user-123',
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-job-10',
    title: 'Senior Mobile Engineer — iOS & React Native',
    location: 'Chicago, IL (Hybrid)',
    companyName: 'Uber Technologies',
    description: "Architect and deliver mobile applications used by millions of users daily. You will build fluid native and cross-platform UI workflows, optimize offline caching and background synchronization, and maintain high crash-free session rates across diverse mobile devices.",
    requirements: '3+ years building mobile applications in React Native, Swift (iOS), or Kotlin (Android). Deep understanding of mobile performance profiling, memory management, and mobile CI/CD (Fastlane). Experience shipping consumer apps to the Apple App Store and Google Play Store.',
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
    expectedFit: 'Ranks High on Backend Engineer (Node.js) and Full Stack, Moderate on DevOps',
    text: `Software engineer with 4+ years of experience building and operating server-side systems for a logistics startup. Designed and shipped internal and external REST APIs handling 2M+ requests/day. Migrated a monolithic service into smaller services backed by PostgreSQL and Redis. Led on-call rotation and reduced incident response time by 40%. Comfortable across the stack with Node.js, Express, TypeScript, and Docker. Implemented automated CI/CD pipelines with GitHub Actions.`
  },
  {
    id: 'resume-b',
    name: 'Dana Kim (Resume B)',
    roleTitle: 'Applied Machine Learning & NLP Engineer',
    expectedFit: 'Ranks High on Lead ML/NLP Scientist, Moderate on Backend Engineer',
    text: `Applied ML engineer, 3 years post-grad. Built a search relevance model using sentence embeddings and cosine similarity to improve internal document retrieval by 25%. Fine-tuned transformer models for text classification in PyTorch and Hugging Face. Comfortable writing production Python and have shipped models behind containerized FastAPI services. Implemented vector search indexes using Qdrant. Presented model tradeoffs to non-technical product stakeholders monthly.`
  },
  {
    id: 'resume-c',
    name: 'Jordan Lee (Resume C)',
    roleTitle: 'Lead Product & UI/UX Designer',
    expectedFit: 'Ranks High on Product Designer, Low on Backend / DevOps',
    text: `Lead product designer with 4 years of experience crafting user-centric SaaS interfaces and mobile workflows. Led end-to-end design systems and conducted over 40 user research interviews to synthesize actionable product requirements. Expert in Figma component architecture, interactive prototypes, design tokens, and cross-functional handoff with engineering. Passionate about accessibility (WCAG 2.1), usability heuristics, and iterative design.`
  },
  {
    id: 'resume-d',
    name: 'Marcus Chen (Resume D)',
    roleTitle: 'Cloud Infrastructure & SRE Specialist',
    expectedFit: 'Ranks High on DevOps Architect & SRE, Moderate on Backend Engineer',
    text: `Infrastructure and Site Reliability Engineer with 5 years managing AWS environments, Kubernetes clusters (EKS), and multi-region networking. Automated complete cloud provisioning using Terraform and Helm charts. Built comprehensive monitoring dashboards in Prometheus and Datadog, decreasing mean-time-to-detection (MTTD) by 50%. Led chaos engineering experiments and disaster recovery drills across distributed microservices.`
  },
  {
    id: 'resume-e',
    name: 'Priya Sharma (Resume E)',
    roleTitle: 'Senior Full Stack & TypeScript Platform Engineer',
    expectedFit: 'Ranks High on Full Stack Engineer & Frontend Engineer, Moderate on Backend',
    text: `Full stack software engineer with 4 years of experience building web applications using React, Next.js, Node.js, and TypeScript. Designed GraphQL schemas and RESTful microservices backed by PostgreSQL and Prisma ORM. Implemented responsive, accessible client interfaces with Tailwind CSS and Zustand. Shipped end-to-end checkout features with idempotent webhook handling and automated Playwright test suites.`
  },
  {
    id: 'resume-f',
    name: 'Elena Rostova (Resume F)',
    roleTitle: 'Senior Cybersecurity & AppSec Architect',
    expectedFit: 'Ranks High on Cybersecurity Architect, Moderate on SRE / DevOps',
    text: `Application security specialist with 4+ years executing threat modeling, secure code reviews, and vulnerability management for high-growth tech firms. Led SOC 2 Type II compliance audit and implemented Zero Trust access controls with OAuth2 and OpenID Connect. Integrated automated SAST/DAST tooling into GitLab CI pipelines and authored Python scripts for automated security compliance auditing.`
  },
  {
    id: 'resume-g',
    name: 'David O\'Connor (Resume G)',
    roleTitle: 'Senior Mobile Systems Engineer',
    expectedFit: 'Ranks High on Mobile Engineer, Moderate on Frontend Engineer',
    text: `Mobile engineer with 4 years designing cross-platform applications in React Native and native iOS (Swift). Built offline-first mobile sync engines using SQLite and WebSockets. Optimized bundle size and JavaScript thread execution, achieving consistent 60 FPS across mid-tier devices. Managed automated app store release pipelines using Fastlane.`
  },
  {
    id: 'resume-h',
    name: 'Maya Patel (Resume H)',
    roleTitle: 'Distributed Data Systems Engineer',
    expectedFit: 'Ranks High on Data Platform Engineer, Moderate on ML / Backend',
    text: `Data engineer with 3+ years architecting streaming and batch ETL pipelines using Apache Kafka, Apache Spark, and Snowflake. Implemented real-time event ingestion handling 10,000 events/sec. Designed data warehouse schemas using dbt and automated data quality checks with Great Expectations. Proficient in Python, SQL, and Docker.`
  }
];

export interface SeedCandidateApplication {
  id?: string;
  jobId: string;
  candidateId: string;
  candidateName: string;
  resumeText: string;
  appliedAt: string;
}

export const SEED_CANDIDATE_APPLICATIONS: SeedCandidateApplication[] = [
  {
    id: 'seed-app-1',
    jobId: 'seed-job-1',
    candidateId: 'cand-alex-1',
    candidateName: 'Alex Rivers',
    resumeText: SAMPLE_RESUMES[0].text,
    appliedAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
  },
  {
    id: 'seed-app-2',
    jobId: 'seed-job-3',
    candidateId: 'cand-dana-2',
    candidateName: 'Dana Kim',
    resumeText: SAMPLE_RESUMES[1].text,
    appliedAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'seed-app-3',
    jobId: 'seed-job-5',
    candidateId: 'cand-jordan-3',
    candidateName: 'Jordan Lee',
    resumeText: SAMPLE_RESUMES[2].text,
    appliedAt: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    id: 'seed-app-4',
    jobId: 'seed-job-4',
    candidateId: 'cand-marcus-4',
    candidateName: 'Marcus Chen',
    resumeText: SAMPLE_RESUMES[3].text,
    appliedAt: new Date(Date.now() - 3600000 * 14).toISOString()
  },
  {
    id: 'seed-app-5',
    jobId: 'seed-job-7',
    candidateId: 'cand-priya-5',
    candidateName: 'Priya Sharma',
    resumeText: SAMPLE_RESUMES[4].text,
    appliedAt: new Date(Date.now() - 3600000 * 10).toISOString()
  },
  {
    id: 'seed-app-6',
    jobId: 'seed-job-8',
    candidateId: 'cand-elena-6',
    candidateName: 'Elena Rostova',
    resumeText: SAMPLE_RESUMES[5].text,
    appliedAt: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    id: 'seed-app-7',
    jobId: 'seed-job-10',
    candidateId: 'cand-david-7',
    candidateName: 'David O\'Connor',
    resumeText: SAMPLE_RESUMES[6].text,
    appliedAt: new Date(Date.now() - 3600000 * 6).toISOString()
  },
  {
    id: 'seed-app-8',
    jobId: 'seed-job-9',
    candidateId: 'cand-maya-8',
    candidateName: 'Maya Patel',
    resumeText: SAMPLE_RESUMES[7].text,
    appliedAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  // Additional cross-applications for rich ranking comparison
  {
    id: 'seed-app-9',
    jobId: 'seed-job-1',
    candidateId: 'cand-priya-5',
    candidateName: 'Priya Sharma',
    resumeText: SAMPLE_RESUMES[4].text,
    appliedAt: new Date(Date.now() - 3600000 * 30).toISOString()
  },
  {
    id: 'seed-app-10',
    jobId: 'seed-job-1',
    candidateId: 'cand-dana-2',
    candidateName: 'Dana Kim',
    resumeText: SAMPLE_RESUMES[1].text,
    appliedAt: new Date(Date.now() - 3600000 * 20).toISOString()
  },
  {
    id: 'seed-app-11',
    jobId: 'seed-job-2',
    candidateId: 'cand-priya-5',
    candidateName: 'Priya Sharma',
    resumeText: SAMPLE_RESUMES[4].text,
    appliedAt: new Date(Date.now() - 3600000 * 16).toISOString()
  },
  {
    id: 'seed-app-12',
    jobId: 'seed-job-6',
    candidateId: 'cand-marcus-4',
    candidateName: 'Marcus Chen',
    resumeText: SAMPLE_RESUMES[3].text,
    appliedAt: new Date(Date.now() - 3600000 * 12).toISOString()
  }
];

/**
 * Initializes localStorage with real seed jobs and applications if not already present,
 * or overwrites if force is true. Associates jobs with currentEmployerId so employers
 * see populated listings immediately.
 */
export function initializeSeedData(force = false, currentEmployerId?: string): void {
  const existingJobs = localStorage.getItem('mock_jobs');
  const empId = currentEmployerId || 'mock-user-123';

  if (!existingJobs || force) {
    const jobsWithEmployer = SEED_JOBS.map((job) => ({
      ...job,
      employerId: empId
    }));
    localStorage.setItem('mock_jobs', JSON.stringify(jobsWithEmployer));
  }

  const existingApps = localStorage.getItem('mock_applications');
  if (!existingApps || force) {
    localStorage.setItem('mock_applications', JSON.stringify(SEED_CANDIDATE_APPLICATIONS));
  }
}
