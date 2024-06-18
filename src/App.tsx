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
        bgImage="url('https://img.freepik.com/free-vector/hand-painted-watercolor-abstract-background_23-2148998041.jpg?size=626&ext=jpg&ga=GA1.1.1141335507.1718582400&semt=ais_user')"
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
