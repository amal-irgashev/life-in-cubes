import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn, generateId } from '@/lib/utils'
import { format, addDays, startOfWeek, addWeeks } from 'date-fns'
import { ChevronDown } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Briefcase, Heart, Book, Plane } from 'lucide-react'
import { Event } from '@/types/events'

interface AddEventDialogProps {
  isOpen: boolean
  onClose: () => void
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

export function AddEventDialog({ isOpen, onClose, onAdd, selectedWeek, birthDate, editingEvent }: AddEventDialogProps) {
  const [title, setTitle] = useState(editingEvent?.title || '')
  const [description, setDescription] = useState(editingEvent?.description || '')
  const [selectedCategory, setSelectedCategory] = useState<string>(editingEvent?.icon || EVENT_CATEGORIES[0].id)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<number | undefined>(undefined)

  // Reset form when dialog opens/closes or editing event changes
  React.useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title)
      setDescription(editingEvent.description)
      setSelectedCategory(editingEvent.icon)
    } else {
      setTitle('')
      setDescription('')
      setSelectedCategory(EVENT_CATEGORIES[0].id)
    }
    setSelectedDate(undefined)
    setSelectedDayOfWeek(undefined)
  }, [editingEvent, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    let eventDate: Date
    let dayOfWeek: number = 0 // Default to Sunday

    if (selectedWeek !== null && selectedDayOfWeek !== undefined) {
      dayOfWeek = selectedDayOfWeek
      const weekStart = startOfWeek(addWeeks(birthDate, selectedWeek))
      eventDate = addDays(weekStart, dayOfWeek)
    } else if (selectedDate) {
      eventDate = selectedDate
      // Get the day of week (0-6, where 0 is Sunday)
      dayOfWeek = selectedDate.getDay()
    } else {
      // Default to current date if no date is selected
      eventDate = new Date()
      dayOfWeek = eventDate.getDay()
    }

    const weekIndex = Math.floor((eventDate.getTime() - birthDate.getTime()) / (7 * 24 * 60 * 60 * 1000))
    const category = EVENT_CATEGORIES.find(cat => cat.id === selectedCategory)!

    onAdd({
      id: editingEvent?.id || generateId(),
      weekIndex,
      dayOfWeek,
      title,
      description,
      icon: category.id,
      color: category.color,
      tags: [category.id],
      date: eventDate.toISOString()
    })

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
        <RadioGroup 
          value={selectedDayOfWeek?.toString() || ''} 
          onValueChange={(value) => setSelectedDayOfWeek(parseInt(value))}
          className="flex flex-col space-y-1"
        >
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={index.toString()} id={`day-${index}`} />
              <Label htmlFor={`day-${index}`}>{format(addDays(weekStart, index), "EEEE, MMM d")}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]" aria-describedby="event-form-description">
        <DialogHeader>
          <DialogTitle>{editingEvent ? 'Edit Event' : 'Add Event'}</DialogTitle>
          <DialogDescription id="event-form-description">
            {editingEvent 
              ? 'Edit your life event details below.'
              : 'Add a new event to your life calendar. Choose a category and provide details.'
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
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
                  <Label
                    key={category.id}
                    htmlFor={category.id}
                    className={cn(
                      "flex items-center space-x-2 rounded-lg border p-4 cursor-pointer transition-colors",
                      selectedCategory === category.id ? "border-primary bg-primary/5" : "hover:bg-muted"
                    )}
                  >
                    <RadioGroupItem value={category.id} id={category.id} className="sr-only" />
                    <div className="flex items-center space-x-3 flex-1">
                      <IconComponent className="h-5 w-5 shrink-0" style={{ color: category.color }} />
                      <div className="flex-1">
                        <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {category.name}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </Label>
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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter event description"
            />
          </div>

          {selectedWeek === null ? renderDateSelector() : renderWeekDaySelector()}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Event</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

