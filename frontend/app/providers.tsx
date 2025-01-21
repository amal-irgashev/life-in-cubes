'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { EventsProvider } from '@/lib/contexts/events-context';
import { AuthProvider } from '@/lib/contexts/auth-context';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme';
import { ErrorBoundary } from '@/components/error-boundary';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: 1,
      },
    },
  }));

  return (
    <ErrorBoundary>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          <EventsProvider>
            <QueryClientProvider client={queryClient}>
              {children}
              <Toaster position="top-right" richColors />
            </QueryClientProvider>
          </EventsProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
} 