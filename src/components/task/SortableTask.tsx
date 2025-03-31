import React from 'react';
import {
  Box,
  HStack,
  VStack,
  Text,
  IconButton,
  Checkbox,
  useColorModeValue,
  Badge,
  Tooltip,
  Tag,
  TagLabel,
  TagLeftIcon,
} from '@chakra-ui/react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FiEdit2, FiTrash2, FiMenu, FiTag, FiFlag } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Task } from '../../utils/TaskContext';

const MotionBox = motion(Box);

interface SortableTaskProps {
  task: Task;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
  onEdit: (id: string) => void;
}

const priorityColors = {
  high: 'red',
  medium: 'orange',
  low: 'green',
};

const categoryIcons = {
  Work: '💼',
  Personal: '👤',
  Study: '📚',
  Health: '❤️',
  Shopping: '🛍️',
  Other: '📌',
};

const SortableTask: React.FC<SortableTaskProps> = ({ task, onDelete, onComplete, onEdit }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.500', 'gray.400');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.600');

  return (
    <MotionBox
      ref={setNodeRef}
      style={style}
      bg={bgColor}
      p={4}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      _hover={{
        bg: hoverBgColor,
        transform: 'translateY(-1px)',
        boxShadow: 'sm',
      }}
      transition="all 0.2s"
    >
      <HStack spacing={4} align="start">
        <IconButton
          icon={<FiMenu />}
          variant="ghost"
          size="sm"
          aria-label="Drag to reorder"
          cursor="grab"
          {...attributes}
          {...listeners}
          _hover={{ bg: 'transparent' }}
        />
        <Checkbox
          size="lg"
          colorScheme="blue"
          isChecked={task.completed}
          onChange={() => onComplete(task.id)}
          mt={1}
        />
        <VStack flex={1} align="start" spacing={2}>
          <HStack spacing={2} align="center">
            <Text
              fontSize="lg"
              fontWeight="semibold"
              color={textColor}
              textDecoration={task.completed ? 'line-through' : 'none'}
              opacity={task.completed ? 0.7 : 1}
            >
              {task.title}
            </Text>
            <Badge
              colorScheme={priorityColors[task.priority]}
              variant="subtle"
              fontSize="xs"
              px={2}
              py={0.5}
              borderRadius="full"
            >
              {task.priority}
            </Badge>
          </HStack>
          
          <HStack spacing={2} wrap="wrap">
            <Tag size="sm" variant="subtle" colorScheme="blue">
              <TagLeftIcon as={FiTag} />
              <TagLabel>{task.category}</TagLabel>
            </Tag>
            {task.tags?.map((tag) => (
              <Tag key={tag} size="sm" variant="outline">
                {tag}
              </Tag>
            ))}
          </HStack>

          {task.description && (
            <Text
              fontSize="sm"
              color={mutedColor}
              noOfLines={2}
            >
              {task.description}
            </Text>
          )}
        </VStack>

        <HStack spacing={2}>
          <Tooltip label="Edit task">
            <IconButton
              icon={<FiEdit2 />}
              aria-label="Edit task"
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task.id)}
              colorScheme="blue"
              _hover={{ bg: 'blue.50' }}
            />
          </Tooltip>
          <Tooltip label="Delete task">
            <IconButton
              icon={<FiTrash2 />}
              aria-label="Delete task"
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task.id)}
              colorScheme="red"
              _hover={{ bg: 'red.50' }}
            />
          </Tooltip>
        </HStack>
      </HStack>
    </MotionBox>
  );
};

export default SortableTask; 