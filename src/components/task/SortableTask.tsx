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
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
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
    scale: isDragging ? 1.02 : 1,
    boxShadow: isDragging ? '0 8px 16px rgba(0,0,0,0.1)' : 'none',
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.8 : 1,
  };

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'white');
  const mutedColor = useColorModeValue('gray.500', 'gray.300');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');
  const completedTextColor = useColorModeValue('gray.500', 'gray.400');
  const tagBgColor = useColorModeValue('blue.100', 'blue.900');
  const tagTextColor = useColorModeValue('blue.700', 'blue.200');

  const priorityColors = {
    high: useColorModeValue('red.500', 'red.300'),
    medium: useColorModeValue('orange.500', 'orange.300'),
    low: useColorModeValue('green.500', 'green.300'),
  };

  return (
    <MotionBox
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 25
        }
      }}
      exit={{ 
        opacity: 0, 
        y: -20,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 25
        }
      }}
      whileHover={{ 
        scale: 1.01,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        transition: { duration: 0.2 }
      }}
      p={4}
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      mb={2}
      position="relative"
      _hover={{ bg: hoverBgColor }}
      transition="all 0.2s"
    >
      <Flex align="center" justify="space-between">
        <HStack spacing={4} flex={1}>
          <IconButton
            aria-label="Drag handle"
            icon={<RiDraggable />}
            variant="ghost"
            size="sm"
            color={mutedColor}
            cursor="grab"
            {...attributes}
            {...listeners}
          />
          <VStack align="start" spacing={1} flex={1}>
            <Text
              fontSize="md"
              fontWeight="medium"
              color={task.completed ? completedTextColor : textColor}
              textDecoration={task.completed ? 'line-through' : 'none'}
            >
              {task.title}
            </Text>
            {task.description && (
              <Text fontSize="sm" color={mutedColor} noOfLines={2}>
                {task.description}
              </Text>
            )}
            <HStack spacing={2}>
              <Badge colorScheme={task.priority} variant="subtle">
                {task.priority}
              </Badge>
              <Badge variant="subtle" colorScheme="blue">
                {task.category}
              </Badge>
              {task.dueDate && (
                <HStack spacing={1}>
                  <RiTimeLine />
                  <Text fontSize="xs" color={mutedColor}>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </Text>
                </HStack>
              )}
            </HStack>
            {task.tags.length > 0 && (
              <Wrap spacing={2}>
                {task.tags.map((tag) => (
                  <WrapItem key={tag}>
                    <Tag size="sm" variant="subtle" colorScheme="blue">
                      <TagLabel>{tag}</TagLabel>
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
            )}
          </VStack>
        </HStack>
        <HStack spacing={2}>
          <Tooltip label={task.completed ? "Mark as incomplete" : "Mark as complete"}>
            <IconButton
              aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
              icon={<RiCheckLine />}
              variant={task.completed ? "solid" : "ghost"}
              colorScheme={task.completed ? "green" : "gray"}
              size="sm"
              onClick={() => onComplete(task.id)}
            />
          </Tooltip>
          <Tooltip label="Edit task">
            <IconButton
              aria-label="Edit task"
              icon={<RiEditLine />}
              variant="ghost"
              colorScheme="blue"
              size="sm"
              onClick={() => onEdit(task.id)}
            />
          </Tooltip>
          <Tooltip label="Delete task">
            <IconButton
              aria-label="Delete task"
              icon={<RiDeleteBin6Line />}
              variant="ghost"
              colorScheme="red"
              size="sm"
              onClick={() => onDelete(task.id)}
            />
          </Tooltip>
        </HStack>
      </Flex>
    </MotionBox>
  );
};

export default SortableTask; 