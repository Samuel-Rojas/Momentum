import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
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
  withTiming,
} from 'react-native-reanimated';
import { pressAnimation } from '../utils/animations';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const SettingsScreen = () => {
  const { tasks, clearTasks } = useTaskContext();

  const completedTasks = tasks.filter(task => task.status === 'completed');
  const pendingTasks = tasks.filter(task => task.status === 'pending');

  const energyLevels = {
    low: tasks.filter(task => task.energyLevel === 'low').length,
    medium: tasks.filter(task => task.energyLevel === 'medium').length,
    high: tasks.filter(task => task.energyLevel === 'high').length,
  };

  const totalTasks = tasks.length;
  const energyLevelPercentages = {
    low: totalTasks ? Math.round((energyLevels.low / totalTasks) * 100) : 0,
    medium: totalTasks ? Math.round((energyLevels.medium / totalTasks) * 100) : 0,
    high: totalTasks ? Math.round((energyLevels.high / totalTasks) * 100) : 0,
  };

  const handleClearTasks = () => {
    Alert.alert(
      'Clear All Tasks',
      'Are you sure you want to clear all tasks? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: clearTasks,
        },
      ],
    );
  };

  const handlePressIn = (scale: number) => {
    'worklet';
    return pressAnimation(scale);
  };

  const handlePressOut = () => {
    'worklet';
    return pressAnimation(1);
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
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your tasks and preferences</Text>
      </Animated.View>

      <ScrollView style={styles.content}>
        <Animated.View 
          entering={FadeInDown.duration(500)}
          layout={Layout.springify()}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Task Statistics</Text>
            <View style={styles.statsGrid}>
              {renderStatCard(
                'Total Tasks',
                totalTasks,
                'format-list-checks',
                '#007AFF',
                0,
              )}
              {renderStatCard(
                'Completed',
                completedTasks.length,
                'check-circle',
                '#34c759',
                1,
              )}
              {renderStatCard(
                'Pending',
                pendingTasks.length,
                'clock-outline',
                '#ff9500',
                2,
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Energy Level Distribution</Text>
            <Animated.View 
              style={styles.energyBars}
              layout={Layout.springify()}
            >
              <View style={styles.energyBarContainer}>
                <View style={styles.energyBarLabel}>
                  <Text style={styles.energyBarText}>Low</Text>
                  <Text style={styles.energyBarPercentage}>
                    {energyLevelPercentages.low}%
                  </Text>
                </View>
                <View style={styles.energyBarTrack}>
                  <Animated.View
                    style={[
                      styles.energyBarFill,
                      {
                        width: withSpring(`${energyLevelPercentages.low}%`, {
                          damping: 15,
                          stiffness: 100,
                        }),
                        backgroundColor: '#34c759',
                      },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.energyBarContainer}>
                <View style={styles.energyBarLabel}>
                  <Text style={styles.energyBarText}>Medium</Text>
                  <Text style={styles.energyBarPercentage}>
                    {energyLevelPercentages.medium}%
                  </Text>
                </View>
                <View style={styles.energyBarTrack}>
                  <Animated.View
                    style={[
                      styles.energyBarFill,
                      {
                        width: withSpring(`${energyLevelPercentages.medium}%`, {
                          damping: 15,
                          stiffness: 100,
                        }),
                        backgroundColor: '#ff9500',
                      },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.energyBarContainer}>
                <View style={styles.energyBarLabel}>
                  <Text style={styles.energyBarText}>High</Text>
                  <Text style={styles.energyBarPercentage}>
                    {energyLevelPercentages.high}%
                  </Text>
                </View>
                <View style={styles.energyBarTrack}>
                  <Animated.View
                    style={[
                      styles.energyBarFill,
                      {
                        width: withSpring(`${energyLevelPercentages.high}%`, {
                          damping: 15,
                          stiffness: 100,
                        }),
                        backgroundColor: '#ff3b30',
                      },
                    ]}
                  />
                </View>
              </View>
            </Animated.View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Management</Text>
            <AnimatedTouchableOpacity
              style={styles.clearButton}
              onPress={handleClearTasks}
              onPressIn={() => handlePressIn(0.97)}
              onPressOut={handlePressOut}
            >
              <MaterialCommunityIcons name="delete" size={24} color="#ff3b30" />
              <Text style={styles.clearButtonText}>Clear All Tasks</Text>
            </AnimatedTouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <View style={styles.aboutContent}>
              <Text style={styles.aboutText}>
                Momentum is a smart task management app that helps you stay focused
                and productive by organizing your tasks based on priority, energy
                levels, and deadlines.
              </Text>
              <Text style={styles.versionText}>Version 1.0.0</Text>
            </View>
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
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
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
  energyBars: {
    gap: 16,
  },
  energyBarContainer: {
    gap: 8,
  },
  energyBarLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  energyBarText: {
    fontSize: 13,
    color: '#1c1c1e',
    fontWeight: '500',
  },
  energyBarPercentage: {
    fontSize: 13,
    color: '#8E8E93',
  },
  energyBarTrack: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  energyBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff1f0',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  clearButtonText: {
    fontSize: 17,
    color: '#ff3b30',
    fontWeight: '600',
  },
  aboutContent: {
    gap: 12,
  },
  aboutText: {
    fontSize: 15,
    color: '#8E8E93',
    lineHeight: 22,
  },
  versionText: {
    fontSize: 13,
    color: '#8E8E93',
  },
}); 