import React from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Building, Bitcoin, Gift, Smartphone } from 'lucide-react';
export function DepositPage() {
  return (
    <DashboardLayout title="Deposit Funds" showBack>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-light text-gray-900 mb-8">
          Select a deposit method
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a
            href="#/deposit/bank"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center hover:border-[#0060AF] hover:shadow-md transition-all group">
            
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mr-6 group-hover:bg-[#0060AF] transition-colors flex-shrink-0">
              <Building className="w-8 h-8 text-[#0060AF] group-hover:text-white transition-colors" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Bank Transfer
              </h3>
              <p className="text-gray-500 text-sm">
                View your account details for wire or ACH transfers.
              </p>
            </div>
          </a>

          <a
            href="#/deposit/crypto"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center hover:border-[#0060AF] hover:shadow-md transition-all group">
            
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mr-6 group-hover:bg-[#0060AF] transition-colors flex-shrink-0">
              <Bitcoin className="w-8 h-8 text-[#0060AF] group-hover:text-white transition-colors" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Deposit Cryptocurrency
              </h3>
              <p className="text-gray-500 text-sm">
                Fund your account using BTC, ETH, USDT, and more.
              </p>
            </div>
          </a>

          <a
            href="#/deposit/gift-card"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center hover:border-[#0060AF] hover:shadow-md transition-all group">
            
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mr-6 group-hover:bg-[#0060AF] transition-colors flex-shrink-0">
              <Gift className="w-8 h-8 text-[#0060AF] group-hover:text-white transition-colors" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Gift Card</h3>
              <p className="text-gray-500 text-sm">
                Redeem supported gift cards for account balance.
              </p>
            </div>
          </a>

          <a
            href="#/deposit/cashapp"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center hover:border-[#0060AF] hover:shadow-md transition-all group">
            
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mr-6 group-hover:bg-[#0060AF] transition-colors flex-shrink-0">
              <Smartphone className="w-8 h-8 text-[#0060AF] group-hover:text-white transition-colors" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Cash App</h3>
              <p className="text-gray-500 text-sm">
                Deposit funds directly via Cash App transfer.
              </p>
            </div>
          </a>
        </div>
      </div>
    </DashboardLayout>);

}