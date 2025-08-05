import { create } from "zustand";

interface AuthState {
    isAuthenticated: boolean;
    biometricType: string;

    setIsAuthenticated: (value: boolean) => void;
    setBiometricType: (value: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    biometricType: "",

    setIsAuthenticated: (value) => set({ isAuthenticated: value }),
    setBiometricType: (value) => set({ biometricType: value }),
}));
