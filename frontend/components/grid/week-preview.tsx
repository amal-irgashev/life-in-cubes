'use client'

import { motion } from 'framer-motion'
import { Event } from '@/types/events'
import { format, addWeeks } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, Book, Briefcase, Plane } from 'lucide-react'
import React from 'react'

const WEEKS_PER_YEAR = 52

interface WeekPreviewProps {
  weekIndex: number
  birthDate: Date
  event?: Event
}

const CategoryIcons = {
  personal: Heart,
  career: Briefcase,
  growth: Book,
  experiences: Plane
}

export function WeekPreview({ weekIndex, birthDate, event }: WeekPreviewProps) {
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
          {event ? (
            <div className="border-t pt-1">
              <div className="flex items-center gap-1 mb-1">
                {React.createElement(CategoryIcons[event.icon as keyof typeof CategoryIcons] || Heart, {
                  className: "h-3 w-3",
                  style: { color: event.color }
                })}
                <div className="text-xs font-medium truncate">{event.title}</div>
              </div>
              {event.description && (
                <div className="text-xs text-muted-foreground line-clamp-2">{event.description}</div>
              )}
            </div>
          ) : (
            <div className="text-xs text-muted-foreground italic">No event recorded</div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

