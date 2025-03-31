import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true,
};

const theme = extendTheme({
  config,
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === 'light' ? 'gray.50' : 'gray.900',
        color: props.colorMode === 'light' ? 'gray.800' : 'whiteAlpha.900',
      },
    }),
  },
  colors: {
    brand: {
      50: '#E3F2FD',
      100: '#BBDEFB',
      200: '#90CAF9',
      300: '#64B5F6',
      400: '#42A5F5',
      500: '#2196F3',
      600: '#1E88E5',
      700: '#1976D2',
      800: '#1565C0',
      900: '#0D47A1',
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'lg',
      },
      variants: {
        solid: (props: any) => ({
          bg: `${props.colorScheme}.500`,
          color: 'white',
          _hover: {
            bg: `${props.colorScheme}.600`,
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          },
          _active: {
            bg: `${props.colorScheme}.700`,
            transform: 'translateY(0)',
          },
          transition: 'all 0.2s',
        }),
        ghost: {
          _hover: {
            transform: 'translateY(-2px)',
          },
          _active: {
            transform: 'translateY(0)',
          },
          transition: 'all 0.2s',
        },
      },
    },
    Select: {
      variants: {
        filled: {
          field: {
            borderRadius: 'lg',
            _focus: {
              transform: 'translateY(-2px)',
              boxShadow: 'lg',
            },
            _hover: {
              transform: 'translateY(-1px)',
              boxShadow: 'md',
            },
            transition: 'all 0.2s',
            cursor: 'pointer',
          },
          icon: {
            transition: 'all 0.2s',
            _groupHover: {
              transform: 'translateY(-1px)',
            },
          },
        },
      },
      defaultProps: {
        variant: 'filled',
      },
    },
    Input: {
      variants: {
        filled: {
          field: {
            borderRadius: 'lg',
            _focus: {
              transform: 'translateY(-2px)',
              boxShadow: 'lg',
            },
            transition: 'all 0.2s',
          },
        },
      },
      defaultProps: {
        variant: 'filled',
      },
    },
    Textarea: {
      variants: {
        filled: {
          borderRadius: 'lg',
          _focus: {
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          },
          transition: 'all 0.2s',
        },
      },
      defaultProps: {
        variant: 'filled',
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'xl',
          overflow: 'hidden',
          transition: 'all 0.2s',
          _hover: {
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          },
        },
      },
    },
    Tag: {
      baseStyle: {
        container: {
          borderRadius: 'full',
        },
      },
      variants: {
        solid: {
          container: {
            _hover: {
              transform: 'translateY(-1px)',
              boxShadow: 'sm',
            },
            transition: 'all 0.2s',
          },
        },
      },
    },
  },
});

export default theme; 