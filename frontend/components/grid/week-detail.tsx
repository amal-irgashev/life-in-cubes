'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Plus, ChevronDown, Briefcase, Heart, Book, Plane, Pencil, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Event } from '@/types/events'
import { format, addWeeks, addDays, startOfWeek } from 'date-fns'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { AddEventDialog } from '../dialogs/add-event-dialog'
import { useEvents } from '@/lib/contexts/events-context'

interface WeekDetailProps {
  weekIndex: number
  birthDate: Date
  onBack: () => void
  events: Event[]
  onAddEvent: () => void
}

const CategoryIcons = {
  personal: Heart,
  career: Briefcase,
  growth: Book,
  experiences: Plane
}

const CategoryNames = {
  personal: 'Personal & Relationships',
  career: 'Career & Education',
  growth: 'Personal Growth',
  experiences: 'Experiences & Travel'
}

export function WeekDetail({ weekIndex, birthDate, onBack, events, onAddEvent }: WeekDetailProps) {
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set())
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { dispatch } = useEvents()
  const weekNumber = (weekIndex % 52) + 1
  const year = Math.floor(weekIndex / 52)
  const age = year

  const weekStartDate = addWeeks(birthDate, weekIndex)
  const weekEndDate = addWeeks(weekStartDate, 1)

  const dateRange = `${format(weekStartDate, 'MMM d, yyyy')} - ${format(weekEndDate, 'MMM d, yyyy')}`

  const toggleEvent = (eventId: string) => {
    const newExpanded = new Set(expandedEvents)
    if (expandedEvents.has(eventId)) {
      newExpanded.delete(eventId)
    } else {
      newExpanded.add(eventId)
    }
    setExpandedEvents(newExpanded)
  }

  const handleEditEvent = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent event expansion when clicking edit
    setEditingEvent(event)
    setIsEditDialogOpen(true)
  }

  const handleDeleteEvent = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent event expansion when clicking delete
    if (window.confirm('Are you sure you want to delete this event?')) {
      dispatch({ type: 'DELETE_EVENT', payload: eventId })
    }
  }

  const handleAddEvent = (newEvent: Event) => {
    dispatch({ type: 'ADD_EVENT', payload: newEvent })
    setIsAddDialogOpen(false)
  }

  const handleUpdateEvent = (updatedEvent: Event) => {
    dispatch({ type: 'UPDATE_EVENT', payload: updatedEvent })
    setIsEditDialogOpen(false)
    setEditingEvent(null)
  }

  // Helper function to get the formatted date for an event
  const getEventDate = (weekIndex: number, dayOfWeek: number = 0) => {
    try {
      const weekStart = startOfWeek(addWeeks(new Date(birthDate), weekIndex))
      const eventDate = addDays(weekStart, dayOfWeek)
      
      // Validate the date before formatting
      if (isNaN(eventDate.getTime())) {
        throw new Error('Invalid date')
      }
      
      return format(eventDate, 'EEEE, MMM d')
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'Date not available'
    }
  }

  return (
    <Card className="bg-background p-4 sm:p-8 md:p-12 space-y-8 max-w-2xl mx-auto">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between -mt-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onBack}
            className="hover:bg-muted -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6 -mt-2">
          <div className="flex items-baseline justify-center gap-3 text-center">
            <h2 className="text-5xl font-serif tracking-tight text-foreground">
              {weekNumber}
            </h2>
            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
              Week
            </div>
          </div>

          <div className="flex justify-center items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary/50" />
              <span className="text-muted-foreground">Year {year + 1}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary/50" />
              <span className="text-muted-foreground">Age {age}</span>
            </div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/5 text-sm text-primary">
              {format(weekStartDate, 'MMM d')} — {format(weekEndDate, 'MMM d, yyyy')}
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h3 className="text-xl font-medium text-foreground">Events</h3>
            <p className="text-sm text-muted-foreground">
              {events.length} {events.length === 1 ? 'event' : 'events'} this week
            </p>
          </div>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>

        {events.length > 0 ? (
          <div className="space-y-3">
            {events.map((event) => {
              const isExpanded = expandedEvents.has(event.id)
              const IconComponent = CategoryIcons[event.icon as keyof typeof CategoryIcons] || Heart
              const categoryName = CategoryNames[event.icon as keyof typeof CategoryNames] || 'Uncategorized'
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "group rounded-lg border transition-colors",
                    isExpanded ? "bg-primary/5 border-primary" : "hover:bg-muted/50 border-border"
                  )}
                >
                  <div
                    className="flex items-center p-4 cursor-pointer"
                    onClick={() => toggleEvent(event.id)}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="p-2 rounded-md bg-muted">
                        <IconComponent className="h-5 w-5" style={{ color: event.color || '#CBD5E1' }} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium flex items-center gap-2 mb-0.5 text-foreground">
                          {event.title}
                          <span className="text-xs text-muted-foreground">
                            {categoryName}
                          </span>
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {getEventDate(event.week_index, event.day_of_week)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => handleEditEvent(event, e)}
                      >
                        <Pencil className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                        onClick={(e) => handleDeleteEvent(event.id, e)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <ChevronDown 
                        className={cn(
                          "h-4 w-4 text-muted-foreground transition-transform",
                          isExpanded && "rotate-180"
                        )} 
                      />
                    </div>
                  </div>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4"
                    >
                      <div className="pl-12">
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {event.description}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 px-4">
            <div className="max-w-sm mx-auto space-y-4">
              <p className="text-muted-foreground">No events recorded for this week.</p>
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add your first event
              </Button>
            </div>
          </div>
        )}
      </div>

      <AddEventDialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open)
          if (!open) setEditingEvent(null)
        }}
        onAdd={handleUpdateEvent}
        selectedWeek={weekIndex}
        birthDate={birthDate}
        editingEvent={editingEvent}
      />

      <AddEventDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddEvent}
        selectedWeek={weekIndex}
        birthDate={birthDate}
      />
    </Card>
  )
}

