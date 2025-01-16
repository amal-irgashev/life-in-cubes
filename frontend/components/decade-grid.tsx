import { ChevronDown } from 'lucide-react'
import { WeekPreview } from './week-preview'
import { useEvents } from '@/hooks/use-events-context'
import { getDecadeFromWeek } from '@/lib/utils'

interface DecadeGridProps {
  decadeIndex: number
  weeksLived: number
  isZoomed: boolean
  onDecadeClick: (decade: number) => void
  onWeekClick: (weekIndex: number) => void
  hoveredWeek: number | null
  onWeekHover: (weekIndex: number | null) => void
  birthDate: Date
  searchQuery: string
}

export function DecadeGrid({
  decadeIndex,
  weeksLived,
  isZoomed,
  onDecadeClick,
  onWeekClick,
  hoveredWeek,
  onWeekHover,
  birthDate,
  searchQuery,
}: DecadeGridProps) {
  const WEEKS_PER_YEAR = 52
  const YEARS_PER_DECADE = 10
  const startWeek = decadeIndex * YEARS_PER_DECADE * WEEKS_PER_YEAR
  
  const { state: { events } } = useEvents()
  
  const filteredEvents = events.filter(event => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      event.title.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query)
    )
  })

  return (
    <div
      className={`bg-card rounded-xl shadow-lg p-2 sm:p-4 relative overflow-visible
        ${isZoomed ? 'col-span-2 row-span-2 z-10' : 'cursor-pointer'}
        transition-all duration-300 ease-in-out
        touch-manipulation`}
      onClick={() => onDecadeClick(decadeIndex)}
      style={{
        transform: isZoomed ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      <div className="flex justify-between items-center mb-2 sm:mb-4">
        <div className="text-xs sm:text-sm font-medium">
          Years {decadeIndex * 10 + 1}-{(decadeIndex + 1) * 10}
        </div>
        <div
          style={{
            transform: `rotate(${isZoomed ? 180 : 0}deg)`,
            transition: 'transform 0.3s ease-in-out',
          }}
        >
          <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
        </div>
      </div>
      
      <div 
        className="grid gap-[1px] sm:gap-[2px] bg-muted rounded-lg overflow-visible relative touch-manipulation"
        style={{
          gridTemplateColumns: `repeat(${WEEKS_PER_YEAR}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${YEARS_PER_DECADE}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: YEARS_PER_DECADE * WEEKS_PER_YEAR }).map((_, index) => {
          const weekIndex = startWeek + index
          const weekEvents = filteredEvents.filter(e => e.weekIndex === weekIndex)
          const isHovered = isZoomed && (hoveredWeek === weekIndex || window?.matchMedia('(hover: none)').matches)

          return (
            <div
              key={weekIndex}
              className={`aspect-square relative
                ${isZoomed ? 'cursor-pointer active:bg-yellow-200/50' : ''}
                ${weekIndex < weeksLived ? 'bg-primary shadow-inner' : 'bg-card border border-muted-foreground/20'}
                transition-all duration-200 ease-in-out
                before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:rounded-sm
                touch-manipulation`}
              onClick={(e) => {
                e.stopPropagation()
                if (isZoomed) {
                  onWeekClick(weekIndex)
                }
              }}
              onMouseEnter={() => isZoomed && onWeekHover(weekIndex)}
              onMouseLeave={() => isZoomed && onWeekHover(null)}
              onTouchStart={() => isZoomed && onWeekHover(weekIndex)}
              onTouchEnd={() => isZoomed && onWeekHover(null)}
            >
              {weekEvents.length > 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" 
                    style={{ backgroundColor: weekEvents[0].color }}
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
                    events={weekEvents}
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