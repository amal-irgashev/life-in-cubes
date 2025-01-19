'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'

export interface SearchFilters {
  text: string
  category: string
  dateRange: 'all' | 'past-week' | 'past-month' | 'past-year' | 'custom'
  startDate?: Date
  endDate?: Date
}

export interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void
  className?: string
}

const EVENT_CATEGORIES = [
  { id: 'all', name: 'All Categories' },
  { id: 'personal', name: 'Personal & Relationships' },
  { id: 'career', name: 'Career & Education' },
  { id: 'growth', name: 'Personal Growth' },
  { id: 'experiences', name: 'Experiences & Travel' }
]

const DATE_RANGES = [
  { id: 'all', name: 'All Time' },
  { id: 'past-week', name: 'Past Week' },
  { id: 'past-month', name: 'Past Month' },
  { id: 'past-year', name: 'Past Year' },
  { id: 'custom', name: 'Custom Range' }
]

export function AdvancedSearch({ onSearch, className }: AdvancedSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    text: '',
    category: 'all',
    dateRange: 'all' as const
  })

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value } as SearchFilters
    setFilters(newFilters)
    onSearch(newFilters)
  }

  const clearSearch = () => {
    const newFilters: SearchFilters = {
      text: '',
      category: 'all',
      dateRange: 'all'
    }
    setFilters(newFilters)
    onSearch(newFilters)
  }

  return (
    <div className={cn("relative", className)}>
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search events..."
            value={filters.text}
            onChange={(e) => handleFilterChange('text', e.target.value)}
            className="pl-9 pr-8"
          />
          {filters.text && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-transparent"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "h-10 w-10 shrink-0 transition-colors",
            isExpanded && "bg-primary/10 text-primary hover:bg-primary/20"
          )}
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 p-4 bg-background border shadow-lg z-50 rounded-lg"
          >
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-wider font-medium">Category</Label>
                <RadioGroup
                  value={filters.category}
                  onValueChange={(value) => handleFilterChange('category', value)}
                  className="grid grid-cols-2 gap-2"
                >
                  {EVENT_CATEGORIES.map((category) => (
                    <div
                      key={category.id}
                      className={cn(
                        "flex items-center space-x-2 rounded-lg border p-3 transition-colors cursor-pointer bg-card hover:bg-muted",
                        filters.category === category.id ? "border-primary bg-primary/10" : "hover:border-primary/50"
                      )}
                      onClick={() => handleFilterChange('category', category.id)}
                    >
                      <RadioGroupItem value={category.id} id={`category-${category.id}`} />
                      <Label
                        htmlFor={`category-${category.id}`}
                        className="cursor-pointer text-sm font-medium"
                      >
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-wider font-medium">Time Period</Label>
                <RadioGroup
                  value={filters.dateRange}
                  onValueChange={(value) => handleFilterChange('dateRange', value)}
                  className="grid grid-cols-2 gap-2"
                >
                  {DATE_RANGES.map((range) => (
                    <div
                      key={range.id}
                      className={cn(
                        "flex items-center space-x-2 rounded-lg border p-3 transition-colors cursor-pointer bg-card hover:bg-muted",
                        filters.dateRange === range.id ? "border-primary bg-primary/10" : "hover:border-primary/50"
                      )}
                      onClick={() => handleFilterChange('dateRange', range.id)}
                    >
                      <RadioGroupItem value={range.id} id={`range-${range.id}`} />
                      <Label
                        htmlFor={`range-${range.id}`}
                        className="cursor-pointer text-sm font-medium"
                      >
                        {range.name}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {filters.dateRange === 'custom' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-2 gap-4 pt-2"
                >
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider font-medium">Start Date</Label>
                    <Input
                      type="date"
                      value={filters.startDate ? format(filters.startDate, "yyyy-MM-dd") : ''}
                      onChange={(e) => handleFilterChange('startDate', e.target.value ? new Date(e.target.value) : undefined)}
                      className="w-full bg-card"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider font-medium">End Date</Label>
                    <Input
                      type="date"
                      value={filters.endDate ? format(filters.endDate, "yyyy-MM-dd") : ''}
                      onChange={(e) => handleFilterChange('endDate', e.target.value ? new Date(e.target.value) : undefined)}
                      className="w-full bg-card"
                    />
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 