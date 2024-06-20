import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, CircularProgressLabel, VStack, GridItem } from '@chakra-ui/react';

interface LoadingSpinnerProps {
  loading: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ loading }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 100 ? prev + 10 : 100));
      }, 500);

      return () => clearInterval(interval);
    }
  }, [loading]);

  return (
    <GridItem>
      <VStack>
        {loading && (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress value={progress} size="120px" thickness="8px">
              <CircularProgressLabel>{`${progress}%`}</CircularProgressLabel>
            </CircularProgress>
          </Box>
        )}
      </VStack>
    </GridItem>
  );
};

export default LoadingSpinner;
