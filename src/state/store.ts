import { format } from 'date-fns';
import { create } from 'zustand';
import {
  AlertItem,
  CommunityEvent,
  EcoAction,
  EnergyUse,
  FoodOrder,
  LeaderboardEntry,
  ScanAction,
  TravelLog,
  UserProfile,
  WasteAction
} from '@/types';

interface EcoSphereState {
  user: UserProfile | null;
  ecoActions: EcoAction[];
  alerts: AlertItem[];
  leaderboard: LeaderboardEntry[];
  communityEvents: CommunityEvent[];
  login: (email: string, role?: 'user' | 'admin') => void;
  addScanAction: (payload: Omit<ScanAction, 'id' | 'date' | 'impactLevel'>) => void;
  logTravel: (payload: Omit<TravelLog, 'id' | 'date' | 'impactLevel' | 'category'>) => void;
  logEnergyUse: (payload: Omit<EnergyUse, 'id' | 'date' | 'impactLevel' | 'category'>) => void;
  logFoodOrder: (payload: Omit<FoodOrder, 'id' | 'date' | 'impactLevel' | 'category'>) => void;
  logWasteAction: (payload: Omit<WasteAction, 'id' | 'date' | 'impactLevel' | 'category'>) => void;
  computeEcoScore: () => number;
  addAlert: (alert: Omit<AlertItem, 'id'>) => void;
  completeEvent: (eventId: string) => void;
  categoryTotals: () => Record<EcoAction['category'], number>;
}

const randomId = () => Math.random().toString(36).slice(2, 10);

const impactFromKg = (kg: number): EcoAction['impactLevel'] => {
  if (kg < 1) return 'Low';
  if (kg < 3) return 'Medium';
  return 'High';
};

const today = () => format(new Date(), 'yyyy-MM-dd');

const deriveBadges = (actions: EcoAction[], user?: UserProfile) => {
  const badges = new Set(user?.badges ?? []);
  const lowImpact = actions.filter(a => a.impactLevel === 'Low').length;
  const localBuys = actions.filter(a => 'origin' in a && a.origin === 'local').length;
  const composted = actions.filter(a => 'disposal' in a && a.disposal === 'composted').length;
  const carAlternatives = actions.filter(a => 'method' in a && a.method !== 'car').length;
  if (lowImpact >= 8) badges.add('Eco Hero');
  if (localBuys >= 3) badges.add('Local Shopper');
  if (composted >= 3) badges.add('Zero Waste');
  if (carAlternatives >= 5) badges.add('Transit Champ');
  return Array.from(badges);
};

const computeEcoScoreFromActions = (actions: EcoAction[]) => {
  const scoreFromActions = actions.reduce((sum, action) => {
    const multiplier = action.impactLevel === 'Low' ? 35 : action.impactLevel === 'Medium' ? 18 : -25;
    return sum + multiplier;
  }, 620);
  return Math.max(scoreFromActions, 0);
};

const withUpdatedProfile = (state: EcoSphereState, actions: EcoAction[]) => {
  if (!state.user) return null;
  const ecoScore = computeEcoScoreFromActions(actions);
  return {
    ...state.user,
    ecoScore,
    badges: deriveBadges(actions, state.user)
  };
};

const initialLeaderboard: LeaderboardEntry[] = [
  { name: 'Ava Green', ecoScore: 860, city: 'Portland' },
  { name: 'Luis Torres', ecoScore: 820, city: 'Austin' },
  { name: 'Priya Nair', ecoScore: 790, city: 'Bangalore' },
  { name: 'You', ecoScore: 640, city: 'Remote' }
];

const initialEvents: CommunityEvent[] = [
  { id: randomId(), name: 'Downtown Cleanup', location: 'Riverside Park', date: today(), points: 80 },
  { id: randomId(), name: 'Bike-to-Work Week', location: 'Citywide', date: today(), points: 50 },
  { id: randomId(), name: 'Composting 101', location: 'Community Hub', date: today(), points: 40 }
];

