import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { create } from 'zustand';

import { actionsApi, authApi, eventsApi, impactApi, leaderboardApi } from '@/api/client';
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
  WasteAction,
} from '@/types';

type Role = 'user' | 'admin';

interface EcoSphereState {
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  ecoActions: EcoAction[];
  alerts: AlertItem[];
  leaderboard: LeaderboardEntry[];
  communityEvents: CommunityEvent[];
  loading: boolean;
  login: (email: string, password: string, role?: Role) => Promise<void>;
  register: (email: string, password: string, role?: Role) => Promise<void>;
  logout: () => Promise<void>;
  hydrateFromApi: () => Promise<void>;
  addScanAction: (payload: Omit<ScanAction, 'id' | 'date' | 'impactLevel' | 'category'>) => Promise<void>;
  logTravel: (payload: Omit<TravelLog, 'id' | 'date' | 'impactLevel' | 'category'>) => Promise<void>;
  logEnergyUse: (payload: Omit<EnergyUse, 'id' | 'date' | 'impactLevel' | 'category'>) => Promise<void>;
  logFoodOrder: (payload: Omit<FoodOrder, 'id' | 'date' | 'impactLevel' | 'category'>) => Promise<void>;
  logWasteAction: (payload: Omit<WasteAction, 'id' | 'date' | 'impactLevel' | 'category'>) => Promise<void>;
  computeEcoScore: () => number;
  addAlert: (alert: Omit<AlertItem, 'id'>) => void;
  completeEvent: (eventId: string) => Promise<void>;
  categoryTotals: () => Record<EcoAction['category'], number>;
}

const randomId = () => Math.random().toString(36).slice(2, 10);
const today = () => format(new Date(), 'yyyy-MM-dd');

const impactFromKg = (kg: number): EcoAction['impactLevel'] => {
  if (kg < 1) return 'Low';
  if (kg < 3) return 'Medium';
  return 'High';
};

const mapProfile = (profile: any): UserProfile => ({
  id: String(profile.id),
  name: profile.username || profile.email,
  email: profile.email,
  role: profile.role,
  ecoScore: profile.eco_score ?? 0,
  badges: profile.badges || [],
  streak: profile.streak_days ?? profile.profile_meta?.streak ?? 0,
});

const mapAction = (apiAction: any): EcoAction => ({
  id: String(apiAction.id ?? randomId()),
  title: apiAction.action_type || apiAction.title || 'Eco action',
  date: apiAction.created_at?.slice(0, 10) || today(),
  category: apiAction.category,
  impactKg: apiAction.carbon_kg ?? apiAction.impactKg ?? 0,
  impactLevel: impactFromKg(apiAction.carbon_kg ?? apiAction.impactKg ?? 0),
  packaging: apiAction.packaging_type,
  origin: apiAction.origin,
  expiryPredictionDays: apiAction.data?.expiry_prediction ?? apiAction.expiryPredictionDays,
  receiptUrl: apiAction.receipt_url ?? apiAction.receiptUrl,
  method: apiAction.data?.method ?? apiAction.method,
  distanceKm: apiAction.distance_km ?? apiAction.distanceKm,
  savingsKg: apiAction.estimated_savings_kg ?? apiAction.savingsKg,
  startLat: apiAction.data?.startLat ?? apiAction.data?.start_lat,
  startLng: apiAction.data?.startLng ?? apiAction.data?.start_lng,
  endLat: apiAction.data?.endLat ?? apiAction.data?.end_lat,
  endLng: apiAction.data?.endLng ?? apiAction.data?.end_lng,
  appliance: apiAction.data?.appliance ?? apiAction.appliance,
  hoursUsed: apiAction.data?.hours_used ?? apiAction.hoursUsed,
  suggestion: apiAction.data?.suggestion ?? apiAction.suggestion,
  billUrl: apiAction.data?.bill_url ?? apiAction.billUrl,
  packagingType: apiAction.data?.packagingType ?? apiAction.packagingType,
  deliveryDistanceKm: apiAction.data?.deliveryDistanceKm ?? apiAction.delivery_distance_km,
  alternative: apiAction.data?.alternative ?? apiAction.alternative,
  disposal: apiAction.disposal_method ?? apiAction.disposal,
  reminder: apiAction.data?.reminder ?? apiAction.reminder,
  penalty: apiAction.data?.penalty ?? apiAction.penalty,
});

