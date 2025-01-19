'use client';

import React from 'react'
import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { PreviewSection } from '@/components/landing/preview-section'
import { QuoteSection } from '@/components/landing/quote-section'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <FeaturesSection />
      <PreviewSection />
      <QuoteSection />
    </div>
  )
}
