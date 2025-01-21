'use client'

import React, { useState } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn, generateId } from '@/lib/utils'
import { format, addDays, startOfWeek, addWeeks } from 'date-fns'
import { Briefcase, Heart, Book, Plane, X } from 'lucide-react'
import { Event } from '@/types/events'
import { eventService } from '@/lib/services/event-service'
import { toast } from 'sonner'
import { authService } from '@/lib/services/auth-service'
import Cookies from 'js-cookie'
import { useEvents } from '@/lib/contexts/events-context'

interface AddEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (event: Event) => void
  selectedWeek: number | null
  birthDate: Date
  editingEvent?: Event | null
}

const EVENT_CATEGORIES = [
  { 
    id: 'personal',
    name: 'Personal & Relationships',
    description: 'Family, friends, relationships, and personal milestones',
    icon: Heart,
    color: '#EC4899'
  },
  { 
    id: 'career',
    name: 'Career & Education',
    description: 'Work, studies, and professional achievements',
    icon: Briefcase,
    color: '#3B82F6'
  },
  { 
    id: 'growth',
    name: 'Personal Growth',
    description: 'Learning, hobbies, and self-improvement',
    icon: Book,
    color: '#10B981'
  },
  { 
    id: 'experiences',
    name: 'Experiences & Travel',
    description: 'Travel, adventures, and memorable experiences',
    icon: Plane,
    color: '#F59E0B'
  }
]

export function AddEventDialog({ open, onOpenChange, onAdd, selectedWeek, birthDate, editingEvent }: AddEventDialogProps) {
  const { dispatch, loadEvents } = useEvents()
  const [title, setTitle] = useState(editingEvent?.title || '')
  const [description, setDescription] = useState(editingEvent?.description || '')
  const [selectedCategory, setSelectedCategory] = useState<string>(editingEvent?.icon || EVENT_CATEGORIES[0].id)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<number | undefined>(undefined)

  // Reset form when dialog opens/closes or editing event changes
  React.useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title)
      setDescription(editingEvent.description || '')
      setSelectedCategory(editingEvent.icon)
    } else {
      setTitle('')
      setDescription('')
      setSelectedCategory(EVENT_CATEGORIES[0].id)
    }
    setSelectedDate(undefined)
    setSelectedDayOfWeek(undefined)
  }, [editingEvent, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    try {
      // Ensure we have a CSRF token
      if (!Cookies.get('csrftoken')) {
        await authService.getCsrfToken()
      }

      let eventDate: Date
      let dayOfWeek: number = 0 // Default to Sunday

      if (selectedWeek !== null && selectedDayOfWeek !== undefined) {
        dayOfWeek = selectedDayOfWeek
        const weekStart = startOfWeek(addWeeks(birthDate, selectedWeek))
        eventDate = addDays(weekStart, dayOfWeek)
      } else if (selectedDate) {
        eventDate = selectedDate
        dayOfWeek = eventDate.getDay()
      } else {
        eventDate = new Date()
        dayOfWeek = eventDate.getDay()
      }

      const weekIndex = Math.floor((eventDate.getTime() - birthDate.getTime()) / (7 * 24 * 60 * 60 * 1000))
      const category = EVENT_CATEGORIES.find(cat => cat.id === selectedCategory)!

      const eventData = {
        week_index: weekIndex,
        day_of_week: dayOfWeek,
        title,
        description,
        icon: category.id,
        color: category.color,
        tags: [] // Tags will be handled by the backend
      }

      let savedEvent: Event
      if (editingEvent) {
        savedEvent = await eventService.updateEvent(editingEvent.id, eventData)
      } else {
        savedEvent = await eventService.createEvent(eventData)
      }

      // Always reload events to ensure consistency
      await loadEvents()
      
      // Call onAdd after state is updated
      onAdd(savedEvent)
      toast.success(editingEvent ? 'Event updated successfully' : 'Event added successfully')
      onOpenChange(false)

    } catch (error) {
      console.error('Error saving event:', error)
      toast.error('Failed to save event. Please try again.')
    }

    setTitle('')
    setDescription('')
    setSelectedCategory(EVENT_CATEGORIES[0].id)
    setSelectedDate(undefined)
    setSelectedDayOfWeek(undefined)
  }

  const renderDateSelector = () => (
    <div className="space-y-2">
      <Label>Select Date</Label>
      <Input
        type="date"
        value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ''}
        onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : undefined)}
        className="w-full"
      />
    </div>
  )

  const renderWeekDaySelector = () => {
    const weekStart = addWeeks(birthDate, selectedWeek || 0)
    return (
      <div className="space-y-2">
        <Label>Select Day of the Week</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Array.from({ length: 7 }).map((_, index) => {
            const date = addDays(weekStart, index)
            const isSelected = selectedDayOfWeek === index
            return (
              <div
                key={index}
                onClick={() => setSelectedDayOfWeek(index)}
                className={cn(
                  "flex flex-col items-start rounded-lg border p-3 cursor-pointer transition-all duration-200",
                  isSelected 
                    ? "border-primary bg-primary/5 shadow-sm" 
                    : "hover:border-primary/50 hover:bg-muted"
                )}
              >
                <span className="text-xs font-medium text-muted-foreground">
                  {format(date, "EEEE")}
                </span>
                <span className="text-sm font-semibold mt-1">
                  {format(date, "MMM d")}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50 z-[100] transition-all duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-[101] w-[calc(100%-2rem)] max-h-[calc(100vh-2rem)] overflow-y-auto md:w-full max-w-[425px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-background p-4 sm:p-6 shadow-lg transition-all duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <DialogPrimitive.Title className="text-lg font-semibold">
            {editingEvent ? 'Edit Event' : 'Add Event'}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="text-sm text-muted-foreground mt-1.5">
            {editingEvent 
              ? 'Edit your life event details below.'
              : 'Add a new event to your life calendar. Choose a category and provide details.'
            }
          </DialogPrimitive.Description>
          
          <form onSubmit={handleSubmit} className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label>Category</Label>
              <RadioGroup 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
                className="grid gap-2"
              >
                {EVENT_CATEGORIES.map(category => {
                  const IconComponent = category.icon
                  return (
                    <div
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        "flex items-center space-x-3 rounded-lg border p-3 sm:p-4 cursor-pointer transition-colors",
                        selectedCategory === category.id ? "border-primary bg-primary/5" : "hover:bg-muted"
                      )}
                    >
                      <IconComponent className="h-5 w-5 shrink-0" style={{ color: category.color }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 truncate">
                          {category.name}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter event title"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter event description"
                className="w-full min-h-[80px]"
              />
            </div>

            {selectedWeek === null ? renderDateSelector() : (
              <div className="space-y-2">
                <Label>Select Day of the Week</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Array.from({ length: 7 }).map((_, index) => {
                    const date = addDays(addWeeks(birthDate, selectedWeek || 0), index)
                    const isSelected = selectedDayOfWeek === index
                    return (
                      <div
                        key={index}
                        onClick={() => setSelectedDayOfWeek(index)}
                        className={cn(
                          "flex flex-col items-start rounded-lg border p-3 cursor-pointer transition-all duration-200",
                          isSelected 
                            ? "border-primary bg-primary/5 shadow-sm" 
                            : "hover:border-primary/50 hover:bg-muted"
                        )}
                      >
                        <span className="text-xs font-medium text-muted-foreground">
                          {format(date, "EEEE")}
                        </span>
                        <span className="text-sm font-semibold mt-1">
                          {format(date, "MMM d")}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingEvent ? 'Save Changes' : 'Add Event'}</Button>
            </div>
          </form>
          
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

