import { Box, Button, Text, Heading,keyframes  } from "@chakra-ui/react";
import { FaGamepad } from 'react-icons/fa';

type HomeProps = {
  onStart: () => void;
};
const typewriter = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const blink = keyframes`
  from, to { border-color: transparent; }
  50% { border-color: white; }
`;
const Home = ({ onStart }: HomeProps) => {
  return (
    <Box
      // bgGradient="linear(to-r, #3a7bd5, #3a6073)"
      bgSize="cover"
      bgPosition="center"
      minH="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      p={10}
      textAlign="center"
      bgColor="#60A3D9"
      
    >
      <Heading 
        as="h1" 
        size="2xl" 
        mb={8} 
        color="white" 
        // textShadow="2px 2px 4px rgba(0, 0, 0, 0.5)"
        fontFamily="'Poppins', sans-serif"
        sx={{
          display: 'inline-block',
          width: '100%',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          animation: `${typewriter} 3s steps(30, end) 1s 1 normal both, ${blink} 0.75s step-end infinite`
        }}
        
      >
        Welcome to FinQuiz 🎉
      </Heading>
      <Text 
        fontSize="xl" 
        mb={6} 
        color="white" 
        // textShadow="1px 1px 2px rgba(0, 0, 0, 0.5)"
        fontFamily="'Poppins', sans-serif"
      >
        Are you ready to test your financial knowledge and compete against AI? <br />
        Welcome to FinQuiz, the fun and interactive quiz app designed to boost your financial literacy. <br />
        Challenge yourself with questions generated by advanced AI, and see if you can outsmart it! 🤓
      </Text>
      <Box 
        bg="white" 
        borderRadius="lg" 
        p={6} 
        mt={6} 
        color="black"
        textAlign="left"
        boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
        maxW="600px"
      >
        <Text fontSize="lg" mb={2}>
          🚀 <strong>How It Works:</strong>
        </Text>
        <Text mb={2}>
          ✅ <strong>Engage in Exciting Quizzes:</strong> Answer finance-related questions generated by our AI and accumulate points for every correct answer.
        </Text>
        <Text mb={2}>
          🏆 <strong>Earn and Redeem Points:</strong> The more questions you get right, the more points you earn. Use these points to unlock exclusive discounts for booking sessions with expert consultants within the app.
        </Text>
        <Text>
          📚 <strong>Learn and Grow:</strong> Each quiz is a learning opportunity, helping you expand your financial knowledge in an enjoyable way.
        </Text>
      </Box>
      <Button
      size="lg"
      onClick={onStart}
      leftIcon={<FaGamepad />}
      fontFamily="'Poppins', sans-serif"
      mt={8}
      bg="white"
      color = "blue.700"
      _hover={{ bg:"blue.700", color:"white", transform: "scale(1.05)" }}
      _active={{ bg:"blue.700",color: "white", transform: "scale(0.95)" }}
      boxShadow="0 4px 8px rgba(0, 0, 0, 0.2)"
>
        Play
      </Button>
    </Box>
  );
};

export default Home;
