import React from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  useColorModeValue,
  Heading,
  Divider,
} from '@chakra-ui/react'
import { useTasks } from '../../utils/TaskContext'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

const TaskTimeline = () => {
  const { tasks } = useTasks()
  const textColor = useColorModeValue('gray.700', 'white')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  // Group tasks by date
  const groupedTasks = tasks.reduce((acc, task) => {
    const date = new Date(task.createdAt).toLocaleDateString()
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(task)
    return acc
  }, {} as Record<string, typeof tasks>)

  return (
    <VStack spacing={8} align="stretch">
      <Heading size="lg" color={textColor}>Task Timeline</Heading>
      {Object.entries(groupedTasks).map(([date, dateTasks]) => (
        <MotionBox
          key={date}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <HStack spacing={4} mb={4}>
            <Text fontWeight="bold" color={textColor}>
              {date}
            </Text>
            <Badge colorScheme="blue">{dateTasks.length} tasks</Badge>
          </HStack>
          <VStack spacing={4} align="stretch">
            {dateTasks.map((task) => (
              <Box
                key={task.id}
                p={4}
                bg={useColorModeValue('white', 'gray.800')}
                borderRadius="lg"
                border="1px"
                borderColor={borderColor}
                boxShadow="sm"
              >
                <VStack align="stretch" spacing={2}>
                  <HStack justify="space-between">
                    <Text fontWeight="medium" color={textColor}>
                      {task.title}
                    </Text>
                    <Badge colorScheme={task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'yellow' : 'green'}>
                      {task.priority}
                    </Badge>
                  </HStack>
                  <Text color={mutedColor} fontSize="sm">
                    {task.description}
                  </Text>
                  <HStack spacing={2}>
                    <Badge colorScheme="blue">{task.category}</Badge>
                    {task.dueDate && (
                      <Badge colorScheme="purple">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </Badge>
                    )}
                  </HStack>
                </VStack>
              </Box>
            ))}
          </VStack>
          <Divider my={6} />
        </MotionBox>
      ))}
    </VStack>
  )
}

export default TaskTimeline 