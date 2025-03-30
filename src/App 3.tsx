import { Box } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Welcome } from './pages/Welcome'
import { TaskInput } from './pages/TaskInput'
import TaskList from './pages/TaskList'
import { TaskReview } from './pages/TaskReview'
import { Settings } from './pages/Settings'
import { Navbar } from './components/layout/Navbar'
import { TaskProvider } from './utils/TaskContext'

function App() {
  return (
    <TaskProvider>
      <Router>
        <Box minH="100vh" bg="gray.50">
          <Navbar />
          <Box as="main" pt={16}>
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/tasks/new" element={<TaskInput />} />
              <Route path="/tasks" element={<TaskList />} />
              <Route path="/review" element={<TaskReview />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </TaskProvider>
  )
}

export default App
