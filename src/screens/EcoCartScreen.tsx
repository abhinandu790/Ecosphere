<<<<<<< HEAD
import React, { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
=======
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
>>>>>>> main
import { useEcoSphereStore } from '@/state/store';
import ActionList from '@/components/ActionList';

export const EcoCartScreen: React.FC = () => {
  const ecoActions = useEcoSphereStore(state => state.ecoActions);
<<<<<<< HEAD
  const [filter, setFilter] = useState<'all' | 'food' | 'travel' | 'energy' | 'waste'>('all');
  const filtered = useMemo(
    () => (filter === 'all' ? ecoActions : ecoActions.filter(action => action.category === filter)),
    [ecoActions, filter]
  );
=======
>>>>>>> main
  const grouped = ecoActions.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + item.impactKg;
    return acc;
  }, {});
<<<<<<< HEAD
  const severityCounts = ecoActions.reduce(
    (acc, item) => ({ ...acc, [item.impactLevel]: acc[item.impactLevel] + 1 }),
    { Low: 0, Medium: 0, High: 0 }
  );
=======
>>>>>>> main

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>EcoCart Timeline</Text>
<<<<<<< HEAD
      <Text style={styles.subtitle}>Chronological log of shopping, travel, energy, and waste</Text>
      <View style={styles.severityRow}>
        {(['Low', 'Medium', 'High'] as const).map(level => (
          <View key={level} style={[styles.severityChip, styles[`severity${level}`]]}>
            <Text style={styles.severityText}>{level}</Text>
            <Text style={styles.chipValue}>{severityCounts[level]}</Text>
          </View>
        ))}
      </View>
      <View style={styles.filterRow}>
        {(['all', 'food', 'travel', 'energy', 'waste'] as const).map(category => (
          <Pressable key={category} style={[styles.filterChip, filter === category && styles.filterActive]} onPress={() => setFilter(category)}>
            <Text style={styles.chipText}>{category.toUpperCase()}</Text>
          </Pressable>
        ))}
      </View>
=======
>>>>>>> main
      <View style={styles.chips}>
        {Object.entries(grouped).map(([category, total]) => (
          <View key={category} style={styles.chip}>
            <Text style={styles.chipText}>{category.toUpperCase()}</Text>
            <Text style={styles.chipValue}>{total.toFixed(1)}kg</Text>
          </View>
        ))}
      </View>
<<<<<<< HEAD
      <ActionList actions={filtered} />
=======
      <ActionList actions={ecoActions} />
>>>>>>> main
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    padding: 16
  },
  title: {
    color: '#e2e8f0',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12
  },
<<<<<<< HEAD
  subtitle: { color: '#94a3b8', marginBottom: 10 },
  severityRow: { flexDirection: 'row', marginBottom: 8, gap: 8 },
  severityChip: { padding: 8, borderRadius: 10, flex: 1, alignItems: 'center' },
  severityLow: { backgroundColor: 'rgba(34,197,94,0.2)' },
  severityMedium: { backgroundColor: 'rgba(234,179,8,0.2)' },
  severityHigh: { backgroundColor: 'rgba(239,68,68,0.2)' },
  severityText: { color: '#e2e8f0', fontWeight: '700' },
=======
>>>>>>> main
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12
  },
<<<<<<< HEAD
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  filterChip: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, backgroundColor: '#0b1224' },
  filterActive: { backgroundColor: '#1d4ed8' },
=======
>>>>>>> main
  chip: {
    backgroundColor: '#0b1224',
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8
  },
  chipText: {
    color: '#94a3b8',
    fontWeight: '700'
  },
  chipValue: {
    color: '#e2e8f0'
  }
});

export default EcoCartScreen;
