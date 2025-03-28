import React, { useState, useMemo } from 'react';
import {
  Box,
  VStack,
  Text,
  Badge,
  IconButton,
  Tooltip,
  useColorModeValue,
  Input,
  Select,
  HStack,
  Flex,
  SimpleGrid,
  Heading,
  Button,
  useToast,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  useColorMode,
  Switch,
  FormLabel,
  FormControl,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
  Center,
  Divider,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Textarea,
  Checkbox,
  Wrap,
  WrapItem,
  Tag,
  TagLabel,
  TagCloseButton,
  useToken,
  ButtonGroup,
  Spacer,
} from '@chakra-ui/react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { RiCheckLine, RiDeleteBin6Line, RiDraggable } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '../utils/TaskContext';
import TaskTimeline from '../components/task/TaskTimeline';
import TaskStats from '../components/task/TaskStats';
import SortableTask from '../components/task/SortableTask';
import { FiPlus, FiSearch, FiFilter, FiX, FiCheck, FiTrash2, FiEdit2, FiCalendar, FiTag, FiList, FiBarChart2, FiClock, FiCheckSquare, FiSquare, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Priority } from '../utils/TaskContext';

const MotionBox = motion(Box);

type View = 'list' | 'timeline' | 'stats';
type SortBy = 'createdAt' | 'dueDate' | 'priority' | 'title';

interface FilterOptions {
  search: string;
  priority: 'all' | 'high' | 'medium' | 'low';
  category: string;
  status: 'all' | 'completed' | 'pending';
}

const TaskList: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const [blue400, blue500] = useToken('colors', ['blue.400', 'blue.500']);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const gradientBg = useColorModeValue(
    'linear-gradient(135deg, #f6f8fb 0%, #ffffff 100%)',
    'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)'
  );

  const { tasks, addTask, deleteTask, toggleTaskComplete, editTask, categories, reorderTasks } = useTasks();
  const [view, setView] = useState<View>('list');
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    priority: 'all',
    category: '',
    status: 'all',
  });
  const [sortBy, setSortBy] = useState<SortBy>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);
      reorderTasks(oldIndex, newIndex);
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description?.toLowerCase().includes(filters.search.toLowerCase());
      const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
      const matchesCategory = !filters.category || task.category === filters.category;
      const matchesStatus = filters.status === 'all' || 
        (task.completed ? filters.status === 'completed' : filters.status === 'pending');
      return matchesSearch && matchesPriority && matchesCategory && matchesStatus;
    });
  }, [tasks, filters]);

  const handleFilterChange = (
    field: keyof FilterOptions,
    value: string | string[] | boolean | null
  ) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Box maxW="1200px" mx="auto" px={4} py={8}>
      <VStack spacing={6} align="stretch">
        <Flex justify="space-between" align="center">
          <Heading size="lg">Tasks</Heading>
          <Button
            leftIcon={<FiPlus />}
            colorScheme="blue"
            onClick={() => navigate('/tasks/new')}
          >
            Add Task
          </Button>
        </Flex>

        <Box>
          <InputGroup mb={4}>
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </InputGroup>

          <HStack spacing={4} mb={4}>
            <Select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              w="200px"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </Select>
            <Select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              w="200px"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>
            <Select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              w="200px"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </HStack>

          <HStack spacing={4} mb={4}>
            <ButtonGroup size="sm" isAttached variant="outline">
              <IconButton
                aria-label="List view"
                icon={<FiList />}
                onClick={() => setView('list')}
                colorScheme={view === 'list' ? 'blue' : 'gray'}
              />
              <IconButton
                aria-label="Timeline view"
                icon={<FiCalendar />}
                onClick={() => setView('timeline')}
                colorScheme={view === 'timeline' ? 'blue' : 'gray'}
              />
              <IconButton
                aria-label="Stats view"
                icon={<FiBarChart2 />}
                onClick={() => setView('stats')}
                colorScheme={view === 'stats' ? 'blue' : 'gray'}
              />
            </ButtonGroup>
            <Spacer />
            <HStack>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                w="150px"
                size="sm"
              >
                <option value="createdAt">Created Date</option>
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </Select>
              <IconButton
                aria-label="Toggle sort order"
                icon={sortOrder === 'asc' ? <FiArrowUp /> : <FiArrowDown />}
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                size="sm"
                variant="ghost"
              />
            </HStack>
          </HStack>
        </Box>

        {view === 'timeline' ? (
          <TaskTimeline tasks={filteredTasks} />
        ) : view === 'stats' ? (
          <TaskStats tasks={filteredTasks} />
        ) : tasks.length === 0 ? (
          <Center py={12}>
            <VStack spacing={4}>
              <Text fontSize="lg" color="gray.500">
                No tasks yet. Create your first task!
              </Text>
              <Button
                leftIcon={<FiPlus />}
                colorScheme="blue"
                onClick={() => navigate('/tasks/new')}
              >
                Add Task
              </Button>
            </VStack>
          </Center>
        ) : filteredTasks.length === 0 ? (
          <Center py={12}>
            <Text fontSize="lg" color="gray.500">
              No tasks match your filters
            </Text>
          </Center>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredTasks.map(task => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <VStack spacing={4} align="stretch">
                <AnimatePresence>
                  {filteredTasks.map((task) => (
                    <SortableTask
                      key={task.id}
                      task={task}
                      onComplete={toggleTaskComplete}
                      onDelete={deleteTask}
                      onEdit={(id: string) => navigate(`/tasks/edit/${id}`)}
                    />
                  ))}
                </AnimatePresence>
              </VStack>
            </SortableContext>
          </DndContext>
        )}
      </VStack>
    </Box>
  );
};

export default TaskList; 