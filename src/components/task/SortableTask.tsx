import React from 'react';
import {
  Box,
  Text,
  Badge,
  IconButton,
  Tooltip,
  useColorModeValue,
  HStack,
  VStack,
  Flex,
  Tag,
  TagLabel,
  TagCloseButton,
} from '@chakra-ui/react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Task } from '../../utils/TaskContext';
import {
  RiCheckLine,
  RiDeleteBin6Line,
  RiDraggable,
  RiEditLine,
  RiTimeLine,
  RiPriceTag3Line,
} from 'react-icons/ri';

interface SortableTaskProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const MotionBox = motion(Box);

const SortableTask: React.FC<SortableTaskProps> = ({
  task,
  onComplete,
  onDelete,
  onEdit,
}) => {
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

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'white');
  const mutedColor = useColorModeValue('gray.500', 'gray.400');

  const priorityColors = {
    high: 'red',
    medium: 'orange',
    low: 'green',
  };

  return (
    <MotionBox
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      p={4}
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="md"
      mb={2}
      position="relative"
      _hover={{ shadow: 'md' }}
    >
      <Flex align="center" justify="space-between">
        <HStack spacing={3} flex={1}>
          <IconButton
            aria-label="Drag handle"
            icon={<RiDraggable />}
            variant="ghost"
            size="sm"
            cursor="grab"
            {...attributes}
            {...listeners}
            color={mutedColor}
          />
          <IconButton
            aria-label="Complete task"
            icon={<RiCheckLine />}
            variant="ghost"
            size="sm"
            onClick={() => onComplete(task.id)}
            color={task.completed ? 'green.500' : mutedColor}
            _hover={{ color: 'green.500' }}
          />
          <VStack align="start" spacing={1} flex={1}>
            <Text
              fontSize="md"
              fontWeight="medium"
              color={textColor}
              textDecoration={task.completed ? 'line-through' : 'none'}
              opacity={task.completed ? 0.7 : 1}
            >
              {task.title}
            </Text>
            <HStack spacing={2}>
              <Badge colorScheme={priorityColors[task.priority]}>
                {task.priority}
              </Badge>
              {task.category && (
                <Badge colorScheme="blue">{task.category}</Badge>
              )}
            </HStack>
          </VStack>
        </HStack>
        <HStack spacing={2}>
          <Tooltip label="Edit task">
            <IconButton
              aria-label="Edit task"
              icon={<RiEditLine />}
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task.id)}
              color={mutedColor}
              _hover={{ color: 'blue.500' }}
            />
          </Tooltip>
          <Tooltip label="Delete task">
            <IconButton
              aria-label="Delete task"
              icon={<RiDeleteBin6Line />}
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task.id)}
              color={mutedColor}
              _hover={{ color: 'red.500' }}
            />
          </Tooltip>
        </HStack>
      </Flex>

      {task.description && (
        <Box
          mt={2}
          color={mutedColor}
          fontSize="sm"
          dangerouslySetInnerHTML={{ __html: task.description }}
        />
      )}

      {(task.tags?.length > 0 || task.dueDate) && (
        <HStack mt={3} spacing={2}>
          {task.tags?.map((tag) => (
            <Tag key={tag} size="sm" variant="subtle" colorScheme="blue">
              <RiPriceTag3Line />
              <TagLabel ml={1}>{tag}</TagLabel>
            </Tag>
          ))}
          {task.dueDate && (
            <Tag size="sm" variant="subtle" colorScheme="purple">
              <RiTimeLine />
              <TagLabel ml={1}>
                {new Date(task.dueDate).toLocaleDateString()}
              </TagLabel>
            </Tag>
          )}
        </HStack>
      )}
    </MotionBox>
  );
};

export default SortableTask; 