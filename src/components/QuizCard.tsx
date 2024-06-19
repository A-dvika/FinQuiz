import { Box, Button, Text, Grid } from "@chakra-ui/react";
import { useEffect, useState } from "react";

type QuizCardProps = {
  id: number;
  question: string;
  options: string[];
  correct_answer: number;
  checkAnswer: (id: number, answer: number) => void;
};

const QuizCard = ({
  id,
  question,
  options,
  correct_answer,
  checkAnswer,
}: QuizCardProps) => {
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
      maxW="xl"
      p={8}
      boxShadow="lg"
      rounded="xl"
      // bgGradient="linear(to-r, #318ce7, #82BDD3)"
      bgColor="#3664c6"
      fontFamily="Arial"
      className="quiz-card"
    >
      <Text fontSize="xl" fontWeight="bold" mb={6} color="black">
        {id + 1}. {question}
      </Text>
      <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={6} mt={5}>
        {options.map((option, index) => (
          <Button
            key={index}
            variant="solid"
            isDisabled={selectedAnswer !== null}
            onClick={() => handleAnswerClick(index)}
            w="full"
            minH="60px"
            bg={selectedAnswer === index ? "blue.500" : "gray.200"}
            color={selectedAnswer === index ? "white" : "black"}
            _hover={{ bg: selectedAnswer === index ? "blue.600" : "gray.300" }}
            py={6}
            className="quiz-option"
            whiteSpace="normal"
            overflowWrap="break-word"
            textAlign="center"
          >
            <Text fontSize="md">{option}</Text>
          </Button>
        ))}
      </Grid>
      {selectedAnswer !== null && selectedAnswer !== correct_answer && (
        <Text color="red.600" mt={4} fontSize="lg" className="incorrect-answer" textAlign="center">
          Oops, wrong answer! 🙈 Correct answer is: {options[correct_answer]}
        </Text>
      )}
      {selectedAnswer !== null && selectedAnswer === correct_answer && (
        <Text color="darkgreen" mt={4} fontSize="lg" className="correct-answer" textAlign="center">
          Congratulations! Your answer is correct. You earned 1 coin 🪙
        </Text>
      )}
    </Box>
  );
};

export default QuizCard;
