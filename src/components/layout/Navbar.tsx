import { Box, Flex, Link, Button, useColorModeValue } from '@chakra-ui/react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { FaTasks, FaPlus, FaChartBar, FaCog } from 'react-icons/fa'

export const Navbar = () => {
  const location = useLocation()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const isActive = (path: string) => location.pathname === path

  return (
    <Box
      as="nav"
      position="fixed"
      top="0"
      width="100%"
      zIndex="sticky"
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      px={4}
    >
      <Flex h={16} alignItems="center" justifyContent="space-between" maxW="container.xl" mx="auto">
        <Flex alignItems="center" gap={8}>
          <Link
            as={RouterLink}
            to="/"
            fontSize="xl"
            fontWeight="bold"
            bgGradient="linear(to-r, blue.400, purple.500)"
            bgClip="text"
          >
            Momentum
          </Link>
          <Flex gap={4}>
            <Link
              as={RouterLink}
              to="/tasks"
              display="flex"
              alignItems="center"
              gap={2}
              px={3}
              py={2}
              borderRadius="md"
              color={isActive('/tasks') ? 'blue.500' : 'gray.600'}
              _hover={{ bg: 'gray.100' }}
              _active={{ bg: 'gray.200' }}
            >
              <FaTasks />
              Tasks
            </Link>
            <Link
              as={RouterLink}
              to="/tasks/new"
              display="flex"
              alignItems="center"
              gap={2}
              px={3}
              py={2}
              borderRadius="md"
              color={isActive('/tasks/new') ? 'blue.500' : 'gray.600'}
              _hover={{ bg: 'gray.100' }}
              _active={{ bg: 'gray.200' }}
            >
              <FaPlus />
              New Task
            </Link>
            <Link
              as={RouterLink}
              to="/review"
              display="flex"
              alignItems="center"
              gap={2}
              px={3}
              py={2}
              borderRadius="md"
              color={isActive('/review') ? 'blue.500' : 'gray.600'}
              _hover={{ bg: 'gray.100' }}
              _active={{ bg: 'gray.200' }}
            >
              <FaChartBar />
              Review
            </Link>
          </Flex>
        </Flex>
        <Link
          as={RouterLink}
          to="/settings"
          display="flex"
          alignItems="center"
          gap={2}
          px={3}
          py={2}
          borderRadius="md"
          color={isActive('/settings') ? 'blue.500' : 'gray.600'}
          _hover={{ bg: 'gray.100' }}
          _active={{ bg: 'gray.200' }}
        >
          <FaCog />
          Settings
        </Link>
      </Flex>
    </Box>
  )
} 