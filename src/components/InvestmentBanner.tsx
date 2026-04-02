import React from 'react';

export function InvestmentBanner() {
  return (
    <section className="w-full py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row rounded-lg overflow-hidden shadow-md">
          {/* Left Side: Graphic/Offer */}
          <div className="w-full md:w-1/2 bg-[#F5F5F5] p-8 md:p-12 flex flex-col justify-center items-center text-center relative overflow-hidden">
            {/* Abstract background shapes placeholder */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>

            <div className="relative z-10">
              <p className="text-2xl md:text-3xl text-gray-800 font-medium mb-2">
                Now get up to
              </p>
              <div className="relative inline-block">
                <span className="text-4xl md:text-5xl text-gray-500 font-bold line-through decoration-red-500 decoration-4 mr-4">
                  $700
                </span>
              </div>
              <h2 className="text-6xl md:text-8xl font-bold text-gray-900 leading-none my-2">
                $1,000
              </h2>
              <p className="text-2xl md:text-3xl text-gray-800 font-medium">
                cash bonus
              </p>
            </div>
          </div>

          {/* Right Side: Content */}
          <div className="w-full md:w-1/2 bg-white p-8 md:p-12 flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-200">
            <h3 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6">
              Commission-free online trades – plus a bonus
            </h3>
            <p className="text-lg text-gray-700 mb-8">
              This is an invitation to get up to $1,000 when you open and fund a
              Crypto Self-Directed Investing account—an investing
              experience that puts you in control.
            </p>
            <button className="bg-[#117A3E] hover:bg-[#0e6332] text-white font-semibold py-3 px-8 rounded w-full md:w-auto self-start transition-colors">
              Continue
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
