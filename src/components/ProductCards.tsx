import React from 'react';
import { CreditCard, Car } from 'lucide-react';

export function ProductCards() {
  return (
    <section className="w-full py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Crest Credit Cards */}
          <div className="flex flex-col border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="bg-[#117A3E] text-white p-6 flex justify-between items-center h-24">
              <h3 className="text-xl font-semibold">Crest Credit Cards</h3>
              <CreditCard className="w-10 h-10 opacity-90" strokeWidth={1.5} />
            </div>
            <div className="p-6 flex flex-col flex-grow bg-white">
              <h4 className="text-2xl font-semibold text-gray-900 mb-4">
                See if you're preapproved
              </h4>
              <p className="text-gray-700 mb-8 flex-grow">
                Learn which Crest Credit Cards you're preapproved for in just a
                few moments. Plus, there's no impact to your credit score.
              </p>
              <button className="bg-[#117A3E] hover:bg-[#0e6332] text-white font-semibold py-3 px-6 rounded w-full md:w-auto self-start transition-colors">
                Get started
              </button>
            </div>
          </div>

          {/* Card 2: Crest Sapphire Preferred */}
          <div className="flex flex-col border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="bg-[#003A70] text-white p-6 flex justify-between items-center h-24">
              <h3 className="text-xl font-semibold pr-4">
                Crest Sapphire Preferred®
              </h3>
              <CreditCard
                className="w-10 h-10 opacity-90 flex-shrink-0"
                strokeWidth={1.5} />
            </div>
            <div className="p-6 flex flex-col flex-grow bg-white">
              <h4 className="text-2xl font-semibold text-gray-900 mb-4">
                Earn 75,000 bonus points
              </h4>
              <p className="text-gray-700 mb-8 flex-grow">
                Plus, earn 5x total points on Crest Travel℠, 3x points on
                dining, 2x points on all other travel purchases, and more. Terms
                apply.
              </p>
              <button className="bg-[#117A3E] hover:bg-[#0e6332] text-white font-semibold py-3 px-6 rounded w-full md:w-auto self-start transition-colors">
                See details
              </button>
            </div>
          </div>

          {/* Card 3: Crest Auto */}
          <div className="flex flex-col border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="bg-[#117A3E] text-white p-6 flex justify-between items-center h-24">
              <h3 className="text-xl font-semibold">Crest Auto</h3>
              <Car className="w-10 h-10 opacity-90" strokeWidth={1.5} />
            </div>
            <div className="p-6 flex flex-col flex-grow bg-white">
              <h4 className="text-2xl font-semibold text-gray-900 mb-4">
                Find the best car for you
              </h4>
              <p className="text-gray-700 mb-8 flex-grow">
                Shop live inventory and filter by price, model, features and
                more. Then apply online in minutes for Crest Auto financing.
              </p>
              <button className="bg-[#117A3E] hover:bg-[#0e6332] text-white font-semibold py-3 px-6 rounded w-full md:w-auto self-start transition-colors">
                Shop now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
