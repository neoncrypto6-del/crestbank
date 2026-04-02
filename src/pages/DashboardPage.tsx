import React, { useCallback, useEffect, useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { TransactionReceipt } from '../components/TransactionReceipt';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { Transaction } from '../lib/types';
import {
  ArrowRightLeft,
  Download,
  CreditCard,
  Landmark,
  TrendingUp,
  Receipt,
  FileText,
  Settings,
  Upload,
  Bell } from
'lucide-react';
import { WelcomeOverlay } from '../components/WelcomeOverlay';
export function DashboardPage() {
  const { user, refreshUser } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const fetchTransactions = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase.
      from('transactions').
      select('*').
      eq('user_id', userId).
      order('created_at', {
        ascending: false
      }).
      limit(20);
      if (error) {
        console.error('Error fetching transactions:', error);
        return;
      }
      setTransactions(data || []);
    } catch (err) {
      console.error('Transaction fetch failed:', err);
    }
  }, []);
  const fetchNotifications = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase.
      from('notifications').
      select('*').
      eq('user_id', userId).
      eq('read', false).
      order('created_at', {
        ascending: false
      }).
      limit(5);
      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }
      setNotifications(data || []);
    } catch (err) {
      console.error('Notification fetch failed:', err);
    }
  }, []);
  useEffect(() => {
    if (!user?.id) return;
    const userId = user.id;
    // Initial fetch
    fetchTransactions(userId);
    fetchNotifications(userId);
    refreshUser();
    // Realtime: transactions
    const txChannel = supabase.
    channel(`tx-${userId}`).
    on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'transactions',
        filter: `user_id=eq.${userId}`
      },
      () => {
        fetchTransactions(userId);
        refreshUser();
      }
    ).
    subscribe();
    // Realtime: user table (balance changes)
    const userChannel = supabase.
    channel(`user-${userId}`).
    on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'users',
        filter: `id=eq.${userId}`
      },
      () => {
        refreshUser();
        fetchTransactions(userId);
      }
    ).
    subscribe();
    // Realtime: new notifications
    const notifChannel = supabase.
    channel(`notif-${userId}`).
    on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        setNotifications((prev) => [payload.new, ...prev].slice(0, 5));
      }
    ).
    subscribe();
    return () => {
      supabase.removeChannel(txChannel);
      supabase.removeChannel(userChannel);
      supabase.removeChannel(notifChannel);
    };
  }, [user?.id]);
  if (!user) return null;
  const actions = [
  {
    name: 'Transfer',
    icon: ArrowRightLeft,
    link: '#/transfer'
  },
  {
    name: 'Deposit',
    icon: Download,
    link: '#/deposit'
  },
  {
    name: 'Cards',
    icon: CreditCard,
    link: '#/cards'
  },
  {
    name: 'Loan',
    icon: Landmark,
    link: '#/loan'
  },
  {
    name: 'Invest',
    icon: TrendingUp,
    link: '#/invest'
  },
  {
    name: 'Bills',
    icon: Receipt,
    link: '#/bills'
  },
  {
    name: 'Statement',
    icon: FileText,
    link: '#/statement'
  },
  {
    name: 'Settings',
    icon: Settings,
    link: '#/settings'
  }];

  const getTxIcon = (type?: string) => {
    const lower = type?.toLowerCase() || '';
    if (lower.includes('deposit') || lower.includes('investment'))
    return <Download className="w-5 h-5" />;
    if (lower.includes('transfer') || lower.includes('withdrawal'))
    return <ArrowRightLeft className="w-5 h-5" />;
    if (lower.includes('admin_deposit')) return <Download className="w-5 h-5" />;
    if (lower.includes('admin_withdrawal'))
    return <Upload className="w-5 h-5" />;
    return <CreditCard className="w-5 h-5" />;
  };
  return (
    <DashboardLayout>
      <WelcomeOverlay />
      <TransactionReceipt
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)} />
      

      {/* Notifications banner */}
      {notifications.length > 0 &&
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <Bell className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-blue-900">
              {notifications[0].message}
            </p>
            {notifications.length > 1 &&
          <p className="text-sm text-blue-700 mt-1">
                +{notifications.length - 1} more notifications
              </p>
          }
          </div>
          <button
          onClick={async () => {
            await supabase.
            from('notifications').
            update({
              read: true
            }).
            eq('user_id', user.id).
            in(
              'id',
              notifications.map((n) => n.id)
            );
            setNotifications([]);
          }}
          className="text-sm text-blue-700 hover:underline whitespace-nowrap">
          
            Mark read
          </button>
        </div>
      }

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Balance & Actions */}
        <div className="lg:col-span-2 space-y-8">
          {/* Greeting & Balance Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-light text-gray-900">
                  Welcome, {user.full_name.split(' ')[0]}!
                </h1>
                <div className="mt-2 inline-block bg-blue-100 text-[#0060AF] text-xs font-semibold px-2.5 py-1 rounded-full">
                  {user.account_type}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Account Number</p>
                <p className="font-mono text-gray-900">
                  ...{user.account_number?.slice(-4) || '••••'}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">
                Available Balance
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                $
                {user.balance.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </h2>
            </div>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <a
                  key={action.name}
                  href={action.link}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 flex flex-col items-center justify-center hover:border-[#0060AF] hover:shadow-md transition-all group">
                  
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-2 group-hover:bg-[#0060AF] transition-colors">
                    <Icon className="w-5 h-5 text-[#0060AF] group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-xs font-medium text-gray-700 group-hover:text-[#0060AF] text-center">
                    {action.name}
                  </span>
                </a>);

            })}
          </div>
        </div>

        {/* Right Column: Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-full max-h-[800px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Transactions
            </h3>
            <a
              href="#/transactions"
              className="text-sm text-[#0060AF] hover:underline font-medium">
              
              See All
            </a>
          </div>

          <div className="flex-grow flex flex-col space-y-3 overflow-y-auto pr-2">
            {transactions.length === 0 ?
            <div className="flex-grow flex items-center justify-center text-gray-500 text-sm py-8">
                No recent transactions
              </div> :

            transactions.map((tx) => {
              const isPositive = [
              'deposit',
              'investment',
              'admin_deposit'].
              some((t) => tx.type?.toLowerCase().includes(t));
              return (
                <div
                  key={tx.id}
                  onClick={() => setSelectedTx(tx)}
                  className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                  
                    <div className="flex items-center">
                      <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 ${isPositive ? 'bg-green-100 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      
                        {getTxIcon(tx.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm line-clamp-1">
                          {tx.description || tx.type}
                        </p>
                        <div className="flex items-center mt-1 space-x-2">
                          <p className="text-xs text-gray-500">
                            {new Date(tx.created_at).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                          </p>
                          <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${tx.status?.toLowerCase() === 'completed' || !tx.status ? 'bg-green-100 text-green-700' : tx.status?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                          
                            {tx.status || 'Completed'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                    className={`font-semibold ml-4 whitespace-nowrap ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    
                      {isPositive ? '+' : '-'}$
                      {Math.abs(tx.amount).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                    </div>
                  </div>);

            })
            }
          </div>
        </div>
      </div>
    </DashboardLayout>);

}