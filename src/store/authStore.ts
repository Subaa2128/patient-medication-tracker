import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  userType:string
  setUserType: (status: string) => void; 
  setIsLoggedIn: (status: boolean) => void; 
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  userType:'',
  setUserType: (status) => set({ userType: status }),
  setIsLoggedIn: (status) => set({ isLoggedIn: status }),
}));
