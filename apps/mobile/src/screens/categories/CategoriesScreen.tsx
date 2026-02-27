import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useTasks } from '../../contexts/TasksContext';
import { CATEGORY_COLORS } from '@nexora/shared';

export function CategoriesScreen() {
  const { theme } = useTheme();
  const { categories, addCategory, updateCategory, deleteCategory } = useTasks();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState(CATEGORY_COLORS[0]);

  const openCreate = () => {
    setEditingId(null);
    setName('');
    setColor(CATEGORY_COLORS[0]);
    setModalVisible(true);
  };

  const openEdit = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;
    setEditingId(id);
    setName(cat.name);
    setColor(cat.color);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Nome é obrigatório');
      return;
    }
    if (editingId) {
      await updateCategory(editingId, { name: name.trim(), color });
    } else {
      await addCategory({ name: name.trim(), color });
    }
    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Excluir categoria',
      'Deseja excluir esta categoria?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => deleteCategory(id) },
      ]
    );
  };

  const s = styles(theme);
  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Categorias</Text>
        <TouchableOpacity style={s.addButton} onPress={openCreate}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={s.list}
        renderItem={({ item }) => (
          <View style={s.categoryItem}>
            <View style={[s.colorDot, { backgroundColor: item.color }]} />
            <Text style={s.categoryName}>{item.name}</Text>
            <TouchableOpacity onPress={() => openEdit(item.id)} style={s.iconButton}>
              <Ionicons name="pencil" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={s.iconButton}>
              <Ionicons name="trash" size={20} color={theme.colors.danger} />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={s.empty}>
            <Ionicons name="pricetags-outline" size={64} color={theme.colors.textMuted} />
            <Text style={s.emptyText}>Nenhuma categoria criada</Text>
          </View>
        }
      />
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modal}>
            <Text style={s.modalTitle}>{editingId ? 'Editar categoria' : 'Nova categoria'}</Text>
            <TextInput
              style={s.input}
              placeholder="Nome da categoria"
              placeholderTextColor={theme.colors.textMuted}
              value={name}
              onChangeText={setName}
            />
            <Text style={s.colorLabel}>Cor</Text>
            <View style={s.colorGrid}>
              {CATEGORY_COLORS.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[s.colorOption, { backgroundColor: c }, color === c && s.colorSelected]}
                  onPress={() => setColor(c)}
                />
              ))}
            </View>
            <View style={s.modalButtons}>
              <TouchableOpacity style={s.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={s.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.saveButton} onPress={handleSave}>
                <Text style={s.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      paddingTop: 60,
      backgroundColor: theme.colors.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text },
    addButton: {
      backgroundColor: theme.colors.primary,
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
    },
    list: { padding: 16 },
    categoryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    colorDot: { width: 16, height: 16, borderRadius: 8, marginRight: 12 },
    categoryName: { flex: 1, fontSize: 16, color: theme.colors.text },
    iconButton: { padding: 8 },
    empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
    emptyText: { fontSize: 16, color: theme.colors.textMuted, marginTop: 12 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modal: {
      backgroundColor: theme.colors.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 24,
    },
    modalTitle: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text, marginBottom: 16 },
    input: {
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      padding: 14,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      fontSize: 15,
      marginBottom: 16,
    },
    colorLabel: { fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 },
    colorGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
    colorOption: { width: 36, height: 36, borderRadius: 18, margin: 4 },
    colorSelected: { borderWidth: 3, borderColor: '#fff' },
    modalButtons: { flexDirection: 'row', gap: 12 },
    cancelButton: {
      flex: 1,
      padding: 14,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    cancelButtonText: { color: theme.colors.text },
    saveButton: {
      flex: 1,
      padding: 14,
      borderRadius: 12,
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
    },
    saveButtonText: { color: '#fff', fontWeight: 'bold' },
  });
