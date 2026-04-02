import React from 'react';
import { X, CheckCircle } from 'lucide-react';
import { Transaction } from '../lib/types';
interface TransactionReceiptProps {
  transaction: Transaction | null;
  onClose: () => void;
}
export function TransactionReceipt({
  transaction,
  onClose
}: TransactionReceiptProps) {
  if (!transaction) return null;
  const isPositive = ['Deposit', 'Investment'].includes(transaction.type);
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden">
        <div className="bg-[#0060AF] p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white">
            
            <X className="w-5 h-5" />
          </button>
          <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
          <h3 className="text-xl font-semibold mb-1">
            {transaction.type} Successful
          </h3>
          <p className="text-3xl font-bold">
            {isPositive ? '+' : '-'}$
            {Math.abs(transaction.amount).toLocaleString('en-US', {
              minimumFractionDigits: 2
            })}
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Date & Time
            </p>
            <p className="text-gray-900 font-medium">
              {new Date(transaction.created_at).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Description
            </p>
            <p className="text-gray-900 font-medium">
              {transaction.description}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Status
            </p>
            <p className="text-green-600 font-medium">{transaction.status}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Transaction ID
            </p>
            <p className="text-gray-900 font-mono text-sm">{transaction.id}</p>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded transition-colors">
            
            Close
          </button>
        </div>
      </div>
    </div>);

}