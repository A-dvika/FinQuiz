import { Box, Button, Text, Grid } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import './q.css';

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
    setSelectedAnswer(answerIndex); // Set selected answer
    checkAnswer(id, answerIndex); // Check answer
  };

  useEffect(() => {
    setSelectedAnswer(null); // Reset the state when the id prop changes
  }, [id]);

  return (
    <Box
      w="full"
      maxW="3xl"
      p={12}
      boxShadow="xl"
      rounded="xl"
      bgGradient="linear(to-r, #318ce7, #82BDD3)"
      fontFamily="Arial"
      className="quiz-card"
    >
      <Text fontSize="2xl" fontWeight="bold" mb={6} color="white">
        {id + 1}. {question}
      </Text>
      <Grid templateColumns="repeat(2, 1fr)" gap={6} w="full" mt={5}>
        {options.map((option, index) => (
          <Button
            key={index}
            variant="solid"
            isDisabled={selectedAnswer !== null}
            onClick={() => handleAnswerClick(index)}
            w="full"
            bg={selectedAnswer === index ? "white.400" : "white"}
            color={selectedAnswer === index ? "white" : "black"}
            _hover={{ bg: selectedAnswer === index ? "gray.400" : "gray.200" }}
            h="60px"
            className="quiz-option"
          >
            <Text fontSize="lg">{option}</Text>
          </Button>
        ))}
      </Grid>
      {selectedAnswer !== null && selectedAnswer !== correct_answer && (
        <Text color="red.600" mt={4} fontSize="lg" className="incorrect-answer">
          "Oops, wrong answer! 🙈. Correct answer is {options[correct_answer]}
        </Text>
      )}
      {selectedAnswer !== null && selectedAnswer === correct_answer && (
        <Text color="darkgreen" mt={4} fontSize="lg" className="correct-answer">
          Congratulations! Your answer is correct. You earned 1 coin 🪙.
        </Text>
      )}
    </Box>
  );
}
