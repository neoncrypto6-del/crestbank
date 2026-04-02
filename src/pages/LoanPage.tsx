import React, { useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { Landmark, CheckCircle } from 'lucide-react';
const LOAN_TYPES = [
'Personal Loan',
'Auto Loan',
'Home Loan',
'Business Loan',
'Student Loan'];

const DURATIONS = [
'6 months',
'12 months',
'24 months',
'36 months',
'48 months',
'60 months'];

export function LoanPage() {
  const { user } = useAuth();
  const [loanType, setLoanType] = useState(LOAN_TYPES[0]);
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState(DURATIONS[2]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid loan amount');
      return;
    }
    setLoading(true);
    try {
      if (!user) throw new Error('Not authenticated');
      const { error: insertError } = await supabase.
      from('loan_applications').
      insert([
      {
        user_id: user.id,
        loan_type: loanType,
        amount: parseFloat(amount),
        duration: duration,
        status: 'pending'
      }]
      );
      if (insertError) throw insertError;
      setSuccess(true);
      setAmount('');
    } catch (err: any) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };
  return (
    <DashboardLayout title="Loan Application" showBack>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-[#003A70] p-8 text-white">
            <h2 className="text-2xl font-semibold mb-2">Chase Loans</h2>
            <p className="text-blue-100">
              Flexible financing options tailored to your needs with competitive
              rates.
            </p>
          </div>

          <div className="p-6 md:p-8">
            {error &&
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            }

            {success ?
            <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Application Submitted
                </h3>
                <p className="text-gray-600 mb-6">
                  Your loan application is under review. A representative will
                  contact you shortly.
                </p>
                <button
                onClick={() => setSuccess(false)}
                className="bg-[#0060AF] hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
                
                  Apply for Another Loan
                </button>
              </div> :

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Type
                  </label>
                  <select
                  value={loanType}
                  onChange={(e) => setLoanType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0060AF] focus:border-transparent outline-none">
                  
                    {LOAN_TYPES.map((opt) =>
                  <option key={opt} value={opt}>
                        {opt}
                      </option>
                  )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requested Amount (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                    type="number"
                    step="100"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="10000"
                    className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0060AF] focus:border-transparent outline-none" />
                  
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Repayment Duration
                  </label>
                  <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0060AF] focus:border-transparent outline-none">
                  
                    {DURATIONS.map((opt) =>
                  <option key={opt} value={opt}>
                        {opt}
                      </option>
                  )}
                  </select>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-600">
                  <p>
                    By submitting this application, you authorize Chase to
                    review your credit history and verify the information
                    provided.
                  </p>
                </div>

                <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0060AF] hover:bg-blue-800 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70">
                
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            }
          </div>
        </div>
      </div>
    </DashboardLayout>);

}