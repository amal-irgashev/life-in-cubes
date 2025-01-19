import { Event } from '@/types/events'

export interface AddEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (event: Event) => void
  selectedWeek: number | null
  birthDate: Date
  editingEvent?: Event | null
} 