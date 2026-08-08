import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  startInterview,
  type Feedback,
  type InterviewResponse,
} from "../api/interviewApi";
import { InterviewChat } from "../components/interview/InterviewChat";

export function InterviewPage() {
  const navigate = useNavigate();
  
  const [sessionId] = useState(
    () => `session-${Date.now()}`
  );

  const [question, setQuestion] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [feedback, setFeedback] =
    useState<Feedback | null>(null);

  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const candidate = {
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

  // Trigger the redirect the moment 'done' becomes true
  useEffect(() => {
    if (done) {
      navigate(`/result/${sessionId}`);
    }
  }, [done, navigate, sessionId]);

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

      setQuestionIndex(
        response.questionIndex
      );

      setTotalQuestions(
        response.totalQuestions
      );

      setFeedback(
        response.feedback ?? null
      );

      setDone(response.done);

      setStarted(true);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to connect to the interview server."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = (
    response: InterviewResponse
  ) => {
    setQuestion(response.reply);

    setQuestionIndex(
      response.questionIndex
    );

    setTotalQuestions(
      response.totalQuestions
    );

    setFeedback(
      response.feedback ?? null
    );

    setDone(response.done);
  };

  if (!started) {
    return (
      <main className="center-page">
        <div>
          <h1>AI Interview</h1>

          <p>
            Curriculum-based AI interview system
          </p>

          <div>
            <p>
              <strong>Name:</strong>{" "}
              {candidate.member.name}
            </p>

            <p>
              <strong>Role:</strong>{" "}
              {candidate.member.jobRole}
            </p>

            <p>
              <strong>Experience:</strong>{" "}
              {candidate.member.yearsExperience} years
            </p>

            <p>
              <strong>Education:</strong>{" "}
              {candidate.member.education}
            </p>
          </div>

          <button
            type="button"
            onClick={handleStartInterview}
            disabled={loading}
          >
            {loading
              ? "Starting Interview..."
              : "Start Interview"}
          </button>

          {error && (
            <p>{error}</p>
          )}
        </div>
      </main>
    );
  }

  // If the interview is done, we display a quick loading message 
  // while the useEffect above handles the redirect
  if (done) {
    return (
      <main className="center-page">
        <div>
          <div className="mx-auto size-10 animate-spin rounded-full border-4 border-[#dbe5ef] border-t-[#168f99]" />
          <p className="mt-4 text-sm text-[#587086] text-center">
            Generating your results...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="center-page">
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
        }}
      >
        <InterviewChat
          sessionId={sessionId}
          question={question}
          questionIndex={questionIndex}
          totalQuestions={totalQuestions}
          onResponse={handleResponse}
        />
      </div>
    </main>
  );
}