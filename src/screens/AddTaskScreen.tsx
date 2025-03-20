import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTaskContext } from '../context/TaskContext';

export const AddTaskScreen = () => {
  const navigation = useNavigation();
  const { addTask } = useTaskContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [energyLevel, setEnergyLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [showCalendar, setShowCalendar] = useState(false);
  const [deadline, setDeadline] = useState<string | undefined>();

  const handleSubmit = () => {
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      description: description.trim(),
      status: 'todo',
      energyLevel,
      deadline,
    });
    
    navigation.goBack();
  };

  const energyColors = {
    low: '#34c759',
    medium: '#ff9500',
    high: '#ff3b30',
  };

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
          <Text style={styles.label}>Energy Level Required:</Text>
          <View style={styles.energyButtons}>
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

        <TouchableOpacity
          style={[styles.submitButton, !title.trim() && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!title.trim()}
        >
          <MaterialCommunityIcons name="check" size={24} color="white" />
          <Text style={styles.submitButtonText}>Create Task</Text>
        </TouchableOpacity>
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
  energyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
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
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  submitButtonDisabled: {
    backgroundColor: '#B4B4B6',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 