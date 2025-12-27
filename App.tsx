import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import { useEcoSphereStore } from '@/state/store';
import DashboardScreen from './src/screens/DashboardScreen';
import EcoScanScreen from './src/screens/EcoScanScreen';
import EcoCartScreen from './src/screens/EcoCartScreen';
import EcoMilesScreen from './src/screens/EcoMilesScreen';
import EcoWattScreen from './src/screens/EcoWattScreen';
import EcoPlateScreen from './src/screens/EcoPlateScreen';
import EcoCycleScreen from './src/screens/EcoCycleScreen';
import CommunityScreen from './src/screens/CommunityScreen';
import LoginScreen from './src/screens/LoginScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const screenOptions = {
  headerShown: false,
  tabBarStyle: { backgroundColor: '#0b1224', borderTopColor: '#1e293b' },
  tabBarActiveTintColor: '#22c55e',
  tabBarInactiveTintColor: '#94a3b8'
};

const AppTabs = () => (
  <Tab.Navigator screenOptions={screenOptions}>
    <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarIcon: () => <Text>🏠</Text> }} />
    <Tab.Screen name="EcoScan" component={EcoScanScreen} options={{ tabBarIcon: () => <Text>🧾</Text> }} />
    <Tab.Screen name="EcoCart" component={EcoCartScreen} options={{ tabBarIcon: () => <Text>🛒</Text> }} />
    <Tab.Screen name="Travel" component={EcoMilesScreen} options={{ tabBarIcon: () => <Text>🚲</Text>, title: 'EcoMiles' }} />
    <Tab.Screen name="Energy" component={EcoWattScreen} options={{ tabBarIcon: () => <Text>⚡️</Text>, title: 'EcoWatt' }} />
    <Tab.Screen name="Food" component={EcoPlateScreen} options={{ tabBarIcon: () => <Text>🥗</Text>, title: 'EcoPlate' }} />
    <Tab.Screen name="Waste" component={EcoCycleScreen} options={{ tabBarIcon: () => <Text>♻️</Text>, title: 'EcoCycle' }} />
    <Tab.Screen name="Community" component={CommunityScreen} options={{ tabBarIcon: () => <Text>🌎</Text> }} />
  </Tab.Navigator>
);

export default function App() {
  const user = useEcoSphereStore(state => state.user);

  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: { ...DefaultTheme.colors, background: '#020617', text: '#e2e8f0' }
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? <Stack.Screen name="Login" component={LoginScreen} /> : <Stack.Screen name="Home" component={AppTabs} />}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
