import React, { useMemo, useState } from 'react';
import { Button, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useEcoSphereStore } from '@/state/store';
import ActionList from '@/components/ActionList';

type TravelMethod = 'walking' | 'cycling' | 'bus' | 'metro' | 'car' | 'ev';

const travelEmissionFactor: Record<TravelMethod, number> = {
  walking: 0,
  cycling: 0,
  bus: 0.08,
  metro: 0.05,
  car: 0.21,
  ev: 0.04
};

export const EcoMilesScreen: React.FC = () => {
  const { logTravel, ecoActions } = useEcoSphereStore();
  const travelLogs = useMemo(() => ecoActions.filter(action => action.category === 'travel'), [ecoActions]);
  const [method, setMethod] = useState<TravelMethod>('cycling');
  const [distance, setDistance] = useState('3.5');

  const carFactor = travelEmissionFactor.car;

  const computedImpact = useMemo(() => {
    const km = parseFloat(distance) || 0;
    return +(km * travelEmissionFactor[method]).toFixed(2);
  }, [distance, method]);

  const savings = useMemo(() => {
    const km = parseFloat(distance) || 0;
    const carImpact = km * carFactor;
    return +(carImpact - computedImpact).toFixed(2);
  }, [carFactor, computedImpact, distance]);

  const handleLog = () => {
    logTravel({
      title: `${method} ride`,
      method,
      distanceKm: parseFloat(distance) || 0,
      impactKg: computedImpact,
      savingsKg: savings
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>EcoMiles</Text>
      <Text style={styles.subtitle}>Log transportation and visualize carbon savings</Text>
      <View style={styles.chipRow}>
        {(['walking', 'cycling', 'bus', 'metro', 'car', 'ev'] as const).map(option => (
          <Pressable key={option} style={[styles.chip, method === option && styles.chipActive]} onPress={() => setMethod(option)}>
            <Text style={styles.chipText}>{option}</Text>
          </Pressable>
        ))}
      </View>
      <TextInput style={styles.input} placeholder="Distance (km)" placeholderTextColor="#cbd5e1" value={distance} onChangeText={setDistance} keyboardType="decimal-pad" />
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Impact</Text>
          <Text style={styles.summaryValue}>{computedImpact} kg</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Savings vs car</Text>
          <Text style={styles.summaryValue}>{savings} kg</Text>
        </View>
      </View>
      <Button title="Save trip" onPress={handleLog} />
      <View style={styles.historyHeader}>
        <Text style={styles.subtitle}>Recent travel</Text>
        <Text style={styles.historyHint}>Weekly + monthly insights auto-calc from logs</Text>
      </View>
      <ActionList actions={travelLogs} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', padding: 16 },
  title: { color: '#e2e8f0', fontSize: 22, fontWeight: '800' },
  subtitle: { color: '#94a3b8', marginBottom: 12 },
  historyHint: { color: '#64748b', marginBottom: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#0b1224' },
  chipActive: { backgroundColor: '#1d4ed8' },
  chipText: { color: '#e2e8f0', textTransform: 'capitalize' },
  input: {
    backgroundColor: '#0b1224',
    color: '#e2e8f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10
  },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  summaryCard: { flex: 1, backgroundColor: '#0b1224', padding: 12, borderRadius: 10 },
  summaryLabel: { color: '#94a3b8' },
  summaryValue: { color: '#e2e8f0', fontWeight: '800', fontSize: 18 },
  historyHeader: { marginTop: 10 }
});

export default EcoMilesScreen;
