import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { AlertItem } from '@/types';

interface Props {
  alerts: AlertItem[];
}

const severityColors = {
  Low: '#16a34a',
  Medium: '#d97706',
  High: '#dc2626'
};

export const AlertList: React.FC<Props> = ({ alerts }) => (
  <FlatList
    data={alerts}
    keyExtractor={item => item.id}
    renderItem={({ item }) => (
      <View style={[styles.alert, { borderLeftColor: severityColors[item.severity] }]}> 
        <Text style={styles.title}>{item.category}</Text>
        <Text style={styles.message}>{item.message}</Text>
      </View>
    )}
  />
);

const styles = StyleSheet.create({
  alert: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4
  },
  title: {
    color: '#e2e8f0',
    fontWeight: '700'
  },
  message: {
    color: '#cbd5e1'
  }
});

export default AlertList;
