import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(async (config: any) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

api.interceptors.response.use(
  (response: any) => response,
  async (error: any) => {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (error.response?.status === 401 && refreshToken && error.config) {
      try {
        const refreshResp = await api.post('/api/auth/refresh/', { refresh: refreshToken });
        const newToken = refreshResp.data.access as string;
        await AsyncStorage.setItem('accessToken', newToken);
        error.config.headers = {
          ...error.config.headers,
          Authorization: `Bearer ${newToken}`,
        };
        return api.request(error.config);
      } catch (refreshError) {
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
      }
    }
    return Promise.reject(error);
  },
);

export interface AuthTokens {
  access: string;
  refresh: string;
}

export const authApi = {
  register: (payload: { email: string; password: string; username?: string; role?: string }) =>
    api.post('/api/auth/register/', payload),
  login: (payload: { email: string; password: string }) => api.post('/api/auth/login/', payload),
  profile: () => api.get('/api/auth/profile/'),
};

export const actionsApi = {
  list: () => api.get('/api/actions/'),
  create: (payload: any) => api.post('/api/actions/', payload),
};

export const remindersApi = {
  list: () => api.get('/api/reminders/'),
};

export const impactApi = {
  summary: () => api.get('/api/impact/'),
};

export const eventsApi = {
  list: () => api.get('/api/events/'),
  create: (payload: any) => api.post('/api/events/', payload),
  join: (id: number | string) => api.post(`/api/events/${id}/join/`),
  complete: (id: number | string) => api.post(`/api/events/${id}/complete/`),
};

export const leaderboardApi = {
  list: () => api.get('/api/leaderboard/'),
};

export const uploadApi = {
  receipt: async (file: { uri: string; name: string; type: string }) => {
    const form = new FormData();
    const fileEntry: any = {
      uri: file.uri,
      name: file.name,
      type: file.type,
    };
    form.append('file', fileEntry);
    const response = await api.post('/api/uploads/receipt/', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
