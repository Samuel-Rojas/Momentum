import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  List,
  ListItem,
  ListIcon,
  Alert,
  AlertIcon,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiClock, FiCalendar, FiTag, FiTrendingUp } from 'react-icons/fi';
import { useTasks } from '../utils/TaskContext';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const ProductivityInsights: React.FC = () => {
  const { productivityService, hasProductivityInsights } = useTasks();
  const insights = productivityService.getProductivityInsights();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  if (!hasProductivityInsights) {
    return (
      <Box p={8}>
        <Alert status="info" borderRadius="lg">
          <AlertIcon />
          Complete at least 5 tasks to generate productivity insights. We'll analyze your patterns to help optimize your task scheduling.
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg" color={textColor}>Your Productivity Insights</Heading>
        
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
              <CardBody>
                <VStack align="start" spacing={4}>
                  <Heading size="md" color={textColor}>
                    Peak Performance Times
                  </Heading>
                  <List spacing={3}>
                    <ListItem display="flex" alignItems="center">
                      <ListIcon as={FiClock} color="blue.500" />
                      Most Productive Time: {insights?.mostProductiveTimeOfDay}
                    </ListItem>
                    <ListItem display="flex" alignItems="center">
                      <ListIcon as={FiCalendar} color="blue.500" />
                      Best Day: {insights?.mostProductiveDayOfWeek}
                    </ListItem>
                  </List>
                </VStack>
              </CardBody>
            </Card>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
              <CardBody>
                <VStack align="start" spacing={4}>
                  <Heading size="md" color={textColor}>
                    Task Categories
                  </Heading>
                  <List spacing={3}>
                    {insights?.bestCategories.map((category, index) => (
                      <ListItem key={category} display="flex" alignItems="center">
                        <ListIcon as={FiTag} color="blue.500" />
                        {category} {index === 0 && '(Most Efficient)'}
                      </ListItem>
                    ))}
                  </List>
                </VStack>
              </CardBody>
            </Card>
          </MotionBox>
        </SimpleGrid>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
            <CardBody>
              <VStack align="start" spacing={4}>
                <Heading size="md" color={textColor}>
                  Recommendations
                </Heading>
                <List spacing={3}>
                  <ListItem display="flex" alignItems="center">
                    <ListIcon as={FiTrendingUp} color="blue.500" />
                    Average Task Duration: {Math.round(insights?.averageTaskDuration || 0)} minutes
                  </ListItem>
                  <ListItem display="flex" alignItems="center">
                    <ListIcon as={FiClock} color="blue.500" />
                    Schedule {insights?.bestCategories[0]} tasks during your peak time ({insights?.mostProductiveTimeOfDay})
                  </ListItem>
                  <ListItem display="flex" alignItems="center">
                    <ListIcon as={FiCalendar} color="blue.500" />
                    Plan important tasks for {insights?.mostProductiveDayOfWeek}
                  </ListItem>
                </List>
              </VStack>
            </CardBody>
          </Card>
        </MotionBox>
      </VStack>
    </Box>
  );
};

export default ProductivityInsights; 