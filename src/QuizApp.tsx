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
import { FaRandom, FaArrowRight } from "react-icons/fa";

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
  const [loadingProgress, setLoadingProgress] = useState(0);
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
    setLoadingProgress(0);
    const loadingInterval = setInterval(() => {
      setLoadingProgress((prevProgress) => {
        if (prevProgress < 90) {
          return prevProgress + 10;
        }
        return prevProgress;
      });
    }, 300);

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
        temperature: 0.5,
      });
      const data: QuizQuestion[] = JSON.parse(response.choices[0].text);
      setQuiz(data);
      setQuizStarted(true);
      clearInterval(loadingInterval);
      setLoadingProgress(100);
    } catch (error) {
      clearInterval(loadingInterval);
      setLoadingProgress(0);
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

  const handleShuffle = () => {
    const randomTopicIndex = Math.floor(Math.random() * topics.length);
    const randomDifficultyIndex = Math.floor(Math.random() * difficulties.length);
    setTopic(topics[randomTopicIndex]);
    setDifficulty(difficulties[randomDifficultyIndex]);

    generateQuiz();
  };

  return (
    <Flex
      direction="column"
      align="center"
      style={{
        background: "white",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Navbar */}
      <Box w="100%" bg="#0067B3" boxShadow="md">
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
      <Grid templateColumns="repeat(12, 1fr)" gap={6} width="100%" bg="#60A3D9">
        {!quizStarted && (
          <>
            {/* Left Topics Card */}
            <GridItem colSpan={3}>
              <Box
                boxShadow="md"
                borderRadius="md"
                p={4}
                bgColor="white"
                ml={9}
                mt={3}
                mb={3}
              >
                <Heading size="md" color="black" textAlign="center">
                  Topics for Beginners
                </Heading>
                <VStack align="stretch" spacing={4} mt={4}>
                  {topicsLeft.map((topic) => (
                    <Button
                      key={topic}
                      onClick={() => handleTopicSelect(topic)}
                      colorScheme={topic === selectedTopic ? "blue" : "gray"}
                      size="md"
                      _hover={{ bg: "blue.500", color: "white" }}
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
            <Heading as="h1" size="xl" textAlign="center" color="white" mt={10}>
              Let's test your financial knowledge!
            </Heading>

            {/* Start Quiz Section */}
            {quiz.length === 0 && (
              <Center>
                <Box
                  as="form"
                  onSubmit={handleSubmit}
                  w="full"
                  maxW="md"
                  bgColor="white"
                >
                  <Heading as="h3" size="md" mb={4} textAlign="center">
                    Choose your favorite topic and difficulty level to start the
                    quiz.
                  </Heading>
                  <Flex direction="column" align="center" mb={4}>
                    <HStack spacing={4} mb={4}>
                      {difficulties.map((level) => (
                        <Button
                          key={level}
                          onClick={() => setDifficulty(level)}
                          colorScheme={
                            difficulty === level ? "blue" : "gray"
                          }
                          _hover={{ bg: "blue.500", color: "white" }}
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
                                             <FaArrowRight
                                               color="white"
                                               style={{ width: "16px", height: "16px" }}
                                             />
                                           }
                                           _hover={{ transform: "scale(1.05)" }}
                                         >
                                           Start Quiz
                                         </Button>
                                       </Flex>
                                       <Flex justify="center" mt={4}>
                                         <Button
                                           onClick={handleShuffle}
                                           colorScheme="blue"
                                           rightIcon={
                                             <FaRandom
                                               color="white"
                                               style={{ width: "16px", height: "16px" }}
                                             />
                                           }
                                           _hover={{ transform: "scale(1.05)" }}
                                         >
                                           Shuffle Topic & Difficulty
                                         </Button>
                                       </Flex>
                                     </Box>
                                   </Center>
                                 )}
                     
                                 {/* Quiz Questions Section */}
                                 {quiz.length > 0 && (
                                   <>
                                     <Text
                                       textAlign="center"
                                       mb={3}
                                       fontFamily="Arial, sans-serif"
                                       fontSize="lg"
                                       color="white"
                                     >
                                       Total Questions: {quiz.length} 📝, Correct Answers:{" "}
                                       {countCorrects} ✅, Incorrect Answers: {countIncorrect} ❌
                                       <br />
                                       Difficulty:{" "}
                                       {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}{" "}
                                       🌟
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
                                       <Center mt={3} mb={5}>
                                         {questionNumber < quiz.length - 1 ? (
                                           <Button
                                             onClick={() => setQuestionNumber(questionNumber + 1)}
                                             mt={3}
                                             mb={5}
                                             size="lg"
                                             bg="white"
                                             color="blue.700"
                                             _hover={{
                                               bg: "blue.700",
                                               color: "white",
                                               transform: "scale(1.05)",
                                             }}
                                             _active={{
                                               bg: "blue.700",
                                               color: "white",
                                               transform: "scale(0.95)",
                                             }}
                                           >
                                             Next
                                           </Button>
                                         ) : (
                                           <Button
                                             onClick={handleTryAnother}
                                             mt={3}
                                             mb={5}
                                             size="lg"
                                             bg="white"
                                             color="blue.700"
                                             _hover={{
                                               bg: "blue.700",
                                               color: "white",
                                               transform: "scale(1.05)",
                                             }}
                                             _active={{
                                               bg: "blue.700",
                                               color: "white",
                                               transform: "scale(0.95)",
                                             }}
                                           >
                                             Try Another
                                           </Button>
                                         )}
                                       </Center>
                                     </Box>
                                   </>
                                 )}
                     
                                 {/* Loading Spinner */}
                                 {loading && (
                                   <Box display="flex" justifyContent="center" mt={4}>
                                     <Spinner size="xl" />
                                   </Box>
                                 )}
                     
                                 {/* Progressive Loading */}
                                 {loading && !quizStarted && (
                                   <Box textAlign="center" mt={4}>
                                     <Text color="white" fontSize="lg">
                                       Generating quiz...
                                     </Text>
                                     <Progress
                                       value={loadingProgress}
                                       size="md"
                                       colorScheme="blue"
                                       w="full"
                                       maxW="md"
                                       mt={2}
                                     />
                                     <Text color="white" fontSize="sm" mt={1}>
                                       {loadingProgress}% loaded
                                     </Text>
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
                                     bgColor="white"
                                     mr={9}
                                     mt={3}
                                     mb={3}
                                   >
                                     <Heading size="md" color="black" textAlign="center">
                                       Topics for Experts
                                     </Heading>
                                     <VStack align="stretch" spacing={4} mt={4}>
                                       {topicsRight.map((topic) => (
                                         <Button
                                           key={topic}
                                           onClick={() => handleTopicSelect(topic)}
                                           colorScheme={topic === selectedTopic ? "blue" : "gray"}
                                           size="md"
                                           _hover={{ bg: "blue.500", color: "white" }}
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
                     
