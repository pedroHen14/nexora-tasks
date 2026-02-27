import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useTasks } from '../contexts/TasksContext';
import { isOverdue, formatDate } from '@nexora/shared';
import type { Task } from '@nexora/shared';

interface Props {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: Props) {
  const { theme } = useTheme();
  const { categories } = useTasks();
  const category = task.categoryId ? categories.find((c) => c.id === task.categoryId) : null;
  const overdue = isOverdue(task);

  const s = styles(theme);
  return (
    <View style={[s.container, task.completed && s.completed, overdue && s.overdue]}>
      <TouchableOpacity style={s.checkbox} onPress={onToggle}>
        <Ionicons
          name={task.completed ? 'checkbox' : 'square-outline'}
          size={24}
          color={task.completed ? theme.colors.success : theme.colors.border}
        />
      </TouchableOpacity>
      <View style={s.content}>
        <Text style={[s.title, task.completed && s.titleCompleted]}>{task.title}</Text>
        {task.description ? (
          <Text style={s.description} numberOfLines={2}>{task.description}</Text>
        ) : null}
        <View style={s.meta}>
          {task.dueDate && (
            <View style={[s.metaItem, overdue && s.overdueTag]}>
              <Ionicons name="calendar" size={12} color={overdue ? '#fff' : theme.colors.textMuted} />
              <Text style={[s.metaText, overdue && s.overdueText]}>
                {formatDate(task.dueDate)}{task.dueTime ? ` ${task.dueTime}` : ''}
              </Text>
            </View>
          )}
          {category && (
            <View style={[s.metaItem, { backgroundColor: category.color + '20' }]}>
              <View style={[s.dot, { backgroundColor: category.color }]} />
              <Text style={[s.metaText, { color: category.color }]}>{category.name}</Text>
            </View>
          )}
          {task.tags.slice(0, 2).map((tag) => (
            <View key={tag} style={s.tag}>
              <Text style={s.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={s.actions}>
        <TouchableOpacity onPress={onEdit} style={s.actionButton}>
          <Ionicons name="pencil" size={18} color={theme.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={s.actionButton}>
          <Ionicons name="trash" size={18} color={theme.colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 14,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'flex-start',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    completed: { opacity: 0.6 },
    overdue: { borderColor: theme.colors.danger, borderWidth: 1.5 },
    checkbox: { marginRight: 12, marginTop: 2 },
    content: { flex: 1 },
    title: { fontSize: 16, fontWeight: '500', color: theme.colors.text },
    titleCompleted: { textDecorationLine: 'line-through', color: theme.colors.textMuted },
    description: { fontSize: 13, color: theme.colors.textMuted, marginTop: 4 },
    meta: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, gap: 6 },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      borderRadius: 6,
      paddingHorizontal: 6,
      paddingVertical: 3,
      gap: 4,
    },
    metaText: { fontSize: 11, color: theme.colors.textMuted },
    overdueTag: { backgroundColor: theme.colors.danger },
    overdueText: { color: '#fff' },
    dot: { width: 8, height: 8, borderRadius: 4 },
    tag: {
      backgroundColor: theme.colors.primary + '20',
      borderRadius: 6,
      paddingHorizontal: 6,
      paddingVertical: 3,
    },
    tagText: { fontSize: 11, color: theme.colors.primary },
    actions: { flexDirection: 'column', gap: 8, marginLeft: 8 },
    actionButton: { padding: 4 },
  });
