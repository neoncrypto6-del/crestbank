import React, { useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { Gift, Upload, CheckCircle } from 'lucide-react';
const CARD_TYPES = [
'Amazon',
'Apple',
'Google Play',
'Steam',
'iTunes',
'Walmart',
'Target',
'eBay',
'Visa',
'Mastercard'];

export function DepositGiftCardPage() {
  const { user } = useAuth();
  const [cardType, setCardType] = useState(CARD_TYPES[0]);
  const [amount, setAmount] = useState('');
  const [code, setCode] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (!code && !file) {
      setError('Please provide either the card code or upload an image');
      return;
    }
    setLoading(true);
    try {
      if (!user) throw new Error('Not authenticated');
      let imageUrl = '';
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-giftcard-${Date.now()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage.
        from('uploads').
        upload(fileName, file);
        if (uploadError) throw uploadError;
        const {
          data: { publicUrl }
        } = supabase.storage.from('uploads').getPublicUrl(fileName);
        imageUrl = publicUrl;
      }
      const { error: insertError } = await supabase.
      from('transactions').
      insert([
      {
        user_id: user.id,
        type: 'Deposit',
        amount: parseFloat(amount),
        description: `${cardType} gift card deposit of ${parseFloat(amount).toFixed(2)}`,
        recipient_details: {
          card_type: cardType,
          card_code: code,
          image_url: imageUrl,
          method: 'giftcard'
        },
        status: 'Pending'
      }]
      );
      if (insertError) throw insertError;
      setSuccess(true);
      setAmount('');
      setCode('');
      setFile(null);
    } catch (err: any) {
      setError(err.message || 'Failed to submit gift card');
    } finally {
      setLoading(false);
    }
  };
  return (
    <DashboardLayout title="Gift Card Deposit" showBack>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mr-4">
              <Gift className="w-6 h-6 text-[#0060AF]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Deposit via Gift Card
              </h2>
              <p className="text-gray-500 text-sm">
                Funds will be credited after verification
              </p>
            </div>
          </div>

          {error &&
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          }

          {success ?
          <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Submitted Successfully
              </h3>
              <p className="text-gray-600 mb-6">
                Your gift card has been submitted for review. Funds will be
                credited to your account once verified.
              </p>
              <button
              onClick={() => setSuccess(false)}
              className="bg-[#0060AF] hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
              
                Submit Another
              </button>
            </div> :

          <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gift Card Type
                </label>
                <select
                value={cardType}
                onChange={(e) => setCardType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0060AF] focus:border-transparent outline-none">
                
                  {CARD_TYPES.map((opt) =>
                <option key={opt} value={opt}>
                      {opt}
                    </option>
                )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Value (USD)
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Code / PIN (Optional if uploading image)
                </label>
                <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter the claim code or PIN"
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0060AF] focus:border-transparent outline-none font-mono text-sm" />
              
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Card Image (Front & Back)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                  <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600 font-medium">
                    {file ? file.name : 'Click or drag image to upload'}
                  </span>
                </div>
              </div>

              <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0060AF] hover:bg-blue-800 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70">
              
                {loading ? 'Submitting...' : 'Submit for Review'}
              </button>
            </form>
          }
        </div>
      </div>
    </DashboardLayout>);

}