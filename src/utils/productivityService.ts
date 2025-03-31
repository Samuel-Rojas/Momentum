import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { Task } from './TaskContext';

interface ProductivityData {
  mostProductiveHour: number;
  mostProductiveDay: string;
  completionRateByHour: { [hour: number]: number };
  completionRateByDay: { [day: string]: number };
  averageCompletionTime: number;
}

export const analyzeProductivity = async (userId: string): Promise<ProductivityData> => {
  const tasksRef = collection(db, 'tasks');
  const q = query(
    tasksRef,
    where('userId', '==', userId),
    where('completed', '==', true)
  );

  const snapshot = await getDocs(q);
  const completedTasks = snapshot.docs.map(doc => ({
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    completedAt: doc.data().completedAt?.toDate(),
  })) as (Task & { completedAt: Date })[];

  // Analyze completion times by hour
  const completionRateByHour: { [hour: number]: number } = {};
  const completionCountByHour: { [hour: number]: number } = {};
  
  completedTasks.forEach(task => {
    const hour = task.completedAt.getHours();
    completionCountByHour[hour] = (completionCountByHour[hour] || 0) + 1;
  });

  // Calculate completion rates by hour
  Object.keys(completionCountByHour).forEach(hour => {
    const hourNum = parseInt(hour);
    completionRateByHour[hourNum] = completionCountByHour[hourNum] / completedTasks.length;
  });

  // Find most productive hour
  const mostProductiveHour = Object.entries(completionRateByHour)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || '0';

  // Analyze completion times by day
  const completionRateByDay: { [day: string]: number } = {};
  const completionCountByDay: { [day: string]: number } = {};
  
  completedTasks.forEach(task => {
    const day = task.completedAt.toLocaleDateString('en-US', { weekday: 'long' });
    completionCountByDay[day] = (completionCountByDay[day] || 0) + 1;
  });

  // Calculate completion rates by day
  Object.keys(completionCountByDay).forEach(day => {
    completionRateByDay[day] = completionCountByDay[day] / completedTasks.length;
  });

  // Find most productive day
  const mostProductiveDay = Object.entries(completionRateByDay)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'Monday';

  // Calculate average completion time
  const completionTimes = completedTasks.map(task => {
    if (!task.completedAt || !task.createdAt) return 0;
    return task.completedAt.getTime() - task.createdAt.getTime();
  }).filter(time => time > 0);

  const averageCompletionTime = completionTimes.length > 0
    ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
    : 0;

  return {
    mostProductiveHour: parseInt(mostProductiveHour),
    mostProductiveDay,
    completionRateByHour,
    completionRateByDay,
    averageCompletionTime,
  };
};

export const getProductivityRecommendations = (data: ProductivityData): string[] => {
  const recommendations: string[] = [];

  // Time-based recommendations
  if (data.mostProductiveHour >= 9 && data.mostProductiveHour <= 17) {
    recommendations.push('You tend to be most productive during work hours. Try to schedule important tasks during this time.');
  } else if (data.mostProductiveHour >= 18 && data.mostProductiveHour <= 23) {
    recommendations.push('You\'re most productive in the evening. Consider adjusting your schedule to take advantage of this time.');
  } else {
    recommendations.push('You\'re most productive in the early hours. Try to get important tasks done in the morning.');
  }

  // Day-based recommendations
  if (data.mostProductiveDay === 'Monday') {
    recommendations.push('You\'re most productive on Mondays. Use this day to tackle your most challenging tasks.');
  } else if (data.mostProductiveDay === 'Friday') {
    recommendations.push('You tend to be most productive on Fridays. Consider saving important tasks for the end of the week.');
  }

  // Completion time recommendations
  const avgHours = data.averageCompletionTime / (1000 * 60 * 60);
  if (avgHours > 24) {
    recommendations.push('Tasks take you more than a day to complete on average. Consider breaking them down into smaller, more manageable pieces.');
  } else if (avgHours < 1) {
    recommendations.push('You complete tasks quickly! Make sure you\'re not rushing through important tasks.');
  }

  return recommendations;
};

interface ProductivityMetrics {
  timeOfDay: string;
  dayOfWeek: string;
  category: string;
  priority: string;
  completionDuration: number; // in minutes
}

interface ProductivityPattern {
  mostProductiveTimeOfDay: string;
  mostProductiveDayOfWeek: string;
  bestCategories: string[];
  averageTaskDuration: number;
  recommendedTaskOrder: string[];
}

