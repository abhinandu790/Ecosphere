import React, { useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useEcoSphereStore } from '@/state/store';

export const EcoMilesScreen: React.FC = () => {
  const logTravel = useEcoSphereStore(state => state.logTravel);
  const [method, setMethod] = useState<'walking' | 'cycling' | 'bus' | 'metro' | 'car' | 'ev'>('cycling');
  const [distance, setDistance] = useState('3.5');
  const [impact, setImpact] = useState('0.6');
  const [savings, setSavings] = useState('1.2');

  const handleLog = () => {
    logTravel({
      title: `${method} ride`,
      method,
      distanceKm: parseFloat(distance) || 0,
      impactKg: parseFloat(impact) || 0,
      savingsKg: parseFloat(savings) || 0
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>EcoMiles</Text>
      <Text style={styles.subtitle}>Log transportation and visualize carbon savings</Text>
      <TextInput style={styles.input} placeholder="Method" placeholderTextColor="#cbd5e1" value={method} onChangeText={text => setMethod(text as any)} />
      <TextInput style={styles.input} placeholder="Distance (km)" placeholderTextColor="#cbd5e1" value={distance} onChangeText={setDistance} keyboardType="decimal-pad" />
      <TextInput style={styles.input} placeholder="Impact (kg CO₂)" placeholderTextColor="#cbd5e1" value={impact} onChangeText={setImpact} keyboardType="decimal-pad" />
      <TextInput style={styles.input} placeholder="Savings (kg CO₂ vs. car)" placeholderTextColor="#cbd5e1" value={savings} onChangeText={setSavings} keyboardType="decimal-pad" />
      <Button title="Save trip" onPress={handleLog} />
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

export default EcoMilesScreen;
