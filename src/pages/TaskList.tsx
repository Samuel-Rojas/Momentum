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
  Container,
} from '@chakra-ui/react';
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion';
import { DndContext, DragEndEvent, DragOverlay, closestCenter, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useTasks } from '../utils/TaskContext';
import SortableTask from '../components/task/SortableTask';
import { RiSearchLine, RiFilter3Line, RiAddLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box) as React.FC<HTMLMotionProps<"div">>;
const MotionVStack = motion(VStack) as React.FC<HTMLMotionProps<"div">>;
const MotionButton = motion(Button) as React.FC<HTMLMotionProps<"button">>;

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
  const mutedColor = useColorModeValue('gray.600', 'gray.300');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');
  const gradientBg = useColorModeValue(
    'linear-gradient(135deg, #f6f8fb 0%, #ffffff 100%)',
    'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)'
  );
  const filterBgColor = useColorModeValue('gray.50', 'gray.700');
  const filterBorderColor = useColorModeValue('gray.200', 'gray.600');
  const filterTextColor = useColorModeValue('gray.700', 'white');
  const filterPlaceholderColor = useColorModeValue('gray.500', 'gray.400');
  const statBgColor = useColorModeValue('white', 'gray.700');
  const statBorderColor = useColorModeValue('gray.200', 'gray.600');
  const statTextColor = useColorModeValue('gray.700', 'white');
  const statMutedColor = useColorModeValue('gray.500', 'gray.400');

  const { tasks, addTask, deleteTask, toggleTaskComplete, reorderTasks } = useTasks();
  const [view, setView] = useState<View>('list');
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    priority: 'all',
    category: 'all',
    status: 'all'
  });
  const [sortBy, setSortBy] = useState<SortBy>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [categories] = useState(['Work', 'Personal', 'Study', 'Health', 'Shopping', 'Other']);

  const pointerSensor = useSensor(PointerSensor);
  const sensors = useSensors(pointerSensor);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.priority !== 'all' && task.priority !== filters.priority) {
        return false;
      }
      if (filters.category !== 'all' && task.category !== filters.category) {
        return false;
      }
      if (filters.status === 'completed' && !task.completed) {
        return false;
      }
      if (filters.status === 'pending' && task.completed) {
        return false;
      }
      return true;
    });
  }, [tasks, filters]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex(task => task.id === active.id);
      const newIndex = tasks.findIndex(task => task.id === over.id);
      reorderTasks(oldIndex, newIndex);
    }
    setActiveId(null);
  };

  const handleFilterChange = (
    field: keyof FilterOptions,
    value: string
  ) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Box
      minH="100vh"
      bg={useColorModeValue('gray.50', 'gray.900')}
      pt="60px"
    >
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch" maxW="1200px" mx="auto">
          <Flex justify="space-between" align="center">
            <Heading size="lg" color={textColor}>Tasks</Heading>
            <Button
              leftIcon={<RiAddLine />}
              colorScheme="blue"
              onClick={() => navigate('/tasks/new')}
              size="md"
              fontWeight="semibold"
            >
              Add Task
            </Button>
          </Flex>

          <Box
            bg={filterBgColor}
            p={4}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={filterBorderColor}
          >
            <VStack spacing={4} align="stretch">
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <RiSearchLine color={filterPlaceholderColor} />
                </InputLeftElement>
                <Input
                  placeholder="Search tasks..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  bg={bgColor}
                  borderColor={borderColor}
                  _hover={{ borderColor: 'blue.400' }}
                  _focus={{ borderColor: 'blue.500' }}
                />
              </InputGroup>

              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <Select
                  value={filters.priority}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                  bg={bgColor}
                  borderColor={borderColor}
                  _hover={{ borderColor: 'blue.400' }}
                  _focus={{ borderColor: 'blue.500' }}
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </Select>

                <Select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  bg={bgColor}
                  borderColor={borderColor}
                  _hover={{ borderColor: 'blue.400' }}
                  _focus={{ borderColor: 'blue.500' }}
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>

                <Select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  bg={bgColor}
                  borderColor={borderColor}
                  _hover={{ borderColor: 'blue.400' }}
                  _focus={{ borderColor: 'blue.500' }}
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </Select>
              </SimpleGrid>
            </VStack>
          </Box>

          <StatGroup>
            <Stat
              bg={statBgColor}
              p={4}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={statBorderColor}
            >
              <StatLabel color={statTextColor}>Total Tasks</StatLabel>
              <StatNumber color={statTextColor}>{filteredTasks.length}</StatNumber>
              <StatHelpText color={statMutedColor}>
                {filteredTasks.length === tasks.length ? 'All tasks' : 'Filtered tasks'}
              </StatHelpText>
            </Stat>

            <Stat
              bg={statBgColor}
              p={4}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={statBorderColor}
            >
              <StatLabel color={statTextColor}>Completed</StatLabel>
              <StatNumber color={statTextColor}>
                {filteredTasks.filter((task) => task.completed).length}
              </StatNumber>
              <StatHelpText color={statMutedColor}>
                {((filteredTasks.filter((task) => task.completed).length / filteredTasks.length) * 100).toFixed(1)}% completion rate
              </StatHelpText>
            </Stat>
          </StatGroup>

          <Box
            bg={bgColor}
            p={6}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={filteredTasks.map((task) => task.id)}>
                <VStack spacing={4} align="stretch">
                  {filteredTasks.map((task) => (
                    <SortableTask
                      key={task.id}
                      task={task}
                      onComplete={toggleTaskComplete}
                      onDelete={deleteTask}
                      onEdit={(id: string) => navigate(`/tasks/edit/${id}`)}
                    />
                  ))}
                </VStack>
              </SortableContext>
            </DndContext>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default TaskList; 