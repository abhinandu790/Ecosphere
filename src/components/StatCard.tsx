import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { palette } from '@/theme';

interface Props {
  label: string;
  value: string;
  sublabel?: string;
  tone?: 'primary' | 'success' | 'warning';
}

const toneStyles = {
  primary: { backgroundColor: '#0ea5e9' },
  success: { backgroundColor: palette.accent },
  warning: { backgroundColor: '#f59e0b' },
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
    width: '48%',
    borderWidth: 1,
    borderColor: '#0f172a',
    shadowColor: '#22d3ee',
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  label: {
    color: palette.textPrimary,
    fontWeight: '600',
  },
  value: {
    color: '#0b1224',
    fontSize: 22,
    fontWeight: '800',
  },
  sublabel: {
    color: '#e2e8f0'
  }
});

export default StatCard;
