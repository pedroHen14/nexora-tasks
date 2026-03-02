import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../contexts/ThemeContext';
import { TaskListScreen } from '../screens/tasks/TaskListScreen';
import { CreateTaskScreen } from '../screens/tasks/CreateTaskScreen';
import { EditTaskScreen } from '../screens/tasks/EditTaskScreen';
import type { TasksStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<TasksStackParamList>();

export function TasksStack() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.card },
        headerTintColor: theme.colors.text,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="TaskList" component={TaskListScreen} options={{ title: 'Nexora Tasks' }} />
      <Stack.Screen name="CreateTask" component={CreateTaskScreen} options={{ title: 'Nova Tarefa' }} />
      <Stack.Screen name="EditTask" component={EditTaskScreen} options={{ title: 'Editar Tarefa' }} />
    </Stack.Navigator>
  );
}
