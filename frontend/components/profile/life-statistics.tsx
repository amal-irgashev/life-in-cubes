import React from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface LifeStatisticsProps {
  birthDate: Date
}

export function LifeStatistics({ birthDate }: LifeStatisticsProps) {
  const currentDate = new Date()
  
  // Constants for calculations
  const WEEKS_PER_YEAR = 52.1429 // More accurate weeks per year
  const LIFE_EXPECTANCY = 80
  const TOTAL_WEEKS = Math.floor(LIFE_EXPECTANCY * WEEKS_PER_YEAR)
  
  // Calculate weeks lived (floor to get completed weeks)
  const weeksLived = Math.floor((currentDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 7))
  
  // Calculate remaining weeks
  const weeksRemaining = TOTAL_WEEKS - weeksLived
  
  // Calculate life progress percentage
  const lifeProgress = ((weeksLived / TOTAL_WEEKS) * 100).toFixed(1)

  // Calculate years for display
  const yearsLived = (weeksLived / WEEKS_PER_YEAR).toFixed(1)
  const yearsRemaining = (weeksRemaining / WEEKS_PER_YEAR).toFixed(1)

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <h2 className="text-xl font-semibold tracking-tight">Life Statistics</h2>
        <p className="text-sm text-muted-foreground">Your life journey in numbers</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            value={weeksLived.toLocaleString()}
            label="Weeks lived"
            sublabel={`(${yearsLived} years)`}
          />
          <StatCard
            value={weeksRemaining.toLocaleString()}
            label="Weeks remaining"
            sublabel={`(${yearsRemaining} years)`}
          />
          <StatCard
            value={`${lifeProgress}%`}
            label="Life progress"
            sublabel={`of ${LIFE_EXPECTANCY} years`}
          />
        </div>
      </CardContent>
    </Card>
  )
}

interface StatCardProps {
  value: string
  label: string
  sublabel: string
}

function StatCard({ value, label, sublabel }: StatCardProps) {
  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-primary/5">
      <p className="text-3xl font-bold text-primary">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-xs text-muted-foreground">{sublabel}</p>
    </div>
  )
} 