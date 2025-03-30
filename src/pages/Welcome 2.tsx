import React from 'react';
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  useColorMode,
  useColorModeValue,
  useToken
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPlus } from 'react-icons/fi'

const MotionBox = motion(Box)
const MotionVStack = motion(VStack)

export const Welcome = () => {
  const navigate = useNavigate()
  const { colorMode } = useColorMode()
  const [blue400, blue500] = useToken('colors', ['blue.400', 'blue.500'])
  
  const bgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.700', 'white')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const gradientBg = useColorModeValue(
    'linear-gradient(135deg, #f6f8fb 0%, #ffffff 100%)',
    'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)'
  )

  return (
    <Box
      minH="100vh"
      bg={gradientBg}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <VStack spacing={8} textAlign="center" maxW="800px">
        <Heading
          as="h1"
          size="2xl"
          bgGradient={`linear(to-r, ${blue400}, ${blue500})`}
          bgClip="text"
          fontWeight="extrabold"
        >
          Welcome to Momentum
        </Heading>
        <Text fontSize="xl" color={mutedColor}>
          Your personal task management companion. Stay organized, boost productivity, and achieve your goals.
        </Text>
        <Button
          size="lg"
          colorScheme="blue"
          onClick={() => navigate('/tasks/new')}
          px={8}
        >
          Get Started
        </Button>
      </VStack>
    </Box>
  )
} 