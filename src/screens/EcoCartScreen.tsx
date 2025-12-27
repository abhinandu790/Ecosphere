import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useEcoSphereStore } from '@/state/store';
import ActionList from '@/components/ActionList';

export const EcoCartScreen: React.FC = () => {
  const ecoActions = useEcoSphereStore(state => state.ecoActions);
  const grouped = ecoActions.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + item.impactKg;
    return acc;
  }, {});

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>EcoCart Timeline</Text>
      <View style={styles.chips}>
        {Object.entries(grouped).map(([category, total]) => (
          <View key={category} style={styles.chip}>
            <Text style={styles.chipText}>{category.toUpperCase()}</Text>
            <Text style={styles.chipValue}>{total.toFixed(1)}kg</Text>
          </View>
        ))}
      </View>
      <ActionList actions={ecoActions} />
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
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12
  },
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
