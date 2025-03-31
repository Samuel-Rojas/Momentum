import React from 'react';
import { Box, Container, useColorModeValue } from '@chakra-ui/react';
import { Navigation } from './Navigation';
import CommandPalette from './CommandPalette';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box minH="100vh" bg={bgColor}>
      <Navigation />
      <CommandPalette />
      <Box
        pt="60px"
        minH="calc(100vh - 60px)"
        width="100%"
        display="flex"
        justifyContent="center"
      >
        <Container
          maxW="1200px"
          py={8}
          px={{ base: 4, md: 8 }}
          width="100%"
          height="100%"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 