const deriveBadges = (actions: EcoAction[], user?: UserProfile) => {
  const badges = new Set(user?.badges ?? []);
  const lowImpact = actions.filter(a => a.impactLevel === 'Low').length;
  const localBuys = actions.filter(a => a.origin === 'local').length;
  const composted = actions.filter(a => a.disposal === 'composted').length;
  const carAlternatives = actions.filter(a => a.method && a.method !== 'car').length;
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

const initialLeaderboard: LeaderboardEntry[] = [
  { name: 'Ava Green', ecoScore: 860, city: 'Portland' },
  { name: 'Luis Torres', ecoScore: 820, city: 'Austin' },
  { name: 'Priya Nair', ecoScore: 790, city: 'Bangalore' },
  { name: 'You', ecoScore: 640, city: 'Remote' },
];

const initialEvents: CommunityEvent[] = [
  { id: randomId(), name: 'Downtown Cleanup', location: 'Riverside Park', date: today(), points: 80 },
  { id: randomId(), name: 'Bike-to-Work Week', location: 'Citywide', date: today(), points: 50 },
  { id: randomId(), name: 'Composting 101', location: 'Community Hub', date: today(), points: 40 },
];

const addAlertFromReminder = (alert: AlertItem) => ({ ...alert, id: randomId() });

export const useEcoSphereStore = create<EcoSphereState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  ecoActions: [],
  alerts: [],
  leaderboard: initialLeaderboard,
  communityEvents: initialEvents,
  login: async (email: string, password: string, role: Role = 'user') => {
    set({ loading: true });
    try {
      const { data: tokens } = await authApi.login({ email, password });
      await AsyncStorage.multiSet([
        ['accessToken', tokens.access],
        ['refreshToken', tokens.refresh],
        ['userEmail', email],
      ]);
      set({ accessToken: tokens.access, refreshToken: tokens.refresh });
      await get().hydrateFromApi();
      // ensure role persists locally for navigation gating when API profile is light
      set(state => ({ user: state.user ? { ...state.user, role } : state.user }));
    } finally {
      set({ loading: false });
    }
  },
  register: async (email: string, password: string, role: Role = 'user') => {
    set({ loading: true });
    try {
      await authApi.register({ email, password, role, username: email });
      await get().login(email, password, role);
    } finally {
      set({ loading: false });
    }
  },
  logout: async () => {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userEmail']);
    set({ user: null, accessToken: null, refreshToken: null, ecoActions: [], alerts: [] });
  },
  hydrateFromApi: async () => {
    const token = get().accessToken || (await AsyncStorage.getItem('accessToken'));
    if (!token) {
      return;
    }
    set({ loading: true });
    try {
      const [profile, actions, impact, events, leaders] = await Promise.all([
        authApi.profile(),
        actionsApi.list(),
        impactApi.summary(),
        eventsApi.list(),
        leaderboardApi.list(),
      ]);
      const ecoActions = (actions.data || []).map(mapAction);
      const reminders = (impact.data?.reminders || []).map((rem: any) =>
        addAlertFromReminder({
          message: rem.message,
          category: rem.severity ?? 'medium',
          severity: (rem.severity || 'low').charAt(0).toUpperCase() + (rem.severity || 'low').slice(1) as any,
        }),
      );
      const badges = impact.data?.badges || profile.data.badges || [];
      set({
        user: { ...mapProfile(profile.data), badges },
        ecoActions,
        alerts: reminders,
        leaderboard: leaders.data?.leaders?.map((leader: any) => ({
          name: leader.username ?? leader.email ?? leader.id,
          ecoScore: leader.eco_score ?? 0,
          city: leader.profile_meta?.city ?? 'Community',
        })) ?? initialLeaderboard,
        communityEvents:
          events.data?.map((event: any) => ({
            id: String(event.id),
            name: event.name,
            location: event.location,
            date: event.starts_at ?? today(),
            points: event.points,
          })) ?? initialEvents,
      });
    } finally {
      set({ loading: false });
    }
  },
  addScanAction: async payload => {
    const body = {
      category: 'food',
      action_type: payload.title,
      carbon_kg: payload.impactKg,
      packaging_type: payload.packaging,
      origin: payload.origin,
      expiry_date: payload.expiryPredictionDays
        ? format(new Date(Date.now() + payload.expiryPredictionDays * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
        : null,
      receipt_url: payload.receiptUrl,
      data: { barcode: payload.barcode, expiry_prediction: payload.expiryPredictionDays },
      severity: impactFromKg(payload.impactKg).toLowerCase(),
    };
    try {
      const { data } = await actionsApi.create(body);
      const action = mapAction(data);
      set(state => ({ ecoActions: [action, ...state.ecoActions], user: withUpdatedProfile(state, [action, ...state.ecoActions]) }));
      set(state => ({
        alerts: [
          addAlertFromReminder({
            message: `Expiry predicted in ${payload.expiryPredictionDays ?? 0} days for ${payload.title}`,
            category: 'EcoCycle',
            severity: impactFromKg(payload.impactKg),
          }),
          ...state.alerts,
        ],
      }));
    } catch {
      addActionOffline(payload.title, 'food', payload.impactKg, set, get(), payload);
    }
  },
  logTravel: async payload => {
    const body = {
      category: 'travel',
      action_type: payload.title,
      carbon_kg: payload.impactKg,
      estimated_savings_kg: payload.savingsKg,
      data: {
        method: payload.method,
        distance_km: payload.distanceKm,
        start_lat: payload.startLat,
        start_lng: payload.startLng,
        end_lat: payload.endLat,
        end_lng: payload.endLng,
      },
      distance_km: payload.distanceKm,
      severity: impactFromKg(payload.impactKg).toLowerCase(),
    };
    try {
      const { data } = await actionsApi.create(body);
      const action = mapAction(data);
      set(state => ({ ecoActions: [action, ...state.ecoActions], user: withUpdatedProfile(state, [action, ...state.ecoActions]) }));
      set(state => ({
        alerts: [
          addAlertFromReminder({
            message: `${payload.method} saved ${(payload.savingsKg ?? 0).toFixed(1)}kg CO₂.`,
            category: 'EcoMiles',
            severity: 'Low',
          }),
          ...state.alerts,
        ],
      }));
    } catch {
      addActionOffline(payload.title, 'travel', payload.impactKg, set, get(), payload);
    }
  },
  logEnergyUse: async payload => {
    const body = {
      category: 'energy',
      action_type: payload.title,
      carbon_kg: payload.impactKg,
      data: {
        appliance: payload.appliance,
        hours_used: payload.hoursUsed,
        suggestion: payload.suggestion,
        bill_url: payload.billUrl,
      },
      receipt_url: payload.billUrl,
      severity: impactFromKg(payload.impactKg).toLowerCase(),
    };
    try {
      const { data } = await actionsApi.create(body);
      const action = mapAction(data);
      set(state => ({ ecoActions: [action, ...state.ecoActions], user: withUpdatedProfile(state, [action, ...state.ecoActions]) }));
      set(state => ({
        alerts: [
          addAlertFromReminder({
            message: `Reduce ${payload.appliance} runtime to save more energy.`,
            category: 'EcoWatt',
            severity: 'Medium',
          }),
          ...state.alerts,
        ],
      }));
    } catch {
      addActionOffline(payload.title, 'energy', payload.impactKg, set, get(), payload);
    }
  },
  logFoodOrder: async payload => {
    const body = {
      category: 'food',
      action_type: payload.title,
      carbon_kg: payload.impactKg,
      data: {
        packagingType: payload.packagingType,
        deliveryDistanceKm: payload.deliveryDistanceKm,
        alternative: payload.alternative,
      },
      severity: impactFromKg(payload.impactKg).toLowerCase(),
      packaging_type: payload.packagingType,
    };
    try {
      const { data } = await actionsApi.create(body);
      const action = mapAction(data);
      set(state => ({ ecoActions: [action, ...state.ecoActions], user: withUpdatedProfile(state, [action, ...state.ecoActions]) }));
      set(state => ({
        alerts: [
          addAlertFromReminder({
            message: `${payload.title} packaged in ${payload.packagingType}. Consider ${payload.alternative ?? 'reusable containers'}.`,
            category: 'EcoPlate',
            severity: 'Medium',
          }),
          ...state.alerts,
        ],
      }));
    } catch {
      addActionOffline(payload.title, 'food', payload.impactKg, set, get(), payload);
    }
  },
  logWasteAction: async payload => {
    const body = {
      category: 'waste',
      action_type: payload.title,
      carbon_kg: payload.impactKg,
      disposal_method: payload.disposal,
      data: { reminder: payload.reminder, penalty: payload.penalty },
      severity: impactFromKg(payload.impactKg).toLowerCase(),
    };
    try {
      const { data } = await actionsApi.create(body);
      const action = mapAction(data);
      set(state => ({ ecoActions: [action, ...state.ecoActions], user: withUpdatedProfile(state, [action, ...state.ecoActions]) }));
      set(state => ({
        alerts: [
          addAlertFromReminder({
            message: `${payload.disposal} logged for ${payload.title}.`,
            category: 'EcoCycle',
            severity: payload.disposal === 'landfill' ? 'High' : 'Low',
          }),
          ...state.alerts,
        ],
      }));
    } catch {
      addActionOffline(payload.title, 'waste', payload.impactKg, set, get(), payload);
    }
  },
  computeEcoScore: () => computeEcoScoreFromActions(get().ecoActions),
  addAlert: alert => set(state => ({ alerts: [addAlertFromReminder(alert as AlertItem), ...state.alerts] })),
  completeEvent: async eventId => {
    try {
      await eventsApi.complete(eventId);
    } catch (err) {
      // best-effort offline fallback
    }
    set(state => {
      const event = state.communityEvents.find(e => e.id === eventId);
      const currentScore = state.user?.ecoScore ?? 0;
      return {
        communityEvents: state.communityEvents.filter(e => e.id !== eventId),
        user: state.user
          ? { ...state.user, ecoScore: currentScore + (event?.points ?? 0), badges: [...state.user.badges, 'Community Builder'] }
          : null,
      };
    });
  },
  categoryTotals: () => {
    const totals: Record<EcoAction['category'], number> = { food: 0, travel: 0, energy: 0, waste: 0 };
    get().ecoActions.forEach(action => {
      totals[action.category] += action.impactKg;
    });
    return totals;
  },
}));

const withUpdatedProfile = (state: EcoSphereState, actions: EcoAction[]) => {
  if (!state.user) return null;
  const ecoScore = computeEcoScoreFromActions(actions);
  return {
    ...state.user,
    ecoScore,
    badges: deriveBadges(actions, state.user),
  };
};

const addActionOffline = (
  title: string,
  category: EcoAction['category'],
  impactKg: number,
  set: (fn: any) => void,
  state: EcoSphereState,
  extra?: Partial<EcoAction>,
) => {
  const action: EcoAction = {
    id: randomId(),
    title,
    date: today(),
    category,
    impactKg,
    impactLevel: impactFromKg(impactKg),
    ...extra,
  } as EcoAction;
  const ecoActions = [action, ...state.ecoActions];
  set({ ecoActions, user: withUpdatedProfile(state, ecoActions) });
};
