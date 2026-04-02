import React, { useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { Hash } from 'lucide-react';
export function CreatePinPage() {
  const { user, refreshUser } = useAuth();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const hasPin = !!user?.pin;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (pin !== confirmPin) {
      setError('PINs do not match');
      return;
    }
    if (!/^\d{4}$/.test(pin)) {
      setError('PIN must be exactly 4 digits');
      return;
    }
    setLoading(true);
    try {
      if (!user) throw new Error('Not authenticated');
      const { error: updateError } = await supabase.
      from('users').
      update({
        pin: pin
      }).
      eq('id', user.id);
      if (updateError) throw updateError;
      setSuccess(true);
      setPin('');
      setConfirmPin('');
      await refreshUser();
    } catch (err: any) {
      setError(err.message || 'Failed to set PIN');
    } finally {
      setLoading(false);
    }
  };
  return (
    <DashboardLayout title="Transaction PIN" showBack>
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
              <Hash className="w-8 h-8 text-[#0060AF]" />
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
            {hasPin ? 'Update Transaction PIN' : 'Create Transaction PIN'}
          </h2>
          <p className="text-center text-gray-500 text-sm mb-6">
            This 4-digit PIN is required to authorize transfers, payments, and
            investments.
          </p>

          {error &&
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          }
          {success &&
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg text-sm">
              PIN successfully {hasPin ? 'updated' : 'created'}!
            </div>
          }

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                4-Digit PIN
              </label>
              <input
                type="password"
                required
                maxLength={4}
                pattern="[0-9]*"
                inputMode="numeric"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0060AF] outline-none text-center text-2xl tracking-widest" />
              
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm PIN
              </label>
              <input
                type="password"
                required
                maxLength={4}
                pattern="[0-9]*"
                inputMode="numeric"
                value={confirmPin}
                onChange={(e) =>
                setConfirmPin(e.target.value.replace(/\D/g, ''))
                }
                placeholder="••••"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0060AF] outline-none text-center text-2xl tracking-widest" />
              
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0060AF] hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-70 mt-2">
              
              {loading ? 'Saving...' : hasPin ? 'Update PIN' : 'Create PIN'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>);

}