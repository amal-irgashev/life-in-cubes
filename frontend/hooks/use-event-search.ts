import { useMemo } from 'react'
import { Event } from '@/types/events'
import { SearchFilters } from '@/components/dialogs/advanced-search'
import { subDays, isAfter, isBefore, isWithinInterval } from 'date-fns'

export function useEventSearch(events: Event[], filters: SearchFilters) {
  return useMemo(() => {
    return events.filter(event => {
      // Text search
      if (filters.text) {
        const searchText = filters.text.toLowerCase()
        const matchesText = 
          event.title.toLowerCase().includes(searchText) ||
          event.description.toLowerCase().includes(searchText)
        
        if (!matchesText) return false
      }

      // Category filter
      if (filters.category && filters.category !== 'all') {
        if (event.icon !== filters.category) return false
      }

      // Date range filter
      if (filters.dateRange && filters.dateRange !== 'all') {
        const today = new Date()
        let startDate: Date

        switch (filters.dateRange) {
          case 'past-week':
            startDate = subDays(today, 7)
            break
          case 'past-month':
            startDate = subDays(today, 30)
            break
          case 'past-year':
            startDate = subDays(today, 365)
            break
          case 'custom':
            if (filters.startDate && filters.endDate) {
              return isWithinInterval(new Date(event.date), {
                start: filters.startDate,
                end: filters.endDate
              })
            }
            return true
          default:
            return true
        }

        const eventDate = new Date(event.date)
        if (!isAfter(eventDate, startDate) || !isBefore(eventDate, today)) {
          return false
        }
      }

      return true
    })
  }, [events, filters])
} 