export const useEcoSphereStore = create<EcoSphereState>((set, get) => ({
  user: null,
  ecoActions: [
    {
      id: randomId(),
      title: 'Farmers market veggies',
      date: today(),
      category: 'food',
      impactKg: 0.4,
      impactLevel: 'Low',
      packaging: 'paper',
      origin: 'local',
      expiryPredictionDays: 5
    },
    {
      id: randomId(),
      title: 'EV commute',
      date: today(),
      category: 'travel',
      impactKg: 0.8,
      impactLevel: 'Low',
      method: 'ev',
      distanceKm: 12,
      savingsKg: 1.1
    },
    {
      id: randomId(),
      title: 'Air fryer dinner',
      date: today(),
      category: 'energy',
      impactKg: 1.2,
      impactLevel: 'Medium',
      appliance: 'Air Fryer',
      hoursUsed: 0.6,
      suggestion: 'Batch cook to maximize efficiency.'
    },
    {
      id: randomId(),
      title: 'Plastic bottles recycled',
      date: today(),
      category: 'waste',
      impactKg: 0.5,
      impactLevel: 'Low',
      disposal: 'recycled',
      reminder: 'expiry',
      penalty: 0
    }
  ],
  alerts: [
    { id: randomId(), message: 'Oat milk expires in 3 days — finish or freeze.', category: 'EcoCycle', severity: 'Medium' },
    { id: randomId(), message: 'Bus saved 2.4kg CO₂ vs. car this week.', category: 'EcoMiles', severity: 'Low' },
    { id: randomId(), message: 'Try composting veggie scraps to earn a Zero Waste badge.', category: 'EcoCycle', severity: 'Low' }
  ],
  leaderboard: initialLeaderboard,
  communityEvents: initialEvents,
  login: (email, role = 'user') =>
    set({
      user: {
        id: randomId(),
        name: email.split('@')[0] || 'Explorer',
        email,
        role,
        ecoScore: 640,
        badges: ['Local Shopper'],
        streak: 5
      }
    }),
  addScanAction: payload =>
    set(state => {
      const ecoActions = [
        {
          ...payload,
          id: randomId(),
          date: today(),
          category: 'food',
          impactLevel: impactFromKg(payload.impactKg)
        },
        ...state.ecoActions
      ];
      return {
        ecoActions,
        user: withUpdatedProfile(state, ecoActions),
        alerts: [
          {
            id: randomId(),
            message: `Expiry predicted in ${payload.expiryPredictionDays} days for ${payload.title}`,
            category: 'EcoCycle',
            severity: payload.expiryPredictionDays <= 3 ? 'High' : 'Medium'
          },
          ...state.alerts
        ]
      };
    }),
  logTravel: payload =>
    set(state => {
      const ecoActions = [
        {
          ...payload,
          id: randomId(),
          date: today(),
          category: 'travel',
          impactLevel: impactFromKg(payload.impactKg)
        },
        ...state.ecoActions
      ];
      return {
        ecoActions,
        user: withUpdatedProfile(state, ecoActions),
        alerts: [
          { id: randomId(), message: `${payload.method} saved ${payload.savingsKg.toFixed(1)}kg CO₂.`, category: 'EcoMiles', severity: 'Low' },
          ...state.alerts
        ]
      };
    }),
  logEnergyUse: payload =>
    set(state => {
      const ecoActions = [
        {
          ...payload,
          id: randomId(),
          date: today(),
          category: 'energy',
          impactLevel: impactFromKg(payload.impactKg)
        },
        ...state.ecoActions
      ];
      return {
        ecoActions,
        user: withUpdatedProfile(state, ecoActions),
        alerts: [
          { id: randomId(), message: `Reduce ${payload.appliance} runtime to save more energy.`, category: 'EcoWatt', severity: 'Medium' },
          ...state.alerts
        ]
      };
    }),
  logFoodOrder: payload =>
    set(state => {
      const ecoActions = [
        {
          ...payload,
          id: randomId(),
          date: today(),
          category: 'food',
          impactLevel: impactFromKg(payload.impactKg)
        },
        ...state.ecoActions
      ];
      return {
        ecoActions,
        user: withUpdatedProfile(state, ecoActions),
        alerts: [
          { id: randomId(), message: `${payload.title} packaged in ${payload.packagingType}. Consider ${payload.alternative ?? 'reusable containers'}.`, category: 'EcoPlate', severity: 'Medium' },
          ...state.alerts
        ]
      };
    }),
  logWasteAction: payload =>
    set(state => {
      const ecoActions = [
        {
          ...payload,
          id: randomId(),
          date: today(),
          category: 'waste',
          impactLevel: impactFromKg(payload.impactKg)
        },
        ...state.ecoActions
      ];
      return {
        ecoActions,
        user: withUpdatedProfile(state, ecoActions),
        alerts: [
          { id: randomId(), message: `${payload.disposal} logged for ${payload.title}.`, category: 'EcoCycle', severity: payload.disposal === 'landfill' ? 'High' : 'Low' },
          ...state.alerts
        ]
      };
    }),
  computeEcoScore: () => computeEcoScoreFromActions(get().ecoActions),
  addAlert: alert => set(state => ({ alerts: [{ ...alert, id: randomId() }, ...state.alerts] })),
  completeEvent: eventId =>
    set(state => {
      const event = state.communityEvents.find(e => e.id === eventId);
      const currentScore = state.user?.ecoScore ?? 0;
      return {
        communityEvents: state.communityEvents.filter(e => e.id !== eventId),
        user: state.user
          ? { ...state.user, ecoScore: currentScore + (event?.points ?? 0), badges: [...state.user.badges, 'Community Builder'] }
          : null
      };
    }),
  categoryTotals: () => {
    const totals: Record<EcoAction['category'], number> = { food: 0, travel: 0, energy: 0, waste: 0 };
    get().ecoActions.forEach(action => {
      totals[action.category] += action.impactKg;
    });
    return totals;
  }
}));
