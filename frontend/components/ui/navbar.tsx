'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, LogOut, LayoutDashboard, Settings, Calendar, ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/contexts/auth-context'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function Navbar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { logout } = useAuth()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard
    },
    {
      href: "/profile",
      label: "Profile",
      icon: User
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings
    },
    {
      href: "/calendar",
      label: "Calendar",
      icon: Calendar
    }
  ]

  const isActive = (path: string) => pathname === path

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await logout()
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Logout failed:', error)
      toast.error('Failed to logout. Please try again.')
    } finally {
      setIsLoggingOut(false)
      setIsConfirmOpen(false)
    }
  }

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 h-screen bg-card/50 backdrop-blur-sm border-r border-border transition-all duration-300 z-50",
        isExpanded ? "w-64" : "w-16"
      )}>
        <div className="flex flex-col h-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute -right-3 top-6 w-6 h-6 rounded-full border border-border bg-background p-0"
          >
            {isExpanded ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>

          <div className="flex-1 py-4">
            <div className="space-y-2 px-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-2 py-2 rounded-lg transition-colors",
                    isActive(item.href) 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-primary/5 hover:text-primary",
                    isExpanded ? "justify-start" : "justify-center"
                  )}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {isExpanded && (
                    <span className="font-serif tracking-wider text-sm">
                      {item.label.toUpperCase()}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="p-4">
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  disabled={isLoggingOut}
                  className={cn(
                    "w-full text-muted-foreground hover:text-primary",
                    isExpanded ? "justify-start" : "justify-center"
                  )}
                >
                  <LogOut className="h-4 w-4 flex-shrink-0" />
                  {isExpanded && (
                    <span className="ml-2 font-serif tracking-wider text-sm">
                      {isLoggingOut ? 'LOGGING OUT...' : 'LOGOUT'}
                    </span>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card/50 backdrop-blur-sm">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-serif tracking-wider">
                    Are you sure you want to logout?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="font-serif">
                    You will need to log in again to access your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="font-serif tracking-wider">CANCEL</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="font-serif tracking-wider"
                  >
                    {isLoggingOut ? 'LOGGING OUT...' : 'LOGOUT'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </nav>
      <div className={cn(
        "transition-all duration-300",
        isExpanded ? "ml-64" : "ml-16"
      )}>
        {children}
      </div>
    </>
  )
} 