import React, { useEffect, useMemo, useState } from 'react';
import { Button, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { useEcoSphereStore } from '@/state/store';
import ActionList from '@/components/ActionList';
import { TravelLog } from '@/types';

type TravelMethod = 'walking' | 'cycling' | 'bus' | 'metro' | 'car' | 'ev';
type Coordinates = { latitude: number; longitude: number };

const travelEmissionFactor: Record<TravelMethod, number> = {
  walking: 0,
  cycling: 0,
  bus: 0.08,
  metro: 0.05,
  car: 0.21,
  ev: 0.04
};

export const EcoMilesScreen: React.FC = () => {
  const { logTravel, ecoActions } = useEcoSphereStore();
  const travelLogs = useMemo(
    () => ecoActions.filter((action): action is TravelLog => action.category === 'travel'),
    [ecoActions]
  );
  const [method, setMethod] = useState<TravelMethod>('cycling');
  const [distance, setDistance] = useState('3.5');
  const [autoDistance, setAutoDistance] = useState<number | null>(null);
  const [startCoords, setStartCoords] = useState<Coordinates | null>(null);
  const [endCoords, setEndCoords] = useState<Coordinates | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);

  const carFactor = travelEmissionFactor.car;

  useEffect(() => {
    Location.requestForegroundPermissionsAsync().then(({ status }: { status: string }) =>
      setHasLocationPermission(status === 'granted')
    );
  }, []);

  const haversineKm = (a: Coordinates, b: Coordinates) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(b.latitude - a.latitude);
    const dLon = toRad(b.longitude - a.longitude);
    const lat1 = toRad(a.latitude);
    const lat2 = toRad(b.latitude);
    const h =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * R * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  };

  const handleStart = async () => {
    if (!hasLocationPermission) return;
    const loc = await Location.getCurrentPositionAsync({});
    setStartCoords(loc.coords);
    setEndCoords(null);
    setAutoDistance(null);
  };

  const handleStop = async () => {
    if (!startCoords) return;
    const loc = await Location.getCurrentPositionAsync({});
    setEndCoords(loc.coords);
    const computed = haversineKm(startCoords, loc.coords);
    setAutoDistance(computed);
    setDistance(computed.toFixed(2));
  };

  const computedImpact = useMemo(() => {
    const km = parseFloat(distance) || 0;
    return +(km * travelEmissionFactor[method]).toFixed(2);
  }, [distance, method]);

  const savings = useMemo(() => {
    const km = parseFloat(distance) || 0;
    const carImpact = km * carFactor;
    return +(carImpact - computedImpact).toFixed(2);
  }, [carFactor, computedImpact, distance]);

  const handleLog = () => {
    logTravel({
      title: `${method} ride`,
      method,
      distanceKm: parseFloat(distance) || autoDistance || 0,
      impactKg: computedImpact,
      savingsKg: savings,
      startLat: startCoords?.latitude,
      startLng: startCoords?.longitude,
      endLat: endCoords?.latitude,
      endLng: endCoords?.longitude,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>EcoMiles</Text>
      <Text style={styles.subtitle}>Log transportation and visualize carbon savings</Text>
      {hasLocationPermission === false && <Text style={styles.warning}>Location permission is required for auto-distance.</Text>}
      <View style={styles.chipRow}>
        {(['walking', 'cycling', 'bus', 'metro', 'car', 'ev'] as const).map(option => (
          <Pressable key={option} style={[styles.chip, method === option && styles.chipActive]} onPress={() => setMethod(option)}>
            <Text style={styles.chipText}>{option}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.trackingRow}>
        <Button title="Start route" onPress={handleStart} disabled={!hasLocationPermission} />
        <Button title="Stop & calc" onPress={handleStop} disabled={!startCoords || !hasLocationPermission} />
      </View>
      {autoDistance !== null && (
        <Text style={styles.autoDistance}>Auto distance: {autoDistance.toFixed(2)} km</Text>
      )}
      {startCoords && endCoords && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: startCoords.latitude,
            longitude: startCoords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker coordinate={{ latitude: startCoords.latitude, longitude: startCoords.longitude }} title="Start" />
          <Marker coordinate={{ latitude: endCoords.latitude, longitude: endCoords.longitude }} title="End" pinColor="#22d3ee" />
        </MapView>
      )}
      <TextInput style={styles.input} placeholder="Distance (km)" placeholderTextColor="#cbd5e1" value={distance} onChangeText={setDistance} keyboardType="decimal-pad" />
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Impact</Text>
          <Text style={styles.summaryValue}>{computedImpact} kg</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Savings vs car</Text>
          <Text style={styles.summaryValue}>{savings} kg</Text>
        </View>
      </View>
      <Button title="Save trip" onPress={handleLog} />
      <View style={styles.historyHeader}>
        <Text style={styles.subtitle}>Recent travel</Text>
        <Text style={styles.historyHint}>Weekly + monthly insights auto-calc from logs</Text>
      </View>
      <ActionList actions={travelLogs} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', padding: 16 },
  title: { color: '#e2e8f0', fontSize: 22, fontWeight: '800' },
  subtitle: { color: '#94a3b8', marginBottom: 12 },
  warning: { color: '#fbbf24', marginBottom: 8 },
  historyHint: { color: '#64748b', marginBottom: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#0b1224' },
  chipActive: { backgroundColor: '#1d4ed8' },
  chipText: { color: '#e2e8f0', textTransform: 'capitalize' },
  input: {
    backgroundColor: '#0b1224',
    color: '#e2e8f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10
  },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  summaryCard: { flex: 1, backgroundColor: '#0b1224', padding: 12, borderRadius: 10 },
  summaryLabel: { color: '#94a3b8' },
  summaryValue: { color: '#e2e8f0', fontWeight: '800', fontSize: 18 },
  trackingRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 8 },
  autoDistance: { color: '#22d3ee', marginBottom: 8 },
  map: { height: 160, borderRadius: 12, marginBottom: 10 },
  historyHeader: { marginTop: 10 }
});

export default EcoMilesScreen;
