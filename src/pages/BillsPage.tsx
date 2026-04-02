import React, { useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { PinModal } from '../components/PinModal';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import {
  Zap,
  Droplet,
  Wifi,
  Smartphone,
  Shield,
  Home,
  Tv,
  Flame } from
'lucide-react';
const BILL_CATEGORIES = [
{
  id: 'electricity',
  name: 'Electricity',
  icon: Zap,
  color: 'text-yellow-500',
  bg: 'bg-yellow-50'
},
{
  id: 'water',
  name: 'Water',
  icon: Droplet,
  color: 'text-blue-500',
  bg: 'bg-blue-50'
},
{
  id: 'internet',
  name: 'Internet',
  icon: Wifi,
  color: 'text-indigo-500',
  bg: 'bg-indigo-50'
},
{
  id: 'phone',
  name: 'Phone',
  icon: Smartphone,
  color: 'text-gray-700',
  bg: 'bg-gray-100'
},
{
  id: 'insurance',
  name: 'Insurance',
  icon: Shield,
  color: 'text-green-500',
  bg: 'bg-green-50'
},
{
  id: 'rent',
  name: 'Rent/Mortgage',
  icon: Home,
  color: 'text-[#0060AF]',
  bg: 'bg-blue-50'
},
{
  id: 'cable',
  name: 'Cable TV',
  icon: Tv,
  color: 'text-purple-500',
  bg: 'bg-purple-50'
},
{
  id: 'gas',
  name: 'Gas',
  icon: Flame,
  color: 'text-orange-500',
  bg: 'bg-orange-50'
}];

export function BillsPage() {
  const { user, refreshUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<
    (typeof BILL_CATEGORIES)[0] | null>(
    null);
  const [provider, setProvider] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleCategoryClick = (category: (typeof BILL_CATEGORIES)[0]) => {
    setSelectedCategory(category);
    setProvider('');
    setAccountNumber('');
    setAmount('');
    setError('');
    setSuccess(false);
  };
  const handlePayClick = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!provider || !accountNumber) {
      setError('Please fill in all fields');
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (user && numAmount > user.balance) {
      setError('Insufficient funds');
      return;
    }
    setIsPinModalOpen(true);
  };
  const executePayment = async () => {
    setIsPinModalOpen(false);
    setLoading(true);
    setError('');
    try {
      if (!user || !selectedCategory)
      throw new Error('Not authenticated or no category selected');
      const numAmount = parseFloat(amount);
      const newBalance = user.balance - numAmount;
      // Update user balance
      const { error: updateError } = await supabase.
      from('users').
      update({
        balance: newBalance
      }).
      eq('id', user.id);
      if (updateError) throw updateError;
      // Create transaction record
      const { error: txError } = await supabase.from('transactions').insert([
      {
        user_id: user.id,
        type: 'Payment',
        amount: -numAmount,
        description: `Bill Payment: ${provider} (${selectedCategory.name})`,
        recipient_details: {
          provider,
          account: accountNumber,
          category: selectedCategory.name
        },
        status: 'completed'
      }]
      );
      if (txError) throw txError;
      setSuccess(true);
      await refreshUser();
      setTimeout(() => {
        setSuccess(false);
        setSelectedCategory(null);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <DashboardLayout title="Pay Bills" showBack>
      <div className="max-w-4xl mx-auto">
        {selectedCategory ?
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 max-w-2xl mx-auto">
            <div className="flex items-center mb-8 border-b border-gray-100 pb-6">
              <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${selectedCategory.bg}`}>
              
                <selectedCategory.icon
                className={`w-6 h-6 ${selectedCategory.color}`} />
              
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Pay {selectedCategory.name} Bill
                </h2>
                <p className="text-gray-500 text-sm">
                  Available Balance: ${user?.balance.toFixed(2)}
                </p>
              </div>
            </div>

            {error &&
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
          }
            {success &&
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg text-sm">
                Payment successful!
              </div>
          }

            <form onSubmit={handlePayClick} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Provider Name
                </label>
                <input
                type="text"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                placeholder={`e.g. City ${selectedCategory.name}`}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0060AF] focus:border-transparent outline-none" />
              
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account/Reference Number
                </label>
                <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter your account number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0060AF] focus:border-transparent outline-none font-mono" />
              
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0060AF] focus:border-transparent outline-none" />
                
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className="flex-1 bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors">
                
                  Cancel
                </button>
                <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#0060AF] hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-70">
                
                  {loading ? 'Processing...' : 'Pay Now'}
                </button>
              </div>
            </form>
          </div> :

        <>
            <h2 className="text-xl font-light text-gray-900 mb-6">
              Select a bill category
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {BILL_CATEGORIES.map((category) =>
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col items-center justify-center hover:border-[#0060AF] hover:bg-gray-50 transition-all group">
              
                  <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${category.bg} group-hover:scale-110 transition-transform`}>
                
                    <category.icon className={`w-6 h-6 ${category.color}`} />
                  </div>
                  <span className="font-medium text-gray-800 text-sm">
                    {category.name}
                  </span>
                </button>
            )}
            </div>
          </>
        }
      </div>

      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={executePayment} />
      
    </DashboardLayout>);

}