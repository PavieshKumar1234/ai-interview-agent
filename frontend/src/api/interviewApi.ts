
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/interview";
const RESULT_API_URL = "http://127.0.0.1:8000/api/result";

export interface Candidate {
  member: {
    id: string;
    name: string;
    jobRole: string;
    yearsExperience: number;
    education: string;
    status: string;
  };
  missions: unknown[];
  signals: Record<string, unknown>;
}

export interface InterviewRequest {
  sessionId: string;
  candidate?: Candidate;
  message?: string;
  questionIndex?: number;
}

export interface Feedback {
  summary: string;
  strengths: string[];
  gaps: string[];
  next: string[];
}

export interface InterviewResponse {
  reply: string;
  done: boolean;
  questionIndex: number;
  totalQuestions: number;
  score?: number | null;
  feedback?: Feedback | null;
}

export interface FinalResult {
  total_questions: number;
  answered_questions: number;
  total_score: number;
  maximum_score: number;
  percentage: number;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  summary: string;
}

export async function startInterview(
  data: InterviewRequest
): Promise<InterviewResponse> {
  const response = await axios.post<InterviewResponse>(
    API_URL,
    {
      ...data,
      questionIndex: 0,
    }
  );

  return response.data;
}

export async function submitAnswer(
  data: InterviewRequest
): Promise<InterviewResponse> {
  const response = await axios.post<InterviewResponse>(
    API_URL,
    data
  );

  return response.data;
}

export async function getFinalResult(
  sessionId: string
): Promise<FinalResult> {
  const response = await axios.get<FinalResult>(
    `${RESULT_API_URL}/${sessionId}`
  );

  return response.data;
}
