import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Progress,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
  Grid,
  useToken
} from '@chakra-ui/react'
import { useTasks } from '../utils/TaskContext'
import { fadeInUp, bounceIn, transitions } from '../utils/animations'
import { useMemo } from 'react'

export const TaskReview = () => {
  const { tasks } = useTasks()
  const [blue400, blue500] = useToken('colors', ['blue.400', 'blue.500'])

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const textColor = useColorModeValue('gray.700', 'white')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const gradientBg = useColorModeValue(
    'linear-gradient(135deg, #f6f8fb 0%, #ffffff 100%)',
    'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)'
  )

  const stats = useMemo(() => {
    const completedTasks = tasks.filter(task => task.completed)
    const totalTasks = tasks.length
    const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0

    const priorityDistribution = {
      high: tasks.filter(task => task.priority === 'high').length,
      medium: tasks.filter(task => task.priority === 'medium').length,
      low: tasks.filter(task => task.priority === 'low').length,
    }

    const categoryDistribution = tasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const averageTasksPerDay = tasks.length > 0
      ? tasks.reduce((acc, task) => {
          const date = new Date(task.createdAt).toLocaleDateString()
          acc[date] = (acc[date] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      : {}

    const avgTasks = Object.values(averageTasksPerDay).reduce((a, b) => a + b, 0) / 
      (Object.keys(averageTasksPerDay).length || 1)

    return {
      total: totalTasks,
      completed: completedTasks.length,
      completion: completionRate,
      priority: priorityDistribution,
      categories: categoryDistribution,
      avgTasksPerDay: avgTasks,
    }
  }, [tasks])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return useColorModeValue('red.500', 'red.300')
      case 'medium':
        return useColorModeValue('yellow.500', 'yellow.300')
      case 'low':
        return useColorModeValue('green.500', 'green.300')
      default:
        return useColorModeValue('gray.500', 'gray.300')
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'work':
        return useColorModeValue('purple.500', 'purple.300')
      case 'personal':
        return useColorModeValue('blue.500', 'blue.300')
      case 'study':
        return useColorModeValue('teal.500', 'teal.300')
      case 'health':
        return useColorModeValue('pink.500', 'pink.300')
      default:
        return useColorModeValue('gray.500', 'gray.300')
    }
  }

  return (
    <Box
      minH="calc(100vh - 64px)"
      w="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={useColorModeValue('gray.50', 'gray.900')}
      px={4}
      py={8}
    >
      <Box
        w="100%"
        maxW="800px"
        p={8}
        bg={gradientBg}
        borderRadius="2xl"
        boxShadow="xl"
        borderWidth="1px"
        borderColor={borderColor}
        position="relative"
        overflow="hidden"
        animation={`${fadeInUp} 0.5s ${transitions.spring}`}
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: `linear-gradient(to right, ${blue400}, ${blue500})`,
        }}
      >
        <VStack spacing={8} align="stretch">
          <Heading
            textAlign="center"
            color={textColor}
            animation={`${bounceIn} 0.6s ${transitions.spring}`}
          >
            Task Review
          </Heading>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Stat
              p={4}
              bg={bgColor}
              borderRadius="xl"
              borderWidth="1px"
              borderColor={borderColor}
              transition={transitions.smooth}
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
            >
              <StatLabel color={mutedColor}>Total Tasks</StatLabel>
              <StatNumber color={textColor}>{stats.total}</StatNumber>
              <StatHelpText color={mutedColor}>
                {stats.avgTasksPerDay.toFixed(1)} tasks per day
              </StatHelpText>
            </Stat>

            <Stat
              p={4}
              bg={bgColor}
              borderRadius="xl"
              borderWidth="1px"
              borderColor={borderColor}
              transition={transitions.smooth}
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
            >
              <StatLabel color={mutedColor}>Completed Tasks</StatLabel>
              <StatNumber color={textColor}>{stats.completed}</StatNumber>
              <Progress
                value={stats.completion}
                size="sm"
                colorScheme="green"
                borderRadius="full"
                mt={2}
              />
            </Stat>

            <Stat
              p={4}
              bg={bgColor}
              borderRadius="xl"
              borderWidth="1px"
              borderColor={borderColor}
              transition={transitions.smooth}
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
            >
              <StatLabel color={mutedColor}>Completion Rate</StatLabel>
              <StatNumber color={textColor}>{stats.completion.toFixed(1)}%</StatNumber>
              <StatHelpText color={mutedColor}>
                {stats.total - stats.completed} remaining
              </StatHelpText>
            </Stat>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Box
              p={6}
              bg={bgColor}
              borderRadius="xl"
              borderWidth="1px"
              borderColor={borderColor}
              transition={transitions.smooth}
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
            >
              <Heading size="md" color={textColor} mb={4}>
                Priority Distribution
              </Heading>
              <VStack spacing={4} align="stretch">
                {Object.entries(stats.priority).map(([priority, count]) => (
                  <Box key={priority}>
                    <HStack justify="space-between" mb={2}>
                      <Badge
                        colorScheme={getPriorityColor(priority)}
                        px={2}
                        py={1}
                        borderRadius="md"
                      >
                        {priority}
                      </Badge>
                      <Text color={mutedColor}>{count} tasks</Text>
                    </HStack>
                    <Progress
                      value={(count / stats.total) * 100}
                      size="sm"
                      colorScheme={priority === 'high' ? 'red' : priority === 'medium' ? 'yellow' : 'green'}
                      borderRadius="full"
                    />
                  </Box>
                ))}
              </VStack>
            </Box>

            <Box
              p={6}
              bg={bgColor}
              borderRadius="xl"
              borderWidth="1px"
              borderColor={borderColor}
              transition={transitions.smooth}
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
            >
              <Heading size="md" color={textColor} mb={4}>
                Category Distribution
              </Heading>
              <VStack spacing={4} align="stretch">
                {Object.entries(stats.categories).map(([category, count]) => (
                  <Box key={category}>
                    <HStack justify="space-between" mb={2}>
                      <Badge
                        colorScheme={getCategoryColor(category)}
                        px={2}
                        py={1}
                        borderRadius="md"
                      >
                        {category}
                      </Badge>
                      <Text color={mutedColor}>{count} tasks</Text>
                    </HStack>
                    <Progress
                      value={(count / stats.total) * 100}
                      size="sm"
                      colorScheme={
                        category === 'work'
                          ? 'purple'
                          : category === 'personal'
                          ? 'blue'
                          : category === 'study'
                          ? 'teal'
                          : 'pink'
                      }
                      borderRadius="full"
                    />
                  </Box>
                ))}
              </VStack>
            </Box>
          </SimpleGrid>
        </VStack>
      </Box>
    </Box>
  )
} 