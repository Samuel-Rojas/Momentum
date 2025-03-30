import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Divider,
  HStack,
  Link,
  useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { RiGoogleFill } from 'react-icons/ri';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'white');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await signIn(email, password);
      navigate('/tasks');
    } catch (error) {
      toast({
        title: 'Error signing in',
        description: 'Please check your credentials and try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      navigate('/tasks');
    } catch (error) {
      toast({
        title: 'Error signing in with Google',
        description: 'Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={useColorModeValue('gray.50', 'gray.900')}
      py={12}
      px={4}
      sm:px={6}
      lg:px={8}
    >
      <Box
        maxW="md"
        w="full"
        bg={bgColor}
        p={8}
        borderRadius="xl"
        boxShadow="lg"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <VStack spacing={8}>
          <Heading size="lg" color={textColor}>Welcome Back</Heading>
          <Text color={textColor}>Sign in to continue to Momentum</Text>

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                isLoading={isLoading}
              >
                Sign In
              </Button>
            </VStack>
          </form>

          <HStack width="full">
            <Divider />
            <Text color="gray.500">or</Text>
            <Divider />
          </HStack>

          <Button
            leftIcon={<RiGoogleFill />}
            width="full"
            variant="outline"
            onClick={handleGoogleSignIn}
            isLoading={isLoading}
          >
            Continue with Google
          </Button>

          <HStack spacing={1} justify="center">
            <Text color="gray.500">Don't have an account?</Text>
            <Link
              color="blue.500"
              href="/signup"
              fontWeight="semibold"
            >
              Sign up
            </Link>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default Login; 