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
} from 'firebase/firestore'
import { db } from './firebase'
import { useAuth } from './AuthContext'

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
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed' | 'order' | 'userId'>) => void
  editTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleTaskComplete: (id: string) => void
  startEditing: (id: string) => void
  stopEditing: (id: string) => void
  batchComplete: (ids: string[]) => void
  batchDelete: (ids: string[]) => void
  reorderTasks: (oldIndex: number, newIndex: number) => void
  getTaskStats: () => TaskStats
  filteredAndSortedTasks: Task[]
  exportTasks: () => string
  importTasks: (jsonData: string) => void
}

const TaskContext = createContext<TaskContextType>({} as TaskContextType)

export const useTasks = () => useContext(TaskContext)

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortBy>('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])

  useEffect(() => {
    if (!user) return

    const tasksRef = collection(db, 'tasks')
    const q = query(
      tasksRef,
      where('userId', '==', user.uid)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        dueDate: doc.data().dueDate?.toDate(),
      })) as Task[]

      // Sort tasks by order in memory
      const sortedTasks = tasksData.sort((a, b) => a.order - b.order)
      setTasks(sortedTasks)
    })

    return () => unsubscribe()
  }, [user])

  const addTask = useCallback(async (task: Omit<Task, 'id' | 'createdAt' | 'completed' | 'order' | 'userId'>) => {
    if (!user) return

    const tasksRef = collection(db, 'tasks')
    const newTask = {
      ...task,
      completed: false,
      order: tasks.length,
      createdAt: Timestamp.now(),
      userId: user.uid,
    }

    await addDoc(tasksRef, newTask)
  }, [user, tasks.length])

  const editTask = useCallback(async (id: string, updates: Partial<Task>) => {
    const taskRef = doc(db, 'tasks', id)
    await updateDoc(taskRef, updates)
  }, [])

  const deleteTask = useCallback(async (id: string) => {
    const taskRef = doc(db, 'tasks', id)
    await deleteDoc(taskRef)
  }, [])

  const toggleTaskComplete = useCallback(async (id: string) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return

    const taskRef = doc(db, 'tasks', id)
    await updateDoc(taskRef, { completed: !task.completed })
  }, [tasks])

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
    startEditing: () => {},
    stopEditing: () => {},
    batchComplete: () => {},
    batchDelete: () => {},
    reorderTasks,
    getTaskStats,
    filteredAndSortedTasks,
    exportTasks,
    importTasks,
  }

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
} 