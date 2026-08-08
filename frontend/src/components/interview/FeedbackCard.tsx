interface Feedback {
  summary: string;
  strengths: string[];
  gaps: string[];
  next: string[];
}

interface FeedbackCardProps {
  score?: number | null;
  feedback?: Feedback | null;
}

export function FeedbackCard({
  score,
  feedback,
}: FeedbackCardProps) {
  if (!feedback && score === null) {
    return null;
  }

  return (
    <div className="interview-feedback-card">
      {score !== null && score !== undefined && (
        <>
          <h3>Evaluation Score</h3>
          <p>{score}/10</p>
        </>
      )}

      {feedback && (
        <>
          <h3>Summary</h3>
          <p>{feedback.summary}</p>

          <h3>Strengths</h3>
          {feedback.strengths.length > 0 ? (
            <ul>
              {feedback.strengths.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>No strengths recorded yet.</p>
          )}

          <h3>Gaps</h3>
          {feedback.gaps.length > 0 ? (
            <ul>
              {feedback.gaps.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>No gaps recorded yet.</p>
          )}

          <h3>Next Steps</h3>
          {feedback.next.length > 0 ? (
            <ul>
              {feedback.next.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>No next steps yet.</p>
          )}
        </>
      )}
    </div>
  );
}