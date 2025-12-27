import React, { useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useEcoSphereStore } from '@/state/store';

export const EcoScanScreen: React.FC = () => {
  const addScanAction = useEcoSphereStore(state => state.addScanAction);
  const [title, setTitle] = useState('Organic pasta');
  const [packaging, setPackaging] = useState<'plastic' | 'paper' | 'glass' | 'metal' | 'mixed'>('paper');
  const [origin, setOrigin] = useState<'local' | 'imported'>('local');
  const [impactKg, setImpactKg] = useState('1.2');
  const [expiryPredictionDays, setExpiryPredictionDays] = useState('5');

  const handleScan = () => {
    addScanAction({
      title,
      barcode: '123456789',
      packaging,
      origin,
      impactKg: parseFloat(impactKg) || 0,
      expiryPredictionDays: parseInt(expiryPredictionDays, 10) || 0
    });
    setTitle('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>EcoScan</Text>
      <Text style={styles.subtitle}>Barcode / QR + receipt capture with expiry prediction</Text>
      <TextInput style={styles.input} placeholder="Product" placeholderTextColor="#cbd5e1" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Packaging" placeholderTextColor="#cbd5e1" value={packaging} onChangeText={text => setPackaging(text as any)} />
      <TextInput style={styles.input} placeholder="Origin" placeholderTextColor="#cbd5e1" value={origin} onChangeText={text => setOrigin(text as any)} />
      <TextInput style={styles.input} placeholder="Impact kg" placeholderTextColor="#cbd5e1" value={impactKg} onChangeText={setImpactKg} keyboardType="decimal-pad" />
      <TextInput style={styles.input} placeholder="Expiry prediction (days)" placeholderTextColor="#cbd5e1" value={expiryPredictionDays} onChangeText={setExpiryPredictionDays} keyboardType="number-pad" />
      <Button title="Add to EcoCart" onPress={handleScan} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', padding: 16 },
  title: { color: '#e2e8f0', fontSize: 22, fontWeight: '800' },
  subtitle: { color: '#94a3b8', marginBottom: 12 },
  input: {
    backgroundColor: '#0b1224',
    color: '#e2e8f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10
  }
});

export default EcoScanScreen;
