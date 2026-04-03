import React from 'react';
export function FreedomCardSection() {
  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left Side: Card Graphic */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src="/Freedom_Unlimited_Card_with_No_Annual_Fee.png"
              alt="Crest Freedom Unlimited Card"
              className="w-full max-w-md object-contain drop-shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-300" />
            
          </div>

          {/* Right Side: Text Content */}
          <div className="w-full md:w-1/2 flex flex-col items-start">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6 leading-tight">
              Limited-time offer: Earn a{' '}
              <span className="line-through text-gray-500 decoration-2 mr-2">
                $200
              </span>
              $250 bonus
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Plus, earn unlimited 1.5% cash back or more on all purchases,
              including 3% on dining and drugstores —{' '}
              <strong className="font-semibold text-gray-900">
                all with no annual fee.
              </strong>
            </p>
            <a
              href="#/feature/credit-cards"
              className="bg-[#117A3E] hover:bg-[#0e6332] text-white font-semibold py-3 px-8 rounded w-full md:w-auto text-center transition-colors">
              
              Learn more
            </a>
          </div>
        </div>
      </div>
    </section>);

}
