import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export const ModuleCard: React.FC<Props> = ({ title, description, children }) => (
  <View style={styles.card}>
    <View style={{ marginBottom: 8 }}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#1e293b'
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#e2e8f0'
  },
  description: {
    color: '#94a3b8',
    marginTop: 4
  }
});

export default ModuleCard;
