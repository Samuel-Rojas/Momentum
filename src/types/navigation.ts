export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline?: string;
  energyLevel: 'low' | 'medium' | 'high';
  priority: 'urgent' | 'flexible';
  status: 'pending' | 'completed';
  createdAt: string;
  completedAt?: string;
}

export type RootStackParamList = {
  Welcome: undefined;
  MainApp: undefined;
};

export type MainTabParamList = {
  DoNow: undefined;
  TaskEntry: undefined;
  TaskReview: undefined;
  Settings: undefined;
}; 