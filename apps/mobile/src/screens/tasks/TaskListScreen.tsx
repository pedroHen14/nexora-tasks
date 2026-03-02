import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Alert, ActivityIndicator, RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../contexts/ThemeContext';
import { useTasks } from '../../contexts/TasksContext';
import { TaskItem } from '../../components/TaskItem';
import { FilterBar } from '../../components/FilterBar';
import { SyncIndicator } from '../../components/SyncIndicator';
import { filterTasks, sortTasksByDate, getTaskGroup, getGroupLabel } from '@nexora/shared';
import type { Task, TaskFilter } from '@nexora/shared';
import type { TasksStackParamList } from '../../types/navigation';

type Props = { navigation: NativeStackNavigationProp<TasksStackParamList, 'TaskList'> };

export function TaskListScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const { tasks, isLoading, isSyncing, lastSyncedAt, syncError, deleteTask, toggleTask, deleteCompletedTasks, sync } = useTasks();
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredTasks = useCallback(() => {
    let result = filterTasks(tasks, filter);
    if (selectedCategory) {
      result = result.filter((t) => t.categoryId === selectedCategory);
    }
    return sortTasksByDate(result);
  }, [tasks, filter, selectedCategory]);

  const groupedTasks = useCallback(() => {
    const grouped: Record<string, Task[]> = {};
    for (const task of filteredTasks()) {
      const group = getTaskGroup(task);
      if (!grouped[group]) grouped[group] = [];
      grouped[group].push(task);
    }
    return grouped;
  }, [filteredTasks]);

  const handleDelete = (id: string) => {
    Alert.alert(
      'Excluir tarefa',
      'Tem certeza que deseja excluir esta tarefa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => deleteTask(id) },
      ]
    );
  };

  const handleDeleteCompleted = () => {
    Alert.alert(
      'Excluir concluídas',
      'Deseja excluir todas as tarefas concluídas?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => deleteCompletedTasks() },
      ]
    );
  };

  const s = styles(theme);
  const groups = groupedTasks();
  const groupOrder = ['overdue', 'today', 'tomorrow', 'this_week', 'later', 'no_date'];

  const sections: Array<{ key: string; item: Task | string }> = [];
  for (const group of groupOrder) {
    if (groups[group]?.length) {
      sections.push({ key: `header-${group}`, item: getGroupLabel(group as Parameters<typeof getGroupLabel>[0]) });
      for (const task of groups[group]) {
        sections.push({ key: task.id, item: task });
      }
    }
  }

  const hasCompleted = tasks.some((t) => t.completed);

  return (
    <View style={s.container}>
      <SyncIndicator isSyncing={isSyncing} lastSyncedAt={lastSyncedAt} error={syncError} />
      <FilterBar filter={filter} onFilterChange={setFilter} />
      {isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={s.loader} />
      ) : sections.length === 0 ? (
        <View style={s.empty}>
          <Ionicons name="checkbox-outline" size={64} color={theme.colors.textMuted} />
          <Text style={s.emptyText}>Nenhuma tarefa encontrada</Text>
          <Text style={s.emptySubtext}>Toque no + para adicionar uma tarefa</Text>
        </View>
      ) : (
        <FlatList
          data={sections}
          keyExtractor={(item) => item.key}
          refreshControl={<RefreshControl refreshing={isSyncing} onRefresh={sync} />}
          renderItem={({ item: section }) => {
            if (typeof section.item === 'string') {
              return <Text style={s.groupHeader}>{section.item}</Text>;
            }
            return (
              <TaskItem
                task={section.item}
                onToggle={() => toggleTask((section.item as Task).id)}
                onEdit={() => navigation.navigate('EditTask', { taskId: (section.item as Task).id })}
                onDelete={() => handleDelete((section.item as Task).id)}
              />
            );
          }}
          contentContainerStyle={s.list}
        />
      )}
      {hasCompleted && (
        <TouchableOpacity style={s.clearButton} onPress={handleDeleteCompleted}>
          <Text style={s.clearButtonText}>Limpar concluídas</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={s.fab} onPress={() => navigation.navigate('CreateTask')}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    loader: { flex: 1 },
    list: { padding: 16, paddingBottom: 100 },
    groupHeader: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.textMuted,
      marginTop: 16,
      marginBottom: 8,
      textTransform: 'uppercase',
    },
    empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
    emptyText: { fontSize: 18, fontWeight: '600', color: theme.colors.text, marginTop: 16 },
    emptySubtext: { fontSize: 14, color: theme.colors.textMuted, marginTop: 8 },
    fab: {
      position: 'absolute',
      bottom: 24,
      right: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    clearButton: {
      position: 'absolute',
      bottom: 90,
      left: 24,
      right: 24,
      backgroundColor: theme.colors.danger,
      borderRadius: 12,
      padding: 12,
      alignItems: 'center',
      opacity: 0.9,
    },
    clearButtonText: { color: '#fff', fontWeight: '600' },
  });
