import React, { useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useEcoSphereStore } from '@/state/store';
import ActionList from '@/components/ActionList';

export const EcoCycleScreen: React.FC = () => {
  const { ecoActions, logWasteAction } = useEcoSphereStore();
  const wasteActions = ecoActions.filter(a => a.category === 'waste');
  const [title, setTitle] = useState('Glass jar');
  const [disposal, setDisposal] = useState<'recycled' | 'reused' | 'composted' | 'landfill'>('reused');
  const [impact, setImpact] = useState('0.3');
  const [reminder, setReminder] = useState<'7d' | '3d' | 'expiry'>('7d');

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
      <TextInput style={styles.input} placeholder="Disposal" placeholderTextColor="#cbd5e1" value={disposal} onChangeText={text => setDisposal(text as any)} />
      <TextInput style={styles.input} placeholder="Impact (kg CO₂)" placeholderTextColor="#cbd5e1" value={impact} onChangeText={setImpact} keyboardType="decimal-pad" />
      <TextInput style={styles.input} placeholder="Reminder (7d/3d/expiry)" placeholderTextColor="#cbd5e1" value={reminder} onChangeText={text => setReminder(text as any)} />
      <Button title="Log disposal" onPress={handleLog} />
      <Text style={styles.timelineTitle}>Waste timeline</Text>
      <ActionList actions={wasteActions} />
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
  },
  timelineTitle: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8
  }
});

export default EcoCycleScreen;
