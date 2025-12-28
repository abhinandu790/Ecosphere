import React, { useMemo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEcoSphereStore } from '@/state/store';
import StatCard from '@/components/StatCard';
import ModuleCard from '@/components/ModuleCard';
import AlertList from '@/components/AlertList';
import SurfaceCard from '@/components/SurfaceCard';
import { palette } from '@/theme';

const quickActions = [
  { label: 'Scan', emoji: '📷', target: 'EcoScan' },
  { label: 'Travel', emoji: '🚲', target: 'Travel' },
  { label: 'Energy', emoji: '⚡️', target: 'Energy' },
  { label: 'Food', emoji: '🥗', target: 'Food' },
  { label: 'Waste', emoji: '♻️', target: 'Waste' },
  { label: 'Community', emoji: '🌎', target: 'Community' },
];

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, ecoActions, alerts, leaderboard, communityEvents, computeEcoScore, categoryTotals } = useEcoSphereStore();
  const ecoScore = user?.ecoScore ?? computeEcoScore();
  const completedLowImpact = ecoActions.filter(a => a.impactLevel === 'Low').length;
  const highImpactCount = ecoActions.filter(a => a.impactLevel === 'High').length;
  const totals = categoryTotals();
  const topThree = useMemo(() => [...leaderboard].sort((a, b) => b.ecoScore - a.ecoScore).slice(0, 3), [leaderboard]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <SurfaceCard accent="hero" borderless style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.welcome}>Welcome back, {user?.name ?? 'Explorer'} 👋</Text>
              <Text style={styles.caption}>Role: {user?.role ?? 'user'} • Streak: {user?.streak ?? 0} days</Text>
              <View style={styles.pillRow}>
                <View style={styles.pill}><Text style={styles.pillText}>EcoScore {ecoScore}</Text></View>
                <View style={styles.pillMuted}><Text style={styles.pillMutedText}>{user?.badges.length ?? 1} badges</Text></View>
              </View>
            </View>
            <View style={styles.heroBadge}> 
              <Text style={styles.heroBadgeEmoji}>✨</Text>
              <Text style={styles.heroBadgeText}>EcoSphere X</Text>
            </View>
          </View>
        </SurfaceCard>

        <SurfaceCard style={styles.quickCard}>
          <Text style={styles.sectionTitle}>Quick actions</Text>
          <Text style={styles.sectionSub}>Jump straight into any module</Text>
          <View style={styles.quickGrid}>
            {quickActions.map(action => (
              <Pressable key={action.label} style={styles.quickTile} onPress={() => navigation.navigate(action.target as never)}>
                <Text style={styles.quickEmoji}>{action.emoji}</Text>
                <Text style={styles.quickLabel}>{action.label}</Text>
              </Pressable>
            ))}
          </View>
        </SurfaceCard>

        <ModuleCard title="Eco performance" description="Personalized carbon balance, ready at a glance">
          <View style={styles.row}>
            <StatCard label="EcoScore" value={`${ecoScore}`} sublabel="Dynamic carbon score" />
            <StatCard label="Badges" value={`${user?.badges.length ?? 1}`} sublabel={(user?.badges ?? ['Local Shopper']).join(', ')} tone="success" />
          </View>
          <View style={[styles.row, { marginTop: 10 }]}>
            <StatCard label="Low impact" value={`${completedLowImpact}`} sublabel="This week" />
            <StatCard label="High impact" value={`${highImpactCount}`} sublabel="Action needed" tone="warning" />
          </View>
        </ModuleCard>

        <ModuleCard title="Category impact" description="Food, travel, energy, waste balance">
          <View style={styles.row}>
            <StatCard label="Food" value={`${totals.food.toFixed(1)}kg`} sublabel="EcoScan + EcoPlate" />
            <StatCard label="Travel" value={`${totals.travel.toFixed(1)}kg`} sublabel="EcoMiles" />
          </View>
          <View style={[styles.row, { marginTop: 8 }]}>
            <StatCard label="Energy" value={`${totals.energy.toFixed(1)}kg`} sublabel="EcoWatt" />
            <StatCard label="Waste" value={`${totals.waste.toFixed(1)}kg`} sublabel="EcoCycle" />
          </View>
        </ModuleCard>

        <ModuleCard title="Eco Alerts & Nudges" description="Smart reminders across expiry, travel, waste, and energy usage.">
          <AlertList alerts={alerts} />
        </ModuleCard>

        <ModuleCard title="Leaderboard highlights" description="Crowned eco-performers with your live standing">
          <View style={styles.topRow}>
            {topThree.map((entry, idx) => (
              <SurfaceCard key={entry.name} style={styles.miniCard} accent={idx === 0 ? 'hero' : 'accent'}>
                <Text style={styles.leaderRank}>#{idx + 1}</Text>
                <Text style={styles.leaderName}>{entry.name}</Text>
                <Text style={styles.leaderCity}>{entry.city}</Text>
                <Text style={styles.leaderScore}>{entry.ecoScore} pts</Text>
              </SurfaceCard>
            ))}
          </View>
        </ModuleCard>

        <ModuleCard title="Community & Events" description="Join local eco groups and earn points">
          {communityEvents.map(event => (
            <SurfaceCard key={event.id} style={styles.eventCard}>
              <Text style={styles.leaderName}>{event.name}</Text>
              <Text style={styles.leaderCity}>{event.location} • {event.date}</Text>
              <Text style={styles.eventPoints}>{event.points} pts</Text>
            </SurfaceCard>
          ))}
        </ModuleCard>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  scroll: {
    padding: 16,
    paddingBottom: 24,
  },
  heroCard: {
    marginBottom: 12,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcome: {
    color: palette.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  caption: {
    color: palette.textSecondary,
    marginTop: 4,
  },
  pillRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
    flexWrap: 'wrap',
  },
  pill: {
    backgroundColor: '#0b1224aa',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  pillText: {
    color: palette.accentAlt,
    fontWeight: '800',
  },
  pillMuted: {
    backgroundColor: '#0f172acc',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
  },
  pillMutedText: {
    color: palette.textPrimary,
    fontWeight: '700',
  },
  heroBadge: {
    backgroundColor: '#0b1224dd',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
    alignItems: 'center',
    gap: 4,
    marginLeft: 12,
  },
  heroBadgeEmoji: {
    fontSize: 18,
  },
  heroBadgeText: {
    color: palette.textPrimary,
    fontWeight: '800',
  },
  quickCard: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: palette.textPrimary,
    fontWeight: '800',
    fontSize: 16,
  },
  sectionSub: {
    color: palette.textSecondary,
    marginBottom: 10,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickTile: {
    backgroundColor: palette.muted,
    borderColor: palette.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    minWidth: '30%',
    flexGrow: 1,
    alignItems: 'center',
    gap: 4,
  },
  quickEmoji: { fontSize: 18 },
  quickLabel: { color: palette.textPrimary, fontWeight: '700' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    gap: 8,
  },
  miniCard: {
    flex: 1,
  },
  leaderRank: { color: palette.textSecondary, fontWeight: '800' },
  leaderName: { color: palette.textPrimary, fontWeight: '800', fontSize: 16 },
  leaderCity: { color: palette.textSecondary },
  leaderScore: { color: palette.accent, fontWeight: '800', marginTop: 2 },
  eventCard: {
    marginBottom: 10,
  },
  eventPoints: {
    color: palette.accent,
    fontWeight: '800',
    marginTop: 4,
  },
});

export default DashboardScreen;
