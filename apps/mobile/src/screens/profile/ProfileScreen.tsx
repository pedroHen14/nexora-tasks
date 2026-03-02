import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTasks } from '../../contexts/TasksContext';

export function ProfileScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { tasks, isSyncing, lastSyncedAt, sync } = useTasks();

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.filter((t) => !t.completed).length;

  const handleLogout = () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => logout() },
    ]);
  };

  const s = styles(theme);
  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Perfil</Text>
      </View>
      <View style={s.userCard}>
        <View style={s.avatar}>
          <Text style={s.avatarText}>{user?.name[0].toUpperCase()}</Text>
        </View>
        <Text style={s.userName}>{user?.name}</Text>
        <Text style={s.userEmail}>{user?.email}</Text>
      </View>
      <View style={s.statsRow}>
        <View style={s.statCard}>
          <Text style={s.statNumber}>{pendingCount}</Text>
          <Text style={s.statLabel}>Pendentes</Text>
        </View>
        <View style={s.statCard}>
          <Text style={[s.statNumber, { color: theme.colors.success }]}>{completedCount}</Text>
          <Text style={s.statLabel}>Concluídas</Text>
        </View>
        <View style={s.statCard}>
          <Text style={s.statNumber}>{tasks.length}</Text>
          <Text style={s.statLabel}>Total</Text>
        </View>
      </View>
      <View style={s.section}>
        <View style={s.row}>
          <Ionicons name={isDark ? 'moon' : 'sunny'} size={20} color={theme.colors.text} />
          <Text style={s.rowText}>Tema escuro</Text>
          <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ true: theme.colors.primary }} />
        </View>
        <TouchableOpacity style={s.row} onPress={sync} disabled={isSyncing}>
          <Ionicons name="sync" size={20} color={theme.colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={s.rowText}>Sincronizar dados</Text>
            {lastSyncedAt && (
              <Text style={s.rowSubText}>
                Última sync: {new Date(lastSyncedAt).toLocaleString('pt-BR')}
              </Text>
            )}
          </View>
          {isSyncing && <Text style={s.syncingText}>Sincronizando...</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={[s.row, s.logoutRow]} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color={theme.colors.danger} />
          <Text style={[s.rowText, { color: theme.colors.danger }]}>Sair da conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
      padding: 16,
      paddingTop: 60,
      backgroundColor: theme.colors.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text },
    userCard: { alignItems: 'center', padding: 24, backgroundColor: theme.colors.card, marginBottom: 16 },
    avatar: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    avatarText: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
    userName: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text },
    userEmail: { fontSize: 14, color: theme.colors.textMuted, marginTop: 4 },
    statsRow: { flexDirection: 'row', padding: 16, gap: 12, marginBottom: 8 },
    statCard: {
      flex: 1,
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    statNumber: { fontSize: 24, fontWeight: 'bold', color: theme.colors.primary },
    statLabel: { fontSize: 12, color: theme.colors.textMuted, marginTop: 4 },
    section: { backgroundColor: theme.colors.card, borderRadius: 12, margin: 16, overflow: 'hidden' },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      gap: 12,
    },
    rowText: { flex: 1, fontSize: 16, color: theme.colors.text },
    rowSubText: { fontSize: 12, color: theme.colors.textMuted },
    syncingText: { fontSize: 12, color: theme.colors.primary },
    logoutRow: { borderBottomWidth: 0 },
  });
