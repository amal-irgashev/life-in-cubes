export interface Tag {
  id: number;
  name: string;
  created_at: string;
}

export interface Event {
  id: string;
  user?: number;
  week_index: number;
  day_of_week: number;
  title: string;
  description: string;
  icon: string;
  color: string | null;
  tags: Tag[];
  created_at?: string;
  updated_at?: string;
}

export interface EventsState {
  events: Event[];
  loading: boolean;
  error: string | null;
}

export type EventAction = 
  | { type: 'ADD_EVENT'; payload: Event }
  | { type: 'UPDATE_EVENT'; payload: Event }
  | { type: 'DELETE_EVENT'; payload: string }
  | { type: 'SET_EVENTS'; payload: Event[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'CLEAR_EVENTS' }

export interface EventsContextType {
  state: EventsState
  dispatch: (action: EventAction) => void
  loadEvents: () => Promise<void>
}

