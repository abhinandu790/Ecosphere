import React, { useState } from 'react';
import { Button, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useEcoSphereStore } from '@/state/store';

export const EcoScanScreen: React.FC = () => {
  const addScanAction = useEcoSphereStore(state => state.addScanAction);
  const [title, setTitle] = useState('Organic pasta');
  const [packaging, setPackaging] = useState<'plastic' | 'paper' | 'glass' | 'metal' | 'mixed'>('paper');
  const [origin, setOrigin] = useState<'local' | 'imported'>('local');
  const [impactKg, setImpactKg] = useState('1.2');
  const [expiryPredictionDays, setExpiryPredictionDays] = useState('5');
  const [receiptLink, setReceiptLink] = useState('');

  const handleScan = () => {
    addScanAction({
      title,
      barcode: '123456789',
      packaging,
      origin,
      receiptUrl: receiptLink || undefined,
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
      <Text style={styles.label}>Packaging type</Text>
      <View style={styles.chipRow}>
        {['plastic', 'paper', 'glass', 'metal', 'mixed'].map(option => (
          <Pressable key={option} style={[styles.chip, packaging === option && styles.chipActive]} onPress={() => setPackaging(option as any)}>
            <Text style={styles.chipText}>{option}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.label}>Origin</Text>
      <View style={styles.chipRow}>
        {['local', 'imported'].map(option => (
          <Pressable key={option} style={[styles.chip, origin === option && styles.chipActive]} onPress={() => setOrigin(option as any)}>
            <Text style={styles.chipText}>{option}</Text>
          </Pressable>
        ))}
      </View>
      <TextInput style={styles.input} placeholder="Impact kg" placeholderTextColor="#cbd5e1" value={impactKg} onChangeText={setImpactKg} keyboardType="decimal-pad" />
      <TextInput style={styles.input} placeholder="Expiry prediction (days)" placeholderTextColor="#cbd5e1" value={expiryPredictionDays} onChangeText={setExpiryPredictionDays} keyboardType="number-pad" />
      <TextInput style={styles.input} placeholder="Receipt URL or photo ref" placeholderTextColor="#cbd5e1" value={receiptLink} onChangeText={setReceiptLink} />
      <Button title="Add to EcoCart" onPress={handleScan} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', padding: 16 },
  title: { color: '#e2e8f0', fontSize: 22, fontWeight: '800' },
  subtitle: { color: '#94a3b8', marginBottom: 12 },
  label: { color: '#e2e8f0', marginBottom: 4, marginTop: 8 },
  input: {
    backgroundColor: '#0b1224',
    color: '#e2e8f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10
  },
  chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, backgroundColor: '#0b1224' },
  chipActive: { backgroundColor: '#1d4ed8' },
  chipText: { color: '#e2e8f0', textTransform: 'capitalize' }
});

export default EcoScanScreen;
