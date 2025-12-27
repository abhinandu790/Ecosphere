import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  label: string;
  value: string;
  sublabel?: string;
  tone?: 'primary' | 'success' | 'warning';
}

const toneStyles = {
  primary: { backgroundColor: '#0f766e' },
  success: { backgroundColor: '#16a34a' },
  warning: { backgroundColor: '#d97706' }
};

export const StatCard: React.FC<Props> = ({ label, value, sublabel, tone = 'primary' }) => (
  <View style={[styles.card, toneStyles[tone]]}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
    {sublabel ? <Text style={styles.sublabel}>{sublabel}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 6,
    width: '48%'
  },
  label: {
    color: '#e2e8f0',
    fontWeight: '600'
  },
  value: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '700'
  },
  sublabel: {
    color: '#cbd5e1'
  }
});

export default StatCard;
