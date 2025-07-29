import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  user: { _id: string; email: string; } | null;
  login: (token: string, user: { _id: string; email: string; }) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      login: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
      isLoggedIn: () => !!get().token,
    }),
    {
      name: 'auth-storage', 
    }
  )
);