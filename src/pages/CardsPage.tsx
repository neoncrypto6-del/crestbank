import React, { useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../lib/auth';
import { Lock, RefreshCw, Eye, EyeOff, Unlock } from 'lucide-react';

export function CardsPage() {
  const { user } = useAuth();
  const [isFrozen, setIsFrozen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const toggleFreeze = () => {
    setIsFrozen(!isFrozen);
    // In a real app, this would update the backend
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  // Mock CVV and Expiry for demo purposes
  const mockCvv = '123';
  const mockExpiry = '12/28';
  const fullCardNumber = user?.account_number ?
    `4147 2021 3456 ${user.account_number.slice(-4)}` :
    '4147 2021 3456 1234';

  return (
    <DashboardLayout title="My Cards" showBack>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-light text-gray-900 mb-8">
          Manage your cards
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card Visual */}
          <div className="flex justify-center items-start">
            <div
              className={`relative w-full max-w-md aspect-[1.586/1] rounded-xl shadow-2xl overflow-hidden transition-all duration-500 ${isFrozen ? 'grayscale opacity-80' : ''} bg-gradient-to-br from-[#117A3E] via-[#0e6332] to-gray-900 p-6 flex flex-col justify-between border border-gray-700`}>
              
              {isFrozen && (
                <div className="absolute inset-0 bg-black/20 z-10 flex items-center justify-center backdrop-blur-[1px]">
                  <div className="bg-white/90 text-gray-900 px-4 py-2 rounded-full font-bold flex items-center shadow-lg">
                    <Lock className="w-4 h-4 mr-2 text-red-500" /> Card Frozen
                  </div>
                </div>
              )}

              <div className="flex justify-between items-start">
                <img
                  src="/chasebank.png"
                  alt="Crest"
                  className="h-6 brightness-0 invert" />
                <div className="w-8 h-8 border-2 border-white/40 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white/40 rounded-full"></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="w-12 h-8 bg-yellow-200/80 rounded shadow-inner"></div>
                <div className="text-white/90 font-mono text-xl tracking-widest transition-all duration-300">
                  {showDetails ?
                    fullCardNumber :
                    `•••• •••• •••• ${user?.account_number.slice(-4) || '1234'}`}
                </div>

                {showDetails && (
                  <div className="flex space-x-6 text-white/80 font-mono text-sm animate-in fade-in slide-in-from-bottom-2">
                    <div>
                      <span className="text-xs text-white/50 block">EXP</span>
                      {mockExpiry}
                    </div>
                    <div>
                      <span className="text-xs text-white/50 block">CVV</span>
                      {mockCvv}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-end">
                <div className="text-white/80 font-semibold tracking-wider uppercase">
                  {user?.full_name || 'CARD HOLDER'}
                </div>
                <div className="text-white font-bold text-2xl italic">VISA</div>
              </div>
            </div>
          </div>

          {/* Card Controls */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Card Controls
            </h3>

            <div className="space-y-4">
              <button
                onClick={toggleFreeze}
                className={`w-full flex items-center justify-between p-4 border rounded-lg transition-colors ${isFrozen ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${isFrozen ? 'bg-green-100' : 'bg-green-50'}`}>
                    {isFrozen ?
                      <Unlock className="w-5 h-5 text-[#117A3E]" /> :
                      <Lock className="w-5 h-5 text-[#117A3E]" />
                    }
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">
                      {isFrozen ? 'Unfreeze Card' : 'Freeze Card'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {isFrozen ?
                        'Allow new purchases and withdrawals' :
                        'Temporarily lock your card'}
                    </p>
                  </div>
                </div>
                <div
                  className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${isFrozen ? 'bg-[#117A3E]' : 'bg-gray-300'}`}>
                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow transition-transform duration-300 ${isFrozen ? 'left-[26px]' : 'left-0.5'}`}>
                  </div>
                </div>
              </button>

              <button
                onClick={toggleDetails}
                className={`w-full flex items-center p-4 border rounded-lg transition-colors ${showDetails ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${showDetails ? 'bg-green-100' : 'bg-green-50'}`}>
                  {showDetails ?
                    <EyeOff className="w-5 h-5 text-[#117A3E]" /> :
                    <Eye className="w-5 h-5 text-[#117A3E]" />
                  }
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">
                    {showDetails ? 'Hide Details' : 'Show Details'}
                  </p>
                  <p className="text-xs text-gray-500">
                    View full card number and CVV
                  </p>
                </div>
              </button>

              <button className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mr-4">
                  <RefreshCw className="w-5 h-5 text-[#117A3E]" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Replace Card</p>
                  <p className="text-xs text-gray-500">
                    Report lost, stolen, or damaged
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
