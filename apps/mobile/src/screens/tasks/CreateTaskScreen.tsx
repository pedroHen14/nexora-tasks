import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../contexts/ThemeContext';
import { useTasks } from '../../contexts/TasksContext';
import { REMINDER_OPTIONS } from '@nexora/shared';
import type { ReminderType } from '@nexora/shared';
import type { TasksStackParamList } from '../../types/navigation';

type Props = { navigation: NativeStackNavigationProp<TasksStackParamList, 'CreateTask'> };

export function CreateTaskScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const { addTask, categories } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [reminder, setReminder] = useState<ReminderType>('none');
  const [tags, setTagsInput] = useState('');

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Erro', 'O título é obrigatório');
      return;
    }
    await addTask({
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate || undefined,
      dueTime: dueTime || undefined,
      categoryId,
      tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      reminder: reminder !== 'none' ? reminder : undefined,
      completed: false,
    });
    navigation.goBack();
  };

  const s = styles(theme);
  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.label}>Título *</Text>
      <TextInput
        style={s.input}
        placeholder="Título da tarefa"
        placeholderTextColor={theme.colors.textMuted}
        value={title}
        onChangeText={setTitle}
      />
      <Text style={s.label}>Descrição</Text>
      <TextInput
        style={[s.input, s.multiline]}
        placeholder="Descrição (opcional)"
        placeholderTextColor={theme.colors.textMuted}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
      />
      <Text style={s.label}>Data (AAAA-MM-DD)</Text>
      <TextInput
        style={s.input}
        placeholder="Ex: 2024-12-31"
        placeholderTextColor={theme.colors.textMuted}
        value={dueDate}
        onChangeText={setDueDate}
      />
      <Text style={s.label}>Hora (HH:MM)</Text>
      <TextInput
        style={s.input}
        placeholder="Ex: 14:30"
        placeholderTextColor={theme.colors.textMuted}
        value={dueTime}
        onChangeText={setDueTime}
      />
      {categories.length > 0 && (
        <>
          <Text style={s.label}>Categoria</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.categoryScroll}>
            <TouchableOpacity
              style={[s.categoryChip, !categoryId && s.categoryChipSelected]}
              onPress={() => setCategoryId(undefined)}
            >
              <Text style={s.categoryChipText}>Nenhuma</Text>
            </TouchableOpacity>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[s.categoryChip, categoryId === cat.id && s.categoryChipSelected, { borderColor: cat.color }]}
                onPress={() => setCategoryId(cat.id)}
              >
                <View style={[s.categoryDot, { backgroundColor: cat.color }]} />
                <Text style={s.categoryChipText}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}
      <Text style={s.label}>Etiquetas (separadas por vírgula)</Text>
      <TextInput
        style={s.input}
        placeholder="Ex: urgente, projeto, reunião"
        placeholderTextColor={theme.colors.textMuted}
        value={tags}
        onChangeText={setTagsInput}
      />
      <Text style={s.label}>Lembrete</Text>
      {REMINDER_OPTIONS.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={[s.reminderOption, reminder === opt.value && s.reminderSelected]}
          onPress={() => setReminder(opt.value as ReminderType)}
        >
          <Text style={[s.reminderText, reminder === opt.value && s.reminderSelectedText]}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={s.saveButton} onPress={handleSave}>
        <Text style={s.saveButtonText}>Criar Tarefa</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    content: { padding: 16, paddingBottom: 32 },
    label: { fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8, marginTop: 16 },
    input: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 14,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      fontSize: 15,
    },
    multiline: { minHeight: 80, textAlignVertical: 'top' },
    categoryScroll: { flexDirection: 'row', marginBottom: 8 },
    categoryChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: theme.colors.border,
      marginRight: 8,
      backgroundColor: theme.colors.card,
    },
    categoryChipSelected: { backgroundColor: theme.colors.primary + '20', borderColor: theme.colors.primary },
    categoryChipText: { color: theme.colors.text, fontSize: 14 },
    categoryDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
    reminderOption: {
      padding: 12,
      borderRadius: 8,
      marginBottom: 8,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    reminderSelected: { backgroundColor: theme.colors.primary + '20', borderColor: theme.colors.primary },
    reminderText: { color: theme.colors.text, fontSize: 14 },
    reminderSelectedText: { color: theme.colors.primary, fontWeight: '600' },
    saveButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      marginTop: 24,
    },
    saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  });
