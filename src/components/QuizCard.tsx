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
    const isCorrect = answerIndex === correct_answer;
    console.log('here')
    const audio = new Audio(isCorrect ? '/correct_answer.mp3' : '/wrong_answer.mp3');
    console.log('here')
    audio.play();
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
      bgColor="white"
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
            bg={
              selectedAnswer === null ? "gray.200"
              : index === correct_answer ? "green.500"
              :"red.500"
              
            }
            color={
              selectedAnswer === null ? "black"
              : index === correct_answer || index === selectedAnswer ? "white"
              : "white"
            }
            _hover={{  bg: selectedAnswer === null ? "blue.600" : undefined,
              color: selectedAnswer === null ? "white" : undefined
             }}
            py={6}
            className="quiz-option"
            whiteSpace="normal"
            overflowWrap="break-word"
            textAlign="center"
            transform={selectedAnswer === index ? "scale(1.05)" : undefined}
          >
            <Text px={4} py={2} fontSize="md">{option}</Text>
          </Button>
        ))}
      </Grid>
      {selectedAnswer !== null && selectedAnswer !== correct_answer && (
        <Text color="red.500" mt={4} fontSize="lg" className="incorrect-answer" textAlign="center">
          Oops, wrong answer! 🙈 
          <br />
          Correct answer is: {options[correct_answer]}
        </Text>
      )}
      {selectedAnswer !== null && selectedAnswer === correct_answer && (
        <Text color="darkgreen" mt={4} fontSize="lg" className="correct-answer" textAlign="center">
          Congratulations! 
          <br />
          Your answer is correct. You earned 1 coin 🪙
        </Text>
      )}
    </Box>
  );
};

export default QuizCard;
