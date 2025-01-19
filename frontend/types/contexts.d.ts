declare module '@/lib/contexts/auth-context' {
  export interface User {
    id: string
    username: string
    email: string
    first_name?: string
    last_name?: string
    profile?: {
      avatar?: string
      birth_date?: string
    }
  }

  export interface AuthContextType {
    user: User | null
    isLoading: boolean
    signIn: (username: string, password: string) => Promise<void>
    signOut: () => Promise<void>
    register: (userData: {
      username: string
      password: string
      email: string
      first_name?: string
      last_name?: string
      birth_date?: string
    }) => Promise<void>
  }

  export const AuthProvider: React.FC<{ children: React.ReactNode }>
  export const useAuth: () => AuthContextType
}

declare module '@/lib/contexts/events-context' {
  export interface Event {
    id: string
    title: string
    description?: string
    week_index: number
    day_of_week: number
    color?: string
    icon?: string
    created_at: string
    updated_at: string
  }

  export interface EventsContextType {
    events: Event[]
    isLoading: boolean
    addEvent: (event: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
    updateEvent: (id: string, event: Partial<Event>) => Promise<void>
    deleteEvent: (id: string) => Promise<void>
  }

  export const EventsProvider: React.FC<{ children: React.ReactNode }>
  export const useEvents: () => EventsContextType
}

declare module '@/lib/contexts/onboarding-context' {
  export interface UserPreferences {
    birthYear: string
    trackingPreference: 'weekly' | 'monthly'
    lifeGoal?: string
  }

  export interface OnboardingContextType {
    showOnboarding: boolean
    userPreferences: UserPreferences | null
    isLoading: boolean
    completeOnboarding: () => void
    setUserPreferences: (preferences: UserPreferences) => void
  }

  export const OnboardingProvider: React.FC<{ children: React.ReactNode }>
  export const useOnboarding: () => OnboardingContextType
} 