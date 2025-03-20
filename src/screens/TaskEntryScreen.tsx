import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
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
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { pressAnimation } from '../utils/animations';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const TaskEntryScreen = () => {
  const { addTask } = useTaskContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [energyLevel, setEnergyLevel] = useState<Task['energyLevel']>('medium');
  const [priority, setPriority] = useState<Task['priority']>('flexible');
  const [deadline, setDeadline] = useState<string | undefined>();

  const handleSubmit = () => {
    if (!title.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim() || undefined,
      energyLevel,
      priority,
      deadline,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    addTask(newTask);
    setTitle('');
    setDescription('');
    setEnergyLevel('medium');
    setPriority('flexible');
    setDeadline(undefined);
  };

  const handlePressIn = (scale: number) => {
    'worklet';
    return pressAnimation(scale);
  };

  const handlePressOut = () => {
    'worklet';
    return pressAnimation(1);
  };

  const submitButtonStyle = useAnimatedStyle(() => {
    const isValid = title.trim().length > 0;
    return {
      opacity: withSpring(isValid ? 1 : 0.6),
      transform: [
        {
          scale: withSpring(isValid ? 1 : 0.98),
        },
      ],
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Animated.View 
          entering={FadeIn.duration(300)}
          style={styles.header}
        >
          <Text style={styles.title}>Add New Task</Text>
          <Text style={styles.subtitle}>Create a task to get started</Text>
        </Animated.View>

        <ScrollView style={styles.content}>
          <Animated.View 
            entering={FadeInDown.duration(500)}
            style={styles.form}
          >
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter task title"
                placeholderTextColor="#8E8E93"
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter task description"
                placeholderTextColor="#8E8E93"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <Animated.View 
              style={styles.inputContainer}
              layout={Layout.springify()}
            >
              <Text style={styles.label}>Energy Level</Text>
              <View style={styles.energyButtons}>
                <AnimatedTouchableOpacity
                  style={[
                    styles.energyButton,
                    energyLevel === 'low' && styles.energyButtonActive,
                    { backgroundColor: energyLevel === 'low' ? '#34c759' : '#f2f2f7' },
                  ]}
                  onPress={() => setEnergyLevel('low')}
                  onPressIn={() => handlePressIn(0.95)}
                  onPressOut={handlePressOut}
                >
                  <MaterialCommunityIcons
                    name="battery-low"
                    size={24}
                    color={energyLevel === 'low' ? 'white' : '#8E8E93'}
                  />
                  <Text
                    style={[
                      styles.energyButtonText,
                      energyLevel === 'low' && styles.energyButtonTextActive,
                    ]}
                  >
                    Low
                  </Text>
                </AnimatedTouchableOpacity>

                <AnimatedTouchableOpacity
                  style={[
                    styles.energyButton,
                    energyLevel === 'medium' && styles.energyButtonActive,
                    { backgroundColor: energyLevel === 'medium' ? '#ff9500' : '#f2f2f7' },
                  ]}
                  onPress={() => setEnergyLevel('medium')}
                  onPressIn={() => handlePressIn(0.95)}
                  onPressOut={handlePressOut}
                >
                  <MaterialCommunityIcons
                    name="battery-medium"
                    size={24}
                    color={energyLevel === 'medium' ? 'white' : '#8E8E93'}
                  />
                  <Text
                    style={[
                      styles.energyButtonText,
                      energyLevel === 'medium' && styles.energyButtonTextActive,
                    ]}
                  >
                    Medium
                  </Text>
                </AnimatedTouchableOpacity>

                <AnimatedTouchableOpacity
                  style={[
                    styles.energyButton,
                    energyLevel === 'high' && styles.energyButtonActive,
                    { backgroundColor: energyLevel === 'high' ? '#ff3b30' : '#f2f2f7' },
                  ]}
                  onPress={() => setEnergyLevel('high')}
                  onPressIn={() => handlePressIn(0.95)}
                  onPressOut={handlePressOut}
                >
                  <MaterialCommunityIcons
                    name="battery-high"
                    size={24}
                    color={energyLevel === 'high' ? 'white' : '#8E8E93'}
                  />
                  <Text
                    style={[
                      styles.energyButtonText,
                      energyLevel === 'high' && styles.energyButtonTextActive,
                    ]}
                  >
                    High
                  </Text>
                </AnimatedTouchableOpacity>
              </View>
            </Animated.View>

            <Animated.View 
              style={styles.inputContainer}
              layout={Layout.springify()}
            >
              <Text style={styles.label}>Priority</Text>
              <View style={styles.priorityButtons}>
                <AnimatedTouchableOpacity
                  style={[
                    styles.priorityButton,
                    priority === 'urgent' && styles.priorityButtonActive,
                  ]}
                  onPress={() => setPriority('urgent')}
                  onPressIn={() => handlePressIn(0.95)}
                  onPressOut={handlePressOut}
                >
                  <MaterialCommunityIcons
                    name="alert-circle"
                    size={24}
                    color={priority === 'urgent' ? 'white' : '#8E8E93'}
                  />
                  <Text
                    style={[
                      styles.priorityButtonText,
                      priority === 'urgent' && styles.priorityButtonTextActive,
                    ]}
                  >
                    Urgent
                  </Text>
                </AnimatedTouchableOpacity>

                <AnimatedTouchableOpacity
                  style={[
                    styles.priorityButton,
                    priority === 'flexible' && styles.priorityButtonActive,
                  ]}
                  onPress={() => setPriority('flexible')}
                  onPressIn={() => handlePressIn(0.95)}
                  onPressOut={handlePressOut}
                >
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={24}
                    color={priority === 'flexible' ? 'white' : '#8E8E93'}
                  />
                  <Text
                    style={[
                      styles.priorityButtonText,
                      priority === 'flexible' && styles.priorityButtonTextActive,
                    ]}
                  >
                    Flexible
                  </Text>
                </AnimatedTouchableOpacity>
              </View>
            </Animated.View>

            <Animated.View
              style={[styles.submitButton, submitButtonStyle]}
            >
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={!title.trim()}
                style={styles.submitButtonTouchable}
              >
                <Text style={styles.submitButtonText}>Add Task</Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  },
  form: {
    padding: 16,
    gap: 24,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1c1c1e',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 17,
    color: '#1c1c1e',
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
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  energyButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  energyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  energyButtonActive: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
      },
      default: {
        elevation: 4,
      },
    }),
  },
  energyButtonText: {
    fontSize: 15,
    color: '#8E8E93',
    fontWeight: '600',
  },
  energyButtonTextActive: {
    color: 'white',
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f2f2f7',
    gap: 8,
  },
  priorityButtonActive: {
    backgroundColor: '#007AFF',
    ...Platform.select({
      ios: {
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      web: {
        boxShadow: '0px 2px 8px rgba(0, 122, 255, 0.2)',
      },
      default: {
        elevation: 4,
      },
    }),
  },
  priorityButtonText: {
    fontSize: 15,
    color: '#8E8E93',
    fontWeight: '600',
  },
  priorityButtonTextActive: {
    color: 'white',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    marginTop: 8,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      web: {
        boxShadow: '0px 4px 8px rgba(0, 122, 255, 0.2)',
      },
      default: {
        elevation: 4,
      },
    }),
  },
  submitButtonTouchable: {
    width: '100%',
    padding: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
}); 