import React from 'react'
import { Card } from '@/components/ui/card'

export function QuoteSection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <Card className="p-8 sm:p-12 bg-card/50 backdrop-blur-sm text-center">
          <blockquote className="max-w-3xl mx-auto">
            <p className="text-xl sm:text-2xl font-serif italic text-muted-foreground mb-4">
              "The whole life of a philosopher is the meditation of his death."
            </p>
            <footer className="text-sm font-semibold tracking-wider">
              — CICERO
            </footer>
          </blockquote>
        </Card>
      </div>
    </section>
  )
} 