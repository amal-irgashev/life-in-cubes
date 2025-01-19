declare module '@/components/theme' {
  export interface ThemeProviderProps {
    children: React.ReactNode
    attribute?: string
    defaultTheme?: string
    enableSystem?: boolean
    disableTransitionOnChange?: boolean
  }

  export const ThemeProvider: React.FC<ThemeProviderProps>
  export const ModeToggle: React.FC
} 