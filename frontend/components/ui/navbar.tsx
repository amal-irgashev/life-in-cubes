'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/contexts/auth-context'
import { ModeToggle } from '@/components/theme/mode-toggle'
import { Button } from './button'
import { LogOut, User, ChevronRight, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavbarProps {
  onExpandedChange?: (expanded: boolean) => void
}

export function Navbar({ onExpandedChange }: NavbarProps) {
  const { user, signOut } = useAuth()
  const [isExpanded, setIsExpanded] = useState(false)

  const handleExpandedChange = (expanded: boolean) => {
    setIsExpanded(expanded)
    onExpandedChange?.(expanded)
  }

  return (
    <nav className={cn(
      "fixed top-0 left-0 bottom-0 z-50 bg-background border-r border-border",
      "flex flex-col transition-all duration-500 ease-in-out",
      isExpanded ? "w-56" : "w-14",
    )}>
      <div className="flex-1 flex flex-col gap-1 p-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => handleExpandedChange(!isExpanded)}
          className="h-10 w-10 rounded-lg mb-4 hover:bg-muted"
        >
          <ChevronRight className={cn(
            "h-4 w-4 transition-transform duration-500 ease-in-out",
            isExpanded && "rotate-180"
          )} />
        </Button>

        <Link href="/dashboard" className="w-full">
          <Button 
            variant="ghost" 
            className={cn(
              "w-full h-10 rounded-lg hover:bg-muted relative",
              isExpanded ? "justify-start" : "justify-center"
            )}
          >
            <LayoutDashboard className="h-4 w-4 absolute left-3" />
            <span className={cn(
              "font-serif tracking-widest text-sm transition-all duration-500 ease-in-out absolute left-10",
              isExpanded 
                ? "opacity-100 translate-x-0" 
                : "opacity-0 -translate-x-4"
            )}>
              DASHBOARD
            </span>
          </Button>
        </Link>

        <Link href="/profile" className="w-full">
          <Button 
            variant="ghost" 
            className={cn(
              "w-full h-10 rounded-lg hover:bg-muted relative",
              isExpanded ? "justify-start" : "justify-center"
            )}
          >
            <User className="h-4 w-4 absolute left-3" />
            <span className={cn(
              "font-serif tracking-widest text-sm transition-all duration-500 ease-in-out absolute left-10",
              isExpanded 
                ? "opacity-100 translate-x-0" 
                : "opacity-0 -translate-x-4"
            )}>
              PROFILE
            </span>
          </Button>
        </Link>
      </div>

      <div className="p-2 flex flex-col gap-1">
        <ModeToggle expanded={isExpanded} />
        <Button 
          variant="ghost" 
          className={cn(
            "w-full h-10 rounded-lg hover:bg-muted relative",
            isExpanded ? "justify-start" : "justify-center"
          )}
          onClick={signOut}
        >
          <LogOut className="h-4 w-4 absolute left-3" />
          <span className={cn(
            "font-serif tracking-widest text-sm transition-all duration-500 ease-in-out absolute left-10",
            isExpanded 
              ? "opacity-100 translate-x-0" 
              : "opacity-0 -translate-x-4"
          )}>
            LOGOUT
          </span>
        </Button>
      </div>
    </nav>
  )
} 