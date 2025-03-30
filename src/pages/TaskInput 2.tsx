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
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useTasks } from '../utils/TaskContext'
import { FiCalendar, FiX } from 'react-icons/fi'
import { SingleDatepicker } from 'chakra-dayzed-datepicker'
import { motion } from 'framer-motion'
import { RiAddLine } from 'react-icons/ri'
import RichTextEditor from '../components/common/RichTextEditor'

const MotionBox = motion(Box)

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
  const { addTask, categories } = useTasks()
  const [blue400, blue500] = useToken('colors', ['blue.400', 'blue.500'])

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    richDescription: '',
    priority: 'medium',
    category: '',
    dueDate: undefined,
    newTag: '',
    tags: [],
  })

  const [errors, setErrors] = useState<FormErrors>({
    name: '',
    description: '',
    priority: '',
    category: '',
  })

  const [currentTag, setCurrentTag] = useState('')
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const textColor = useColorModeValue('gray.700', 'white')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const gradientBg = useColorModeValue(
    'linear-gradient(135deg, #f6f8fb 0%, #ffffff 100%)',
    'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)'
  )

  const handleSubmit = (e: React.FormEvent) => {
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
      addTask({
        title: formData.title.trim(),
        description: formData.description.trim(),
        richDescription: formData.richDescription.trim(),
        priority: formData.priority,
        category: formData.category,
        dueDate: formData.dueDate,
        tags: formData.tags,
      })

      toast({
        title: 'Task added successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top-right',
      })

      navigate('/tasks', { replace: true })
    } catch (error) {
      toast({
        title: 'Error adding task',
        description: error instanceof Error ? error.message : 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
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

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      maxW="800px"
      mx="auto"
      p={6}
    >
      <Box
        as="form"
        onSubmit={handleSubmit}
        bg={bgColor}
        p={8}
        borderRadius="xl"
        boxShadow="lg"
        border="1px"
        borderColor={borderColor}
      >
        <VStack spacing={6} align="stretch">
          <Heading size="lg" color={textColor}>Create New Task</Heading>
          
          <FormControl isRequired isInvalid={!!errors.name}>
            <FormLabel>Task Title</FormLabel>
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter task title"
              size="lg"
            />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.category}>
            <FormLabel>Category</FormLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="Select category"
              size="lg"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.category}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.priority}>
            <FormLabel>Priority</FormLabel>
            <Select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              size="lg"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
            <FormErrorMessage>{errors.priority}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.description}>
            <FormLabel>Description</FormLabel>
            <RichTextEditor
              content={formData.richDescription}
              onChange={handleRichDescriptionChange}
              placeholder="Enter task description..."
            />
            <FormErrorMessage>{errors.description}</FormErrorMessage>
          </FormControl>

          <FormControl>
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
          </FormControl>

          <FormControl>
            <FormLabel>Tags</FormLabel>
            <InputGroup>
              <Input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add tags (press Enter)"
                size="lg"
              />
              <InputRightElement>
                <IconButton
                  aria-label="Add tag"
                  icon={<RiAddLine />}
                  variant="ghost"
                  onClick={handleAddTag}
                />
              </InputRightElement>
            </InputGroup>
            <Wrap mt={2}>
              {formData.tags.map((tag) => (
                <WrapItem key={tag}>
                  <Tag size="lg" borderRadius="full" variant="solid" colorScheme="blue">
                    <TagLabel>{tag}</TagLabel>
                    <TagCloseButton onClick={() => handleRemoveTag(tag)} />
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          </FormControl>

          <HStack spacing={4} justify="flex-end">
            <Button
              variant="outline"
              onClick={() => navigate('/tasks')}
              size="lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              isLoading={false}
            >
              Create Task
            </Button>
          </HStack>
        </VStack>
      </Box>

      <Modal isOpen={isDatePickerOpen} onClose={() => setIsDatePickerOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Due Date</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <SingleDatepicker
              name="date-input"
              date={formData.dueDate}
              onDateChange={(date) => {
                setFormData(prev => ({ ...prev, dueDate: date }))
                setIsDatePickerOpen(false)
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </MotionBox>
  )
} 