import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export function FeaturePage() {
  // Get the feature name from the hash URL
  const hash = window.location.hash;
  const featurePath = hash.split('/').pop() || 'feature';

  // Format the name for display
  const featureName = featurePath
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="w-full bg-[#003A70] text-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6">
                Explore {featureName}
              </h1>
              <p className="text-xl text-green-100 font-light leading-relaxed">
                Discover how our {featureName.toLowerCase()} solutions can help
                you achieve your financial goals with security and convenience.
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-semibold text-gray-900 mb-6">
                  Why choose Crest for {featureName.toLowerCase()}?
                </h2>
                <div className="space-y-6 text-lg text-gray-700">
                  <p>
                    Whether you're looking for everyday convenience, premium
                    rewards, or long-term growth, our{' '}
                    {featureName.toLowerCase()} products are designed with your
                    needs in mind.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1 mr-3">
                        <div className="w-2 h-2 bg-[#117A3E] rounded-full"></div>
                      </div>
                      <span>
                        Industry-leading security and fraud protection
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1 mr-3">
                        <div className="w-2 h-2 bg-[#117A3E] rounded-full"></div>
                      </div>
                      <span>24/7 access via the Crest Mobile® app</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1 mr-3">
                        <div className="w-2 h-2 bg-[#117A3E] rounded-full"></div>
                      </div>
                      <span>Dedicated customer support when you need it</span>
                    </li>
                  </ul>
                  <div className="pt-6">
                    <a
                      href="#/enroll"
                      className="inline-block bg-[#117A3E] hover:bg-[#0e6332] text-white font-semibold py-3 px-8 rounded transition-colors">
                      Get Started Today
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 rounded-2xl p-8 aspect-square flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-gray-200"></div>
                <div className="relative z-10 text-center">
                  <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-6">
                    <img
                      src="/chasebank.png"
                      alt="Crest"
                      className="h-8 object-contain" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#117A3E]">
                    {featureName}
                  </h3>
                  <p className="text-gray-600 mt-2">Premium Solutions</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
