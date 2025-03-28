import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import TaskInput from './pages/TaskInput';
import TaskList from './pages/TaskList';
import TaskReview from './pages/TaskReview';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/add-task" element={<TaskInput />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/review" element={<TaskReview />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 