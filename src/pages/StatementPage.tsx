import React, { useState } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { useAuth } from "../lib/auth";
import { supabase } from "../lib/supabase";
import { FileText, Download, Search } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface Transaction {
  id: string;
  description: string;
  type: string;
  amount: number;
  created_at: string;
}

export function StatementPage() {
  const { user } = useAuth();

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [openingBalance, setOpeningBalance] = useState(0);

  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const totalIn = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOut = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const closingBalance = openingBalance + totalIn - totalOut;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !fromDate || !toDate) return;

    setLoading(true);
    setSearched(true);

    try {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      end.setDate(end.getDate() + 1);

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", (user as any).id)
        .gte("created_at", start.toISOString())
        .lt("created_at", end.toISOString())
        .order("created_at", { ascending: true });

      if (error) throw error;

      setTransactions(data || []);

      const { data: previous } = await supabase
        .from("transactions")
        .select("amount")
        .eq("user_id", (user as any).id)
        .lt("created_at", start.toISOString());

      const opening =
        previous?.reduce((sum: number, tx: any) => sum + tx.amount, 0) || 0;

      setOpeningBalance(opening);
    } catch (err) {
      console.error("Statement error:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    let runningBalance = openingBalance;

    const rows = transactions.map((tx) => {
      runningBalance += tx.amount;

      return [
        new Date(tx.created_at).toLocaleDateString(),
        tx.description,
        tx.type,
        tx.amount > 0 ? `+${tx.amount.toFixed(2)}` : tx.amount.toFixed(2),
        runningBalance.toFixed(2),
      ];
    });

    doc.setFontSize(18);
    doc.text("Account Statement", 14, 20);

    doc.setFontSize(11);

    doc.text(
      `Account Holder: ${(user as any)?.full_name || "Account Holder"}`,
      14,
      30
    );
    doc.text(
      `Account Number: ${(user as any)?.account_number || "0000000000"}`,
      14,
      36
    );
    doc.text(
      `Routing Number: ${(user as any)?.routing_number || "000000000"}`,
      14,
      42
    );

    doc.text(`Statement Period: ${fromDate} to ${toDate}`, 14, 48);

    doc.text(`Opening Balance: $${openingBalance.toFixed(2)}`, 14, 60);
    doc.text(`Total Money In: $${totalIn.toFixed(2)}`, 14, 66);
    doc.text(`Total Money Out: $${totalOut.toFixed(2)}`, 14, 72);
    doc.text(`Closing Balance: $${closingBalance.toFixed(2)}`, 14, 78);

    (doc as any).autoTable({
      startY: 90,
      head: [["Date", "Description", "Type", "Amount", "Balance"]],
      body: rows,
    });

    doc.save(`statement-${fromDate}-to-${toDate}.pdf`);
  };

  return (
    <DashboardLayout title="Account Statement" showBack>
      <div className="max-w-5xl mx-auto">
        {/* Statement Form */}

        <div className="bg-white border rounded-xl p-6 mb-8">
          <form
            onSubmit={handleGenerate}
            className="flex flex-col md:flex-row gap-4 items-end"
          >
            <div className="flex-1">
              <label className="text-sm font-medium block mb-2">
                From Date
              </label>

              <input
                type="date"
                required
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full border p-3 rounded-lg"
              />
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium block mb-2">
                To Date
              </label>

              <input
                type="date"
                required
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full border p-3 rounded-lg"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#117A3E] text-white px-6 py-3 rounded-lg flex items-center"
            >
              <Search className="w-5 h-5 mr-2" />
              {loading ? "Loading..." : "Generate"}
            </button>
          </form>
        </div>

        {/* Results */}

        {searched && (
          <div className="bg-white border rounded-xl overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="font-semibold text-lg">Statement Results</h3>

              {transactions.length > 0 && (
                <button
                  onClick={downloadPDF}
                  className="text-[#117A3E] flex items-center"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download PDF
                </button>
              )}
            </div>

            {transactions.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No transactions found for this date range.</p>
              </div>
            ) : (
              <div className="p-6 space-y-6">
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

                {/* Transactions */}

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
                          {tx.amount > 0 ? "+" : ""}
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
