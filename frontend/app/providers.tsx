'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { EventsProvider } from '../hooks/use-events-context';
import { AuthProvider } from '../lib/contexts/auth-context';
import { Toaster } from 'sonner';

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
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <EventsProvider>
          {children}
          <Toaster position="top-right" richColors />
        </EventsProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
} 