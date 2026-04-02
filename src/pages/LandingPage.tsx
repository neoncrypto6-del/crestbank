import React from 'react';
import { Header } from '../components/Header';
import { HeroBanner } from '../components/HeroBanner';
import { CategorySelector } from '../components/CategorySelector';
import { ProductCards } from '../components/ProductCards';
import { InvestmentBanner } from '../components/InvestmentBanner';
import { BusinessSection } from '../components/BusinessSection';
import { FreedomCardSection } from '../components/FreedomCardSection';
import { Footer } from '../components/Footer';
export function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Header />
      <main>
        <HeroBanner />
        <CategorySelector />
        <ProductCards />
        <InvestmentBanner />
        <BusinessSection />
        <FreedomCardSection />
      </main>
      <Footer />
    </div>);

}