import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

export type Priority = 'low' | 'medium' | 'high'
export type Category = string
export type SortBy = 'date' | 'priority' | 'category' | 'name'
export type SortOrder = 'asc' | 'desc'

export interface Task {
  id: string
  title: string
  description: string
  richDescription: string // For TipTap rich text
  priority: Priority
  category: Category
  completed: boolean
  createdAt: Date
  dueDate?: Date
  tags: string[]
  order: number // For drag and drop ordering
}

interface TaskStats {
  totalTasks: number
  completedTasks: number
  completionRate: number
  priorityDistribution: { [key: string]: number }
  categoryDistribution: { [key: string]: number }
  averageTasksPerDay: number
  upcomingDeadlines: Task[]
}

interface TaskContextType {
  tasks: Task[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  sortBy: SortBy
  setSortBy: (sortBy: SortBy) => void
  sortOrder: SortOrder
  setSortOrder: (order: SortOrder) => void
  selectedTasks: string[]
  setSelectedTasks: (ids: string[]) => void
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed' | 'order'>) => void
  editTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleTaskComplete: (id: string) => void
  startEditing: (id: string) => void
  stopEditing: (id: string) => void
  batchComplete: (ids: string[]) => void
  batchDelete: (ids: string[]) => void
  filteredAndSortedTasks: Task[]
  exportTasks: () => string
  importTasks: (jsonData: string) => void
  getTaskStats: () => TaskStats
  searchTasks: (query: string) => Task[]
  filterTasks: (filters: TaskFilters) => Task[]
  tags: string[]
  categories: string[]
  completeTask: (id: string) => void
  reorderTasks: (startIndex: number, endIndex: number) => void
}

interface TaskFilters {
  priority?: ('low' | 'medium' | 'high')[]
  category?: string[]
  completed?: boolean
  dueDateRange?: { start: Date; end: Date }
  tags?: string[]
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks')
    if (savedTasks) {
      const parsed = JSON.parse(savedTasks)
      return parsed.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined
      }))
    }
    return []
  })
  
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortBy>('date')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])

  // Add default categories
  const defaultCategories = ['Work', 'Personal', 'Study', 'Health', 'Shopping', 'Other']
  const [categories, setCategories] = useState<string[]>(() => {
    const savedCategories = localStorage.getItem('categories')
    return savedCategories ? JSON.parse(savedCategories) : defaultCategories
  })

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
    localStorage.setItem('categories', JSON.stringify(categories))
  }, [tasks, categories])

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'completed' | 'order'>) => {
    try {
      setTasks(prev => {
        const maxOrder = Math.max(...prev.map(t => t.order), 0)
        const newTask: Task = {
          ...taskData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          completed: false,
          order: maxOrder + 1,
          tags: taskData.tags || [],
          richDescription: taskData.richDescription || '',
          description: taskData.description || '',
          title: taskData.title || '',
          priority: taskData.priority || 'medium',
          category: taskData.category || 'Other'
        }
        return [...prev, newTask]
      })
    } catch (error) {
      console.error('Error adding task:', error)
      throw new Error('Failed to add task. Please try again.')
    }
  }, [])

  const editTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ))
  }

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id))
    setSelectedTasks(prev => prev.filter(taskId => taskId !== id))
  }, [])

  const toggleTaskComplete = (id: string) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const startEditing = (id: string) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, isEditing: true } : { ...task, isEditing: false }
    ))
  }

  const stopEditing = (id: string) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, isEditing: false } : task
    ))
  }

  const batchComplete = (ids: string[]) => {
    setTasks(prev => prev.map(task =>
      ids.includes(task.id) ? { ...task, completed: true } : task
    ))
    setSelectedTasks([])
  }

  const batchDelete = (ids: string[]) => {
    setTasks(prev => prev.filter(task => !ids.includes(task.id)))
    setSelectedTasks([])
  }

  const exportTasks = () => {
    return JSON.stringify(tasks, null, 2)
  }

  const importTasks = (jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData)
      if (!Array.isArray(parsed)) throw new Error('Invalid data format')
      
      const validatedTasks = parsed.map((task: any) => ({
        ...task,
        id: task.id || crypto.randomUUID(),
        createdAt: new Date(task.createdAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        completed: Boolean(task.completed),
        isEditing: false
      }))
      
      setTasks(validatedTasks)
    } catch (error) {
      console.error('Failed to import tasks:', error)
      throw new Error('Failed to import tasks. Please check the data format.')
    }
  }

  const filteredAndSortedTasks = (() => {
    let result = [...tasks]
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.category.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }
    
    // Apply sorting
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return sortOrder === 'asc'
            ? a.createdAt.getTime() - b.createdAt.getTime()
            : b.createdAt.getTime() - a.createdAt.getTime()
        case 'priority':
          return sortOrder === 'asc'
            ? priorityOrder[a.priority] - priorityOrder[b.priority]
            : priorityOrder[b.priority] - priorityOrder[a.priority]
        case 'category':
          return sortOrder === 'asc'
            ? a.category.localeCompare(b.category)
            : b.category.localeCompare(a.category)
        case 'name':
          return sortOrder === 'asc'
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title)
        default:
          return 0
      }
    })
    
    return result
  })()

  const getTaskStats = useCallback((): TaskStats => {
    const totalTasks = tasks.length
    const completedTasks = tasks.filter(t => t.completed).length
    
    const priorityDistribution = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1
      return acc
    }, {} as { [key: string]: number })

    const categoryDistribution = tasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1
      return acc
    }, {} as { [key: string]: number })

    const now = new Date()
    const upcomingDeadlines = tasks
      .filter(task => task.dueDate && !task.completed)
      .sort((a, b) => (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0))
      .slice(0, 5)

    return {
      totalTasks,
      completedTasks,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
      priorityDistribution,
      categoryDistribution,
      averageTasksPerDay: totalTasks / 30, // Simple average over 30 days
      upcomingDeadlines
    }
  }, [tasks])

  const searchTasks = useCallback((query: string): Task[] => {
    const searchTerm = query.toLowerCase()
    return tasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm) ||
      task.description.toLowerCase().includes(searchTerm) ||
      task.category.toLowerCase().includes(searchTerm) ||
      task.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }, [tasks])

  const filterTasks = useCallback((filters: TaskFilters): Task[] => {
    return tasks.filter(task => {
      if (filters.priority && !filters.priority.includes(task.priority)) return false
      if (filters.category && !filters.category.includes(task.category)) return false
      if (filters.completed !== undefined && task.completed !== filters.completed) return false
      if (filters.dueDateRange) {
        const taskDate = task.dueDate?.getTime()
        if (!taskDate) return false
        if (taskDate < filters.dueDateRange.start.getTime() || taskDate > filters.dueDateRange.end.getTime()) return false
      }
      if (filters.tags && !filters.tags.every(tag => task.tags.includes(tag))) return false
      return true
    })
  }, [tasks])

  const tags = Array.from(new Set(tasks.flatMap(t => t.tags)))

  const completeTask = useCallback((id: string) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, completed: true } : task
    ))
  }, [])

  const reorderTasks = useCallback((startIndex: number, endIndex: number) => {
    setTasks(prev => {
      const result = arrayMove(prev, startIndex, endIndex)
      return result.map((task, index) => ({ ...task, order: index + 1 }))
    })
  }, [])

  const value = {
    tasks,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    selectedTasks,
    setSelectedTasks,
    addTask,
    editTask,
    deleteTask,
    toggleTaskComplete,
    startEditing,
    stopEditing,
    batchComplete,
    batchDelete,
    filteredAndSortedTasks,
    exportTasks,
    importTasks,
    getTaskStats,
    searchTasks,
    filterTasks,
    tags,
    categories,
    completeTask,
    reorderTasks,
  }

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

export const useTasks = () => {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider')
  }
  return context
} 