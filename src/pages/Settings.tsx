import React from 'react';
import {
  Box,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Switch,
  useColorMode,
  useColorModeValue,
  Text,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export const Settings = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'white');

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      width="100%"
      maxW="800px"
    >
      <Card bg={bgColor}>
        <CardBody p={8}>
          <VStack spacing={6} align="stretch">
            <Heading size="lg" color={textColor}>Settings</Heading>
            
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0" color={textColor}>
                Dark Mode
              </FormLabel>
              <Switch
                isChecked={colorMode === 'dark'}
                onChange={toggleColorMode}
                colorScheme="blue"
              />
            </FormControl>

            <Box>
              <Text color={textColor} fontWeight="medium" mb={2}>
                Account Settings
              </Text>
              <Text color={textColor} fontSize="sm">
                More account settings coming soon...
              </Text>
            </Box>

            <Box>
              <Text color={textColor} fontWeight="medium" mb={2}>
                Notification Settings
              </Text>
              <Text color={textColor} fontSize="sm">
                Configure your notification preferences here...
              </Text>
            </Box>
          </VStack>
        </CardBody>
      </Card>
    </MotionBox>
  );
};

export default Settings; 