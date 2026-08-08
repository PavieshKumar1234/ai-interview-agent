interface QuestionCardProps {
  question: string;
  questionIndex: number;
  totalQuestions: number;
}

export function QuestionCard({
  question,
  questionIndex,
  totalQuestions,
}: QuestionCardProps) {
  return (
    <div className="interview-question-card">
      <div className="interview-question-progress">
        Question {questionIndex + 1} of {totalQuestions}
      </div>

      <h2>{question}</h2>
    </div>
  );
}