import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { TransactionReceipt } from '../components/TransactionReceipt';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { Transaction } from '../lib/types';
import {
  ArrowRightLeft,
  Download,
  Landmark,
  TrendingUp,
  Receipt } from
'lucide-react';
export function TransactionHistoryPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);
  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase.
      from('transactions').
      select('*').
      eq('user_id', user?.id).
      order('created_at', {
        ascending: false
      });
      if (error) throw error;
      if (data) setTransactions(data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };
  const getTxIcon = (type: string) => {
    switch (type) {
      case 'Transfer':
        return <ArrowRightLeft className="w-5 h-5 text-blue-500" />;
      case 'Deposit':
        return <Download className="w-5 h-5 text-green-500" />;
      case 'Withdrawal':
        return <Landmark className="w-5 h-5 text-gray-500" />;
      case 'Investment':
        return <TrendingUp className="w-5 h-5 text-purple-500" />;
      case 'Payment':
        return <Receipt className="w-5 h-5 text-orange-500" />;
      default:
        return <ArrowRightLeft className="w-5 h-5 text-gray-500" />;
    }
  };
  return (
    <DashboardLayout title="Transaction History" showBack>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              All Transactions
            </h2>
          </div>

          {loading ?
          <div className="p-12 text-center text-gray-500">
              Loading transactions...
            </div> :
          transactions.length === 0 ?
          <div className="p-12 text-center text-gray-500">
              No transactions found.
            </div> :

          <div className="divide-y divide-gray-100">
              {transactions.map((tx) =>
            <div
              key={tx.id}
              onClick={() => setSelectedTx(tx)}
              className="p-4 hover:bg-gray-50 cursor-pointer flex items-center justify-between transition-colors">
              
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                      {getTxIcon(tx.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {tx.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(tx.created_at).toLocaleDateString()} •{' '}
                        {tx.type}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                  className={`font-semibold ${tx.amount < 0 ? 'text-gray-900' : 'text-green-600'}`}>
                  
                      {tx.amount > 0 ? '+' : ''}
                      {tx.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">
                      {tx.status}
                    </p>
                  </div>
                </div>
            )}
            </div>
          }
        </div>
      </div>

      {selectedTx &&
      <TransactionReceipt
        tx={selectedTx}
        onClose={() => setSelectedTx(null)} />

      }
    </DashboardLayout>);

}