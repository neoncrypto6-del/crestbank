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
      const end = new Date(toDate);
      end.setDate(end.getDate() + 1);

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', new Date(fromDate).toISOString())
        .lt('created_at', end.toISOString())
        .order('created_at', { ascending: true });

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

  /* ---------------------- STATEMENT CALCULATIONS ---------------------- */

  const totalIn = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOut = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const openingBalance = 0;

  const runningTransactions = transactions.map((tx, index) => {
    const previousBalance =
      index === 0
        ? openingBalance
        : runningTransactionsTemp[index - 1].balance;

    const balance = previousBalance + tx.amount;

    return {
      ...tx,
      balance,
    };
  });

  const runningTransactionsTemp: any[] = [];
  transactions.forEach((tx) => {
    const previous =
      runningTransactionsTemp.length === 0
        ? openingBalance
        : runningTransactionsTemp[runningTransactionsTemp.length - 1].balance;

    runningTransactionsTemp.push({
      ...tx,
      balance: previous + tx.amount,
    });
  });

  const closingBalance =
    runningTransactionsTemp.length > 0
      ? runningTransactionsTemp[runningTransactionsTemp.length - 1].balance
      : 0;

  return (
    <DashboardLayout title="Account Statement" showBack>
      <div className="max-w-5xl mx-auto">

        {/* PRINT HEADER */}

        <div className="hidden print:block mb-8 border-b-2 border-[#117A3E] pb-6">

          <div className="flex justify-between items-start">

            <img
              src="/chasebank.png"
              alt="Crest"
              className="h-8"
            />

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

              <h3 className="font-bold text-gray-900">
                Account Holder
              </h3>

              <p>{user?.full_name}</p>
              <p>{user?.address}</p>

            </div>

            <div className="text-right">

              <h3 className="font-bold text-gray-900">
                Account Details
              </h3>

              <p>Account: {user?.account_number}</p>
              <p>Routing: {user?.routing_number}</p>
              <p>Type: {user?.account_type}</p>

            </div>

          </div>

        </div>

        {/* CONTROLS */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 print:hidden">

          <form
            onSubmit={handleGenerate}
            className="flex flex-col md:flex-row gap-4 items-end"
          >

            <div className="flex-1 w-full">

              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Date
              </label>

              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg"
              />

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
                className="w-full p-3 border border-gray-300 rounded-lg"
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto bg-[#117A3E] text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center"
            >

              {loading ? 'Loading...' : (
                <>
                  <Search className="w-5 h-5 mr-2"/>
                  Generate
                </>
              )}

            </button>

          </form>

        </div>

        {/* RESULTS */}

        {hasSearched && (

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print:border-none print:shadow-none">

            <div className="p-6 border-b flex justify-between items-center print:hidden">

              <h3 className="text-lg font-semibold text-gray-900">
                Statement Results
              </h3>

              {transactions.length > 0 && (

                <button
                  onClick={handleDownload}
                  className="text-[#117A3E] font-medium flex items-center"
                >

                  <Download className="w-5 h-5 mr-1"/>
                  Download PDF

                </button>

              )}

            </div>

            {/* SUMMARY */}

            {transactions.length > 0 && (

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-b">

                <div>
                  <p className="text-sm text-gray-500">Opening Balance</p>
                  <p className="font-bold">${openingBalance.toFixed(2)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Money In</p>
                  <p className="font-bold text-green-600">
                    +${totalIn.toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Money Out</p>
                  <p className="font-bold text-red-600">
                    -${totalOut.toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Closing Balance</p>
                  <p className="font-bold text-[#117A3E]">
                    ${closingBalance.toFixed(2)}
                  </p>
                </div>

              </div>

            )}

            {/* TABLE */}

            {transactions.length === 0 ? (

              <div className="p-12 text-center text-gray-500">

                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300"/>

                <p>No transactions found for the selected period.</p>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full text-left border-collapse">

                  <thead>

                    <tr className="bg-gray-50 text-gray-600 text-sm uppercase">

                      <th className="p-4 border-b">Date</th>
                      <th className="p-4 border-b">Description</th>
                      <th className="p-4 border-b">Type</th>
                      <th className="p-4 border-b text-right">Amount</th>
                      <th className="p-4 border-b text-right">Balance</th>

                    </tr>

                  </thead>

                  <tbody className="divide-y">

                    {runningTransactionsTemp.map((tx) => (

                      <tr key={tx.id}>

                        <td className="p-4 text-sm">
                          {new Date(tx.created_at).toLocaleDateString()}
                        </td>

                        <td className="p-4 text-sm">
                          {tx.description}
                        </td>

                        <td className="p-4 text-sm">
                          {tx.type}
                        </td>

                        <td
                          className={`p-4 text-right font-medium ${
                            tx.amount > 0
                              ? 'text-green-600'
                              : 'text-gray-900'
                          }`}
                        >

                          {tx.amount > 0 ? '+' : ''}
                          {tx.amount.toFixed(2)}

                        </td>

                        <td className="p-4 text-right font-semibold">

                          ${tx.balance.toFixed(2)}

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
