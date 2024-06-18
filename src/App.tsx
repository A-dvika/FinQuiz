import { useState } from "react";
import { ChakraProvider, Box } from "@chakra-ui/react";
import QuizApp from "./QuizApp";

import Footer from "./Footer";
import Home from "./components/Home";

function App() {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStart = () => {
    setIsPlaying(true);
  };

  return (
    <ChakraProvider>
      <Box
        display="flex"
        flexDirection="column"
        minHeight="100vh"
         bgGradient="linear(to-r, #3a7bd5, #3a6073)"
        bgSize="cover"
        bgPosition="center"
      >
        
        {isPlaying ? <QuizApp /> : <Home onStart={handleStart} />}
        <Footer />
      </Box>
    </ChakraProvider>
  );
}

export default App;
