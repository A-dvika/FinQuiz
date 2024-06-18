import React, { useState } from "react";
import OpenAi from "openai";
import {
  Box,
  Button,
  Heading,
  Spinner,
  Text,
  VStack,
  HStack,
  Grid,
  Progress,
  GridItem,
  useToast,
  Flex,
  Center,
} from "@chakra-ui/react";
import QuizCard from "./components/QuizCard";
import "./styles.css";

const openai = new OpenAi({
  apiKey: import.meta.env.VITE_OPEN_API_KEY,
  dangerouslyAllowBrowser: true,
});

interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: number;
}

const difficulties = ["easy", "medium", "hard"];

const QuizApp = () => {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [countCorrects, setCountCorrect] = useState(0);
  const [countIncorrect, setCountIncorrect] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [quizStarted, setQuizStarted] = useState(false);
  const toast = useToast();

  const topics = [
    "Budgeting Basics",
    "Saving Strategies",
    "Understanding Credit Scores",
    "Debt Management",
    "Investing for Beginners",
    "Types of Bank Accounts",
    "Financial Goals Setting",
    "Insurance Basics",
    "Retirement Planning",
    "Portfolio Optimization",
    "Advanced Options Trading",
    "Alternative Investments",
    "Risk Management",
    "Financial Modeling",
    "Derivatives Trading",
    "Behavioral Finance",
    "Mergers & Acquisitions",
    "International Finance",
  ];

  const topicsLeft = topics.slice(0, Math.ceil(topics.length / 2));
  const topicsRight = topics.slice(Math.ceil(topics.length / 2));

  const handleTopicSelect = (selectedTopic: string) => {
    setSelectedTopic(selectedTopic);
    if (topic === selectedTopic) {
      setTopic("");
    } else {
      setTopic(selectedTopic);
    }
  };

  const generateQuiz = async () => {
    setQuiz([]);
    setCountCorrect(0);
    setLoading(true);
    try {
      const prompt = `Generate a JSON array containing 10 different multiple-choice questions on the topic "${topic}" with a difficulty level of "${difficulty}". Each question should have 4 options and indicate the correct answer. Use this format 
        [
          {
            "question": "",
            "options": [
              "",
              "",
              "",
              ""
            ],
            "correct_answer": 0 // index of the correct answer option
          }
        ]
      `;

      const response = await openai.completions.create({
        model: "gpt-3.5-turbo-instruct",
        prompt,
        max_tokens: 2048,
        n: 1,
        stop: null,
        temperature: 0.7,
      });
      const data: QuizQuestion[] = JSON.parse(response.choices[0].text);
      setQuiz(data);
      setQuizStarted(true);
    } catch (error) {
      toast({
        title: "Error generating quiz.",
        description: "Unable to generate quiz. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !difficulty) {
      toast({
        title: "Incomplete Selection",
        description: "Please select both the topic and difficulty first.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    generateQuiz();
  };

  const checkAnswer = (id: number, answer: number) => {
    if (quiz.length > 0 && quiz[id].correct_answer === answer) {
      setCountCorrect(countCorrects + 1);
      toast({
        title: "Correct!",
        description: "Congratulations! 🎉 You've just earned points! 🪙",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } else {
      setCountIncorrect(countIncorrect + 1);
      toast({
        title: "Incorrect!",
        description: "Oh no, that's not it! 😬",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleTryAnother = () => {
    setQuizStarted(false);
    setQuiz([]);
    setQuestionNumber(0);
    setCountCorrect(0);
    setCountIncorrect(0);
    setTopic("");
    setDifficulty("");
    setSelectedTopic("");
  };

  return (
    <Flex
      direction="column"
      align="center"
      style={{
        background: "linear-gradient(to right, #3a7bd5, #3a6073)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Navbar */}
      <Box w="100%" bg="blue.500" boxShadow="md">
        <Flex
          h={16}
          maxWidth="6xl"
          w="full"
          mx="auto"
          px={6}
          align="center"
          justify="center"
        >
          <Heading as="h1" size="lg" color="white">
            FinQuiz
          </Heading>
        </Flex>
      </Box>

      {/* Main Content */}
      <Grid templateColumns="repeat(12, 1fr)" gap={6} mt={4} width="100%">
        {!quizStarted && (
          <>
            {/* Left Topics Card */}
            <GridItem colSpan={3}>
              <Box
                boxShadow="md"
                borderRadius="md"
                p={4}
                bgGradient="linear(to-r, #318ce7, #82BDD3)"
                ml={9}
              >
                <Heading size="md" color="white">
                  Topics for Beginners
                </Heading>
                <VStack align="stretch" spacing={4} mt={4}>
                  {topicsLeft.map((topic) => (
                    <Button
                      key={topic}
                      onClick={() => handleTopicSelect(topic)}
                      colorScheme={topic === selectedTopic ? "blue" : "gray"}
                      variant={topic === selectedTopic ? "solid" : "outline"}
                      size="md"
                    >
                      {topic}
                    </Button>
                  ))}
                </VStack>
              </Box>
            </GridItem>
          </>
        )}

        {/* Main Quiz Content */}
        <GridItem colSpan={quizStarted ? 12 : 6}>
          <VStack spacing={8} align="center">
            {/* Quiz Header */}
            <Heading as="h2" size="lg" textAlign="center">
              Let's test your financial knowledge!
            </Heading>

            {/* Start Quiz Section */}
            {quiz.length === 0 && (
              <Center>
                <Box
                  bgGradient="linear(to-r, #318ce7, #82BDD3)"
                  as="form"
                  onSubmit={handleSubmit}
                  w="full"
                  maxW="md"
                >
                  <Text mb={4} textAlign="center">
                    Choose your favorite topic and difficulty level to start the quiz.
                  </Text>
                  <Flex direction="column" align="center" mb={4}>
                    <HStack spacing={4} mb={4}>
                      {difficulties.map((level) => (
                        <Button
                          key={level}
                          onClick={() => setDifficulty(level)}
                          colorScheme={difficulty === level ? "blue" : "gray"}
                          variant={difficulty === level ? "solid" : "outline"}
                        >
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </Button>
                      ))}
                    </HStack>
                    <Button
                      isLoading={loading}
                      colorScheme="blue"
                      type="submit"
                      rightIcon={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m8.25 4.5 7.5 7.5-7.5 7.5"
                          />
                        </svg>
                      }
                    >
                      Start Quiz
                    </Button>
                  </Flex>
                </Box>
              </Center>
            )}

            {/* Quiz Questions Section */}
            {quiz.length > 0 && (
              <>
                <Text textAlign="center" mb={3} fontFamily="Arial, sans-serif" fontSize="lg">
                  Total Questions: {quiz.length} 📝, Correct Answers: {countCorrects} ✅, Incorrect Answers: {countIncorrect} ❌
                  <br />
                  Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} 🌟
                  <br />
                  Coins earned: {countCorrects} 💰
                </Text>

                <Progress
                  value={(questionNumber / quiz.length) * 100}
                  size="md"
                  colorScheme="blue"
                  w="full"
                  maxW="md"
                  mb={4}
                />
                <Box w="full" maxW="md">
                  <QuizCard
                    question={quiz[questionNumber].question}
                    correct_answer={quiz[questionNumber].correct_answer}
                    id={questionNumber}
                    options={quiz[questionNumber].options}
                    checkAnswer={checkAnswer}
                  />
                  {questionNumber < quiz.length - 1 ? (
                    <Button
                      onClick={() => setQuestionNumber(questionNumber + 1)}
                      mt={3}
                      colorScheme="blue"
                      mb={5}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      onClick={handleTryAnother}
                      mt={3}
                      colorScheme="blue"
                      mb={5}
                    >
                      Try Another
                    </Button>
                  )}
                </Box>
              </>
            )}

            {/* Loading Spinner */}
            {loading && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Spinner size="xl" />
              </Box>
            )}
          </VStack>
        </GridItem>

        {!quizStarted && (
          <>
            {/* Right Topics Card */}
            <GridItem colSpan={3}>
              <Box
                boxShadow="md"
                borderRadius="md"
                p={4}
                bgGradient="linear(to-r, #318ce7, #82BDD3)"
                mr={9}
              >
                <Heading size="md" color="white">
                  Topics for Experts
                </Heading>
                <VStack align="stretch" spacing={4} mt={4}>
                  {topicsRight.map((topic) => (
                    <Button
                      key={topic}
                      onClick={() => handleTopicSelect(topic)}
                      colorScheme={topic === selectedTopic ? "blue" : "gray"}
                      variant={topic === selectedTopic ? "solid" : "outline"}
                      size="md"
                    >
                      {topic}
                    </Button>
                  ))}
                </VStack>
              </Box>
            </GridItem>
          </>
        )}
      </Grid>
    </Flex>
  );
};

export default QuizApp;

