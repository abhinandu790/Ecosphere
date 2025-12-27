import React, { useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, TextInput } from 'react-native';
import { useEcoSphereStore } from '@/state/store';

export const EcoPlateScreen: React.FC = () => {
  const logFoodOrder = useEcoSphereStore(state => state.logFoodOrder);
  const [title, setTitle] = useState('Vegan bowl delivery');
  const [packagingType, setPackagingType] = useState('bioplastic');
  const [distance, setDistance] = useState('5');
  const [impact, setImpact] = useState('0.9');
  const [alternative, setAlternative] = useState('bring your own container');

  const handleLog = () => {
    logFoodOrder({
      title,
      packagingType,
      deliveryDistanceKm: parseFloat(distance) || 0,
      impactKg: parseFloat(impact) || 0,
      alternative
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>EcoPlate</Text>
      <Text style={styles.subtitle}>Track food & delivery footprint</Text>
      <TextInput style={styles.input} placeholder="Order" placeholderTextColor="#cbd5e1" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Packaging" placeholderTextColor="#cbd5e1" value={packagingType} onChangeText={setPackagingType} />
      <TextInput style={styles.input} placeholder="Delivery distance (km)" placeholderTextColor="#cbd5e1" value={distance} onChangeText={setDistance} keyboardType="decimal-pad" />
      <TextInput style={styles.input} placeholder="Impact (kg CO₂)" placeholderTextColor="#cbd5e1" value={impact} onChangeText={setImpact} keyboardType="decimal-pad" />
      <TextInput style={styles.input} placeholder="Eco alternative" placeholderTextColor="#cbd5e1" value={alternative} onChangeText={setAlternative} />
      <Button title="Save order" onPress={handleLog} />
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

export default EcoPlateScreen;
