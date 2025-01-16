"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { DateRange } from "react-day-picker"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function CalendarDemo() {
  // Single date selection
  const [date, setDate] = React.useState<Date>()
  
  // Date range selection
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })

  // Calendar mode
  const [mode, setMode] = React.useState<"single" | "range">("single")

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <Select
          value={mode}
          onValueChange={(value) => setMode(value as "single" | "range")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single">Single Date</SelectItem>
            <SelectItem value="range">Date Range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col space-y-4">
        <Calendar
          mode={mode}
          selected={mode === "single" ? date : dateRange}
          onSelect={mode === "single" 
            ? (date) => setDate(date as Date)
            : (range) => setDateRange(range as DateRange)}
          className="rounded-md border"
        />

        <Card className="p-4">
          <h3 className="font-medium mb-2">Selected Date(s):</h3>
          {mode === "single" && date && (
            <p>Selected date: {format(date, "PPP")}</p>
          )}
          {mode === "range" && dateRange?.from && (
            <div className="space-y-1">
              <p>From: {format(dateRange.from, "PPP")}</p>
              {dateRange.to && <p>To: {format(dateRange.to, "PPP")}</p>}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
} 