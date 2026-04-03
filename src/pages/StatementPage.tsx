import React, { useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { Transaction } from '../lib/types';
import { FileText, Download, Search } from 'lucide-react';

export function StatementPage() {
  const { user } = useAuth();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !fromDate || !toDate) return;
    setLoading(true);
    setHasSearched(true);
    try {
      // Add 1 day to toDate to include the whole day
      const end = new Date(toDate);
      end.setDate(end.getDate() + 1);

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', new Date(fromDate).toISOString())
        .lt('created_at', end.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (err) {
      console.error('Error fetching statement:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    window.print();
  };

  // Calculate totals for the print section
  const totalIn = transactions
    .filter(tx => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalOut = transactions
    .filter(tx => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const currentBalance = user?.balance || 0;

  return (
    <DashboardLayout title="Account Statement" showBack>
      <div className="max-w-5xl mx-auto">
        {/* Print-only header with totals */}
        <div className="hidden print:block mb-8 border-b-2 border-[#117A3E] pb-6">
          <div className="flex justify-between items-start">
            <img
              src="/chasebank.png"
              alt="Crest"
              className="h-8" />
            <div className="text-right">
              <h1 className="text-2xl font-bold text-[#117A3E]">
                Account Statement
              </h1>
              <p className="text-gray-600">
                Period: {fromDate} to {toDate}
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-gray-900">Account Holder</h3>
              <p>{user?.full_name}</p>
              <p>{user?.address}</p>
            </div>
            <div className="text-right">
              <h3 className="font-bold text-gray-900">Account Details</h3>
              <p>Account: {user?.account_number}</p>
              <p>Routing: {user?.routing_number}</p>
              <p>Type: {user?.account_type}</p>
            </div>
          </div>

          {/* Summary Section for PDF */}
          <div className="mt-10 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Statement Summary</h3>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-sm text-gray-500">Total Money In</p>
                <p className="text-2xl font-bold text-green-600">
                  +${totalIn.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Money Out</p>
                <p className="text-2xl font-bold text-red-600">
                  -${totalOut.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Balance</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${currentBalance.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls (hidden on print) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 print:hidden">
          <form
            onSubmit={handleGenerate}
            className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#117A3E] focus:border-transparent outline-none" />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#117A3E] focus:border-transparent outline-none" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto bg-[#117A3E] hover:bg-[#0e6332] text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 h-[50px]">
              {loading ? (
                'Loading...'
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" /> Generate
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        {hasSearched && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print:border-none print:shadow-none">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center print:hidden">
              <h3 className="text-lg font-semibold text-gray-900">
                Statement Results
              </h3>
              {transactions.length > 0 && (
                <button
                  onClick={handleDownload}
                  className="text-[#117A3E] hover:text-[#0e6332] font-medium flex items-center">
                  <Download className="w-5 h-5 mr-1" /> Download PDF
                </button>
              )}
            </div>

            {transactions.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No transactions found for the selected period.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                      <th className="p-4 font-medium border-b border-gray-200">
                        Date
                      </th>
                      <th className="p-4 font-medium border-b border-gray-200">
                        Description
                      </th>
                      <th className="p-4 font-medium border-b border-gray-200">
                        Type
                      </th>
                      <th className="p-4 font-medium border-b border-gray-200 text-right">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {transactions.map((tx) => (
                      <tr
                        key={tx.id}
                        className="hover:bg-gray-50 print:hover:bg-transparent">
                        <td className="p-4 text-sm text-gray-900 whitespace-nowrap">
                          {new Date(tx.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-sm text-gray-900">
                          {tx.description}
                        </td>
                        <td className="p-4 text-sm text-gray-500">{tx.type}</td>
                        <td
                          className={`p-4 text-sm font-medium text-right whitespace-nowrap ${tx.amount < 0 ? 'text-gray-900' : 'text-green-600'}`}>
                          {tx.amount > 0 ? '+' : ''}
                          {tx.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
