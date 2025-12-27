export type Role = 'user' | 'admin';

export type ImpactLevel = 'Low' | 'Medium' | 'High';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  ecoScore: number;
  badges: string[];
  streak: number;
}

export interface EcoActionBase {
  id: string;
  date: string;
  title: string;
  category: 'food' | 'travel' | 'energy' | 'waste';
  impactKg: number;
  impactLevel: ImpactLevel;
}

export interface ScanAction extends EcoActionBase {
  barcode?: string;
  packaging: 'plastic' | 'paper' | 'glass' | 'metal' | 'mixed';
  origin: 'local' | 'imported';
  expiryPredictionDays: number;
  receiptUrl?: string;
}

export interface TravelLog extends EcoActionBase {
  method: 'walking' | 'cycling' | 'bus' | 'metro' | 'car' | 'ev';
  distanceKm: number;
  savingsKg: number;
}

export interface EnergyUse extends EcoActionBase {
  appliance: string;
  hoursUsed: number;
  suggestion: string;
}

export interface FoodOrder extends EcoActionBase {
  packagingType: string;
  deliveryDistanceKm: number;
  alternative?: string;
}

export interface WasteAction extends EcoActionBase {
  disposal: 'recycled' | 'reused' | 'composted' | 'landfill';
  reminder: '7d' | '3d' | 'expiry';
  penalty: number;
}

export interface LeaderboardEntry {
  name: string;
  ecoScore: number;
  city: string;
}

export interface CommunityEvent {
  id: string;
  name: string;
  location: string;
  date: string;
  points: number;
}

export interface AlertItem {
  id: string;
  message: string;
  category: string;
  severity: ImpactLevel;
}

export type EcoAction = ScanAction | TravelLog | EnergyUse | FoodOrder | WasteAction;
