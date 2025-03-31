import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import {
  collection,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  Timestamp,
  getDocs,
} from 'firebase/firestore'
import { db } from './firebase'
import { useAuth } from './AuthContext'
import { ProductivityService } from './ProductivityService'

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
  userId: string
  completedAt?: string
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
  addTask: (task: Omit<Task, 'id' | 'completed' | 'userId' | 'createdAt'>) => Promise<void>
  editTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  toggleComplete: (id: string) => Promise<void>
  startEditing: (id: string) => void
  stopEditing: (id: string) => void
  batchComplete: (ids: string[]) => void
  batchDelete: (ids: string[]) => void
  reorderTasks: (oldIndex: number, newIndex: number) => void
  getTaskStats: () => TaskStats
  filteredAndSortedTasks: Task[]
  exportTasks: () => string
  importTasks: (jsonData: string) => void
  productivityService: ProductivityService
  hasProductivityInsights: boolean
  getOptimalTaskOrder: () => Task[]
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export const useTasks = () => {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider')
  }
  return context
}

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortBy>('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [productivityService] = useState(() => new ProductivityService())
  const [hasProductivityInsights, setHasProductivityInsights] = useState(false)

  useEffect(() => {
    if (user) {
      const fetchTasks = async () => {
        const q = query(collection(db, 'tasks'), where('userId', '==', user.uid))
        const querySnapshot = await getDocs(q)
        const fetchedTasks = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Task))
        setTasks(fetchedTasks)

        // Process existing completed tasks for productivity analysis
        fetchedTasks.forEach(task => {
          if (task.completed && task.completedAt) {
            productivityService.addTaskCompletion(task, new Date(task.completedAt))
          }
        })

        setHasProductivityInsights(productivityService.canProvideInsights())
      }

      fetchTasks()
    }
  }, [user])

  const addTask = async (taskData: Omit<Task, 'id' | 'completed' | 'userId' | 'createdAt'>) => {
    if (!user) return

    const newTask = {
      ...taskData,
      completed: false,
      userId: user.uid,
      createdAt: new Date().toISOString()
    }

    const docRef = await addDoc(collection(db, 'tasks'), newTask)
    const task = { ...newTask, id: docRef.id }
    setTasks(prev => [...prev, task])
  }

  const editTask = async (id: string, updates: Partial<Task>) => {
    const taskRef = doc(db, 'tasks', id)
    await updateDoc(taskRef, updates)
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, ...updates } : task
      )
    )
  }

  const deleteTask = async (id: string) => {
    await deleteDoc(doc(db, 'tasks', id))
    setTasks(prev => prev.filter(task => task.id !== id))
  }

  const toggleComplete = async (id: string) => {
    const taskRef = doc(db, 'tasks', id)
    const task = tasks.find(t => t.id === id)
    if (!task) return

    const now = new Date()
    const updates = {
      completed: !task.completed,
      completedAt: !task.completed ? now.toISOString() : null
    }

    await updateDoc(taskRef, updates)
    
    if (!task.completed) {
      productivityService.addTaskCompletion(task, now)
      setHasProductivityInsights(productivityService.canProvideInsights())
    }

    setTasks(prev =>
      prev.map(t =>
        t.id === id ? { ...t, ...updates } : t
      )
    )
  }

  const reorderTasks = useCallback(async (oldIndex: number, newIndex: number) => {
    const newTasks = arrayMove(tasks, oldIndex, newIndex)
    setTasks(newTasks)

    // Update order in Firestore
    const batch = newTasks.map((task, index) => {
      const taskRef = doc(db, 'tasks', task.id)
      return updateDoc(taskRef, { order: index })
    })

    await Promise.all(batch)
  }, [tasks])

  const getTaskStats = useCallback(() => {
    const totalTasks = tasks.length
    const completedTasks = tasks.filter(t => t.completed).length
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

    const priorityDistribution = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1
      return acc
    }, {} as { [key: string]: number })

    const categoryDistribution = tasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1
      return acc
    }, {} as { [key: string]: number })

    const upcomingDeadlines = tasks
      .filter(t => t.dueDate && !t.completed)
      .sort((a, b) => (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0))
      .slice(0, 5)

    return {
      totalTasks,
      completedTasks,
      completionRate,
      priorityDistribution,
      categoryDistribution,
      averageTasksPerDay: 0,
      upcomingDeadlines,
    }
  }, [tasks])

  const filteredAndSortedTasks = tasks
    .filter(task => {
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      const multiplier = sortOrder === 'asc' ? 1 : -1
      switch (sortBy) {
        case 'date':
          return multiplier * ((a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0))
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return multiplier * (priorityOrder[a.priority] - priorityOrder[b.priority])
        case 'category':
          return multiplier * a.category.localeCompare(b.category)
        case 'name':
        default:
          return multiplier * a.title.localeCompare(b.title)
      }
    })

  const exportTasks = () => {
    return JSON.stringify(tasks, null, 2)
  }

  const importTasks = (jsonData: string) => {
    try {
      const importedTasks = JSON.parse(jsonData)
      // Add validation and processing here
      console.log('Importing tasks:', importedTasks)
    } catch (error) {
      console.error('Error importing tasks:', error)
    }
  }

  const getOptimalTaskOrder = () => {
    return productivityService.getOptimalTaskOrder(tasks)
  }

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
    toggleComplete,
    startEditing: () => {},
    stopEditing: () => {},
    batchComplete: () => {},
    batchDelete: () => {},
    reorderTasks,
    getTaskStats,
    filteredAndSortedTasks,
    exportTasks,
    importTasks,
    productivityService,
    hasProductivityInsights,
    getOptimalTaskOrder,
  }

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
} 