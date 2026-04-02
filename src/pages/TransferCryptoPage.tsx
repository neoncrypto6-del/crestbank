import React, { useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { PinModal } from '../components/PinModal';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { Bitcoin, ArrowRight } from 'lucide-react';
const CRYPTO_OPTIONS = [
'Bitcoin (BTC)',
'Ethereum (ETH)',
'Solana (SOL)',
'BNB Smart Chain',
'USDT (ERC20)',
'USDC (ERC20)',
'Dogecoin (DOGE)',
'Tron (TRX)',
'XRP',
'Litecoin (LTC)'];

export function TransferCryptoPage() {
  const { user, refreshUser } = useAuth();
  const [cryptoType, setCryptoType] = useState(CRYPTO_OPTIONS[0]);
  const [walletAddress, setWalletAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleTransferClick = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!walletAddress) {
      setError('Please enter a wallet address');
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
  const executeTransfer = async () => {
    setIsPinModalOpen(false);
    setLoading(true);
    setError('');
    try {
      if (!user) throw new Error('Not authenticated');
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
        type: 'Transfer',
        amount: -numAmount,
        description: `Crypto Transfer (${cryptoType})`,
        recipient_details: {
          wallet: walletAddress,
          crypto: cryptoType
        },
        status: 'completed'
      }]
      );
      if (txError) throw txError;
      setSuccess(true);
      await refreshUser();
      // Reset form
      setWalletAddress('');
      setAmount('');
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <DashboardLayout title="Transfer Crypto" showBack>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mr-4">
              <Bitcoin className="w-6 h-6 text-[#0060AF]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Send Cryptocurrency
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
              Transfer successful!
            </div>
          }

          <form onSubmit={handleTransferClick} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cryptocurrency
              </label>
              <select
                value={cryptoType}
                onChange={(e) => setCryptoType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0060AF] focus:border-transparent outline-none">
                
                {CRYPTO_OPTIONS.map((opt) =>
                <option key={opt} value={opt}>
                    {opt}
                  </option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Wallet Address
              </label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Enter wallet address"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0060AF] focus:border-transparent outline-none font-mono text-sm" />
              
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0060AF] hover:bg-blue-800 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70">
              
              {loading ? 'Processing...' : 'Transfer Now'}
              {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
            </button>
          </form>
        </div>
      </div>

      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={executeTransfer} />
      
    </DashboardLayout>);

}