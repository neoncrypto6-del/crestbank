import React, { useState } from 'react';
import { Search, Menu, ChevronDown, X, ChevronRight } from 'lucide-react';
export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Search functionality for "${searchQuery}" would execute here.`);
      setSearchQuery('');
    }
  };
  const mobileNavItems = [
  {
    name: 'Checking',
    link: '#/feature/checking'
  },
  {
    name: 'Savings & CDs',
    link: '#/feature/savings'
  },
  {
    name: 'Credit cards',
    link: '#/feature/credit-cards'
  },
  {
    name: 'Home loans',
    link: '#/feature/home-loans'
  },
  {
    name: 'Auto',
    link: '#/feature/auto'
  },
  {
    name: 'Investing by Crypto',
    link: '#/feature/investing'
  },
  {
    name: 'Education & goals',
    link: '#/feature/education'
  },
  {
    name: 'Travel',
    link: '#/feature/travel'
  }];

  return (
    <>
      <header className="w-full bg-white flex flex-col z-40 relative border-b border-gray-200">
        {/* Top Utility Bar (Desktop Only) */}
        <div className="hidden md:flex justify-between items-center px-6 py-2 border-b border-gray-200 text-sm">
          <div className="flex space-x-6">
            <a
              href="#/"
              className="text-[#0060AF] font-semibold border-b-2 border-[#0060AF] pb-1">
              
              Personal
            </a>
            <a href="#/" className="text-gray-600 hover:text-gray-900">
              Business
            </a>
            <a href="#/" className="text-gray-600 hover:text-gray-900">
              Commercial
            </a>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#/" className="text-gray-600 hover:text-gray-900">
              Schedule a meeting
            </a>
            <button className="flex items-center text-gray-600 hover:text-gray-900">
              Customer service <ChevronDown className="w-4 h-4 ml-1" />
            </button>
            <a href="#/" className="text-gray-600 hover:text-gray-900">
              Español
            </a>
            <form
              onSubmit={handleSearch}
              className="relative flex items-center">
              
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 text-sm border border-gray-300 rounded-full focus:outline-none focus:border-[#0060AF] w-48 transition-all" />
              
              <button
                type="submit"
                className="absolute left-2 text-gray-500 hover:text-[#0060AF]">
                
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="flex justify-between items-center px-4 md:px-6 py-4">
          {/* Mobile Menu Icon */}
          <button
            className="md:hidden text-gray-800 p-1"
            onClick={() => setIsMobileMenuOpen(true)}>
            
            <Menu className="w-7 h-7" />
          </button>

          {/* Logo */}
          <div className="flex items-center justify-center flex-1 md:flex-none md:justify-start">
            <a href="#/" className="flex items-center">
              <img
                src="/chasebank.png"
                alt="Crest"
                className="h-6 md:h-8 object-contain" />
              
            </a>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-sm font-medium text-gray-700 ml-8">
            <a href="#/feature/checking" className="hover:text-[#0060AF]">
              Checking
            </a>
            <a href="#/feature/savings" className="hover:text-[#0060AF]">
              Savings & CDs
            </a>
            <a href="#/feature/credit-cards" className="hover:text-[#0060AF]">
              Credit cards
            </a>
            <a href="#/feature/home-loans" className="hover:text-[#0060AF]">
              Home loans
            </a>
            <a href="#/feature/auto" className="hover:text-[#0060AF]">
              Auto
            </a>
            <a href="#/feature/investing" className="hover:text-[#0060AF]">
              Investing by crypto
            </a>
            <a href="#/feature/education" className="hover:text-[#0060AF]">
              Education & goals
            </a>
            <a href="#/feature/travel" className="hover:text-[#0060AF]">
              Travel
            </a>
          </nav>

          {/* Mobile Sign In Button */}
          <div className="md:hidden">
            <a
              href="#/signin"
              className="bg-[#0060AF] text-white px-4 py-1.5 rounded text-sm font-semibold inline-block">
              
              Sign in
            </a>
          </div>
        </div>
      </header>

      {/* Mobile Side Navigation Drawer */}
      {isMobileMenuOpen &&
      <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}>
        </div>

          {/* Drawer */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
              <img
              src="/chasebank.png"
              alt="Crest"
              className="h-6 object-contain" />
            
              <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-900">
              
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 border-b border-gray-200">
              <form
              onSubmit={(e) => {
                handleSearch(e);
                setIsMobileMenuOpen(false);
              }}
              className="relative">
              
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-400 rounded focus:outline-none focus:border-[#0060AF] text-lg" />
              
              </form>
            </div>

            <div className="flex-1 overflow-y-auto">
              <nav className="flex flex-col">
                {mobileNavItems.map((item, index) =>
              <a
                key={index}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-4 border-b border-gray-100 text-gray-900 hover:bg-gray-50">
                
                    <span className="text-lg">{item.name}</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </a>
              )}
              </nav>

              <div className="mt-6 mb-2 px-4">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-900 pb-2">
                  Connect with us
                </h3>
              </div>
              <nav className="flex flex-col">
                <a
                href="#/feature/meeting"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-4 border-b border-gray-100 text-gray-900 hover:bg-gray-50">
                
                  <span className="text-lg">Schedule a meeting</span>
                </a>
                <a
                href="#/feature/support"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-4 border-b border-gray-100 text-gray-900 hover:bg-gray-50">
                
                  <span className="text-lg">Customer service</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </a>
              </nav>

              <div className="mt-6 mb-2 px-4">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-900 pb-2">
                  Other products
                </h3>
              </div>
            </div>
          </div>
        </div>
      }
    </>);

}
