import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'patient' | 'lab_admin' | 'admin' | 'super_admin' | 'affiliate' | 'marketing_admin' | 'support_admin' | 'viewer_admin';
    avatar?: string;
    isVerified: boolean;
}

interface UserState {
    user: User | null;
    isAuthenticated: boolean;
    login: (userData: User) => void;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
    currency: 'USD' | 'INR';
    setCurrency: (currency: 'USD' | 'INR') => void;
    location: { city: string; state: string; zip: string; country: string };
    setLocation: (loc: { city: string; state: string; zip: string; country: string }) => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null, // Initially logged out
            isAuthenticated: false,
            currency: 'USD',
            location: { city: '', state: '', zip: '', country: '' },
            login: (userData) => set({ user: userData, isAuthenticated: true, currency: 'INR' }), // Mock: switch to INR on login
            logout: () => set({ user: null, isAuthenticated: false, currency: 'USD' }),
            updateUser: (updates) => set((state) => ({
                user: state.user ? { ...state.user, ...updates } : null
            })),
            setCurrency: (currency) => set({ currency }),
            setLocation: (location) => set({ location }),
        }),
        {
            name: 'milabs-user-storage-v1', // changed name to clear old persisted state
            partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated, currency: state.currency }),
        }
    )
);
