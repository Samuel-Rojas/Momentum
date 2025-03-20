import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppNavigator } from './src/navigation/AppNavigator';
import { TaskProvider } from './src/context/TaskContext';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TaskProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </TaskProvider>
    </GestureHandlerRootView>
  );
}
