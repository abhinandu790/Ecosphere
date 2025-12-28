<<<<<<< HEAD
import React, { useMemo } from 'react';
import { Button, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useEcoSphereStore } from '@/state/store';

const medalColor = ['#fbbf24', '#a3a3a3', '#cd7f32'];

export const CommunityScreen: React.FC = () => {
  const { communityEvents, completeEvent, user, leaderboard } = useEcoSphereStore();
  const rankedLeaders = useMemo(
    () => [...leaderboard].sort((a, b) => b.ecoScore - a.ecoScore).slice(0, 5),
    [leaderboard]
  );
  const yourRank = useMemo(() => {
    const idx = rankedLeaders.findIndex(entry => entry.name === (user?.name ?? 'You'));
    return idx >= 0 ? idx + 1 : null;
  }, [rankedLeaders, user?.name]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          <View>
            <Text style={styles.title}>Community & Events</Text>
            <Text style={styles.subtitle}>Compete, collaborate, and climb the eco leaderboard.</Text>
          </View>
          <View style={styles.badgePill}>
            <Text style={styles.badgePillText}>{user?.badges.length ?? 0} badges</Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Open events</Text>
            <Text style={styles.summaryValue}>{communityEvents.length}</Text>
            <Text style={styles.summaryHint}>Join drives, cleanups, workshops</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Your rank</Text>
            <Text style={styles.summaryValue}>{yourRank ?? '—'}</Text>
            <Text style={styles.summaryHint}>vs top eco performers</Text>
          </View>
        </View>

        <View style={styles.leaderboard}>
          <View style={styles.leaderHeader}>
            <Text style={styles.sectionTitle}>Leaderboard</Text>
            <Text style={styles.sectionSub}>Weekly EcoScore standings</Text>
          </View>
          {rankedLeaders.map((entry, idx) => (
            <View key={`${entry.name}-${entry.ecoScore}`} style={styles.leaderRow}>
              <View style={[styles.medal, { backgroundColor: medalColor[idx] || '#334155' }]}> 
                <Text style={styles.medalText}>{idx + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{entry.name}</Text>
                <Text style={styles.meta}>{entry.city}</Text>
              </View>
              <Text style={styles.points}>{entry.ecoScore}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Open events</Text>
=======
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
>>>>>>> main
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
<<<<<<< HEAD
  container: { flex: 1, backgroundColor: '#020617' },
  scroll: { padding: 16, paddingBottom: 24 },
  hero: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: { color: '#e2e8f0', fontSize: 22, fontWeight: '800' },
  subtitle: { color: '#94a3b8', marginTop: 4, maxWidth: '78%' },
  badgePill: { backgroundColor: '#22d3ee', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 14 },
  badgePillText: { color: '#0b1224', fontWeight: '800' },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  summaryCard: {
    flex: 1,
    backgroundColor: '#0b1224',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  summaryLabel: { color: '#94a3b8' },
  summaryValue: { color: '#e2e8f0', fontWeight: '800', fontSize: 20 },
  summaryHint: { color: '#64748b', marginTop: 2 },
  leaderboard: { backgroundColor: '#0f172a', borderRadius: 14, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#1e293b' },
  leaderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { color: '#e2e8f0', fontWeight: '800', marginBottom: 4, fontSize: 16 },
  sectionSub: { color: '#94a3b8' },
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    gap: 12,
  },
  medal: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  medalText: { color: '#0b1224', fontWeight: '800' },
  card: { backgroundColor: '#0b1224', padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#1e293b' },
=======
  container: { flex: 1, backgroundColor: '#020617', padding: 16 },
  title: { color: '#e2e8f0', fontSize: 22, fontWeight: '800' },
  subtitle: { color: '#94a3b8', marginBottom: 12 },
  card: {
    backgroundColor: '#0b1224',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10
  },
>>>>>>> main
  name: { color: '#e2e8f0', fontWeight: '700', fontSize: 16 },
  meta: { color: '#94a3b8' },
  points: { color: '#22c55e', fontWeight: '800', marginBottom: 6 }
});

export default CommunityScreen;
