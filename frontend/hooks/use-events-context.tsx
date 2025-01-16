'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { Event, EventsState, EventAction } from '@/types/events'

const initialState: EventsState = {
  events: [],
  loading: false,
  error: null,
}

function eventsReducer(state: EventsState, action: EventAction): EventsState {
  switch (action.type) {
    case 'ADD_EVENT':
      return {
        ...state,
        events: [...state.events, action.payload],
      }
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map(event => 
          event.id === action.payload.id ? action.payload : event
        ),
      }
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter(event => event.id !== action.payload),
      }
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

const EventsContext = createContext<{
  state: EventsState
  dispatch: React.Dispatch<EventAction>
} | null>(null)

export function EventsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(eventsReducer, initialState)

  // Load events from localStorage on mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('life-in-cubes-events')
    if (savedEvents) {
      const events = JSON.parse(savedEvents)
      events.forEach((event: Event) => {
        dispatch({ type: 'ADD_EVENT', payload: event })
      })
    }
  }, [])

  // Save events to localStorage when they change
  useEffect(() => {
    localStorage.setItem('life-in-cubes-events', JSON.stringify(state.events))
  }, [state.events])

  return (
    <EventsContext.Provider value={{ state, dispatch }}>
      {children}
    </EventsContext.Provider>
  )
}

export function useEvents() {
  const context = useContext(EventsContext)
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider')
  }
  return context
} 