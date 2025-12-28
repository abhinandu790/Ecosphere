<<<<<<< HEAD
import React, { useMemo, useState } from 'react';
import { Button, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useEcoSphereStore } from '@/state/store';
import ActionList from '@/components/ActionList';
import { WasteAction } from '@/types';

export const EcoCycleScreen: React.FC = () => {
  const { ecoActions, logWasteAction } = useEcoSphereStore();
  const wasteActions = useMemo(
    () => ecoActions.filter((a): a is WasteAction => a.category === 'waste'),
    [ecoActions]
  );
=======
import React, { useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useEcoSphereStore } from '@/state/store';
import ActionList from '@/components/ActionList';

export const EcoCycleScreen: React.FC = () => {
  const { ecoActions, logWasteAction } = useEcoSphereStore();
  const wasteActions = ecoActions.filter(a => a.category === 'waste');
>>>>>>> main
  const [title, setTitle] = useState('Glass jar');
  const [disposal, setDisposal] = useState<'recycled' | 'reused' | 'composted' | 'landfill'>('reused');
  const [impact, setImpact] = useState('0.3');
  const [reminder, setReminder] = useState<'7d' | '3d' | 'expiry'>('7d');

<<<<<<< HEAD
  const disposalMix = wasteActions.reduce(
    (acc, action) => ({ ...acc, [action.disposal ?? 'landfill']: (acc[action.disposal ?? 'landfill'] ?? 0) + 1 }),
    { recycled: 0, reused: 0, composted: 0, landfill: 0 }
  );

=======
>>>>>>> main
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
<<<<<<< HEAD
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
=======
      <TextInput style={styles.input} placeholder="Disposal" placeholderTextColor="#cbd5e1" value={disposal} onChangeText={text => setDisposal(text as any)} />
      <TextInput style={styles.input} placeholder="Impact (kg CO₂)" placeholderTextColor="#cbd5e1" value={impact} onChangeText={setImpact} keyboardType="decimal-pad" />
      <TextInput style={styles.input} placeholder="Reminder (7d/3d/expiry)" placeholderTextColor="#cbd5e1" value={reminder} onChangeText={text => setReminder(text as any)} />
      <Button title="Log disposal" onPress={handleLog} />
>>>>>>> main
      <Text style={styles.timelineTitle}>Waste timeline</Text>
      <ActionList actions={wasteActions} />
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
  chipText: { color: '#e2e8f0', textTransform: 'capitalize' },
=======
>>>>>>> main
  input: {
    backgroundColor: '#0b1224',
    color: '#e2e8f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10
  },
<<<<<<< HEAD
  disposalRow: { flexDirection: 'row', gap: 8, marginTop: 12, marginBottom: 8 },
  disposalCard: { flex: 1, backgroundColor: '#0b1224', padding: 10, borderRadius: 10, alignItems: 'center' },
  disposalValue: { color: '#22c55e', fontWeight: '800', fontSize: 18 },
=======
>>>>>>> main
  timelineTitle: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8
  }
});

export default EcoCycleScreen;
