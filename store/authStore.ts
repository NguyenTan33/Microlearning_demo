import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_USER } from '../data/mockData';

interface AuthState {
  user: typeof MOCK_USER | null;
  isLoggedIn: boolean;
  isOffline: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  toggleOffline: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoggedIn: false,
  isOffline: false,

  login: async (email: string, password: string) => {
    // Simulate API call
    await new Promise(res => setTimeout(res, 1200));
    if (email && password.length >= 6) {
      set({ user: MOCK_USER, isLoggedIn: true });
      await AsyncStorage.setItem('user', JSON.stringify(MOCK_USER));
      return true;
    }
    return false;
  },

  logout: () => {
    set({ user: null, isLoggedIn: false });
    AsyncStorage.removeItem('user');
  },

  toggleOffline: () => {
    set(s => ({ isOffline: !s.isOffline }));
  },
}));
