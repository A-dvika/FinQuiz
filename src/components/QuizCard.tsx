import { Button, Card, CardBody } from "@nextui-org/react";
import { useEffect, useState } from "react";
import './q.css'
type QuizCardProps = {
  id: number;
  question: string;
  options: string[];
  correct_answer: number;
  checkAnswer: (id: number, answer: number) => void;
};

export default function QuizCard({
  id,
  question,
  options,
  correct_answer,
  checkAnswer,
}: QuizCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleAnswerClick = (answerIndex: number) => {
    checkAnswer(id, answerIndex);
    setSelectedAnswer(answerIndex);
  };

  useEffect(() => {
    setSelectedAnswer(null); // Reset the state when the id prop changes
  }, [id]);
  return (
    <Card className="w-full max-w-2xl quiz-card">
      <CardBody className="p-10">
        <p className="quiz-question">{id + 1}. {question}</p>
        <div className="flex flex-col gap-5 w-full mt-5">
          {options.map((option, index) => (
            <div key={index} className="option-box">
              <Button
                id={index.toString()}
                variant="bordered"
                disabled={selectedAnswer !== null}
                className="quiz-option"
                onClick={() => handleAnswerClick(index)}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span> {/* Convert index to letters A, B, C, D */}
                <span className="ml-2">{option}</span> {/* Option text */}
              </Button>
            </div>
          ))}
          {selectedAnswer !== null && selectedAnswer !== correct_answer && (
            <p className="incorrect-answer mt-3">
              Your answer is incorrect. Correct answer:{" "}
              {options[correct_answer]}
            </p>
          )}
          {selectedAnswer !== null && selectedAnswer === correct_answer && (
            <p className="correct-answer mt-3">
              Congratulations! Your answer is correct.
            </p>
          )}
        </div>
      </CardBody>
    </Card>
  );
}  