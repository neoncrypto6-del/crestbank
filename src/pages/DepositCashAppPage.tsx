import React, { useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { Smartphone, Upload, CheckCircle, Copy } from 'lucide-react';
export function DepositCashAppPage() {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const cashAppTag = user?.cashapp_tag || '$ChaseDeposit';
  const handleCopy = () => {
    navigator.clipboard.writeText(cashAppTag);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
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
    if (!file) {
      setError('Please upload a screenshot of the transfer');
      return;
    }
    setLoading(true);
    try {
      if (!user) throw new Error('Not authenticated');
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-cashapp-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.
      from('uploads').
      upload(fileName, file);
      if (uploadError) throw uploadError;
      const {
        data: { publicUrl }
      } = supabase.storage.from('uploads').getPublicUrl(fileName);
      const { error: insertError } = await supabase.
      from('transactions').
      insert([
      {
        user_id: user.id,
        type: 'Deposit',
        amount: parseFloat(amount),
        description: `Cash App deposit of ${parseFloat(amount).toFixed(2)}`,
        recipient_details: {
          proof_url: publicUrl,
          method: 'cashapp'
        },
        status: 'Pending'
      }]
      );
      if (insertError) throw insertError;
      setSuccess(true);
      setAmount('');
      setFile(null);
    } catch (err: any) {
      setError(err.message || 'Failed to submit deposit');
    } finally {
      setLoading(false);
    }
  };
  return (
    <DashboardLayout title="Cash App Deposit" showBack>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mr-4">
              <Smartphone className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Deposit via Cash App
              </h2>
              <p className="text-gray-500 text-sm">
                Send funds to our official tag
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
                Your deposit proof has been submitted. Funds will be credited
                once verified.
              </p>
              <button
              onClick={() => setSuccess(false)}
              className="bg-[#0060AF] hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
              
                Submit Another
              </button>
            </div> :

          <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Send funds to this Cash App tag:
                </p>
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-2xl font-bold text-green-600">
                    {cashAppTag}
                  </span>
                  <button
                  onClick={handleCopy}
                  className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-colors"
                  title="Copy tag">
                  
                    {copied ?
                  <CheckCircle className="w-5 h-5 text-green-600" /> :

                  <Copy className="w-5 h-5" />
                  }
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Include your username "{user?.username}" in the notes.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount Sent (USD)
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
                    Upload Payment Screenshot
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                    <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600 font-medium">
                      {file ? file.name : 'Click or drag screenshot to upload'}
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
            </div>
          }
        </div>
      </div>
    </DashboardLayout>);

}