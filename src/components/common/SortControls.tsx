import {
  HStack,
  Select,
  IconButton,
  Tooltip,
  useColorModeValue,
  Box,
} from '@chakra-ui/react'
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'
import { SortBy, SortOrder } from '../../utils/TaskContext'
import { fadeInLeft, transitions } from '../../utils/animations'
import { useEffect } from 'react'

interface SortControlsProps {
  sortBy: SortBy
  sortOrder: SortOrder
  onSortByChange: (value: SortBy) => void
  onSortOrderChange: (value: SortOrder) => void
}

export const SortControls = ({
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
}: SortControlsProps) => {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const iconColor = useColorModeValue('gray.600', 'gray.400')
  const activeIconColor = useColorModeValue('blue.500', 'blue.300')

  useEffect(() => {
    const controls = document.getElementById('sort-controls')
    if (controls) {
      controls.style.animation = `${fadeInLeft} 0.5s ${transitions.spring}`
    }
  }, [])

  return (
    <Box
      id="sort-controls"
      opacity="0"
    >
      <HStack spacing={2}>
        <Select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as SortBy)}
          size="md"
          width="auto"
          bg={bgColor}
          borderColor={borderColor}
          borderRadius="lg"
          _hover={{
            borderColor: 'blue.400',
            boxShadow: 'sm',
          }}
          transition={transitions.smooth}
        >
          <option value="date">Date</option>
          <option value="priority">Priority</option>
          <option value="category">Category</option>
          <option value="name">Name</option>
        </Select>

        <Tooltip label={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}>
          <IconButton
            aria-label="Toggle sort order"
            icon={sortOrder === 'asc' ? <FiArrowUp /> : <FiArrowDown />}
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            color={iconColor}
            _hover={{ color: activeIconColor }}
            variant="ghost"
            size="md"
            transition={transitions.smooth}
            transform={sortOrder === 'asc' ? 'none' : 'rotate(180deg)'}
          />
        </Tooltip>
      </HStack>
    </Box>
  )
} 