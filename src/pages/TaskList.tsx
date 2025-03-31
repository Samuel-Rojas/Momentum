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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  FlexProps,
  SimpleGridProps,
} from '@chakra-ui/react';
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion';
import { DndContext, DragEndEvent, DragOverlay, closestCenter, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useTasks } from '../utils/TaskContext';
import SortableTask from '../components/task/SortableTask';
import { RiSearchLine, RiFilter3Line, RiAddLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiFilter } from 'react-icons/fi';

type Merge<P, T> = Omit<P, keyof T> & T;
type MotionBoxProps = Merge<HTMLMotionProps<"div">, FlexProps>;
type MotionSimpleGridProps = Merge<HTMLMotionProps<"div">, SimpleGridProps>;

const MotionBox = motion(Box);
const MotionFlex = motion(Flex) as React.FC<MotionBoxProps>;
const MotionSimpleGrid = motion(SimpleGrid) as React.FC<MotionSimpleGridProps>;
const MotionBadge = motion(Badge);

type View = 'list' | 'timeline' | 'stats';
type SortBy = 'createdAt' | 'dueDate' | 'priority' | 'title';

interface FilterOptions {
  search: string;
  priority: 'all' | 'high' | 'medium' | 'low';
  category: string;
  status: 'all' | 'completed' | 'pending';
}

export const TaskList: React.FC = () => {
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
    'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
    'linear-gradient(135deg, #1A365D 0%, #2C5282 100%)'
  );
  const filterBgColor = useColorModeValue('gray.50', 'gray.700');
  const filterBorderColor = useColorModeValue('gray.200', 'gray.600');
  const filterTextColor = useColorModeValue('gray.700', 'white');
  const filterPlaceholderColor = useColorModeValue('gray.500', 'gray.400');
  const statBgColor = useColorModeValue('white', 'gray.700');
  const statBorderColor = useColorModeValue('gray.200', 'gray.600');
  const statTextColor = useColorModeValue('gray.700', 'white');
  const statMutedColor = useColorModeValue('gray.500', 'gray.400');

  const {
    tasks,
    addTask,
    deleteTask,
    toggleComplete,
    reorderTasks,
    productivityService,
    hasProductivityInsights,
    getOptimalTaskOrder
  } = useTasks();
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
  const [filter, setFilter] = useState('all');

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

  const filterTasks = () => {
    let filteredTasks = [...tasks];
    if (filter === 'completed') {
      filteredTasks = tasks.filter(task => task.completed);
    } else if (filter === 'pending') {
      filteredTasks = tasks.filter(task => !task.completed);
    }
    return filteredTasks;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const statVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  return (
    <Box
      minH="100vh"
      bgGradient={gradientBg}
      py={12}
      px={4}
    >
      <Container maxW="1200px">
        <MotionBox
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <VStack spacing={8} align="stretch">
            <MotionFlex
              justify="space-between"
              align="center"
              variants={itemVariants}
            >
              <Heading size="lg" color={textColor}>Tasks</Heading>
              <HStack spacing={4}>
                <Menu>
                  <Tooltip label="Filter tasks">
                    <MenuButton
                      as={IconButton}
                      icon={<FiFilter />}
                      variant="ghost"
                      aria-label="Filter tasks"
                      _hover={{ transform: 'translateY(-2px)' }}
                      style={{ transition: 'all 0.2s' }}
                    />
                  </Tooltip>
                  <MenuList>
                    <MenuItem onClick={() => setFilter('all')}>All Tasks</MenuItem>
                    <MenuItem onClick={() => setFilter('completed')}>Completed</MenuItem>
                    <MenuItem onClick={() => setFilter('pending')}>Pending</MenuItem>
                  </MenuList>
                </Menu>
                <Button
                  leftIcon={<FiPlus />}
                  colorScheme="blue"
                  onClick={() => navigate('/tasks/new')}
                  size="md"
                  px={6}
                  fontWeight="semibold"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                  _active={{
                    transform: 'translateY(0)',
                  }}
                  style={{ transition: 'all 0.2s' }}
                >
                  Add Task
                </Button>
              </HStack>
            </MotionFlex>

            <MotionSimpleGrid
              columns={{ base: 1, md: 3 }}
              spacing={6}
              variants={itemVariants}
            >
              <MotionBox
                variants={statVariants}
                bg={statBgColor}
                p={6}
                borderRadius="xl"
                borderWidth="1px"
                borderColor={statBorderColor}
                boxShadow="sm"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'md',
                }}
                style={{ transition: 'all 0.2s' }}
              >
                <Stat>
                  <StatLabel color={mutedColor}>Total Tasks</StatLabel>
                  <StatNumber color={textColor}>{totalTasks}</StatNumber>
                  <StatHelpText>All tasks</StatHelpText>
                </Stat>
              </MotionBox>

              <MotionBox
                variants={statVariants}
                bg={statBgColor}
                p={6}
                borderRadius="xl"
                borderWidth="1px"
                borderColor={statBorderColor}
                boxShadow="sm"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'md',
                }}
                style={{ transition: 'all 0.2s' }}
              >
                <Stat>
                  <StatLabel color={mutedColor}>Completed</StatLabel>
                  <StatNumber color="green.500">{completedTasks}</StatNumber>
                  <StatHelpText>
                    <StatArrow type={completedTasks > 0 ? 'increase' : 'decrease'} />
                    {completionRate}% completion rate
                  </StatHelpText>
                </Stat>
              </MotionBox>

              <MotionBox
                variants={statVariants}
                bg={statBgColor}
                p={6}
                borderRadius="xl"
                borderWidth="1px"
                borderColor={statBorderColor}
                boxShadow="sm"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'md',
                }}
                style={{ transition: 'all 0.2s' }}
              >
                <Stat>
                  <StatLabel color={mutedColor}>Pending</StatLabel>
                  <StatNumber color="orange.500">{totalTasks - completedTasks}</StatNumber>
                  <StatHelpText>Tasks to complete</StatHelpText>
                </Stat>
              </MotionBox>
            </MotionSimpleGrid>

            <AnimatePresence mode="wait">
              <MotionBox
                variants={itemVariants}
                bg={bgColor}
                p={6}
                borderRadius="xl"
                borderWidth="1px"
                borderColor={borderColor}
                boxShadow="sm"
              >
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={filterTasks().map(task => task.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <VStack spacing={4} align="stretch">
                      <AnimatePresence>
                        {filterTasks().map((task, index) => (
                          <MotionBox
                            key={task.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{
                              duration: 0.2,
                              delay: index * 0.1
                            }}
                          >
                            <SortableTask
                              task={task}
                              onDelete={deleteTask}
                              onComplete={toggleComplete}
                              onEdit={(id) => navigate(`/tasks/edit/${id}`)}
                            />
                          </MotionBox>
                        ))}
                      </AnimatePresence>
                      {filterTasks().length === 0 && (
                        <MotionBox
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          textAlign="center"
                          py={8}
                        >
                          <Text color={mutedColor}>No tasks found</Text>
                        </MotionBox>
                      )}
                    </VStack>
                  </SortableContext>
                </DndContext>
              </MotionBox>
            </AnimatePresence>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default TaskList; 