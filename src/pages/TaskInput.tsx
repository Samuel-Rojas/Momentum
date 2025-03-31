import React, { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Heading,
  useToast,
  FormErrorMessage,
  useColorModeValue,
  Textarea,
  HStack,
  IconButton,
  Tooltip,
  Text,
  useToken,
  InputGroup,
  InputRightElement,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Container,
  Card,
  CardBody,
  useColorMode,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useTasks } from '../utils/TaskContext'
import { FiCalendar, FiX, FiPlus, FiArrowLeft, FiCheck } from 'react-icons/fi'
import { SingleDatepicker } from 'chakra-dayzed-datepicker'
import { motion, AnimatePresence } from 'framer-motion'
import { RiAddLine, RiArrowLeftLine } from 'react-icons/ri'
import RichTextEditor from '../components/common/RichTextEditor'

const MotionBox = motion(Box)
const MotionCard = motion(Card)
const MotionInput = motion(Input)
const MotionSelect = motion(Select)
const MotionTextarea = motion(Textarea)
const MotionButton = motion(Button)
const MotionFormControl = motion(FormControl)

const CATEGORIES = [
  { value: 'Work', color: 'blue', icon: '💼' },
  { value: 'Personal', color: 'purple', icon: '👤' },
  { value: 'Study', color: 'green', icon: '📚' },
  { value: 'Health', color: 'red', icon: '❤️' },
  { value: 'Shopping', color: 'orange', icon: '🛍️' },
  { value: 'Other', color: 'gray', icon: '📌' }
]

const PRIORITIES = [
  { value: 'low', label: 'Low Priority', color: 'green', icon: '🟢' },
  { value: 'medium', label: 'Medium Priority', color: 'yellow', icon: '🟡' },
  { value: 'high', label: 'High Priority', color: 'red', icon: '🔴' }
]

interface FormData {
  title: string;
  description: string;
  richDescription: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate?: Date;
  newTag: string;
  tags: string[];
}

interface FormErrors {
  name: string
  description: string
  priority: string
  category: string
}

