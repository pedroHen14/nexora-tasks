import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert, ScrollView
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { register } from '../../services/authService';
import type { AuthStackParamList } from '../../types/navigation';

type Props = { navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'> };

export function RegisterScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const { login: authLogin } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }
    setIsLoading(true);
    try {
      const { user, token } = await register({ name, email, password });
      await authLogin(user, token);
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao cadastrar');
    } finally {
      setIsLoading(false);
    }
  };

  const s = styles(theme);
  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={s.inner}>
        <Text style={s.title}>Nexora Tasks</Text>
        <Text style={s.subtitle}>Crie sua conta</Text>
        <TextInput
          style={s.input}
          placeholder="Nome"
          placeholderTextColor={theme.colors.textMuted}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={s.input}
          placeholder="Email"
          placeholderTextColor={theme.colors.textMuted}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={s.input}
          placeholder="Senha (mín. 6 caracteres)"
          placeholderTextColor={theme.colors.textMuted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={s.button} onPress={handleRegister} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={s.buttonText}>Cadastrar</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={s.link}>Já tem conta? Entre</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    inner: { flexGrow: 1, padding: 24, justifyContent: 'center' },
    title: { fontSize: 32, fontWeight: 'bold', color: theme.colors.primary, textAlign: 'center', marginBottom: 8 },
    subtitle: { fontSize: 16, color: theme.colors.textMuted, textAlign: 'center', marginBottom: 32 },
    input: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      fontSize: 16,
    },
    button: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      marginBottom: 16,
    },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    link: { color: theme.colors.primary, textAlign: 'center', fontSize: 14 },
  });
