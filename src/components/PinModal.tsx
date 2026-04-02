import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../lib/auth';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PinModal({ isOpen, onClose, onSuccess }: PinModalProps) {
  const { user } = useAuth();
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.pin) {
      setError('No PIN set. Please set a PIN in Settings first.');
      return;
    }
    if (pinInput === user.pin) {
      setError('');
      setPinInput('');
      onSuccess();
    } else {
      setError('Incorrect PIN');
      setPinInput('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
          Security Verification
        </h3>
        <p className="text-gray-600 text-sm text-center mb-6">
          Please enter your 4-digit PIN to authorize this transaction.
        </p>

        <form onSubmit={handleSubmit}>
          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          <div className="flex justify-center mb-6">
            <input
              type="password"
              maxLength={4}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
              className="w-32 text-center text-3xl tracking-[0.5em] border-b-2 border-gray-300 focus:border-[#117A3E] focus:outline-none py-2 bg-transparent"
              autoFocus
              required
            />
          </div>

          <button
            type="submit"
            disabled={pinInput.length !== 4}
            className="w-full bg-[#117A3E] hover:bg-[#0e6332] text-white font-semibold py-3 rounded transition-colors disabled:opacity-50">
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}
