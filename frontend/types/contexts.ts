import type { User } from './user'

// Auth Context Types
export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  sessionError: string | null
  signIn: (
    credentials: { 
      username: string | FormDataEntryValue | null
      password: string | FormDataEntryValue | null 
    }, 
    redirectTo?: string
  ) => Promise<void>
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

// Events Context Types
export interface Event {
  id: string
  title: string
  description?: string
  date: string
  type: 'milestone' | 'achievement' | 'goal'
  completed?: boolean
}

export interface EventsContextType {
  events: Event[]
  isLoading: boolean
  error: Error | null
  addEvent: (event: Omit<Event, 'id'>) => Promise<void>
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>
  deleteEvent: (id: string) => Promise<void>
}

// Onboarding Context Types
export interface UserPreferences {
  birthYear: string // ISO string format
  trackingPreference: 'weekly' | 'monthly'
  lifeGoal: string
}

export interface OnboardingContextType {
  showOnboarding: boolean
  userPreferences: UserPreferences | null
  completeOnboarding: () => void
  setUserPreferences: (preferences: UserPreferences) => void
} 