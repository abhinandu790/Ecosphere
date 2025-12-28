import React from 'react';
import { Button, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useEcoSphereStore } from '@/state/store';

export const CommunityScreen: React.FC = () => {
  const { communityEvents, completeEvent, user, leaderboard } = useEcoSphereStore();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Community & Events</Text>
        <Text style={styles.subtitle}>Join groups, participate, and earn points</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Open events</Text>
            <Text style={styles.summaryValue}>{communityEvents.length}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Your badges</Text>
            <Text style={styles.summaryValue}>{user?.badges.length ?? 0}</Text>
          </View>
        </View>
        <View style={styles.leaderboard}>
          <Text style={styles.sectionTitle}>Leaderboard</Text>
          {leaderboard.map(entry => (
            <View key={`${entry.name}-${entry.ecoScore}`} style={styles.leaderRow}>
              <View>
                <Text style={styles.name}>{entry.name}</Text>
                <Text style={styles.meta}>{entry.city}</Text>
              </View>
              <Text style={styles.points}>{entry.ecoScore}</Text>
            </View>
          ))}
        </View>
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
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  summaryCard: { flex: 1, backgroundColor: '#0b1224', borderRadius: 10, padding: 12 },
  summaryLabel: { color: '#94a3b8' },
  summaryValue: { color: '#e2e8f0', fontWeight: '800', fontSize: 18 },
  leaderboard: { backgroundColor: '#0b1224', borderRadius: 10, padding: 12, marginBottom: 12 },
  sectionTitle: { color: '#e2e8f0', fontWeight: '800', marginBottom: 8, fontSize: 16 },
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
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
