import { create } from 'zustand'

interface User {
  id: string
  firstName?: string
  lastName?: string
  email: string
  birthDate?: string
  avatar?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User) => void
  logout: () => void
  updateUser: (data: Partial<User>) => void
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: (user) => set({ user, isAuthenticated: true, isLoading: false }),
  logout: () => set({ user: null, isAuthenticated: false, isLoading: false }),
  updateUser: (data) => 
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null
    })),
})) 