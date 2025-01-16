export interface Event {
  id: string
  weekIndex: number
  dayOfWeek: number
  title: string
  description: string
  icon: string
  color?: string
  tags?: string[]
}

export interface EventsState {
  events: Event[]
  loading: boolean
  error: string | null
}

export type EventAction = 
  | { type: 'ADD_EVENT'; payload: Event }
  | { type: 'UPDATE_EVENT'; payload: Event }
  | { type: 'DELETE_EVENT'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }

