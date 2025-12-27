import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  title: string;
  description?: string;
}

export const SectionHeader: React.FC<Props> = ({ title, description }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    {description ? <Text style={styles.description}>{description}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 8
  },
  title: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '700'
  },
  description: {
    color: '#94a3b8'
  }
});

export default SectionHeader;
