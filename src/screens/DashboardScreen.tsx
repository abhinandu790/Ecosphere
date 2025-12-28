import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useEcoSphereStore } from '@/state/store';
import StatCard from '@/components/StatCard';
import ModuleCard from '@/components/ModuleCard';
import AlertList from '@/components/AlertList';
import { SectionHeader } from '@/components/SectionHeader';

export const DashboardScreen: React.FC = () => {
<<<<<<< HEAD
  const { user, ecoActions, alerts, leaderboard, communityEvents, computeEcoScore, categoryTotals } = useEcoSphereStore();
  const ecoScore = user?.ecoScore ?? computeEcoScore();
  const completedLowImpact = ecoActions.filter(a => a.impactLevel === 'Low').length;
  const highImpactCount = ecoActions.filter(a => a.impactLevel === 'High').length;
  const totals = categoryTotals();
=======
  const { user, ecoActions, alerts, leaderboard, communityEvents, computeEcoScore } = useEcoSphereStore();
  const ecoScore = user?.ecoScore ?? computeEcoScore();
  const completedLowImpact = ecoActions.filter(a => a.impactLevel === 'Low').length;
  const highImpactCount = ecoActions.filter(a => a.impactLevel === 'High').length;
>>>>>>> main

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.welcome}>Welcome back, {user?.name ?? 'Explorer'} 👋</Text>
<<<<<<< HEAD
        <Text style={styles.caption}>Role: {user?.role ?? 'user'} • Streak: {user?.streak ?? 0} days</Text>
=======
>>>>>>> main
        <View style={styles.row}>
          <StatCard label="EcoScore" value={`${ecoScore}`} sublabel="Dynamic carbon score" />
          <StatCard label="Badges" value={`${user?.badges.length ?? 1}`} sublabel={(user?.badges ?? ['Local Shopper']).join(', ')} tone="success" />
        </View>
        <View style={styles.row}>
          <StatCard label="Low impact" value={`${completedLowImpact}`} sublabel="This week" />
          <StatCard label="High impact" value={`${highImpactCount}`} sublabel="Action needed" tone="warning" />
        </View>

<<<<<<< HEAD
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

=======
>>>>>>> main
        <ModuleCard title="Eco Alerts & Nudges" description="Smart reminders across expiry, travel, waste, and energy usage.">
          <AlertList alerts={alerts} />
        </ModuleCard>

        <ModuleCard title="EcoScore & Rewards" description="Track leaderboard, streaks, and badges">
          <SectionHeader title="Leaderboard" description="Weekly and monthly rankings" />
          {leaderboard.map(entry => (
            <View key={entry.name} style={styles.leaderItem}>
              <Text style={styles.leaderName}>{entry.name}</Text>
              <Text style={styles.leaderCity}>{entry.city}</Text>
              <Text style={styles.leaderScore}>{entry.ecoScore}</Text>
            </View>
          ))}
        </ModuleCard>

        <ModuleCard title="Community & Events" description="Join local eco groups and earn points">
          {communityEvents.map(event => (
            <View key={event.id} style={styles.eventItem}>
              <Text style={styles.leaderName}>{event.name}</Text>
              <Text style={styles.leaderCity}>{event.location} • {event.date}</Text>
              <Text style={styles.eventPoints}>{event.points} pts</Text>
            </View>
          ))}
        </ModuleCard>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    padding: 16
  },
  welcome: {
    color: '#e2e8f0',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12
  },
<<<<<<< HEAD
  caption: {
    color: '#94a3b8',
    marginBottom: 12
  },
=======
>>>>>>> main
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  leaderItem: {
    backgroundColor: '#0b1224',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  leaderName: {
    color: '#e2e8f0',
    fontWeight: '700'
  },
  leaderCity: {
    color: '#94a3b8'
  },
  leaderScore: {
    color: '#22c55e',
    fontWeight: '800'
  },
  eventItem: {
    backgroundColor: '#0b1224',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8
  },
  eventPoints: {
    color: '#22c55e',
    fontWeight: '800'
  }
});

export default DashboardScreen;
