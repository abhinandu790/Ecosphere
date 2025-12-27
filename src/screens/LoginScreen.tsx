import React, { useState } from 'react';
import { Alert, Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useEcoSphereStore } from '@/state/store';

interface Props {
  onAuthenticated: () => void;
}

export const LoginScreen: React.FC<Props> = ({ onAuthenticated }) => {
  const login = useEcoSphereStore(state => state.login);
  const [email, setEmail] = useState('user@ecospherex.app');
  const [role, setRole] = useState<'user' | 'admin'>('user');

  const handleLogin = () => {
    if (!email.includes('@')) {
      Alert.alert('Please enter a valid email');
      return;
    }
    login(email, role);
    onAuthenticated();
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
      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>Role:</Text>
        <Button title={role === 'user' ? 'User' : 'Admin'} onPress={() => setRole(role === 'user' ? 'admin' : 'user')} />
      </View>
      <Button title="Continue" onPress={handleLogin} />
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
