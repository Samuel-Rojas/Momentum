import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTaskContext } from '../context/TaskContext';
import { RootStackParamList } from '../types/navigation';

type TaskDetailsRouteProp = RouteProp<RootStackParamList, 'TaskDetails'>;

export const TaskDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<TaskDetailsRouteProp>();
  const { tasks, updateTask, deleteTask } = useTaskContext();
  
  const task = tasks.find(t => t.id === route.params.taskId);
  
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [status, setStatus] = useState(task?.status ?? 'todo');
  const [energyLevel, setEnergyLevel] = useState(task?.energyLevel ?? 'medium');
  const [deadline, setDeadline] = useState(task?.deadline);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    if (!task) {
      Alert.alert('Error', 'Task not found');
      navigation.goBack();
    }
  }, [task, navigation]);

  const handleSave = () => {
    if (!task || !title.trim()) return;

    updateTask({
      ...task,
      title: title.trim(),
      description: description.trim(),
      status,
      energyLevel,
      deadline,
    });
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (task) {
              deleteTask(task.id);
              navigation.goBack();
            }
          },
        },
      ]
    );
  };

  const energyColors = {
    low: '#34c759',
    medium: '#ff9500',
    high: '#ff3b30',
  };

  if (!task) return null;

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="format-title" size={24} color="#8E8E93" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Task Title"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#8E8E93"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="text" size={24} color="#8E8E93" style={styles.inputIcon} />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description (optional)"
            value={description}
            onChangeText={setDescription}
            multiline
            placeholderTextColor="#8E8E93"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Status:</Text>
          <View style={styles.buttonGroup}>
            {(['todo', 'in-progress', 'done'] as const).map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.statusButton,
                  status === s && styles.selectedStatusButton,
                ]}
                onPress={() => setStatus(s)}
              >
                <MaterialCommunityIcons
                  name={
                    s === 'todo' ? 'checkbox-blank-outline' :
                    s === 'in-progress' ? 'progress-clock' : 'checkbox-marked'
                  }
                  size={24}
                  color={status === s ? 'white' : '#007AFF'}
                />
                <Text
                  style={[
                    styles.statusButtonText,
                    status === s && styles.selectedButtonText,
                  ]}
                >
                  {s === 'todo' ? 'To Do' :
                   s === 'in-progress' ? 'In Progress' : 'Done'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Energy Level Required:</Text>
          <View style={styles.buttonGroup}>
            {(['low', 'medium', 'high'] as const).map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.energyButton,
                  { borderColor: energyColors[level] },
                  energyLevel === level && { backgroundColor: energyColors[level] },
                ]}
                onPress={() => setEnergyLevel(level)}
              >
                <MaterialCommunityIcons
                  name={level === 'low' ? 'battery-low' : level === 'medium' ? 'battery-medium' : 'battery-high'}
                  size={24}
                  color={energyLevel === level ? 'white' : energyColors[level]}
                />
                <Text
                  style={[
                    styles.energyButtonText,
                    { color: energyColors[level] },
                    energyLevel === level && styles.selectedEnergyText,
                  ]}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.deadlineButton}
          onPress={() => setShowCalendar(!showCalendar)}
        >
          <MaterialCommunityIcons name="calendar" size={24} color="#007AFF" />
          <Text style={styles.deadlineButtonText}>
            {deadline ? new Date(deadline).toLocaleDateString() : 'Set Deadline (Optional)'}
          </Text>
          <MaterialCommunityIcons
            name={showCalendar ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="#007AFF"
          />
        </TouchableOpacity>

        {showCalendar && (
          <View style={styles.calendarContainer}>
            <Calendar
              onDayPress={day => {
                setDeadline(day.dateString);
                setShowCalendar(false);
              }}
              markedDates={deadline ? {
                [deadline]: { selected: true, selectedColor: '#007AFF' }
              } : {}}
              minDate={new Date().toISOString().split('T')[0]}
            />
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.saveButton, !title.trim() && styles.disabledButton]}
            onPress={handleSave}
            disabled={!title.trim()}
          >
            <MaterialCommunityIcons name="content-save" size={24} color="white" />
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <MaterialCommunityIcons name="delete" size={24} color="#ff3b30" />
            <Text style={styles.deleteButtonText}>Delete Task</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  form: {
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#F9F9F9',
  },
  inputIcon: {
    padding: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 12,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  statusButton: {
    flex: 1,
    flexDirection: 'row',
    padding: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    gap: 8,
  },
  selectedStatusButton: {
    backgroundColor: '#007AFF',
  },
  statusButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  energyButton: {
    flex: 1,
    padding: 12,
    borderWidth: 2,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  energyButtonText: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '600',
  },
  selectedButtonText: {
    color: 'white',
  },
  selectedEnergyText: {
    color: 'white',
  },
  deadlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    marginBottom: 16,
  },
  deadlineButtonText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#007AFF',
  },
  calendarContainer: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  actions: {
    gap: 12,
    marginTop: 24,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#B4B4B6',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  deleteButton: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ff3b30',
  },
  deleteButtonText: {
    color: '#ff3b30',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 