<<<<<<< HEAD
import React, { useMemo, useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { Button, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useEcoSphereStore } from '@/state/store';
import { uploadApi } from '@/api/client';
import ActionList from '@/components/ActionList';

const appliancePresets: Record<string, { kw: number; tip: string }> = {
  'Air Conditioner': { kw: 1.4, tip: 'Use 25°C with eco mode and ceiling fans.' },
  Fridge: { kw: 0.15, tip: 'Keep 2/4°C and ensure proper sealing.' },
  'Washer/Dryer': { kw: 2.3, tip: 'Wash cold, run full loads, line-dry when possible.' },
  Laptop: { kw: 0.05, tip: 'Enable battery saver and dim the screen.' },
  Lighting: { kw: 0.06, tip: 'Use LEDs and switch off unused rooms.' }
};

export const EcoWattScreen: React.FC = () => {
  const { logEnergyUse, ecoActions } = useEcoSphereStore();
  const history = useMemo(() => ecoActions.filter(a => a.category === 'energy'), [ecoActions]);
  const [appliance, setAppliance] = useState<keyof typeof appliancePresets>('Air Conditioner');
  const [hours, setHours] = useState('2');
  const [suggestion, setSuggestion] = useState(appliancePresets[appliance].tip);
  const [billUrl, setBillUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const impact = useMemo(() => {
    const hrs = parseFloat(hours) || 0;
    const kw = appliancePresets[appliance]?.kw ?? 0.4;
    const kg = +(hrs * kw * 0.4).toFixed(2); // 0.4 kg per kWh grid intensity baseline
    return kg;
  }, [appliance, hours]);
=======
import React, { useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useEcoSphereStore } from '@/state/store';

export const EcoWattScreen: React.FC = () => {
  const logEnergyUse = useEcoSphereStore(state => state.logEnergyUse);
  const [appliance, setAppliance] = useState('Air Conditioner');
  const [hours, setHours] = useState('2');
  const [impact, setImpact] = useState('1.8');
  const [suggestion, setSuggestion] = useState('Set to 25°C with eco mode.');
>>>>>>> main

  const handleLog = () => {
    logEnergyUse({
      title: `${appliance} usage`,
      appliance,
      hoursUsed: parseFloat(hours) || 0,
<<<<<<< HEAD
      impactKg: impact,
      suggestion,
      billUrl,
    });
  };

  const handleUploadBill = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: ['image/*', 'application/pdf'], copyToCacheDirectory: true });
    if (result.canceled || !result.assets?.length) return;
    const file = result.assets[0];
    setUploading(true);
    try {
      const uploaded = await uploadApi.receipt({ uri: file.uri, name: file.name || 'bill', type: file.mimeType || 'application/pdf' });
      setBillUrl(uploaded.url || uploaded.key);
    } finally {
      setUploading(false);
    }
  };

=======
      impactKg: parseFloat(impact) || 0,
      suggestion
    });
  };

>>>>>>> main
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>EcoWatt</Text>
      <Text style={styles.subtitle}>Log appliances, estimate carbon, and get tips</Text>
<<<<<<< HEAD
      <View style={styles.chipRow}>
        {Object.keys(appliancePresets).map(item => (
          <Pressable key={item} style={[styles.chip, appliance === item && styles.chipActive]} onPress={() => { setAppliance(item as keyof typeof appliancePresets); setSuggestion(appliancePresets[item].tip); }}>
            <Text style={styles.chipText}>{item}</Text>
          </Pressable>
        ))}
      </View>
      <TextInput style={styles.input} placeholder="Hours" placeholderTextColor="#cbd5e1" value={hours} onChangeText={setHours} keyboardType="decimal-pad" />
      <TextInput style={styles.input} placeholder="Suggestion" placeholderTextColor="#cbd5e1" value={suggestion} onChangeText={setSuggestion} />
      <View style={styles.impactCard}>
        <Text style={styles.impactLabel}>Estimated carbon</Text>
        <Text style={styles.impactValue}>{impact} kg CO₂e</Text>
      </View>
      <View style={styles.uploadRow}>
        <Button title={uploading ? 'Uploading…' : 'Add bill'} onPress={handleUploadBill} disabled={uploading} />
        {billUrl ? <Text style={styles.receiptText}>Bill attached</Text> : null}
      </View>
      <Button title="Log energy" onPress={handleLog} />
      <Text style={styles.subtitle}>Recent appliance logs</Text>
      <ActionList actions={history} />
=======
      <TextInput style={styles.input} placeholder="Appliance" placeholderTextColor="#cbd5e1" value={appliance} onChangeText={setAppliance} />
      <TextInput style={styles.input} placeholder="Hours" placeholderTextColor="#cbd5e1" value={hours} onChangeText={setHours} keyboardType="decimal-pad" />
      <TextInput style={styles.input} placeholder="Impact (kg CO₂)" placeholderTextColor="#cbd5e1" value={impact} onChangeText={setImpact} keyboardType="decimal-pad" />
      <TextInput style={styles.input} placeholder="Suggestion" placeholderTextColor="#cbd5e1" value={suggestion} onChangeText={setSuggestion} />
      <Button title="Log energy" onPress={handleLog} />
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
  uploadRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  receiptText: { color: '#22d3ee' }
=======
  }
>>>>>>> main
});

export default EcoWattScreen;
