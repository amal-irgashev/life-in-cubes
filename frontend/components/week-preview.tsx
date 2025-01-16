import { motion } from 'framer-motion'
import { Event } from '@/types/events'
import { format, addWeeks } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { Briefcase, Heart, Book, Plane } from 'lucide-react'
import React from 'react'

const WEEKS_PER_YEAR = 52

interface WeekPreviewProps {
  weekIndex: number
  birthDate: Date
  events?: Event[]
}

const CategoryIcons = {
  personal: Heart,
  career: Briefcase,
  growth: Book,
  experiences: Plane
}

export function WeekPreview({ weekIndex, birthDate, events = [] }: WeekPreviewProps) {
  const weekNumber = (weekIndex % 52) + 1
  const year = Math.floor(weekIndex / 52)
  const age = year

  const weekStartDate = addWeeks(birthDate, weekIndex)
  const dateString = format(weekStartDate, 'MMM d, yyyy')

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48"
    >
      <Card className="shadow-lg border border-yellow-200/50">
        <CardContent className="p-2">
          <div className="text-xs font-medium mb-1">Week {weekNumber}</div>
          <div className="text-xs text-muted-foreground">Age: {age}</div>
          <div className="text-xs text-muted-foreground mb-1">{dateString}</div>
          {events.length > 0 ? (
            <div className="border-t pt-1 space-y-1">
              {events.map((event) => {
                const IconComponent = CategoryIcons[event.icon as keyof typeof CategoryIcons] || Heart
                return (
                  <div key={event.id} className="flex items-center gap-1">
                    <IconComponent 
                      className="h-3 w-3 shrink-0" 
                      style={{ color: event.color }} 
                    />
                    <div className="text-xs truncate">
                      {event.title}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-xs text-muted-foreground italic">No events recorded</div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

