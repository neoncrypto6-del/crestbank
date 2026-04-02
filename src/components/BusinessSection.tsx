import React from 'react';
export function BusinessSection() {
  return (
    <section className="w-full py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse md:flex-row items-center gap-12">
          {/* Left Side: Text Content */}
          <div className="w-full md:w-1/2 flex flex-col items-start">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6 leading-tight">
              Keep your business moving forward with Chase
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Open a new Chase Business Complete Checking® account with
              qualifying activities. For new business checking customers only.
            </p>
            <a
              href="#/enroll"
              className="bg-[#117A3E] hover:bg-[#0e6332] text-white font-semibold py-3 px-8 rounded w-full md:w-auto text-center transition-colors">
              
              Open account
            </a>
          </div>

          {/* Right Side: Graphic */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src="/Earn_up_to_500.png"
              alt="Earn up to $500"
              className="w-full max-w-md object-contain shadow-lg rounded-lg" />
            
          </div>
        </div>
      </div>
    </section>);

}