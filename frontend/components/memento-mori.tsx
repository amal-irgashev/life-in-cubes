'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, X, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { calculateWeeks } from '@/lib/utils'
import { WeekDetail } from './week-detail'
import { AddEventDialog } from './add-event-dialog'
import { DecadeGrid } from './decade-grid'
import { useEvents } from '@/hooks/use-events-context'
import { Event } from '@/types/events'

interface MementoMoriProps {
  birthDate: Date
}

export default function MementoMori({ birthDate }: MementoMoriProps) {
  const YEARS = 80
  const DECADES = YEARS / 10
  const router = useRouter()

  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null)
  const [isAddingEvent, setIsAddingEvent] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [focusedDecade, setFocusedDecade] = useState<number | null>(null)
  
  const { state: { events }, dispatch } = useEvents()
  const weeksLived = calculateWeeks(birthDate, new Date())

  const handleWeekClick = (weekIndex: number) => {
    setSelectedWeek(weekIndex)
  }

  const handleBackToGrid = () => {
    setSelectedWeek(null)
  }

  const handleDecadeClick = (decade: number) => {
    setFocusedDecade(focusedDecade === decade ? null : decade)
    setHoveredWeek(null)
  }

  const handleAddEvent = (event: Event) => {
    dispatch({ type: 'ADD_EVENT', payload: event })
    setIsAddingEvent(false)
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-4">
      <AnimatePresence mode="wait">
        {selectedWeek === null ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4 sm:space-y-8"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card/50 p-3 sm:p-6 rounded-xl backdrop-blur-sm sticky top-2 sm:top-4 z-50">
              <h1 className="text-2xl sm:text-4xl font-serif tracking-widest text-primary">
                LIFE IN CUBES
              </h1>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                <div className="relative flex-grow sm:flex-grow-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-8 w-full sm:w-[300px]"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setSearchQuery('')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button onClick={() => setIsAddingEvent(true)} className="flex-1 sm:flex-initial">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Event
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              {Array.from({ length: DECADES }).map((_, i) => (
                <DecadeGrid
                  key={i}
                  decadeIndex={i}
                  weeksLived={weeksLived}
                  isZoomed={focusedDecade === i}
                  onDecadeClick={handleDecadeClick}
                  onWeekClick={handleWeekClick}
                  hoveredWeek={hoveredWeek}
                  onWeekHover={setHoveredWeek}
                  birthDate={birthDate}
                  searchQuery={searchQuery}
                />
              ))}
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
              onBack={handleBackToGrid}
              events={events.filter(e => e.weekIndex === selectedWeek)}
              onAddEvent={() => setIsAddingEvent(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AddEventDialog
        isOpen={isAddingEvent}
        onClose={() => setIsAddingEvent(false)}
        onAdd={handleAddEvent}
        selectedWeek={selectedWeek}
        birthDate={birthDate}
      />
    </div>
  )
}

