import React, { useState } from 'react';
import {
  Briefcase,
  CreditCard,
  CheckSquare,
  Plane,
  PiggyBank,
  Home,
  Car,
  LineChart,
  Building,
  Calendar,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Circle,
  FileText } from 'lucide-react';

const categories = [
  {
    name: 'Business',
    icon: Briefcase,
    link: '#/feature/business'
  },
  {
    name: 'Credit cards',
    icon: CreditCard,
    link: '#/feature/credit-cards'
  },
  {
    name: 'Checking',
    icon: CheckSquare,
    link: '#/feature/checking'
  },
  {
    name: 'Travel',
    icon: Plane,
    link: '#/feature/travel'
  },
  {
    name: 'Savings',
    icon: PiggyBank,
    link: '#/feature/savings'
  },
  {
    name: 'Home loans',
    icon: Home,
    link: '#/feature/home-loans'
  },
  {
    name: 'Auto',
    icon: Car,
    link: '#/feature/auto'
  },
  {
    name: 'Investments',
    icon: LineChart,
    link: '#/feature/investing'
  },
  {
    name: 'Commercial',
    icon: Building,
    link: '#/feature/commercial'
  },
  {
    name: 'Inheritance',
    icon: FileText,
    link: '#/feature/inheritance'
  },
  {
    name: 'Schedule a meeting',
    icon: Calendar,
    link: '#/feature/meeting'
  },
  {
    name: 'Free credit score',
    icon: ShieldCheck,
    link: '#/feature/credit-score'
  }
];

export function CategorySelector() {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 6;

  const handleNext = () => {
    if (startIndex + visibleCount < categories.length) {
      setStartIndex(startIndex + visibleCount);
    } else {
      setStartIndex(0); // loop back
    }
  };

  const handlePrev = () => {
    if (startIndex - visibleCount >= 0) {
      setStartIndex(startIndex - visibleCount);
    } else {
      // Go to last set
      const remainder = categories.length % visibleCount;
      setStartIndex(
        categories.length - (remainder === 0 ? visibleCount : remainder)
      );
    }
  };

  const visibleCategories = categories.slice(
    startIndex,
    startIndex + visibleCount
  );

  const totalPages = Math.ceil(categories.length / visibleCount);
  const currentPage = Math.floor(startIndex / visibleCount);

  return (
    <section className="w-full py-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-900 mb-10">
          Choose what's right for you
        </h2>

        <div className="relative">
          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 mb-8 justify-center animate-in slide-in-from-right-8 fade-in duration-500"
            key={startIndex}>
            
            {visibleCategories.map((category) => {
              const Icon = category.icon;
              return (
                <a
                  key={category.name}
                  href={category.link}
                  className="flex flex-col items-center group cursor-pointer">
                  
                  <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center mb-3 group-hover:border-[#117A3E] transition-colors">
                    <Icon
                      className="w-8 h-8 text-gray-600 group-hover:text-[#117A3E] transition-colors"
                      strokeWidth={1.5} />
                  </div>
                  <span className="text-[#117A3E] font-medium text-center text-sm">
                    {category.name}
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="hidden md:flex items-center justify-center space-x-4 mt-8">
          <button
            onClick={handlePrev}
            className="text-[#117A3E] hover:text-[#0e6332] p-2 rounded-full hover:bg-green-50 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setStartIndex(idx * visibleCount)}
                className="focus:outline-none">
                <Circle
                  className={`w-3 h-3 ${idx === currentPage 
                    ? 'fill-[#117A3E] text-[#117A3E]' 
                    : 'fill-gray-300 text-gray-300'}`} 
                />
              </button>
            ))}
          </div>
          <button
            onClick={handleNext}
            className="text-[#117A3E] hover:text-[#0e6332] p-2 rounded-full hover:bg-green-50 transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
