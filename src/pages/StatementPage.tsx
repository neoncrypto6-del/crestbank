import React, { useState } from 'react'
import { DashboardLayout } from '../components/DashboardLayout'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { Transaction } from '../lib/types'
import { FileText, Download, Search } from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export function StatementPage() {
  const { user } = useAuth()

  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [openingBalance, setOpeningBalance] = useState(0)

  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const totalIn = transactions
    .filter((tx) => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0)

  const totalOut = transactions
    .filter((tx) => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0)

  const closingBalance = openingBalance + totalIn - totalOut

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !fromDate || !toDate) return

    setLoading(true)
    setHasSearched(true)

    try {
      const start = new Date(fromDate)
      const end = new Date(toDate)
      end.setDate(end.getDate() + 1)

      // Fetch transactions within range
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', start.toISOString())
        .lt('created_at', end.toISOString())
        .order('created_at', { ascending: true })

      if (error) throw error

      setTransactions(data || [])

      // Fetch transactions BEFORE start date to compute opening balance
      const { data: previous } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', user.id)
        .lt('created_at', start.toISOString())

      const opening =
        previous?.reduce((sum, tx) => sum + tx.amount, 0) || 0

      setOpeningBalance(opening)

    } catch (err) {
      console.error('Statement error', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    const doc = new jsPDF()

    let runningBalance = openingBalance

    const rows = transactions.map((tx) => {
      runningBalance += tx.amount

      return [
        new Date(tx.created_at).toLocaleDateString(),
        tx.description,
        tx.type,
        tx.amount > 0 ? `+${tx.amount.toFixed(2)}` : tx.amount.toFixed(2),
        runningBalance.toFixed(2),
      ]
    })

    doc.setFontSize(18)
    doc.text('Account Statement', 14, 20)

    doc.setFontSize(11)
    doc.text(`Account Holder: ${user?.full_name}`, 14, 30)
    doc.text(`Account Number: ${user?.account_number}`, 14, 36)
    doc.text(`Routing Number: ${user?.routing_number}`, 14, 42)
    doc.text(`Statement Period: ${fromDate} to ${toDate}`, 14, 48)

    doc.text(`Opening Balance: $${openingBalance.toFixed(2)}`, 14, 60)
    doc.text(`Total Money In: $${totalIn.toFixed(2)}`, 14, 66)
    doc.text(`Total Money Out: $${totalOut.toFixed(2)}`, 14, 72)
    doc.text(`Closing Balance: $${closingBalance.toFixed(2)}`, 14, 78)

    autoTable(doc, {
      startY: 90,
      head: [['Date', 'Description', 'Type', 'Amount', 'Balance']],
      body: rows,
    })

    doc.save(`statement-${fromDate}-to-${toDate}.pdf`)
  }

  return (
    <DashboardLayout title="Account Statement" showBack>
      <div className="max-w-5xl mx-auto">

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">

          <form
            onSubmit={handleGenerate}
            className="flex flex-col md:flex-row gap-4 items-end">

            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">
                From Date
              </label>

              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                required
                className="w-full p-3 border rounded-lg"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">
                To Date
              </label>

              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                required
                className="w-full p-3 border rounded-lg"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#117A3E] text-white py-3 px-6 rounded-lg flex items-center">

              {loading ? 'Loading...' : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Generate
                </>
              )}

            </button>

          </form>

        </div>

        {hasSearched && (

          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

            <div className="p-6 border-b flex justify-between items-center">

              <h3 className="text-lg font-semibold">
                Statement Results
              </h3>

              {transactions.length > 0 && (
                <button
                  onClick={handleDownload}
                  className="text-[#117A3E] flex items-center">

                  <Download className="w-5 h-5 mr-2" />
                  Download PDF

                </button>
              )}

            </div>

            {transactions.length === 0 ? (

              <div className="p-12 text-center text-gray-500">

                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No transactions found.</p>

              </div>

            ) : (

              <div className="p-6 space-y-4">

                {/* Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm text-gray-500">Opening Balance</p>
                    <p className="font-bold">${openingBalance.toFixed(2)}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm text-gray-500">Total In</p>
                    <p className="font-bold text-green-600">
                      +${totalIn.toFixed(2)}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm text-gray-500">Total Out</p>
                    <p className="font-bold text-red-600">
                      -${totalOut.toFixed(2)}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm text-gray-500">Closing Balance</p>
                    <p className="font-bold text-[#117A3E]">
                      ${closingBalance.toFixed(2)}
                    </p>
                  </div>

                </div>

                {/* Table */}
                <table className="w-full text-left">

                  <thead>
                    <tr className="border-b">

                      <th className="p-3">Date</th>
                      <th className="p-3">Description</th>
                      <th className="p-3">Type</th>
                      <th className="p-3 text-right">Amount</th>

                    </tr>
                  </thead>

                  <tbody>

                    {transactions.map((tx) => (

                      <tr key={tx.id} className="border-b">

                        <td className="p-3">
                          {new Date(tx.created_at).toLocaleDateString()}
                        </td>

                        <td className="p-3">{tx.description}</td>

                        <td className="p-3">{tx.type}</td>

                        <td className="p-3 text-right">

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
  )
}
