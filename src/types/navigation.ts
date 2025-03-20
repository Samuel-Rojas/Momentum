export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  energyLevel: 'low' | 'medium' | 'high';
  priority: 'urgent' | 'flexible';
  deadline?: string;
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