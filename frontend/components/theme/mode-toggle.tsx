"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ModeToggleProps {
  expanded?: boolean
}

export function ModeToggle({ expanded = false }: ModeToggleProps) {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full h-10 rounded-lg hover:bg-muted relative",
        expanded ? "justify-start" : "justify-center"
      )}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <div className="absolute left-3 h-4 w-4">
        <Sun className={cn(
          "h-4 w-4 absolute",
          theme === 'dark' ? "opacity-0 scale-0" : "opacity-100 scale-100"
        )} />
        <Moon className={cn(
          "h-4 w-4 absolute",
          theme === 'light' ? "opacity-0 scale-0" : "opacity-100 scale-100"
        )} />
      </div>
      <span className={cn(
        "font-serif tracking-widest text-sm transition-all duration-500 ease-in-out absolute left-10",
        expanded 
          ? "opacity-100 translate-x-0" 
          : "opacity-0 -translate-x-4"
      )}>
        {theme === 'light' ? 'DARK' : 'LIGHT'}
      </span>
    </Button>
  )
} 