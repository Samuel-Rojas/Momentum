import React, { useState, useRef } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Animated,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTaskContext } from '../context/TaskContext';
import { Task } from '../types/navigation';
import { nanoid } from 'nanoid';

type Step = {
  id: number;
  question: string;
  subtitle?: string;
  type: 'text' | 'textarea' | 'energy' | 'priority' | 'calendar';
};

const STEPS: Step[] = [
  {
    id: 1,
    question: "What would you like to accomplish?",
    subtitle: "Enter a clear and specific task",
    type: 'text'
  },
  {
    id: 2,
    question: "Could you describe it in more detail?",
    subtitle: "This helps with task clarity and planning",
    type: 'textarea'
  },
  {
    id: 3,
    question: "How much energy does this task require?",
    subtitle: "This helps us suggest the best time for this task",
    type: 'energy'
  },
  {
    id: 4,
    question: "How urgent is this task?",
    subtitle: "This helps us prioritize your tasks",
    type: 'priority'
  },
  {
    id: 5,
    question: "When does this need to be done?",
    subtitle: "Set a deadline if applicable",
    type: 'calendar'
  }
];

export const AddTaskScreen = () => {
  const navigation = useNavigation();
  const { addTask } = useTaskContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [energyLevel, setEnergyLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [priority, setPriority] = useState<'urgent' | 'flexible'>('flexible');
  const [deadline, setDeadline] = useState<string | undefined>();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  const animateTransition = (forward: boolean = true) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: forward ? -50 : 50,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => {
      slideAnim.setValue(forward ? 50 : -50);
      setCurrentStep(prev => forward ? prev + 1 : prev - 1);
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    });

    // Update progress bar
    Animated.timing(progressWidth, {
      toValue: ((currentStep + (forward ? 1 : -1)) / (STEPS.length - 1)),
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      animateTransition();
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      animateTransition(false);
    } else {
      navigation.goBack();
    }
  };

  const handleSubmit = () => {
    const newTask: Task = {
      id: nanoid(),
      title: title.trim(),
      description: description.trim(),
      status: 'pending',
      energyLevel,
      priority,
      deadline,
      createdAt: new Date().toISOString(),
    };
    addTask(newTask);
    navigation.goBack();
  };

  const energyColors = {
    low: '#34c759',
    medium: '#ff9500',
    high: '#ff3b30',
  };

  const renderStep = () => {
    const step = STEPS[currentStep];

    return (
      <Animated.View 
        style={[
          styles.stepContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }]
          }
        ]}
      >
        <View style={styles.questionContainer}>
          <Text style={styles.question}>{step.question}</Text>
          {step.subtitle && (
            <Text style={styles.subtitle}>{step.subtitle}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          {step.type === 'text' && (
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter task title"
              placeholderTextColor="#8E8E93"
              onSubmitEditing={handleNext}
              returnKeyType="next"
              autoFocus
            />
          )}

          {step.type === 'textarea' && (
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Add description"
              placeholderTextColor="#8E8E93"
              multiline
              textAlignVertical="top"
              autoFocus
            />
          )}

          {step.type === 'energy' && (
            <View style={styles.optionsContainer}>
              {(['low', 'medium', 'high'] as const).map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.optionButton,
                    { borderColor: energyColors[level] },
                    energyLevel === level && { backgroundColor: energyColors[level] }
                  ]}
                  onPress={() => {
                    setEnergyLevel(level);
                    setTimeout(handleNext, 500);
                  }}
                >
                  <MaterialCommunityIcons
                    name={level === 'low' ? 'battery-10' : level === 'medium' ? 'battery-50' : 'battery-90'}
                    size={32}
                    color={energyLevel === level ? 'white' : energyColors[level]}
                  />
                  <Text style={[
                    styles.optionButtonText,
                    { color: energyColors[level] },
                    energyLevel === level && styles.selectedOptionText
                  ]}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {step.type === 'priority' && (
            <View style={styles.optionsContainer}>
              {([
                { value: 'urgent', label: 'Urgent', icon: 'alarm', color: '#FF3B30' },
                { value: 'flexible', label: 'Flexible', icon: 'clock-outline', color: '#34C759' }
              ] as const).map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    { borderColor: option.color },
                    priority === option.value && { backgroundColor: option.color }
                  ]}
                  onPress={() => {
                    setPriority(option.value);
                    setTimeout(handleNext, 500);
                  }}
                >
                  <MaterialCommunityIcons
                    name={option.icon}
                    size={32}
                    color={priority === option.value ? 'white' : option.color}
                  />
                  <Text style={[
                    styles.optionButtonText,
                    { color: option.color },
                    priority === option.value && styles.selectedOptionText
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {step.type === 'calendar' && (
            <View style={styles.calendarContainer}>
              <Calendar
                onDayPress={(day: { dateString: string }) => {
                  setDeadline(day.dateString);
                  setTimeout(handleNext, 500);
                }}
                markedDates={deadline ? {
                  [deadline]: { selected: true, selectedColor: '#007AFF' }
                } : {}}
                minDate={new Date().toISOString().split('T')[0]}
                theme={{
                  todayTextColor: '#007AFF',
                  selectedDayBackgroundColor: '#007AFF',
                  arrowColor: '#007AFF',
                }}
              />
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Progress bar */}
      <Animated.View style={[styles.progressBar, {
        width: progressWidth.interpolate({
          inputRange: [0, 1],
          outputRange: ['0%', '100%']
        })
      }]} />

      {/* Navigation buttons */}
      <View style={styles.navButtons}>
        <TouchableOpacity onPress={handleBack} style={styles.navButton}>
          <MaterialCommunityIcons name="chevron-left" size={24} color="#007AFF" />
          <Text style={styles.navButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.stepIndicator}>
          {currentStep + 1} of {STEPS.length}
        </Text>
        {currentStep < STEPS.length - 1 && (
          <TouchableOpacity onPress={handleNext} style={styles.navButton}>
            <Text style={styles.navButtonText}>Next</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#007AFF" />
          </TouchableOpacity>
        )}
      </View>

      {renderStep()}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  progressBar: {
    height: 3,
    backgroundColor: '#007AFF',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  navButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 4,
  },
  stepIndicator: {
    fontSize: 14,
    color: '#8E8E93',
  },
  stepContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  questionContainer: {
    marginBottom: 32,
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    fontSize: 18,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    borderRadius: 16,
    backgroundColor: 'white',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  optionsContainer: {
    flexDirection: 'column',
    gap: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderWidth: 2,
    borderRadius: 16,
    backgroundColor: 'white',
  },
  optionButtonText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 16,
  },
  selectedOptionText: {
    color: 'white',
  },
  calendarContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
}); 