import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Avatar,
  useColorModeValue,
  Card,
  CardBody,
  Divider,
  Button,
  Icon,
  HStack,
} from '@chakra-ui/react';
import { FiUser, FiMail, FiCalendar, FiSettings } from 'react-icons/fi';
import { useAuth } from '../utils/AuthContext';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Container maxW="container.md" py={8}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <VStack spacing={6} align="stretch">
          <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <VStack spacing={6}>
                <Avatar
                  size="2xl"
                  name={user?.email}
                  bgGradient="linear(to-r, blue.500, purple.500)"
                />
                <Heading size="lg">{user?.email}</Heading>
                <Text color="gray.500">Member since {new Date().toLocaleDateString()}</Text>
              </VStack>
            </CardBody>
          </Card>

          <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Heading size="md">Account Information</Heading>
                <Divider />
                <HStack spacing={4}>
                  <Icon as={FiUser} boxSize={5} />
                  <Text>Username: {user?.email?.split('@')[0]}</Text>
                </HStack>
                <HStack spacing={4}>
                  <Icon as={FiMail} boxSize={5} />
                  <Text>Email: {user?.email}</Text>
                </HStack>
                <HStack spacing={4}>
                  <Icon as={FiCalendar} boxSize={5} />
                  <Text>Member since: {new Date().toLocaleDateString()}</Text>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Heading size="md">Account Settings</Heading>
                <Divider />
                <Button
                  leftIcon={<FiSettings />}
                  colorScheme="blue"
                  variant="outline"
                  onClick={() => window.location.href = '/settings'}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'md',
                  }}
                  transition="all 0.2s"
                >
                  Manage Account Settings
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </MotionBox>
    </Container>
  );
}; 