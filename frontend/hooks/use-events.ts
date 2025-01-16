import { useState } from 'react'
import { Event } from '@/types/events'

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([])

  const addEvent = (event: Event) => {
    setEvents((prev) => {
      // Remove any existing event for this week
      const filtered = prev.filter(e => e.weekIndex !== event.weekIndex)
      return [...filtered, event]
    })
  }

  return { events, addEvent }
}

