import React, { useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useEcoSphereStore } from '@/state/store';

export const EcoWattScreen: React.FC = () => {
  const logEnergyUse = useEcoSphereStore(state => state.logEnergyUse);
  const [appliance, setAppliance] = useState('Air Conditioner');
  const [hours, setHours] = useState('2');
  const [impact, setImpact] = useState('1.8');
  const [suggestion, setSuggestion] = useState('Set to 25°C with eco mode.');

  const handleLog = () => {
    logEnergyUse({
      title: `${appliance} usage`,
      appliance,
      hoursUsed: parseFloat(hours) || 0,
      impactKg: parseFloat(impact) || 0,
      suggestion
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>EcoWatt</Text>
      <Text style={styles.subtitle}>Log appliances, estimate carbon, and get tips</Text>
      <TextInput style={styles.input} placeholder="Appliance" placeholderTextColor="#cbd5e1" value={appliance} onChangeText={setAppliance} />
      <TextInput style={styles.input} placeholder="Hours" placeholderTextColor="#cbd5e1" value={hours} onChangeText={setHours} keyboardType="decimal-pad" />
      <TextInput style={styles.input} placeholder="Impact (kg CO₂)" placeholderTextColor="#cbd5e1" value={impact} onChangeText={setImpact} keyboardType="decimal-pad" />
      <TextInput style={styles.input} placeholder="Suggestion" placeholderTextColor="#cbd5e1" value={suggestion} onChangeText={setSuggestion} />
      <Button title="Log energy" onPress={handleLog} />
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

export default EcoWattScreen;
