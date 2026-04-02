import React, { useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { PinModal } from '../components/PinModal';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { Building, Bitcoin } from 'lucide-react';
export function TransferPage() {
  return (
    <DashboardLayout title="Transfer Funds" showBack>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-light text-gray-900 mb-8">
          Where would you like to transfer?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a
            href="#/transfer/bank"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col items-center hover:border-[#0060AF] hover:shadow-md transition-all group">
            
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#0060AF] transition-colors">
              <Building className="w-10 h-10 text-[#0060AF] group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Transfer to Bank
            </h3>
            <p className="text-gray-500 text-center text-sm">
              Send money to any domestic bank account securely.
            </p>
          </a>

          <a
            href="#/transfer/crypto"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col items-center hover:border-[#0060AF] hover:shadow-md transition-all group">
            
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#0060AF] transition-colors">
              <Bitcoin className="w-10 h-10 text-[#0060AF] group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Transfer Crypto
            </h3>
            <p className="text-gray-500 text-center text-sm">
              Send funds to an external cryptocurrency wallet.
            </p>
          </a>
        </div>
      </div>
    </DashboardLayout>);

}
export function TransferBankPage() {
  const { user, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    accountName: '',
    amount: ''
  });
  const [showPin, setShowPin] = useState(false);
  const [status, setStatus] = useState({
    type: '',
    message: ''
  });
  const handleTransfer = async () => {
    const amount = parseFloat(formData.amount);
    if (amount > (user?.balance || 0)) {
      setStatus({
        type: 'error',
        message: 'Insufficient funds'
      });
      return;
    }
    try {
      // Deduct balance
      await supabase.
      from('users').
      update({
        balance: (user?.balance || 0) - amount
      }).
      eq('id', user?.id);
      // Create transaction
      await supabase.from('transactions').insert([
      {
        user_id: user?.id,
        type: 'Transfer',
        amount: -amount,
        description: `Transfer to ${formData.bankName} - ${formData.accountName}`,
        recipient_details: formData,
        status: 'Completed'
      }]
      );
      await refreshUser();
      setStatus({
        type: 'success',
        message: 'Transfer successful!'
      });
      setFormData({
        bankName: '',
        accountNumber: '',
        routingNumber: '',
        accountName: '',
        amount: ''
      });
    } catch (err) {
      setStatus({
        type: 'error',
        message: 'Transfer failed. Please try again.'
      });
    }
  };
  return (
    <DashboardLayout title="Bank Transfer" showBack>
      <PinModal
        isOpen={showPin}
        onClose={() => setShowPin(false)}
        onSuccess={() => {
          setShowPin(false);
          handleTransfer();
        }} />
      
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Domestic Bank Transfer
        </h2>

        {status.message &&
        <div
          className={`p-4 rounded mb-6 ${status.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          
            {status.message}
          </div>
        }

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setShowPin(true);
          }}
          className="space-y-5">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bank Name
            </label>
            <input
              type="text"
              required
              value={formData.bankName}
              onChange={(e) =>
              setFormData({
                ...formData,
                bankName: e.target.value
              })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 focus:border-[#0060AF] focus:outline-none" />
            
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Holder Name
            </label>
            <input
              type="text"
              required
              value={formData.accountName}
              onChange={(e) =>
              setFormData({
                ...formData,
                accountName: e.target.value
              })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 focus:border-[#0060AF] focus:outline-none" />
            
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Number
              </label>
              <input
                type="text"
                required
                value={formData.accountNumber}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  accountNumber: e.target.value
                })
                }
                className="w-full border border-gray-300 rounded px-3 py-2 focus:border-[#0060AF] focus:outline-none" />
              
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Routing Number
              </label>
              <input
                type="text"
                required
                value={formData.routingNumber}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  routingNumber: e.target.value
                })
                }
                className="w-full border border-gray-300 rounded px-3 py-2 focus:border-[#0060AF] focus:outline-none" />
              
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount ($)
            </label>
            <input
              type="number"
              min="1"
              step="0.01"
              required
              value={formData.amount}
              onChange={(e) =>
              setFormData({
                ...formData,
                amount: e.target.value
              })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 focus:border-[#0060AF] focus:outline-none text-xl" />
            
            <p className="text-xs text-gray-500 mt-1">
              Available balance: ${user?.balance.toLocaleString()}
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-[#0060AF] hover:bg-blue-800 text-white font-semibold py-3 rounded transition-colors mt-4">
            
            Transfer Funds
          </button>
        </form>
      </div>
    </DashboardLayout>);

}