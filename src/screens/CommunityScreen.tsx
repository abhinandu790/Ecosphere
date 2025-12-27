import React from 'react';
import { Button, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useEcoSphereStore } from '@/state/store';

export const CommunityScreen: React.FC = () => {
  const { communityEvents, completeEvent } = useEcoSphereStore();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Community & Events</Text>
        <Text style={styles.subtitle}>Join groups, participate, and earn points</Text>
        {communityEvents.map(event => (
          <View key={event.id} style={styles.card}>
            <Text style={styles.name}>{event.name}</Text>
            <Text style={styles.meta}>{event.location} • {event.date}</Text>
            <Text style={styles.points}>{event.points} pts</Text>
            <Button title="Complete" onPress={() => completeEvent(event.id)} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', padding: 16 },
  title: { color: '#e2e8f0', fontSize: 22, fontWeight: '800' },
  subtitle: { color: '#94a3b8', marginBottom: 12 },
  card: {
    backgroundColor: '#0b1224',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10
  },
  name: { color: '#e2e8f0', fontWeight: '700', fontSize: 16 },
  meta: { color: '#94a3b8' },
  points: { color: '#22c55e', fontWeight: '800', marginBottom: 6 }
});

export default CommunityScreen;
