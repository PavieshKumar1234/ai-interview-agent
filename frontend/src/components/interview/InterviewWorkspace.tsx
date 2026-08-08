import { useState } from "react";
import { startInterview } from "../../api/interviewApi";
import { InterviewChat } from "./InterviewChat";
import { FeedbackCard } from "./FeedbackCard";

interface Candidate {
  member: {
    id: string;
    name: string;
    jobRole: string;
    yearsExperience: number;
    education: string;
    status: string;
  };
  missions: Record<string, unknown>[];
  signals: Record<string, unknown>;
}

interface InterviewResponse {
  reply: string;
  done: boolean;
  questionIndex: number;
  totalQuestions: number;
  score?: number | null;
  feedback?: {
    summary: string;
    strengths: string[];
    gaps: string[];
    next: string[];
  } | null;
}

const candidate: Candidate = {
  member: {
    id: "CAND-001",
    name: "Sarah Johnson",
    jobRole: "Senior Data Engineer",
    yearsExperience: 9,
    education: "MS Computer Science",
    status: "IN_PROGRESS",
  },
  missions: [],
  signals: {},
};

export function InterviewWorkspace() {
  const [sessionId] = useState(
    () => `session-${Date.now()}`
  );

  const [started, setStarted] = useState(false);
  const [question, setQuestion] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] =
    useState<InterviewResponse["feedback"]>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStartInterview = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await startInterview({
        sessionId,
        candidate,
        questionIndex: 0,
      });

      setQuestion(response.reply);
      setQuestionIndex(response.questionIndex);
      setTotalQuestions(response.totalQuestions);
      setDone(response.done);
      setFeedback(response.feedback ?? null);
      setStarted(true);
    } catch (err) {
      console.error(err);
      setError("Unable to start the interview.");
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = (response: InterviewResponse) => {
    setQuestion(response.reply);
    setQuestionIndex(response.questionIndex);
    setTotalQuestions(response.totalQuestions);
    setDone(response.done);
    setScore(response.score ?? null);
    setFeedback(response.feedback ?? null);
  };

  if (!started) {
    return (
      <div className="interview-workspace">
        <div className="interview-start-card">
          <h1>AI Interview</h1>

          <p>
            Start your curriculum-based interview.
          </p>

          <div>
            <strong>Candidate:</strong>{" "}
            {candidate.member.name}
          </div>

          <div>
            <strong>Role:</strong>{" "}
            {candidate.member.jobRole}
          </div>

          <div>
            <strong>Experience:</strong>{" "}
            {candidate.member.yearsExperience} years
          </div>

          <button
            type="button"
            onClick={handleStartInterview}
            disabled={loading}
          >
            {loading
              ? "Starting..."
              : "Start Interview"}
          </button>

          {error && (
            <div className="interview-error">
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="interview-workspace">
      {!done && (
        <InterviewChat
          sessionId={sessionId}
          question={question}
          questionIndex={questionIndex}
          totalQuestions={totalQuestions}
          onResponse={handleResponse}
        />
      )}

      <FeedbackCard
        score={score}
        feedback={feedback}
      />

      {done && (
        <div className="interview-complete-card">
          <h2>Interview Completed</h2>

          <p>
            The candidate has completed the interview.
          </p>

          <FeedbackCard
            score={score}
            feedback={feedback}
          />
        </div>
      )}
    </div>
  );
}