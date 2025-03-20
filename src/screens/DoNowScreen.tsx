import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTaskContext } from '../context/TaskContext';
import type { Task } from '../types/navigation';
import Animated, { 
  FadeIn,
  FadeOut,
  Layout,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';
import { pressAnimation } from '../utils/animations';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const DoNowScreen = () => {
  const { tasks, updateTask } = useTaskContext();

  const sortedTasks = [...tasks]
    .filter(task => task.status === 'pending')
    .sort((a, b) => {
      // First sort by priority
      if (a.priority === 'urgent' && b.priority !== 'urgent') return -1;
      if (a.priority !== 'urgent' && b.priority === 'urgent') return 1;

      // Then sort by energy level
      const energyOrder = { high: 0, medium: 1, low: 2 };
      return energyOrder[a.energyLevel] - energyOrder[b.energyLevel];
    });

  const handleCompleteTask = (task: Task) => {
    updateTask({
      ...task,
      status: 'completed',
      completedAt: new Date().toISOString(),
    });
  };

  const getEnergyColor = (level: Task['energyLevel']) => {
    switch (level) {
      case 'low': return '#34c759';
      case 'medium': return '#ff9500';
      case 'high': return '#ff3b30';
      default: return '#8E8E93';
    }
  };

  const handlePressIn = (scale: number) => {
    'worklet';
    return pressAnimation(scale);
  };

  const handlePressOut = () => {
    'worklet';
    return pressAnimation(1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        entering={FadeIn.duration(300)}
        style={styles.header}
      >
        <Text style={styles.title}>Do Now</Text>
        <Text style={styles.subtitle}>
          {sortedTasks.length > 0
            ? 'Focus on these tasks in order'
            : 'No tasks to do'}
        </Text>
      </Animated.View>

      <ScrollView style={styles.content}>
        <Animated.View layout={Layout.springify()}>
          {sortedTasks.map((task, index) => (
            <AnimatedTouchableOpacity
              key={task.id}
              style={styles.taskCard}
              onPress={() => handleCompleteTask(task)}
              entering={SlideInRight.delay(index * 100).springify()}
              exiting={SlideOutLeft.springify()}
              layout={Layout.springify()}
              onPressIn={() => handlePressIn(0.97)}
              onPressOut={handlePressOut}
            >
              <View style={styles.taskHeader}>
                <View style={styles.taskTitleContainer}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  {task.priority === 'urgent' && (
                    <View style={styles.urgentBadge}>
                      <MaterialCommunityIcons
                        name="alert-circle"
                        size={16}
                        color="white"
                      />
                      <Text style={styles.urgentText}>Urgent</Text>
                    </View>
                  )}
                </View>
                <View
                  style={[
                    styles.energyBadge,
                    { backgroundColor: getEnergyColor(task.energyLevel) },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={
                      task.energyLevel === 'low'
                        ? 'battery-low'
                        : task.energyLevel === 'medium'
                        ? 'battery-medium'
                        : 'battery-high'
                    }
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
                <Text style={styles.taskDescription}>{task.description}</Text>
              )}

              {task.deadline && (
                <View style={styles.deadlineContainer}>
                  <MaterialCommunityIcons
                    name="calendar"
                    size={16}
                    color="#8E8E93"
                  />
                  <Text style={styles.deadlineText}>
                    {new Date(task.deadline).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </AnimatedTouchableOpacity>
          ))}

          {sortedTasks.length === 0 && (
            <Animated.View 
              style={styles.emptyState}
              entering={FadeIn.delay(300).duration(500)}
              exiting={FadeOut.duration(300)}
            >
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={64}
                color="#8E8E93"
              />
              <Text style={styles.emptyStateText}>
                All caught up! Add a new task to get started.
              </Text>
            </Animated.View>
          )}
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
  taskCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  taskTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  taskTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1c1c1e',
    marginBottom: 4,
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff3b30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  urgentText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
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
  taskDescription: {
    fontSize: 15,
    color: '#8E8E93',
    marginBottom: 8,
    lineHeight: 20,
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deadlineText: {
    fontSize: 13,
    color: '#8E8E93',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 32,
  },
  emptyStateText: {
    fontSize: 17,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
  },
}); 