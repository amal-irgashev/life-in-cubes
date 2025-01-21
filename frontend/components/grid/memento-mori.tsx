'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, X, ChevronDown } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Event } from '@/types/events'
import { calculateWeeks } from '@/lib/utils'
import { WeekDetail } from './week-detail'
import { AddEventDialog } from '@/components/dialogs/add-event-dialog'
import { useEvents } from '@/lib/contexts/events-context'
import { WeekPreview } from './week-preview'

interface MementoMoriProps {
  birthDate: Date
}

export function MementoMori({ birthDate }: MementoMoriProps) {
  const YEARS = 80
  const WEEKS_PER_YEAR = 52
  const YEARS_PER_DECADE = 10
  const DECADES = YEARS / YEARS_PER_DECADE

  const context = useEvents()
  const { events, loading, error } = context.state
  const [selectedWeek, setSelectedWeek] = React.useState<number | null>(null)
  const [hoveredWeek, setHoveredWeek] = React.useState<number | null>(null)
  const [isAddEventOpen, setIsAddEventOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [focusedDecade, setFocusedDecade] = React.useState<number | null>(null)
  const decadeRefs = React.useRef<(HTMLDivElement | null)[]>([])

  const weeksLived = React.useMemo(() => calculateWeeks(birthDate), [birthDate])

  const filteredEvents = React.useMemo(() => {
    if (!searchQuery.trim()) return events
    const query = searchQuery.toLowerCase()
    return events.filter(event => 
      event.title.toLowerCase().includes(query) ||
      event.description?.toLowerCase().includes(query)
    )
  }, [events, searchQuery])

  const handleAddEvent = (event: Event) => {
    context.dispatch({ type: 'ADD_EVENT', payload: event })
    setIsAddEventOpen(false)
  }

  const handleUpdateEvent = (event: Event) => {
    context.dispatch({ type: 'UPDATE_EVENT', payload: event })
  }

  const handleDeleteEvent = (id: string) => {
    context.dispatch({ type: 'DELETE_EVENT', payload: id })
  }

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (focusedDecade !== null && decadeRefs.current[focusedDecade]) {
        if (!decadeRefs.current[focusedDecade]?.contains(event.target as Node)) {
          setFocusedDecade(null)
          setHoveredWeek(null)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [focusedDecade])

  const renderDecade = (decadeIndex: number) => {
    const startWeek = decadeIndex * YEARS_PER_DECADE * WEEKS_PER_YEAR
    const isZoomed = focusedDecade === decadeIndex

    return (
      <div
        key={decadeIndex}
        ref={(el: HTMLDivElement | null) => {
          decadeRefs.current[decadeIndex] = el
        }}
        className={`bg-card rounded-xl shadow-lg p-4 relative overflow-visible
          ${isZoomed ? 'col-span-2 row-span-2 z-10' : 'cursor-pointer'}
          transition-all duration-300 ease-in-out`}
        onClick={() => setFocusedDecade(isZoomed ? null : decadeIndex)}
        style={{
          transform: isZoomed ? 'scale(1.05)' : 'scale(1)',
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-medium">
            Years {decadeIndex * 10 + 1}-{(decadeIndex + 1) * 10}
          </div>
          <div
            style={{
              transform: `rotate(${isZoomed ? 180 : 0}deg)`,
              transition: 'transform 0.3s ease-in-out',
            }}
          >
            <ChevronDown className="h-4 w-4 text-primary" />
          </div>
        </div>
        <div 
          className="grid gap-[2px] bg-muted rounded-lg overflow-visible relative"
          style={{
            gridTemplateColumns: `repeat(${WEEKS_PER_YEAR}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${YEARS_PER_DECADE}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: YEARS_PER_DECADE * WEEKS_PER_YEAR }).map((_, index) => {
            const weekIndex = startWeek + index
            const event = filteredEvents.find(e => e.week_index === weekIndex)
            const isHovered = isZoomed && hoveredWeek === weekIndex

            return (
              <div
                key={weekIndex}
                className={`aspect-square relative
                  ${isZoomed ? 'cursor-pointer' : ''}
                  ${weekIndex < weeksLived ? 'bg-primary shadow-inner' : 'bg-card border border-muted-foreground/20'}
                  transition-all duration-200 ease-in-out
                  before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:rounded-sm`}
                onClick={(e) => {
                  e.stopPropagation()
                  if (isZoomed) {
                    setSelectedWeek(weekIndex)
                  }
                }}
                onMouseEnter={() => isZoomed && setHoveredWeek(weekIndex)}
                onMouseLeave={() => isZoomed && setHoveredWeek(null)}
              >
                {event && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div 
                      className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full opacity-80" 
                      style={{ backgroundColor: event.color || '#CBD5E1' }}
                    />
                  </div>
                )}
                {isHovered && (
                  <>
                    <div
                      className="absolute inset-0 bg-yellow-200 opacity-50 z-10"
                      style={{
                        transition: 'opacity 0.2s ease-in-out',
                      }}
                    />
                    <WeekPreview
                      weekIndex={weekIndex}
                      birthDate={birthDate}
                      event={event}
                    />
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <AnimatePresence mode="wait">
        {selectedWeek === null ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <div className="flex justify-between items-center flex-wrap gap-4 bg-card/50 p-6 rounded-xl backdrop-blur-sm sticky top-4 z-50">
              <h1 className="text-4xl font-serif tracking-widest text-primary">
                LIFE IN CUBES
              </h1>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-8 w-[200px] md:w-[300px]"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setSearchQuery('')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Button onClick={() => setIsAddEventOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: DECADES }).map((_, i) => renderDecade(i))}
            </div>

            <Card className="p-6 bg-card/50 backdrop-blur-sm">
              <div className="max-w-2xl mx-auto text-center text-sm text-muted-foreground font-serif italic">
                {"It is not that we have a short time to live, but that we waste much of it. Life is long enough, and it has been given in sufficiently generous measure to allow the accomplishment of the very greatest things if the whole of it is well invested."}
                <div className="mt-2 text-xs font-semibold tracking-wider">
                  — SENECA
                </div>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <WeekDetail
              weekIndex={selectedWeek}
              birthDate={birthDate}
              onBack={() => setSelectedWeek(null)}
              events={events.filter(e => e.week_index === selectedWeek)}
              onAddEvent={() => setIsAddEventOpen(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AddEventDialog
        open={isAddEventOpen}
        onOpenChange={setIsAddEventOpen}
        onAdd={handleAddEvent}
        selectedWeek={selectedWeek}
        birthDate={birthDate}
      />
    </div>
  )
}