export const TaskInput = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const { colorMode } = useColorMode()
  const [blue400, blue500] = useToken('colors', ['blue.400', 'blue.500'])
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const textColor = useColorModeValue('gray.700', 'white')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const gradientBg = useColorModeValue(
    'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
    'linear-gradient(135deg, #1A365D 0%, #2C5282 100%)'
  )

  const { addTask } = useTasks()
  const [currentTag, setCurrentTag] = useState('')
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    richDescription: '',
    priority: 'medium',
    category: '',
    newTag: '',
    tags: [],
  })

  const [errors, setErrors] = useState<FormErrors>({
    name: '',
    description: '',
    priority: '',
    category: '',
  })

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({ name: '', description: '', priority: '', category: '' })

    let hasErrors = false
    const newErrors = { ...errors }

    if (!formData.title.trim()) {
      newErrors.name = 'Task name is required'
      hasErrors = true
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
      hasErrors = true
    }

    if (!formData.priority) {
      newErrors.priority = 'Priority is required'
      hasErrors = true
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
      hasErrors = true
    }

    if (hasErrors) {
      setErrors(newErrors)
      return
    }

    try {
      await addTask({
        ...formData,
      })
      toast({
        title: 'Task created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      navigate('/tasks')
    } catch (error) {
      toast({
        title: 'Error adding task',
        description: error instanceof Error ? error.message : 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }))
      setCurrentTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleRichDescriptionChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      richDescription: content,
      description: content.replace(/<[^>]*>/g, ''),
    }))
  }

  const getCategoryColor = (category: string) => {
    return CATEGORIES.find(c => c.value === category)?.color || 'gray';
  };

  const getPriorityColor = (priority: string) => {
    return PRIORITIES.find(p => p.value === priority)?.color || 'gray';
  };

  return (
    <Box
      minH="100vh"
      bgGradient={gradientBg}
      py={12}
      px={4}
    >
      <Container maxW="800px">
        <MotionBox
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          bg={bgColor}
          p={8}
          borderRadius="2xl"
          boxShadow="xl"
          border="1px"
          borderColor={borderColor}
          overflow="hidden"
        >
          <VStack spacing={6} align="stretch">
            <HStack justify="space-between" mb={4}>
              <MotionButton
                leftIcon={<FiArrowLeft />}
                variant="ghost"
                onClick={() => navigate('/tasks')}
                whileHover={{ x: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                Back
              </MotionButton>
              <Heading size="lg">Create New Task</Heading>
            </HStack>

            <form onSubmit={handleSubmit}>
              <VStack spacing={6}>
                <MotionFormControl
                  variants={itemVariants}
                  isInvalid={!!errors.name}
                >
                  <FormLabel>Task Title</FormLabel>
                  <MotionInput
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter task title"
                    size="lg"
                    bg={useColorModeValue('gray.50', 'gray.700')}
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  />
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                </MotionFormControl>

                <MotionFormControl
                  variants={itemVariants}
                  isInvalid={!!errors.category}
                >
                  <FormLabel>Category</FormLabel>
                  <Box position="relative">
                    <MotionSelect
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="Select category"
                      size="lg"
                      bg={useColorModeValue('gray.50', 'gray.700')}
                      color={formData.category ? `${getCategoryColor(formData.category)}.500` : undefined}
                      sx={{
                        '& option': {
                          color: 'inherit',
                          bg: useColorModeValue('white', 'gray.800'),
                        }
                      }}
                      icon={
                        formData.category ? 
                        <Text fontSize="lg">
                          {CATEGORIES.find(c => c.value === formData.category)?.icon}
                        </Text> : undefined
                      }
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      {CATEGORIES.map(({ value, color, icon }) => (
                        <option key={value} value={value}>
                          {icon} {value}
                        </option>
                      ))}
                    </MotionSelect>
                    {formData.category && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        style={{
                          position: 'absolute',
                          top: '-10px',
                          right: '-10px',
                          zIndex: 1,
                        }}
                      >
                        <Box
                          bg={`${getCategoryColor(formData.category)}.500`}
                          borderRadius="full"
                          p={1}
                          color="white"
                          fontSize="sm"
                        >
                          {CATEGORIES.find(c => c.value === formData.category)?.icon}
                        </Box>
                      </motion.div>
                    )}
                  </Box>
                  <FormErrorMessage>{errors.category}</FormErrorMessage>
                </MotionFormControl>

                <MotionFormControl
                  variants={itemVariants}
                  isInvalid={!!errors.priority}
                >
                  <FormLabel>Priority</FormLabel>
                  <Box position="relative">
                    <MotionSelect
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      size="lg"
                      bg={useColorModeValue('gray.50', 'gray.700')}
                      color={`${getPriorityColor(formData.priority)}.500`}
                      sx={{
                        '& option': {
                          color: 'inherit',
                          bg: useColorModeValue('white', 'gray.800'),
                        }
                      }}
                      icon={
                        <Text fontSize="lg">
                          {PRIORITIES.find(p => p.value === formData.priority)?.icon}
                        </Text>
                      }
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      {PRIORITIES.map(({ value, label, color, icon }) => (
                        <option key={value} value={value}>
                          {icon} {label}
                        </option>
                      ))}
                    </MotionSelect>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                      style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '-10px',
                        zIndex: 1,
                      }}
                    >
                      <Box
                        bg={`${getPriorityColor(formData.priority)}.500`}
                        borderRadius="full"
                        p={1}
                        color="white"
                        fontSize="sm"
                      >
                        {PRIORITIES.find(p => p.value === formData.priority)?.icon}
                      </Box>
                    </motion.div>
                  </Box>
                  <FormErrorMessage>{errors.priority}</FormErrorMessage>
                </MotionFormControl>

                <MotionFormControl
                  variants={itemVariants}
                  isInvalid={!!errors.description}
                >
                  <FormLabel>Description</FormLabel>
                  <MotionTextarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter task description..."
                    bg={useColorModeValue('gray.50', 'gray.700')}
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  />
                  <FormErrorMessage>{errors.description}</FormErrorMessage>
                </MotionFormControl>

                <MotionFormControl variants={itemVariants}>
                  <FormLabel>Due Date</FormLabel>
                  <SingleDatepicker
                    name="date-input"
                    date={formData.dueDate}
                    onDateChange={(date) => {
                      setFormData(prev => ({ ...prev, dueDate: date }))
                    }}
                    triggerVariant="input"
                    closeOnSelect
                    propsConfigs={{
                      inputProps: {
                        placeholder: "Select due date",
                        size: "lg",
                      },
                      triggerIconBtnProps: {
                        children: <FiCalendar />,
                        variant: "ghost",
                      }
                    }}
                  />
                </MotionFormControl>

                <MotionFormControl variants={itemVariants}>
                  <FormLabel>Tags</FormLabel>
                  <HStack>
                    <MotionInput
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Add tags (press Enter)"
                      size="lg"
                      bg={useColorModeValue('gray.50', 'gray.700')}
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    />
                    <Tooltip label="Add tag">
                      <IconButton
                        aria-label="Add tag"
                        icon={<FiPlus />}
                        onClick={handleAddTag}
                        colorScheme="blue"
                      />
                    </Tooltip>
                  </HStack>
                  <Box mt={2}>
                    <Wrap spacing={2}>
                      <AnimatePresence>
                        {formData.tags.map((tag) => (
                          <WrapItem key={tag}>
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Tag
                                size="md"
                                borderRadius="full"
                                variant="solid"
                                colorScheme="blue"
                              >
                                <TagLabel>{tag}</TagLabel>
                                <TagCloseButton onClick={() => handleRemoveTag(tag)} />
                              </Tag>
                            </motion.div>
                          </WrapItem>
                        ))}
                      </AnimatePresence>
                    </Wrap>
                  </Box>
                </MotionFormControl>

                <MotionButton
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  width="100%"
                  leftIcon={<FiCheck />}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  variants={itemVariants}
                >
                  Create Task
                </MotionButton>
              </VStack>
            </form>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  )
}

export default TaskInput; 