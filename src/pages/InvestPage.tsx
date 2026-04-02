import React, { useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { PinModal } from '../components/PinModal';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { TrendingUp, ArrowRight } from 'lucide-react';
const CRYPTO_ASSETS = [
{
  name: 'Bitcoin',
  symbol: 'BTC',
  price: 67500.0
},
{
  name: 'Ethereum',
  symbol: 'ETH',
  price: 3450.0
},
{
  name: 'Solana',
  symbol: 'SOL',
  price: 145.0
},
{
  name: 'BNB',
  symbol: 'BNB',
  price: 580.0
},
{
  name: 'Tether',
  symbol: 'USDT',
  price: 1.0
},
{
  name: 'USD Coin',
  symbol: 'USDC',
  price: 1.0
},
{
  name: 'Dogecoin',
  symbol: 'DOGE',
  price: 0.15
},
{
  name: 'Tron',
  symbol: 'TRX',
  price: 0.12
},
{
  name: 'XRP',
  symbol: 'XRP',
  price: 0.62
},
{
  name: 'Litecoin',
  symbol: 'LTC',
  price: 85.0
}];

export function InvestPage() {
  const { user, refreshUser } = useAuth();
  const [selectedAsset, setSelectedAsset] = useState<
    (typeof CRYPTO_ASSETS)[0] | null>(
    null);
  const [amount, setAmount] = useState('');
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleInvestClick = (asset: (typeof CRYPTO_ASSETS)[0]) => {
    setSelectedAsset(asset);
    setAmount('');
    setError('');
    setSuccess(false);
  };
  const handleConfirmClick = () => {
    setError('');
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
  const executeInvestment = async () => {
    setIsPinModalOpen(false);
    setLoading(true);
    setError('');
    try {
      if (!user || !selectedAsset)
      throw new Error('Not authenticated or no asset selected');
      const numAmount = parseFloat(amount);
      const newBalance = user.balance - numAmount;
      const cryptoAmount = numAmount / selectedAsset.price;
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
        type: 'Investment',
        amount: -numAmount,
        description: `Purchased ${cryptoAmount.toFixed(6)} ${selectedAsset.symbol}`,
        recipient_details: {
          asset: selectedAsset.symbol,
          price: selectedAsset.price
        },
        status: 'completed'
      }]
      );
      if (txError) throw txError;
      setSuccess(true);
      await refreshUser();
      setTimeout(() => {
        setSuccess(false);
        setSelectedAsset(null);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Investment failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <DashboardLayout title="Investments" showBack>
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#003A70] rounded-xl p-8 text-white mb-8 shadow-md">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-8 h-8 mr-3 text-blue-300" />
            <h2 className="text-2xl font-semibold">
              Crypto Self-Directed Investing
            </h2>
          </div>
          <p className="text-blue-100 max-w-2xl">
            Take control of your portfolio. Trade commission-free online and
            access a wide range of digital assets directly from your Crest
            account.
          </p>
        </div>

        {selectedAsset ?
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Buy {selectedAsset.name}
                </h3>
                <p className="text-gray-500">{selectedAsset.symbol}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Current Price</p>
                <p className="text-xl font-bold text-gray-900">
                  $
                  {selectedAsset.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2
                })}
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
                Investment successful!
              </div>
          }

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount to Invest (USD)
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
                  className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0060AF] focus:border-transparent outline-none text-lg" />
                
                </div>
                {amount && !isNaN(parseFloat(amount)) &&
              <p className="text-sm text-gray-500 mt-2">
                    Estimated:{' '}
                    {(parseFloat(amount) / selectedAsset.price).toFixed(6)}{' '}
                    {selectedAsset.symbol}
                  </p>
              }
              </div>

              <div className="flex space-x-4">
                <button
                onClick={() => setSelectedAsset(null)}
                className="flex-1 bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors">
                
                  Cancel
                </button>
                <button
                onClick={handleConfirmClick}
                disabled={loading || !amount}
                className="flex-1 bg-[#0060AF] hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-70">
                
                  {loading ? 'Processing...' : 'Confirm Purchase'}
                </button>
              </div>
            </div>
          </div> :

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CRYPTO_ASSETS.map((asset) =>
          <div
            key={asset.symbol}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex justify-between items-center hover:border-[#0060AF] transition-colors">
            
                <div>
                  <h4 className="font-semibold text-gray-900">{asset.name}</h4>
                  <p className="text-sm text-gray-500">{asset.symbol}</p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <p className="font-medium text-gray-900 mb-2">
                    $
                    {asset.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
                  </p>
                  <button
                onClick={() => handleInvestClick(asset)}
                className="text-sm bg-blue-50 text-[#0060AF] hover:bg-[#0060AF] hover:text-white font-medium py-1.5 px-4 rounded-full transition-colors">
                
                    Trade
                  </button>
                </div>
              </div>
          )}
          </div>
        }
      </div>

      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={executeInvestment} />
      
    </DashboardLayout>);

}
