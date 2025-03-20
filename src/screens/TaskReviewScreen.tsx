import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTaskContext } from '../context/TaskContext';
import type { Task } from '../types/navigation';
import Animated, {
  FadeIn,
  FadeInDown,
  Layout,
  SlideInRight,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

export const TaskReviewScreen = () => {
  const { tasks } = useTaskContext();

  const completedTasks = tasks.filter(task => task.status === 'completed');
  const totalTasks = tasks.length;
  const completedCount = completedTasks.length;

  const stats = {
    totalCompleted: completedCount,
    urgentTasks: completedTasks.filter(task => task.priority === 'urgent').length,
    highEnergyTasks: completedTasks.filter(task => task.energyLevel === 'high').length,
    onTimeCompletion: completedTasks.filter(task => {
      if (!task.deadline || !task.completedAt) return false;
      return new Date(task.completedAt) <= new Date(task.deadline);
    }).length,
  };

  const getEnergyColor = (level: Task['energyLevel']) => {
    switch (level) {
      case 'low': return '#34c759';
      case 'medium': return '#ff9500';
      case 'high': return '#ff3b30';
      default: return '#8E8E93';
    }
  };

  const getEnergyIcon = (level: Task['energyLevel']) => {
    switch (level) {
      case 'low': return 'battery-low';
      case 'medium': return 'battery-medium';
      case 'high': return 'battery-high';
      default: return 'battery';
    }
  };

  const renderStatCard = (
    title: string,
    value: number,
    icon: keyof typeof MaterialCommunityIcons.glyphMap,
    color: string,
    index: number,
  ) => (
    <Animated.View
      entering={SlideInRight.delay(index * 100).springify()}
      style={[styles.statCard, { backgroundColor: color + '10' }]}
    >
      <View style={[styles.statIconContainer, { backgroundColor: color }]}>
        <MaterialCommunityIcons name={icon} size={24} color="white" />
      </View>
      <View style={styles.statContent}>
        <Animated.Text 
          entering={FadeIn.delay(index * 100 + 200)}
          style={[styles.statValue, { color }]}
        >
          {value}
        </Animated.Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        entering={FadeIn.duration(300)}
        style={styles.header}
      >
        <Text style={styles.title}>Task Review</Text>
        <Text style={styles.subtitle}>
          {completedCount} of {totalTasks} tasks completed
        </Text>
      </Animated.View>

      <ScrollView style={styles.content}>
        <Animated.View 
          entering={FadeInDown.duration(500)}
          layout={Layout.springify()}
        >
          <View style={styles.statsGrid}>
            {renderStatCard(
              'Completed',
              stats.totalCompleted,
              'check-circle',
              '#34c759',
              0,
            )}
            {renderStatCard(
              'Urgent Tasks',
              stats.urgentTasks,
              'alert-circle',
              '#ff3b30',
              1,
            )}
            {renderStatCard(
              'High Energy',
              stats.highEnergyTasks,
              'battery-high',
              '#ff9500',
              2,
            )}
            {renderStatCard(
              'On Time',
              stats.onTimeCompletion,
              'clock-check',
              '#007AFF',
              3,
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recently Completed</Text>
            {completedTasks.length > 0 ? (
              completedTasks
                .sort((a, b) => {
                  const dateA = new Date(a.completedAt || '');
                  const dateB = new Date(b.completedAt || '');
                  return dateB.getTime() - dateA.getTime();
                })
                .slice(0, 5)
                .map((task, index) => (
                  <Animated.View
                    key={task.id}
                    style={styles.completedTask}
                    entering={SlideInRight.delay(index * 100).springify()}
                    layout={Layout.springify()}
                  >
                    <View style={styles.completedTaskHeader}>
                      <Text style={styles.completedTaskTitle}>
                        {task.title}
                      </Text>
                      <View
                        style={[
                          styles.energyBadge,
                          { backgroundColor: getEnergyColor(task.energyLevel) },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={getEnergyIcon(task.energyLevel)}
                          size={16}
                          color="white"
                        />
                        <Text style={styles.energyText}>
                          {task.energyLevel.charAt(0).toUpperCase() +
                            task.energyLevel.slice(1)}
                        </Text>
                      </View>
                    </View>
                    {task.description && (
                      <Text style={styles.completedTaskDescription}>
                        {task.description}
                      </Text>
                    )}
                    <Text style={styles.completedTaskDate}>
                      Completed on{' '}
                      {new Date(task.completedAt || '').toLocaleDateString()}
                    </Text>
                  </Animated.View>
                ))
            ) : (
              <Animated.View 
                style={styles.emptyState}
                entering={FadeIn.delay(300).duration(500)}
              >
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  size={64}
                  color="#8E8E93"
                />
                <Text style={styles.emptyStateText}>
                  No completed tasks yet. Complete some tasks to see your progress!
                </Text>
              </Animated.View>
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1c1c1e',
  },
  subtitle: {
    fontSize: 15,
    color: '#8E8E93',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 3,
      },
    }),
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statTitle: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 3,
      },
    }),
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1c1c1e',
    marginBottom: 16,
  },
  completedTask: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  completedTaskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  completedTaskTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1c1c1e',
    flex: 1,
    marginRight: 12,
  },
  energyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  energyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  completedTaskDescription: {
    fontSize: 13,
    color: '#8E8E93',
    marginBottom: 4,
    lineHeight: 18,
  },
  completedTaskDate: {
    fontSize: 12,
    color: '#8E8E93',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 22,
  },
}); 