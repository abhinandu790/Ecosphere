<<<<<<< HEAD
import React, { useMemo, useState } from 'react';
import { Button, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useEcoSphereStore } from '@/state/store';
import ActionList from '@/components/ActionList';

const packagingImpact: Record<'compostable' | 'paper' | 'plastic' | 'reusable', number> = {
  compostable: 0.05,
  paper: 0.08,
  plastic: 0.18,
  reusable: 0.01
};

export const EcoPlateScreen: React.FC = () => {
  const { logFoodOrder, ecoActions } = useEcoSphereStore();
  const history = useMemo(() => ecoActions.filter(a => a.category === 'food'), [ecoActions]);
  const [title, setTitle] = useState('Vegan bowl delivery');
  const [packagingType, setPackagingType] = useState<'compostable' | 'paper' | 'plastic' | 'reusable'>('compostable');
  const [distance, setDistance] = useState('5');
  const [alternative, setAlternative] = useState('bring your own container');

  const impact = useMemo(() => {
    const km = parseFloat(distance) || 0;
    const deliveryImpact = km * 0.12; // per km estimate
    return +(deliveryImpact + packagingImpact[packagingType]).toFixed(2);
  }, [distance, packagingType]);

=======
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

>>>>>>> main
  const handleLog = () => {
    logFoodOrder({
      title,
      packagingType,
      deliveryDistanceKm: parseFloat(distance) || 0,
<<<<<<< HEAD
      impactKg: impact,
=======
      impactKg: parseFloat(impact) || 0,
>>>>>>> main
      alternative
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>EcoPlate</Text>
      <Text style={styles.subtitle}>Track food & delivery footprint</Text>
      <TextInput style={styles.input} placeholder="Order" placeholderTextColor="#cbd5e1" value={title} onChangeText={setTitle} />
<<<<<<< HEAD
      <View style={styles.chipRow}>
        {(['compostable', 'paper', 'plastic', 'reusable'] as const).map(option => (
          <Pressable key={option} style={[styles.chip, packagingType === option && styles.chipActive]} onPress={() => setPackagingType(option)}>
            <Text style={styles.chipText}>{option}</Text>
          </Pressable>
        ))}
      </View>
      <TextInput style={styles.input} placeholder="Delivery distance (km)" placeholderTextColor="#cbd5e1" value={distance} onChangeText={setDistance} keyboardType="decimal-pad" />
      <TextInput style={styles.input} placeholder="Eco alternative" placeholderTextColor="#cbd5e1" value={alternative} onChangeText={setAlternative} />
      <View style={styles.impactCard}>
        <Text style={styles.impactLabel}>Estimated CO₂</Text>
        <Text style={styles.impactValue}>{impact} kg</Text>
        <Text style={styles.impactNote}>Includes packaging + delivery distance</Text>
      </View>
      <Button title="Save order" onPress={handleLog} />
      <Text style={styles.subtitle}>Recent food & delivery logs</Text>
      <ActionList actions={history} />
=======
      <TextInput style={styles.input} placeholder="Packaging" placeholderTextColor="#cbd5e1" value={packagingType} onChangeText={setPackagingType} />
      <TextInput style={styles.input} placeholder="Delivery distance (km)" placeholderTextColor="#cbd5e1" value={distance} onChangeText={setDistance} keyboardType="decimal-pad" />
      <TextInput style={styles.input} placeholder="Impact (kg CO₂)" placeholderTextColor="#cbd5e1" value={impact} onChangeText={setImpact} keyboardType="decimal-pad" />
      <TextInput style={styles.input} placeholder="Eco alternative" placeholderTextColor="#cbd5e1" value={alternative} onChangeText={setAlternative} />
      <Button title="Save order" onPress={handleLog} />
>>>>>>> main
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', padding: 16 },
  title: { color: '#e2e8f0', fontSize: 22, fontWeight: '800' },
  subtitle: { color: '#94a3b8', marginBottom: 12 },
<<<<<<< HEAD
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#0b1224' },
  chipActive: { backgroundColor: '#1d4ed8' },
  chipText: { color: '#e2e8f0' },
=======
>>>>>>> main
  input: {
    backgroundColor: '#0b1224',
    color: '#e2e8f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10
<<<<<<< HEAD
  },
  impactCard: { backgroundColor: '#0b1224', padding: 12, borderRadius: 10, marginBottom: 12 },
  impactLabel: { color: '#94a3b8' },
  impactValue: { color: '#e2e8f0', fontWeight: '800', fontSize: 18 },
  impactNote: { color: '#64748b', marginTop: 4 }
=======
  }
>>>>>>> main
});

export default EcoPlateScreen;
