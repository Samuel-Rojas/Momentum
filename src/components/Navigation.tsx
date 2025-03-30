import React from 'react';
import {
  Box,
  Flex,
  Link,
  useColorModeValue,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { FiHome, FiSettings, FiBarChart2, FiLogOut } from 'react-icons/fi';

export const Navigation = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'white');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <Box
      as="nav"
      position="fixed"
      top={0}
      left={0}
      right={0}
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      zIndex={1000}
    >
      <Flex maxW="1200px" mx="auto" px={4} h="60px" align="center" justify="space-between">
        <Flex align="center" gap={8}>
          <Link
            as={RouterLink}
            to="/"
            color={textColor}
            fontWeight="bold"
            fontSize="xl"
            _hover={{ textDecoration: 'none' }}
          >
            Momentum
          </Link>
          <Flex gap={4}>
            <Link
              as={RouterLink}
              to="/tasks"
              color={textColor}
              display="flex"
              alignItems="center"
              gap={2}
            >
              <FiHome />
              Tasks
            </Link>
            <Link
              as={RouterLink}
              to="/insights"
              color={textColor}
              display="flex"
              alignItems="center"
              gap={2}
            >
              <FiBarChart2 />
              Insights
            </Link>
            <Link
              as={RouterLink}
              to="/settings"
              color={textColor}
              display="flex"
              alignItems="center"
              gap={2}
            >
              <FiSettings />
              Settings
            </Link>
          </Flex>
        </Flex>
        <Menu>
          <MenuButton
            as={Button}
            variant="ghost"
            color={textColor}
            display="flex"
            alignItems="center"
            gap={2}
          >
            <FiLogOut />
            Logout
          </MenuButton>
          <MenuList>
            <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
}; 