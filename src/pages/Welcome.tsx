import React from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiTrendingUp, FiTarget } from 'react-icons/fi';

const MotionBox = motion(Box);

const Feature = ({ icon, title, description }: { icon: any; title: string; description: string }) => (
  <HStack spacing={4} align="start">
    <Icon as={icon} w={6} h={6} color="blue.500" />
    <Box>
      <Text fontWeight="bold" fontSize="lg">
        {title}
      </Text>
      <Text color="gray.600" _dark={{ color: 'gray.400' }}>
        {description}
      </Text>
    </Box>
  </HStack>
);

export const Welcome = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'white');

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Container maxW="container.xl" py={20}>
        <VStack spacing={12} align="center">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            textAlign="center"
          >
            <Heading
              size="2xl"
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
              mb={4}
            >
              Welcome to Momentum
            </Heading>
            <Text fontSize="xl" color={textColor} maxW="2xl">
              Your personal productivity companion. Stay organized, focused, and achieve more with our
              intuitive task management solution.
            </Text>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            w="full"
            maxW="3xl"
            bg={bgColor}
            p={8}
            borderRadius="xl"
            boxShadow="xl"
          >
            <VStack spacing={6} align="stretch">
              <Feature
                icon={FiCheckCircle}
                title="Task Management"
                description="Organize your tasks with priority levels, due dates, and categories. Stay on top of your to-dos with our intuitive interface."
              />
              <Feature
                icon={FiClock}
                title="Time Tracking"
                description="Monitor your productivity patterns and optimize your workflow with detailed insights and analytics."
              />
              <Feature
                icon={FiTrendingUp}
                title="Progress Tracking"
                description="Visualize your progress and celebrate your achievements with our comprehensive progress tracking system."
              />
              <Feature
                icon={FiTarget}
                title="Goal Setting"
                description="Set and track your goals, break them down into manageable tasks, and stay motivated throughout your journey."
              />
            </VStack>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              size="lg"
              colorScheme="blue"
              onClick={() => navigate('/login')}
              px={8}
              py={6}
              fontSize="lg"
            >
              Get Started
            </Button>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
};

export default Welcome; 