export class ProductivityService {
  private static MINIMUM_TASKS_FOR_ANALYSIS = 5;
  private metrics: ProductivityMetrics[] = [];
  private pattern: ProductivityPattern | null = null;

  addTaskCompletion(task: Task, completedAt: Date): void {
    const startTime = task.createdAt ? new Date(task.createdAt) : new Date();
    const completionTime = completedAt;
    
    const metrics: ProductivityMetrics = {
      timeOfDay: this.getTimeOfDayCategory(completionTime),
      dayOfWeek: completionTime.toLocaleDateString('en-US', { weekday: 'long' }),
      category: task.category,
      priority: task.priority,
      completionDuration: Math.round((completionTime.getTime() - startTime.getTime()) / (1000 * 60))
    };

    this.metrics.push(metrics);
    
    if (this.metrics.length >= ProductivityService.MINIMUM_TASKS_FOR_ANALYSIS) {
      this.analyzeProductivityPatterns();
    }
  }

  private getTimeOfDayCategory(date: Date): string {
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 17) return 'Afternoon';
    if (hour >= 17 && hour < 22) return 'Evening';
    return 'Night';
  }

  private analyzeProductivityPatterns(): void {
    const timeOfDayFrequency: { [key: string]: number } = {};
    const dayOfWeekFrequency: { [key: string]: number } = {};
    const categoryDurations: { [key: string]: number[] } = {};
    let totalDuration = 0;

    // Analyze completion patterns
    this.metrics.forEach(metric => {
      timeOfDayFrequency[metric.timeOfDay] = (timeOfDayFrequency[metric.timeOfDay] || 0) + 1;
      dayOfWeekFrequency[metric.dayOfWeek] = (dayOfWeekFrequency[metric.dayOfWeek] || 0) + 1;
      
      if (!categoryDurations[metric.category]) {
        categoryDurations[metric.category] = [];
      }
      categoryDurations[metric.category].push(metric.completionDuration);
      totalDuration += metric.completionDuration;
    });

    // Find most productive time of day
    const mostProductiveTimeOfDay = Object.entries(timeOfDayFrequency)
      .sort((a, b) => b[1] - a[1])[0][0];

    // Find most productive day of week
    const mostProductiveDayOfWeek = Object.entries(dayOfWeekFrequency)
      .sort((a, b) => b[1] - a[1])[0][0];

    // Calculate average durations by category
    const categoryEfficiency: { [key: string]: number } = {};
    Object.entries(categoryDurations).forEach(([category, durations]) => {
      categoryEfficiency[category] = durations.reduce((a, b) => a + b, 0) / durations.length;
    });

    // Sort categories by efficiency
    const bestCategories = Object.entries(categoryEfficiency)
      .sort((a, b) => a[1] - b[1])
      .map(([category]) => category);

    this.pattern = {
      mostProductiveTimeOfDay,
      mostProductiveDayOfWeek,
      bestCategories,
      averageTaskDuration: totalDuration / this.metrics.length,
      recommendedTaskOrder: this.generateRecommendedTaskOrder(bestCategories)
    };
  }

  private generateRecommendedTaskOrder(bestCategories: string[]): string[] {
    // Combine time of day and category preferences
    const timeSlots = ['Morning', 'Afternoon', 'Evening', 'Night'];
    const recommendedOrder: string[] = [];
    
    // Map categories to optimal time slots based on patterns
    timeSlots.forEach(timeSlot => {
      bestCategories.forEach(category => {
        if (timeSlot === this.pattern?.mostProductiveTimeOfDay) {
          recommendedOrder.push(`${timeSlot}-${category}`);
        }
      });
    });

    return recommendedOrder;
  }

  getProductivityInsights(): ProductivityPattern | null {
    return this.pattern;
  }

  canProvideInsights(): boolean {
    return this.metrics.length >= ProductivityService.MINIMUM_TASKS_FOR_ANALYSIS;
  }

  getOptimalTaskOrder(tasks: Task[]): Task[] {
    if (!this.pattern) return tasks;

    return [...tasks].sort((a, b) => {
      const aIndex = this.pattern!.recommendedTaskOrder.findIndex(
        order => order.includes(a.category)
      );
      const bIndex = this.pattern!.recommendedTaskOrder.findIndex(
        order => order.includes(b.category)
      );
      
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  }
} 