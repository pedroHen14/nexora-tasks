import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import type { TaskFilter } from '@nexora/shared';

interface Props {
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
}

const FILTERS: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Pendentes' },
  { value: 'completed', label: 'Concluídas' },
];

export function FilterBar({ filter, onFilterChange }: Props) {
  const { theme } = useTheme();
  const s = styles(theme);
  return (
    <View style={s.container}>
      {FILTERS.map((f) => (
        <TouchableOpacity
          key={f.value}
          style={[s.button, filter === f.value && s.buttonActive]}
          onPress={() => onFilterChange(f.value)}
        >
          <Text style={[s.buttonText, filter === f.value && s.buttonTextActive]}>
            {f.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      padding: 12,
      backgroundColor: theme.colors.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      gap: 8,
    },
    button: {
      flex: 1,
      paddingVertical: 8,
      borderRadius: 8,
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    buttonActive: { backgroundColor: theme.colors.primary },
    buttonText: { fontSize: 13, color: theme.colors.textMuted, fontWeight: '500' },
    buttonTextActive: { color: '#fff' },
  });
