import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { EcoAction } from '@/types';

interface Props {
  actions: EcoAction[];
}

const badgeColor = {
  Low: '#16a34a',
  Medium: '#d97706',
  High: '#dc2626'
};

export const ActionList: React.FC<Props> = ({ actions }) => (
  <FlatList
    data={actions}
    keyExtractor={item => item.id}
    renderItem={({ item }) => (
      <View style={styles.item}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.meta}>{item.category.toUpperCase()} • {item.date}</Text>
          {'method' in item && <Text style={styles.meta}>Method: {item.method} • {item.distanceKm ?? ''} km</Text>}
          {'appliance' in item && <Text style={styles.meta}>Appliance: {item.appliance} • {item.hoursUsed}h</Text>}
          {'packaging' in item && <Text style={styles.meta}>Packaging: {item.packaging} • {item.origin}</Text>}
          {'receiptUrl' in item && item.receiptUrl && <Text style={styles.meta}>Receipt: {item.receiptUrl}</Text>}
          {'packagingType' in item && <Text style={styles.meta}>Packaging: {item.packagingType} • {item.deliveryDistanceKm} km</Text>}
          {'disposal' in item && <Text style={styles.meta}>Disposal: {item.disposal} • Reminder: {item.reminder}</Text>}
          {'alternative' in item && item.alternative && <Text style={styles.meta}>Alternative: {item.alternative}</Text>}
        </View>
        <View style={[styles.badge, { backgroundColor: badgeColor[item.impactLevel] }]}>
          <Text style={styles.badgeText}>{item.impactLevel}</Text>
          <Text style={styles.badgeSub}>{item.impactKg.toFixed(1)}kg</Text>
        </View>
      </View>
    )}
  />
);

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#0b1224',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row'
  },
  title: {
    color: '#e2e8f0',
    fontWeight: '700'
  },
  meta: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2
  },
  badge: {
    minWidth: 68,
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgeText: {
    color: '#0b1224',
    fontWeight: '800'
  },
  badgeSub: {
    color: '#0b1224',
    fontSize: 12
  }
});

export default ActionList;
