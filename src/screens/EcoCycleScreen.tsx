import React, { useMemo, useState } from 'react';
import { Button, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useEcoSphereStore } from '@/state/store';
import ActionList from '@/components/ActionList';

export const EcoCycleScreen: React.FC = () => {
  const { ecoActions, logWasteAction } = useEcoSphereStore();
  const wasteActions = useMemo(() => ecoActions.filter(a => a.category === 'waste'), [ecoActions]);
  const [title, setTitle] = useState('Glass jar');
  const [disposal, setDisposal] = useState<'recycled' | 'reused' | 'composted' | 'landfill'>('reused');
  const [impact, setImpact] = useState('0.3');
  const [reminder, setReminder] = useState<'7d' | '3d' | 'expiry'>('7d');

  const disposalMix = wasteActions.reduce(
    (acc, action) => ({ ...acc, [action.disposal]: (acc[action.disposal] ?? 0) + 1 }),
    { recycled: 0, reused: 0, composted: 0, landfill: 0 }
  );

  const handleLog = () => {
    logWasteAction({
      title,
      disposal,
      impactKg: parseFloat(impact) || 0,
      reminder,
      penalty: disposal === 'landfill' ? 2 : 0
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>EcoCycle</Text>
      <Text style={styles.subtitle}>Expiry reminders, disposal options, and penalties</Text>
      <TextInput style={styles.input} placeholder="Item" placeholderTextColor="#cbd5e1" value={title} onChangeText={setTitle} />
      <View style={styles.chipRow}>
        {(['recycled', 'reused', 'composted', 'landfill'] as const).map(option => (
          <Pressable key={option} style={[styles.chip, disposal === option && styles.chipActive]} onPress={() => setDisposal(option)}>
            <Text style={styles.chipText}>{option}</Text>
          </Pressable>
        ))}
      </View>
      <TextInput style={styles.input} placeholder="Impact (kg CO₂)" placeholderTextColor="#cbd5e1" value={impact} onChangeText={setImpact} keyboardType="decimal-pad" />
      <View style={styles.chipRow}>
        {(['7d', '3d', 'expiry'] as const).map(option => (
          <Pressable key={option} style={[styles.chip, reminder === option && styles.chipActive]} onPress={() => setReminder(option)}>
            <Text style={styles.chipText}>{option}</Text>
          </Pressable>
        ))}
      </View>
      <Button title="Log disposal" onPress={handleLog} />
      <View style={styles.disposalRow}>
        {Object.entries(disposalMix).map(([key, value]) => (
          <View key={key} style={styles.disposalCard}>
            <Text style={styles.chipText}>{key}</Text>
            <Text style={styles.disposalValue}>{value}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.timelineTitle}>Waste timeline</Text>
      <ActionList actions={wasteActions} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', padding: 16 },
  title: { color: '#e2e8f0', fontSize: 22, fontWeight: '800' },
  subtitle: { color: '#94a3b8', marginBottom: 12 },
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
  disposalRow: { flexDirection: 'row', gap: 8, marginTop: 12, marginBottom: 8 },
  disposalCard: { flex: 1, backgroundColor: '#0b1224', padding: 10, borderRadius: 10, alignItems: 'center' },
  disposalValue: { color: '#22c55e', fontWeight: '800', fontSize: 18 },
  timelineTitle: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8
  }
});

export default EcoCycleScreen;
