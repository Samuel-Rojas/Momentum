import {
  Box,
  VStack,
  Heading,
  Text,
  useColorMode,
  useColorModeValue,
  Button,
  Divider,
  HStack,
  IconButton,
  Tooltip,
  useToast,
  Switch,
  FormControl,
  FormLabel,
  useToken,
} from '@chakra-ui/react'
import { FiDownload, FiUpload, FiTrash2, FiMoon, FiSun } from 'react-icons/fi'
import { useTasks } from '../utils/TaskContext'
import { fadeInUp, bounceIn, transitions } from '../utils/animations'
import { useRef } from 'react'

export const Settings = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const { tasks, importTasks } = useTasks()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()
  const [blue400, blue500] = useToken('colors', ['blue.400', 'blue.500'])

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const textColor = useColorModeValue('gray.700', 'white')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const gradientBg = useColorModeValue(
    'linear-gradient(135deg, #f6f8fb 0%, #ffffff 100%)',
    'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)'
  )

  const handleExport = () => {
    const dataStr = JSON.stringify(tasks, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `momentum-tasks-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: 'Tasks exported successfully',
      status: 'success',
      duration: 2000,
      position: 'top-right',
    })
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const jsonData = e.target?.result as string
        importTasks(jsonData)
        toast({
          title: 'Tasks imported successfully',
          status: 'success',
          duration: 2000,
          position: 'top-right',
        })
      } catch (error) {
        toast({
          title: 'Failed to import tasks',
          description: 'Please check the file format',
          status: 'error',
          duration: 3000,
          position: 'top-right',
        })
      }
    }
    reader.readAsText(file)
  }

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all tasks? This action cannot be undone.')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <Box
      minH="calc(100vh - 64px)"
      w="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={useColorModeValue('gray.50', 'gray.900')}
      px={4}
      py={8}
    >
      <Box
        w="100%"
        maxW="600px"
        p={8}
        bg={gradientBg}
        borderRadius="2xl"
        boxShadow="xl"
        borderWidth="1px"
        borderColor={borderColor}
        position="relative"
        overflow="hidden"
        animation={`${fadeInUp} 0.5s ${transitions.spring}`}
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: `linear-gradient(to right, ${blue400}, ${blue500})`,
        }}
      >
        <VStack spacing={8} align="stretch">
          <Heading
            textAlign="center"
            color={textColor}
            animation={`${bounceIn} 0.6s ${transitions.spring}`}
          >
            Settings
          </Heading>

          <VStack spacing={6} align="stretch">
            <Box>
              <Heading size="md" color={textColor} mb={4}>
                Appearance
              </Heading>
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="color-mode" mb="0" color={textColor}>
                  Dark Mode
                </FormLabel>
                <HStack spacing={4}>
                  <Switch
                    id="color-mode"
                    isChecked={colorMode === 'dark'}
                    onChange={toggleColorMode}
                    colorScheme="blue"
                  />
                  <IconButton
                    aria-label="Toggle color mode"
                    icon={colorMode === 'dark' ? <FiSun /> : <FiMoon />}
                    onClick={toggleColorMode}
                    variant="ghost"
                    color={mutedColor}
                    _hover={{ color: textColor }}
                  />
                </HStack>
              </FormControl>
            </Box>

            <Divider />

            <Box>
              <Heading size="md" color={textColor} mb={4}>
                Data Management
              </Heading>
              <VStack spacing={4} align="stretch">
                <HStack>
                  <Button
                    leftIcon={<FiDownload />}
                    onClick={handleExport}
                    colorScheme="blue"
                    variant="outline"
                    flex={1}
                  >
                    Export Tasks
                  </Button>
                  <Button
                    leftIcon={<FiUpload />}
                    onClick={() => fileInputRef.current?.click()}
                    colorScheme="blue"
                    variant="outline"
                    flex={1}
                  >
                    Import Tasks
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImport}
                    accept=".json"
                    style={{ display: 'none' }}
                  />
                </HStack>
                <Tooltip label="This action cannot be undone" placement="top">
                  <Button
                    leftIcon={<FiTrash2 />}
                    onClick={handleClearData}
                    colorScheme="red"
                    variant="ghost"
                  >
                    Clear All Data
                  </Button>
                </Tooltip>
              </VStack>
            </Box>

            <Divider />

            <Box>
              <Heading size="md" color={textColor} mb={4}>
                About
              </Heading>
              <Text color={mutedColor}>
                Momentum is a beautiful and intuitive task management application designed to help you
                stay organized and productive. Built with React and Chakra UI.
              </Text>
              <Text color={mutedColor} mt={2}>
                Version 1.0.0
              </Text>
            </Box>
          </VStack>
        </VStack>
      </Box>
    </Box>
  )
} 