import React, { useEffect, useState, useRef } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Input,
  VStack,
  Text,
  Box,
  useColorModeValue,
  Icon,
  HStack,
  Kbd,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiSettings, FiList, FiHome, FiUser, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const MotionBox = motion(Box);

interface CommandItem {
  name: string;
  description: string;
  icon: any;
  path: string;
  shortcut?: string;
}

const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.500', 'gray.400');

  const commands: CommandItem[] = [
    {
      name: 'Home',
      description: 'Go to the home page',
      icon: FiHome,
      path: '/',
      shortcut: '⌘H',
    },
    {
      name: 'Tasks',
      description: 'View and manage your tasks',
      icon: FiList,
      path: '/tasks',
      shortcut: '⌘T',
    },
    {
      name: 'Settings',
      description: 'Manage your account settings',
      icon: FiSettings,
      path: '/settings',
      shortcut: '⌘S',
    },
    {
      name: 'Profile',
      description: 'View your profile',
      icon: FiUser,
      path: '/profile',
      shortcut: '⌘P',
    },
    {
      name: 'Sign Out',
      description: 'Sign out of your account',
      icon: FiLogOut,
      path: '/signout',
      shortcut: '⌘Q',
    },
  ];

  const filteredCommands = commands.filter(
    (command) =>
      command.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      command.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery('');
    setSelectedIndex(0);
    if (inputRef.current) {
      inputRef.current.blur();
    }
    // Restore previous focus
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  };

  const handleOpen = () => {
    // Store current focus before opening
    previousFocusRef.current = document.activeElement as HTMLElement;
    setIsOpen(true);
  };

  const handleCommandSelect = (command: CommandItem) => {
    if (command.path === '/signout') {
      signOut();
    } else {
      navigate(command.path);
    }
    handleClose();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        handleOpen();
      }
      if (e.key === 'Escape') {
        handleClose();
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        );
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        );
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const selectedCommand = filteredCommands[selectedIndex];
        if (selectedCommand) {
          handleCommandSelect(selectedCommand);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredCommands, selectedIndex, navigate, signOut]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl" isCentered>
      <ModalOverlay
        bg="blackAlpha.300"
        backdropFilter="blur(10px)"
        backdropInvert="80%"
      />
      <ModalContent
        bg={bgColor}
        borderWidth="1px"
        borderColor={borderColor}
        boxShadow="xl"
      >
        <ModalBody p={0}>
          <Box p={4} borderBottomWidth="1px" borderColor={borderColor}>
            <HStack spacing={2}>
              <Icon as={FiSearch} color={mutedColor} />
              <Input
                ref={inputRef}
                placeholder="Search commands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="unstyled"
                size="lg"
                autoFocus
                _focus={{
                  outline: 'none',
                  boxShadow: 'none',
                  border: 'none',
                  ring: 'none',
                }}
                _focusVisible={{
                  outline: 'none',
                  boxShadow: 'none',
                  border: 'none',
                  ring: 'none',
                }}
              />
              <Kbd>esc</Kbd>
            </HStack>
          </Box>
          <VStack spacing={0} maxH="400px" overflowY="auto">
            <AnimatePresence>
              {filteredCommands.map((command, index) => (
                <MotionBox
                  key={command.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  w="100%"
                  p={4}
                  cursor="pointer"
                  bg={selectedIndex === index ? hoverBgColor : 'transparent'}
                  _hover={{ bg: hoverBgColor }}
                  onClick={() => handleCommandSelect(command)}
                >
                  <HStack spacing={4}>
                    <Icon as={command.icon} color={mutedColor} />
                    <Box flex={1}>
                      <Text color={textColor} fontWeight="medium">
                        {command.name}
                      </Text>
                      <Text color={mutedColor} fontSize="sm">
                        {command.description}
                      </Text>
                    </Box>
                    {command.shortcut && (
                      <Kbd>{command.shortcut}</Kbd>
                    )}
                  </HStack>
                </MotionBox>
              ))}
            </AnimatePresence>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CommandPalette; 