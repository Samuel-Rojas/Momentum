import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  useColorModeValue,
  Heading,
  SimpleGrid,
  Badge,
} from '@chakra-ui/react';
import { useTasks } from '../../utils/TaskContext';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const TaskStats = () => {
  const { tasks } = useTasks();
  const textColor = useColorModeValue('gray.700', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Priority distribution
  const priorityDistribution = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Category distribution
  const categoryDistribution = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Upcoming deadlines
  const upcomingDeadlines = tasks
    .filter(task => task.dueDate && !task.completed)
    .sort((a, b) => (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0))
    .slice(0, 5);

  return (
    <VStack spacing={8} align="stretch">
      <Heading size="lg" color={textColor}>Task Statistics</Heading>

      <StatGroup>
        <Stat>
          <StatLabel>Total Tasks</StatLabel>
          <StatNumber>{totalTasks}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Completed Tasks</StatLabel>
          <StatNumber>{completedTasks}</StatNumber>
          <StatHelpText>
            <StatArrow type={completionRate > 50 ? 'increase' : 'decrease'} />
          </StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Completion Rate</StatLabel>
          <StatNumber>{completionRate.toFixed(1)}%</StatNumber>
        </Stat>
      </StatGroup>

      <Box>
        <Text mb={4} fontWeight="medium" color={textColor}>Priority Distribution</Text>
        <VStack spacing={2} align="stretch">
          {Object.entries(priorityDistribution).map(([priority, count]) => (
            <Box key={priority}>
              <HStack justify="space-between" mb={1}>
                <Badge colorScheme={
                  priority === 'high' ? 'red' :
                  priority === 'medium' ? 'yellow' : 'green'
                }>
                  {priority}
                </Badge>
                <Text fontSize="sm" color={mutedColor}>
                  {count} tasks
                </Text>
              </HStack>
              <Progress
                value={(count / totalTasks) * 100}
                colorScheme={
                  priority === 'high' ? 'red' :
                  priority === 'medium' ? 'yellow' : 'green'
                }
                size="sm"
                borderRadius="full"
              />
            </Box>
          ))}
        </VStack>
      </Box>

      <Box>
        <Text mb={4} fontWeight="medium" color={textColor}>Category Distribution</Text>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {Object.entries(categoryDistribution).map(([category, count]) => (
            <Box key={category}>
              <HStack justify="space-between" mb={1}>
                <Badge colorScheme="blue">{category}</Badge>
                <Text fontSize="sm" color={mutedColor}>
                  {count} tasks
                </Text>
              </HStack>
              <Progress
                value={(count / totalTasks) * 100}
                colorScheme="blue"
                size="sm"
                borderRadius="full"
              />
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {upcomingDeadlines.length > 0 && (
        <Box>
          <Text mb={4} fontWeight="medium" color={textColor}>Upcoming Deadlines</Text>
          <VStack spacing={2} align="stretch">
            {upcomingDeadlines.map(task => (
              <HStack key={task.id} justify="space-between">
                <Text>{task.title}</Text>
                <Badge colorScheme="purple">
                  Due: {new Date(task.dueDate!).toLocaleDateString()}
                </Badge>
              </HStack>
            ))}
          </VStack>
        </Box>
      )}
    </VStack>
  );
};

export default TaskStats; 