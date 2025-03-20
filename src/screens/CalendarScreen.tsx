import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTaskContext } from '../context/TaskContext';

export const CalendarScreen = () => {
  const navigation = useNavigation();
  const { tasks } = useTaskContext();

  const markedDates = useMemo(() => {
    const dates: { [key: string]: { marked: boolean; dotColor: string; dots?: any[] } } = {};
    
    tasks.forEach(task => {
      if (task.deadline) {
        const date = task.deadline.split('T')[0];
        const dotColor = task.energyLevel === 'high' ? '#ff3b30' : 
                        task.energyLevel === 'medium' ? '#ff9500' : '#34c759';
        
        if (dates[date]) {
          dates[date].dots?.push({ color: dotColor });
        } else {
          dates[date] = {
            marked: true,
            dotColor,
            dots: [{ color: dotColor }]
          };
        }
      }
    });

    return dates;
  }, [tasks]);

  const tasksForSelectedDate = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => task.deadline?.startsWith(today));
  }, [tasks]);

  const getEnergyColor = (level: string) => {
    switch (level) {
      case 'low': return '#34c759';
      case 'medium': return '#ff9500';
      case 'high': return '#ff3b30';
      default: return '#8E8E93';
    }
  };

  const handleDayPress = (day: { dateString: string }) => {
    const tasksForDay = tasks.filter(task => 
      task.deadline?.startsWith(day.dateString)
    );

    if (tasksForDay.length > 0) {
      navigation.navigate('TaskDetails', { taskId: tasksForDay[0].id });
    }
  };

  return (
    <View style={styles.container}>
      <Animatable.View 
        animation="fadeIn" 
        duration={600} 
        useNativeDriver
      >
        <Calendar
          onDayPress={handleDayPress}
          markedDates={markedDates}
          markingType="multi-dot"
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#1c1c1e',
            selectedDayBackgroundColor: '#007AFF',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#007AFF',
            dayTextColor: '#1c1c1e',
            textDisabledColor: '#d9e1e8',
            dotColor: '#007AFF',
            selectedDotColor: '#ffffff',
            arrowColor: '#007AFF',
            monthTextColor: '#1c1c1e',
            textDayFontWeight: '400',
            textMonthFontWeight: '700',
            textDayHeaderFontWeight: '600',
            textDayFontSize: 15,
            textMonthFontSize: 17,
            textDayHeaderFontSize: 13,
          }}
          style={styles.calendar}
        />
      </Animatable.View>

      <View style={styles.taskSection}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="calendar-today" size={24} color="#007AFF" />
          <Text style={styles.sectionTitle}>Today's Tasks</Text>
        </View>

        <ScrollView style={styles.taskList}>
          {tasksForSelectedDate.length > 0 ? (
            tasksForSelectedDate.map((task, index) => (
              <Animatable.View
                key={task.id}
                animation="fadeInUp"
                delay={index * 100}
                duration={400}
                useNativeDriver
              >
                <TouchableOpacity
                  style={styles.taskCard}
                  onPress={() => navigation.navigate('TaskDetails', { taskId: task.id })}
                  activeOpacity={0.7}
                >
                  <View style={styles.taskHeader}>
                    <Text style={styles.taskTitle} numberOfLines={2}>
                      {task.title}
                    </Text>
                    <View style={[styles.energyIndicator, { backgroundColor: getEnergyColor(task.energyLevel) }]}>
                      <MaterialCommunityIcons
                        name={task.energyLevel === 'low' ? 'battery-low' : 
                              task.energyLevel === 'medium' ? 'battery-medium' : 'battery-high'}
                        size={16}
                        color="white"
                      />
                    </View>
                  </View>
                  {task.description ? (
                    <Text style={styles.taskDescription} numberOfLines={2}>
                      {task.description}
                    </Text>
                  ) : null}
                </TouchableOpacity>
              </Animatable.View>
            ))
          ) : (
            <Animatable.View
              animation="fadeIn"
              duration={400}
              useNativeDriver
              style={styles.emptyState}
            >
              <MaterialCommunityIcons name="calendar-blank" size={48} color="#8E8E93" />
              <Text style={styles.emptyStateText}>No tasks scheduled for today</Text>
            </Animatable.View>
          )}
        </ScrollView>
      </View>

      <Animatable.View
        animation="slideInUp"
        duration={500}
        useNativeDriver
      >
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddTask')}
        >
          <MaterialCommunityIcons name="plus" size={24} color="white" />
          <Text style={styles.addButtonText}>Add New Task</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  calendar: {
    borderRadius: 12,
    margin: 16,
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
        elevation: 4,
      },
    }),
  },
  taskSection: {
    flex: 1,
    marginHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1c1c1e',
    marginLeft: 8,
  },
  taskList: {
    flex: 1,
  },
  taskCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      web: {
        boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1c1c1e',
    flex: 1,
    marginRight: 8,
  },
  taskDescription: {
    fontSize: 13,
    color: '#8e8e93',
    marginTop: 4,
  },
  energyIndicator: {
    padding: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#8E8E93',
    marginTop: 8,
  },
  addButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 