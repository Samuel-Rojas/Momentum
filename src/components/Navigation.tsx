import React from 'react';
import {
  Box,
  Flex,
  Button,
  useColorMode,
  IconButton,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  Text,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { FiLogOut, FiUser, FiSettings, FiMoon, FiSun, FiHome, FiBarChart2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export const Navigation: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');

  const handleSignOut = async () => {
    await signOut();
    onClose();
    navigate('/login');
  };

  return (
    <Box
      as="nav"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      bg={bgColor}
      borderBottomWidth="1px"
      borderColor={borderColor}
      px={4}
      py={2}
    >
      <Flex maxW="1200px" mx="auto" align="center" justify="space-between">
        <Flex align="center" gap={8}>
          <MotionBox
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            cursor="pointer"
            onClick={() => navigate('/')}
          >
            <Text
              fontSize="2xl"
              fontWeight="bold"
              bgGradient="linear(to-r, blue.500, purple.500)"
              bgClip="text"
              color="transparent"
            >
              Momentum
            </Text>
          </MotionBox>

          <Flex gap={4} display={{ base: 'none', md: 'flex' }}>
            <Button
              variant="ghost"
              leftIcon={<FiHome />}
              onClick={() => navigate('/tasks')}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'md',
              }}
              transition="all 0.2s"
            >
              Tasks
            </Button>
            <Button
              variant="ghost"
              leftIcon={<FiBarChart2 />}
              onClick={() => navigate('/insights')}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'md',
              }}
              transition="all 0.2s"
            >
              Insights
            </Button>
            <Button
              variant="ghost"
              leftIcon={<FiSettings />}
              onClick={() => navigate('/settings')}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'md',
              }}
              transition="all 0.2s"
            >
              Settings
            </Button>
          </Flex>
        </Flex>

        <Flex align="center" gap={4}>
          <IconButton
            aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
            icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
            onClick={toggleColorMode}
            variant="ghost"
            size="md"
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: 'md',
            }}
            transition="all 0.2s"
          />

          {user ? (
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                leftIcon={<Avatar size="sm" name={user.email} />}
                rightIcon={<FiLogOut />}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'md',
                }}
                transition="all 0.2s"
              >
                <Text display={{ base: 'none', md: 'block' }}>{user.email}</Text>
              </MenuButton>
              <MenuList>
                <MenuItem icon={<FiUser />} onClick={() => navigate('/profile')}>
                  Profile
                </MenuItem>
                <MenuItem icon={<FiSettings />} onClick={() => navigate('/settings')}>
                  Settings
                </MenuItem>
                <MenuDivider />
                <MenuItem
                  icon={<FiLogOut />}
                  color="red.500"
                  onClick={onOpen}
                  _hover={{ bg: 'red.50' }}
                >
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button
              colorScheme="blue"
              variant="outline"
              onClick={() => navigate('/login')}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'md',
              }}
              transition="all 0.2s"
            >
              Sign In
            </Button>
          )}
        </Flex>
      </Flex>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Sign Out
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to sign out? You'll need to sign in again to access your tasks.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleSignOut}
                ml={3}
                _hover={{
                  transform: 'translateY(-1px)',
                  boxShadow: 'md',
                }}
                transition="all 0.2s"
              >
                Sign Out
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}; 