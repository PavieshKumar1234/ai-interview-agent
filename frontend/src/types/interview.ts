export interface CandidateMember {
  id: string;
  name: string;
  jobRole: string;
  yearsExperience: number;
  education: string;
  status: string;
}

export interface Candidate {
  member: CandidateMember;
  missions: Record<string, unknown>[];
  signals: Record<string, unknown>;
}

export interface Feedback {
  summary: string;
  strengths: string[];
  gaps: string[];
  next: string[];
}

export interface InterviewRequest {
  sessionId: string;
  candidate?: Candidate;
  message?: string;
  questionIndex?: number;
}

export interface InterviewResponse {
  reply: string;
  done: boolean;
  feedback?: Feedback;
  questionIndex: number;
  totalQuestions: number;
  score?: number | null;
}