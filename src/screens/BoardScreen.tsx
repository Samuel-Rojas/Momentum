import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTaskContext } from '../context/TaskContext';
import type { Task } from '../types/navigation';

const AnimatedTouchable = Animatable.createAnimatableComponent(TouchableOpacity);
const COLUMN_WIDTH = 320;

export const BoardScreen = () => {
  const navigation = useNavigation();
  const { tasks, updateTask } = useTaskContext();
  const [draggingTask, setDraggingTask] = useState<Task | null>(null);
  const pan = useRef(new Animated.ValueXY()).current;

  const columns = useMemo(() => ({
    todo: tasks.filter(task => task.status === 'todo'),
    'in-progress': tasks.filter(task => task.status === 'in-progress'),
    done: tasks.filter(task => task.status === 'done'),
  }), [tasks]);

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      pan.setOffset({
        x: pan.x._value,
        y: pan.y._value,
      });
    },
    onPanResponderMove: Animated.event(
      [null, { dx: pan.x, dy: pan.y }],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: (_, gesture) => {
      pan.flattenOffset();
      if (draggingTask) {
        const columnIndex = Math.floor((gesture.moveX + pan.x._value) / COLUMN_WIDTH);
        let newStatus: 'todo' | 'in-progress' | 'done';
        
        if (columnIndex <= 0) newStatus = 'todo';
        else if (columnIndex === 1) newStatus = 'in-progress';
        else newStatus = 'done';

        updateTask({
          ...draggingTask,
          status: newStatus,
        });

        // Reset position and dragging state
        pan.setValue({ x: 0, y: 0 });
        setDraggingTask(null);
      }
    },
  }), [draggingTask, updateTask]);

  const getEnergyColor = (level: string) => {
    switch (level) {
      case 'low': return '#34c759';
      case 'medium': return '#ff9500';
      case 'high': return '#ff3b30';
      default: return '#8E8E93';
    }
  };

  const renderTaskContent = useCallback((task: Task) => (
    <>
      <View style={styles.taskHeader}>
        <Text style={styles.taskTitle} numberOfLines={2}>{task.title}</Text>
        <View style={[styles.energyIndicator, { backgroundColor: getEnergyColor(task.energyLevel) }]}>
          <MaterialCommunityIcons
            name={task.energyLevel === 'low' ? 'battery-low' : task.energyLevel === 'medium' ? 'battery-medium' : 'battery-high'}
            size={16}
            color="white"
          />
        </View>
      </View>
      {task.description ? (
        <Text style={styles.taskDescription} numberOfLines={2}>{task.description}</Text>
      ) : null}
      {task.deadline ? (
        <View style={styles.deadlineContainer}>
          <MaterialCommunityIcons name="calendar" size={14} color="#8E8E93" />
          <Text style={styles.deadlineText}>
            {new Date(task.deadline).toLocaleDateString()}
          </Text>
        </View>
      ) : null}
    </>
  ), []);

  const renderTask = useCallback((task: Task) => {
    const isBeingDragged = draggingTask?.id === task.id;

    if (isBeingDragged) {
      return null; // Don't render in the normal position if being dragged
    }

    return (
      <TouchableOpacity
        key={task.id}
        style={styles.taskCard}
        onPress={() => navigation.navigate('TaskDetails', { taskId: task.id })}
        onLongPress={() => setDraggingTask(task)}
        activeOpacity={0.7}
      >
        {renderTaskContent(task)}
      </TouchableOpacity>
    );
  }, [navigation, draggingTask, renderTaskContent]);

  const getColumnIcon = (status: string) => {
    switch (status) {
      case 'todo': return 'format-list-bulleted';
      case 'in-progress': return 'progress-clock';
      case 'done': return 'check-circle';
      default: return 'format-list-bulleted';
    }
  };

  return (
    <View style={styles.container}>
      <Animatable.View 
        animation="slideInDown" 
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
      
      <View style={styles.boardContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.boardScroll}>
          <View style={styles.board}>
            {Object.entries(columns).map(([status, statusTasks]) => (
              <Animatable.View
                key={status}
                style={styles.column}
                animation="fadeInUp"
                duration={600}
                delay={status === 'todo' ? 100 : status === 'in-progress' ? 200 : 300}
                useNativeDriver
              >
                <View style={styles.columnHeader}>
                  <MaterialCommunityIcons
                    name={getColumnIcon(status)}
                    size={24}
                    color="#007AFF"
                  />
                  <Text style={styles.columnTitle}>
                    {status === 'todo' ? 'To Do' :
                     status === 'in-progress' ? 'In Progress' : 'Done'}
                  </Text>
                  <View style={styles.taskCount}>
                    <Text style={styles.taskCountText}>{statusTasks.length}</Text>
                  </View>
                </View>
                <ScrollView style={styles.columnContent}>
                  {statusTasks.map(task => renderTask(task))}
                </ScrollView>
              </Animatable.View>
            ))}
          </View>
        </ScrollView>

        {/* Dragging overlay */}
        {draggingTask && (
          <Animated.View
            style={[
              styles.draggingOverlay,
              {
                transform: pan.getTranslateTransform(),
              },
            ]}
            {...panResponder.panHandlers}
          >
            <View style={[styles.taskCard, styles.draggingTask]}>
              {renderTaskContent(draggingTask)}
            </View>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  boardContainer: {
    flex: 1,
    position: 'relative',
  },
  boardScroll: {
    flex: 1,
  },
  board: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    height: '100%',
  },
  column: {
    width: COLUMN_WIDTH,
    margin: 8,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    flex: 1,
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
  columnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  columnTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1c1c1e',
    marginLeft: 8,
    flex: 1,
  },
  taskCount: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  taskCountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  columnContent: {
    flex: 1,
    padding: 8,
  },
  taskCard: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
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
  draggingOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: COLUMN_WIDTH,
    zIndex: 1000,
  },
  draggingTask: {
    opacity: 0.9,
    transform: [{ scale: 1.05 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
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
    marginBottom: 8,
  },
  energyIndicator: {
    padding: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  deadlineText: {
    fontSize: 12,
    color: '#8e8e93',
    marginLeft: 4,
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