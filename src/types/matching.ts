export interface SubScores {
  skillsOverlap: number;      // 0-100
  experienceLevelFit: number; // 0-100
  domainRelevance: number;    // 0-100
}

export interface MatchEvidence {
  resumePhrase: string;
  jobPhrase: string;
  reasoning: string;
}

export interface MatchResult {
  jobId: string;
  matchScore: number;       // 0-100, weighted composite
  subScores: SubScores;
  matchedEvidence: MatchEvidence[];
  gaps: string[];
  summary: string;
}

export interface CandidateMatchResult extends MatchResult {
  candidateId: string;
  candidateName: string;
}

export interface JobPosting {
  id: string;
  title: string;
  location: string;
  description: string;
  requirements?: string;
  companyName?: string;
  employerId?: string;
  status?: string;
  createdAt?: string;
}
