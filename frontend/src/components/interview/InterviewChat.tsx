import { useState } from "react";
import {
  submitAnswer,
  type InterviewResponse,
} from "../../api/interviewApi";

interface InterviewChatProps {
  sessionId: string;
  question: string;
  questionIndex: number;
  totalQuestions: number;
  onResponse: (response: InterviewResponse) => void;
}

export function InterviewChat({
  sessionId,
  question,
  questionIndex,
  totalQuestions,
  onResponse,
}: InterviewChatProps) {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!answer.trim()) return;

    try {
      setLoading(true);
      setError("");

      const response = await submitAnswer({
        sessionId,
        message: answer.trim(),
        questionIndex,
      });

      setAnswer("");
      onResponse(response);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to submit your answer. Please check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Question */}
      <div
        style={{
          padding: "28px 30px",
          marginBottom: "22px",
          borderRadius: "18px",
          background: "#202945",
          border: "1px solid #3b4a6b",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.25)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "18px",
            color: "#9fb0d0",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          <span>
            QUESTION {questionIndex + 1}
          </span>

          <span>
            {totalQuestions > 0
              ? `${questionIndex + 1} / ${totalQuestions}`
              : ""}
          </span>
        </div>

        <h2
          style={{
            margin: 0,
            color: "#ffffff",
            fontSize: "24px",
            lineHeight: 1.5,
            fontWeight: 600,
          }}
        >
          {question}
        </h2>
      </div>

      {/* Answer */}
      <div>
        <label
          style={{
            display: "block",
            marginBottom: "10px",
            color: "#dce5f5",
            fontSize: "15px",
            fontWeight: 600,
          }}
        >
          Your Answer
        </label>

        <textarea
          value={answer}
          onChange={(event) =>
            setAnswer(event.target.value)
          }
          placeholder="Type your answer here..."
          rows={8}
          disabled={loading}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "18px",
            borderRadius: "14px",
            border: "1px solid #435275",
            background: "#182039",
            color: "#ffffff",
            fontSize: "16px",
            lineHeight: 1.6,
            resize: "vertical",
            outline: "none",
          }}
        />

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !answer.trim()}
          style={{
            marginTop: "16px",
            padding: "13px 28px",
            border: "none",
            borderRadius: "10px",
            background:
              loading || !answer.trim()
                ? "#3b4560"
                : "#ffffff",
            color:
              loading || !answer.trim()
                ? "#9aa4b8"
                : "#111827",
            fontSize: "15px",
            fontWeight: 600,
            cursor:
              loading || !answer.trim()
                ? "not-allowed"
                : "pointer",
          }}
        >
          {loading
            ? "Evaluating..."
            : "Submit Answer"}
        </button>

        {error && (
          <div
            style={{
              marginTop: "16px",
              padding: "14px 16px",
              borderRadius: "10px",
              background: "#3b1f2b",
              border: "1px solid #704052",
              color: "#ffb4c5",
            }}
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
}