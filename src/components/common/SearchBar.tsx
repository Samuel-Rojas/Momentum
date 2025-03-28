import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  useColorModeValue,
  Tooltip,
} from '@chakra-ui/react'
import { FiSearch, FiX } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import { fadeInRight, transitions } from '../../utils/animations'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const SearchBar = ({ value, onChange, placeholder = 'Search...' }: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const focusBorderColor = useColorModeValue('blue.500', 'blue.300')
  const iconColor = useColorModeValue('gray.400', 'gray.500')
  const iconHoverColor = useColorModeValue('gray.600', 'gray.300')

  useEffect(() => {
    // Add entrance animation class
    const searchBar = document.getElementById('search-bar')
    if (searchBar) {
      searchBar.style.animation = `${fadeInRight} 0.5s ${transitions.spring}`
    }
  }, [])

  return (
    <Box
      id="search-bar"
      position="relative"
      width="100%"
      maxW="600px"
      transition={transitions.smooth}
      transform={isFocused ? 'translateY(-2px)' : 'none'}
    >
      <InputGroup
        size="lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <InputLeftElement
          pointerEvents="none"
          children={
            <FiSearch
              size={20}
              color={isFocused ? focusBorderColor : iconColor}
              style={{ transition: transitions.smooth }}
            />
          }
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          bg={bgColor}
          borderWidth="2px"
          borderColor={isFocused ? focusBorderColor : isHovered ? borderColor : 'transparent'}
          _hover={{
            borderColor: focusBorderColor,
            boxShadow: 'sm',
          }}
          _focus={{
            borderColor: focusBorderColor,
            boxShadow: `0 0 0 1px ${focusBorderColor}`,
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          transition={transitions.smooth}
          pl="45px"
          borderRadius="xl"
        />
        {value && (
          <InputRightElement>
            <Tooltip label="Clear search" placement="top">
              <IconButton
                aria-label="Clear search"
                icon={<FiX />}
                size="sm"
                variant="ghost"
                color={iconColor}
                _hover={{ color: iconHoverColor }}
                onClick={() => onChange('')}
                transition={transitions.smooth}
              />
            </Tooltip>
          </InputRightElement>
        )}
      </InputGroup>
    </Box>
  )
} 