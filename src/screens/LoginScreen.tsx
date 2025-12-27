import React, { useState } from 'react';
import { Alert, Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useEcoSphereStore } from '@/state/store';

export const LoginScreen: React.FC = () => {
  const login = useEcoSphereStore(state => state.login);
  const register = useEcoSphereStore(state => state.register);
  const loading = useEcoSphereStore(state => state.loading);
  const [email, setEmail] = useState('user@ecospherex.app');
  const [password, setPassword] = useState('changeme123');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const handleAuth = async () => {
    if (!email.includes('@') || password.length < 6) {
      Alert.alert('Enter a valid email and a password of at least 6 characters');
      return;
    }
    try {
      if (mode === 'login') {
        await login(email, password, role);
      } else {
        await register(email, password, role);
      }
    } catch (error: any) {
      Alert.alert('Authentication failed', error?.response?.data?.detail || 'Check credentials and try again');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>EcoSphere X</Text>
      <Text style={styles.subtitle}>Track and reduce your carbon footprint</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#cbd5e1"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#cbd5e1"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>Role:</Text>
        <Button title={role === 'user' ? 'User' : 'Admin'} onPress={() => setRole(role === 'user' ? 'admin' : 'user')} />
      </View>
      <View style={styles.toggleRow}>
        <Button title={`Switch to ${mode === 'login' ? 'Register' : 'Login'}`} onPress={() => setMode(mode === 'login' ? 'register' : 'login')} />
      </View>
      <Button title={loading ? 'Working...' : mode === 'login' ? 'Login' : 'Create account'} onPress={handleAuth} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    padding: 24,
    justifyContent: 'center'
  },
  title: {
    color: '#e2e8f0',
    fontSize: 32,
    fontWeight: '800'
  },
  subtitle: {
    color: '#94a3b8',
    marginBottom: 24
  },
  input: {
    backgroundColor: '#0b1224',
    color: '#e2e8f0',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  toggleLabel: {
    color: '#e2e8f0',
    marginRight: 12
  }
});

export default LoginScreen;
