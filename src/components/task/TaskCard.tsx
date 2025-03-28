import {
  Box,
  HStack,
  Text,
  IconButton,
  Badge,
  useColorModeValue,
  Checkbox,
  Tooltip,
  Input,
  Flex,
  useToken,
} from '@chakra-ui/react'
import { FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi'
import { Task } from '../../utils/TaskContext'
import { transitions, checkmarkAnimation, bounceIn } from '../../utils/animations'
import { useState } from 'react'

interface TaskCardProps {
  task: Task
  onEdit: (id: string, updates: Partial<Task>) => void
  onDelete: (id: string) => void
  onToggleComplete: (id: string) => void
  style?: React.CSSProperties
}

export const TaskCard = ({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
  style,
}: TaskCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [editedName, setEditedName] = useState(task.name)

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const textColor = useColorModeValue('gray.700', 'gray.200')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const [blue400] = useToken('colors', ['blue.400'])

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

  const handleSaveEdit = () => {
    onEdit(task.id, { name: editedName, isEditing: false })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit()
    } else if (e.key === 'Escape') {
      onEdit(task.id, { isEditing: false })
      setEditedName(task.name)
    }
  }

  return (
    <Box
      p={4}
      bg={bgColor}
      borderWidth="1px"
      borderColor={isHovered ? 'blue.400' : borderColor}
      borderRadius="xl"
      boxShadow={isHovered ? 'lg' : 'sm'}
      transition={transitions.smooth}
      transform={isHovered ? 'translateY(-2px)' : 'none'}
      position="relative"
      overflow="hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      opacity={task.completed ? 0.7 : 1}
      style={style}
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: `linear-gradient(to right, ${blue400}, transparent)`,
        opacity: isHovered ? 1 : 0,
        transition: transitions.smooth,
      }}
    >
      <Flex justify="space-between" align="center">
        <HStack spacing={4} flex={1}>
          <Checkbox
            isChecked={task.completed}
            onChange={() => onToggleComplete(task.id)}
            sx={{
              '& > span': {
                animation: task.completed ? `${checkmarkAnimation} 0.3s ${transitions.spring}` : 'none',
              },
            }}
          />
          
          {task.isEditing ? (
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={handleKeyPress}
              autoFocus
              size="sm"
              width="auto"
              flex={1}
            />
          ) : (
            <Text
              color={textColor}
              textDecoration={task.completed ? 'line-through' : 'none'}
              flex={1}
            >
              {task.name}
            </Text>
          )}
        </HStack>

        <HStack spacing={2}>
          <Badge
            colorScheme={getPriorityColor(task.priority)}
            variant="subtle"
            px={2}
            py={1}
            borderRadius="md"
            animation={`${bounceIn} 0.5s ${transitions.spring}`}
          >
            {task.priority}
          </Badge>
          <Badge
            colorScheme={getCategoryColor(task.category)}
            variant="subtle"
            px={2}
            py={1}
            borderRadius="md"
            animation={`${bounceIn} 0.5s ${transitions.spring} 0.1s`}
          >
            {task.category}
          </Badge>

          {task.isEditing ? (
            <HStack>
              <Tooltip label="Save">
                <IconButton
                  aria-label="Save edit"
                  icon={<FiCheck />}
                  size="sm"
                  colorScheme="green"
                  variant="ghost"
                  onClick={handleSaveEdit}
                />
              </Tooltip>
              <Tooltip label="Cancel">
                <IconButton
                  aria-label="Cancel edit"
                  icon={<FiX />}
                  size="sm"
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => {
                    onEdit(task.id, { isEditing: false })
                    setEditedName(task.name)
                  }}
                />
              </Tooltip>
            </HStack>
          ) : (
            <HStack
              opacity={isHovered ? 1 : 0}
              transition={transitions.smooth}
            >
              <Tooltip label="Edit">
                <IconButton
                  aria-label="Edit task"
                  icon={<FiEdit2 />}
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(task.id, { isEditing: true })}
                />
              </Tooltip>
              <Tooltip label="Delete">
                <IconButton
                  aria-label="Delete task"
                  icon={<FiTrash2 />}
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => onDelete(task.id)}
                />
              </Tooltip>
            </HStack>
          )}
        </HStack>
      </Flex>

      {task.dueDate && (
        <Text
          fontSize="sm"
          color={mutedColor}
          mt={2}
        >
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </Text>
      )}
    </Box>
  )
} 