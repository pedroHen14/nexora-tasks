import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
  isSyncing: boolean;
  lastSyncedAt: string | null;
  error: string | null;
}

export function SyncIndicator({ isSyncing, lastSyncedAt, error }: Props) {
  const { theme } = useTheme();
  const s = styles(theme);

  if (!isSyncing && !error && !lastSyncedAt) return null;

  return (
    <View style={[s.container, error ? s.error : isSyncing ? s.syncing : s.synced]}>
      {isSyncing && <ActivityIndicator size="small" color="#fff" style={s.spinner} />}
      <Text style={s.text}>
        {error ? `Erro: ${error}` : isSyncing ? 'Sincronizando...' : `Sincronizado`}
      </Text>
    </View>
  );
}

const styles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 8,
      paddingHorizontal: 16,
    },
    syncing: { backgroundColor: theme.colors.primary },
    synced: { backgroundColor: theme.colors.success },
    error: { backgroundColor: theme.colors.danger },
    spinner: { marginRight: 8 },
    text: { color: '#fff', fontSize: 13 },
  });
