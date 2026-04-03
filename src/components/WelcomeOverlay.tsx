import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../lib/auth';

export function WelcomeOverlay() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsOpen(false);
      return;
    }

    // Always show welcome overlay on every login
    setIsOpen(true);
  }, [user]);

  if (!isOpen || !user) return null;

  const message =
    user.welcome_message ||
    'Welcome to Crest Online Banking! Your secure gateway to managing your finances.';

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-[#117A3E] p-6 text-white text-center relative">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
          <img
            src="/chasebank.png"
            alt="Crest"
            className="h-8 mx-auto mb-4 brightness-0 invert" />
          <h2 className="text-2xl font-light">
            Welcome, {user.full_name.split(' ')[0]}!
          </h2>
        </div>

        <div className="p-8 text-center">
          <p className="text-gray-700 text-lg leading-relaxed">{message}</p>

          <button
            onClick={() => setIsOpen(false)}
            className="mt-8 w-full bg-[#117A3E] hover:bg-[#0e6332] text-white font-semibold py-3 px-6 rounded-lg transition-colors">
            Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
