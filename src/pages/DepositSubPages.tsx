import React, { useState, useRef } from 'react'
import { DashboardLayout } from '../components/DashboardLayout'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { Copy, CheckCircle, Upload, Wallet, X } from 'lucide-react'

const CRYPTO_WALLETS: Record<string, string> = {
  'Bitcoin (BTC)': 'bc1qedjgpmpa69922x2pzqgyfp0nxf20wxvwzl2qvk',
  'Ethereum (ETH)': '0xdf708b40Eb7b6f252caf99Dfd7BfE031d00593D4',
  'Solana (SOL)': 'DEHwbFtyBkKN6fR67xDjsVXTp51LuBSxeHBtUqCBMvjR',
  'BNB Smart Chain': '0xdf708b40Eb7b6f252caf99Dfd7BfE031d00593D4',
  'USDT (ERC20)': '0xdf708b40Eb7b6f252caf99Dfd7BfE031d00593D4',
  'USDC (ERC20)': '0xdf708b40Eb7b6f252caf99Dfd7BfE031d00593D4',
  'Dogecoin (DOGE)': '0xdf708b40Eb7b6f252caf99Dfd7BfE031d00593D4',
  'Tron (TRX)': 'TXHFMFSryaVDhPkTmawzqNxdpKimd2wwp6',
  XRP: 'rUsdW7rnoR1uGwYw79U7YT1PRZL6Etk45',
  'Litecoin (LTC)': 'ltc1qufqrwwqcu04xn974w7vechjvqd08xd7e78yvhm',
}

// ✅ ONLY ADDITION
const QR_MAP: Record<string, string> = {
  'Bitcoin (BTC)': '/qrcode/bitcoin.JPG',
  'Ethereum (ETH)': '/qrcode/ethereun.JPG',
  'Solana (SOL)': '/qrcode/solana.JPG',
  'BNB Smart Chain': '/qrcode/bnd.JPG',
  'USDT (ERC20)': '/qrcode/usdt.JPG',
  'USDC (ERC20)': '/qrcode/usdc.JPG',
  'Dogecoin (DOGE)': '/qrcode/dogecoin.JPG',
  'Tron (TRX)': '/qrcode/tron.JPG',
  XRP: '/qrcode/xrp.JPG',
  'Litecoin (LTC)': '/qrcode/litecoin.JPG',
}

export function DepositCryptoPage() {
  const { user } = useAuth()
  const [selectedCrypto, setSelectedCrypto] = useState('')
  const [amount, setAmount] = useState('')
  const [copied, setCopied] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  // ✅ ONLY ADDITION
  const [qrError, setQrError] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleCopy = () => {
    navigator.clipboard.writeText(CRYPTO_WALLETS[selectedCrypto])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    if (!selectedFile.type.startsWith('image/')) {
      setStatusMessage('Please upload an image file (screenshot)')
      setIsError(true)
      return
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setStatusMessage('File size must be under 5MB')
      setIsError(true)
      return
    }
    setFile(selectedFile)
    setPreviewUrl(URL.createObjectURL(selectedFile))
    setStatusMessage('')
    setIsError(false)
  }

  const removeFile = () => {
    setFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const uploadReceipt = async (): Promise<string | null> => {
    if (!file || !user) return null
    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop() || 'png'
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      const filePath = `receipts/${fileName}`
      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })
      if (uploadError) {
        console.error('Storage upload error:', uploadError)
        throw new Error(uploadError.message)
      }
      const { data: urlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath)
      if (!urlData.publicUrl) throw new Error('Failed to get public URL')
      return urlData.publicUrl
    } catch (err: any) {
      console.error('Upload failed:', err)
      setStatusMessage(`Upload failed: ${err.message || 'Unknown error'}`)
      setIsError(true)
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setStatusMessage('You must be logged in to submit a deposit')
      setIsError(true)
      return
    }
    if (!selectedCrypto) {
      setStatusMessage('Please select a cryptocurrency')
      setIsError(true)
      return
    }
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setStatusMessage('Please enter a valid amount greater than 0')
      setIsError(true)
      return
    }
    setStatusMessage('Processing...')
    setIsError(false)
    setUploading(true)
    try {
      let receiptUrl: string | null = null
      if (file) {
        receiptUrl = await uploadReceipt()
        if (!receiptUrl) return
      }
      const { error: txError } = await supabase.from('transactions').insert({
        user_id: user.id,
        type: 'Crypto Deposit',
        amount: parseFloat(amount),
        description: `${selectedCrypto} crypto deposit`,
        status: 'pending',
        receipt_url: receiptUrl,
      })
      if (txError) {
        console.error('Transaction insert error:', txError)
        throw new Error(txError.message)
      }
      setStatusMessage(
        'Deposit submitted successfully! Waiting for admin review.',
      )
      setIsError(false)
      setSelectedCrypto('')
      setAmount('')
      setFile(null)
      setPreviewUrl(null)
    } catch (err: any) {
      console.error('Submit failed:', err)
      setStatusMessage(
        `Failed to submit deposit: ${err.message || 'Unknown error'}`,
      )
      setIsError(true)
    } finally {
      setUploading(false)
    }
  }

  return (
    <DashboardLayout title="Crypto Deposit" showBack>
      <div className="max-w-4xl mx-auto">
        {!selectedCrypto ? (
          <>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Select Cryptocurrency
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.keys(CRYPTO_WALLETS).map((crypto) => {
                const symbol = crypto.match(/\(([^)]+)\)/)?.[1] || crypto
                const name = crypto.split(' (')[0]
                return (
                  <button
                    key={crypto}
                    onClick={() => {
                      setSelectedCrypto(crypto)
                      setQrError(false)
                    }}
                    className="bg-white border border-gray-200 rounded-xl p-5 hover:border-[#0060AF] hover:shadow-md transition-all text-left flex items-center group"
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mr-4 group-hover:bg-blue-50 transition-colors">
                      <Wallet className="w-6 h-6 text-gray-400 group-hover:text-[#0060AF]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{name}</h3>
                      <p className="text-sm text-gray-500">{symbol}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 max-w-2xl mx-auto">
            <button
              onClick={() => setSelectedCrypto('')}
              className="text-sm text-[#0060AF] hover:underline mb-6 block"
            >
              ← Back to selection
            </button>

            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Deposit {selectedCrypto}
            </h2>

            {statusMessage && (
              <div className={`p-4 rounded mb-6 border ${isError ? 'bg-red-50 text-red-800 border-red-200' : 'bg-green-50 text-green-800 border-green-200'}`}>
                {statusMessage}
              </div>
            )}

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8 flex flex-col items-center">

              {/* ✅ ONLY THIS PART CHANGED */}
              <div className="w-48 h-48 bg-white border-2 border-dashed border-gray-300 flex items-center justify-center mb-6">
                {!qrError ? (
                  <img
                    src={QR_MAP[selectedCrypto]}
                    alt="QR Code"
                    className="w-full h-full object-contain"
                    onError={() => setQrError(true)}
                  />
                ) : (
                  <span className="text-gray-400 text-sm">
                    QR Code not found
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-500 mb-2">
                Send only {selectedCrypto} to this address
              </p>

              <div className="flex items-center w-full max-w-md bg-white border border-gray-300 rounded overflow-hidden">
                <input
                  type="text"
                  readOnly
                  value={CRYPTO_WALLETS[selectedCrypto]}
                  className="flex-grow px-3 py-2 text-sm font-mono text-gray-600 outline-none"
                />
                <button
                  onClick={handleCopy}
                  className="bg-gray-100 hover:bg-gray-200 px-4 py-2 border-l border-gray-300 transition-colors"
                >
                  {copied ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* EVERYTHING BELOW REMAINS EXACTLY THE SAME */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount Sent (USD Equivalent)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:border-[#0060AF] focus:outline-none"
                  placeholder="e.g. 250.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Transaction Receipt (optional)
                </label>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />

                {previewUrl ? (
                  <div className="relative border border-gray-300 rounded-lg overflow-hidden">
                    <img
                      src={previewUrl}
                      alt="Receipt preview"
                      className="w-full h-48 object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeFile}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      {file?.name}
                    </p>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <Upload className="w-10 h-10 text-gray-400 mb-3" />
                    <span className="text-sm font-medium text-gray-700">
                      Click to upload screenshot (optional)
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      PNG, JPG or JPEG (max 5MB)
                    </span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={uploading || !amount || !selectedCrypto}
                className={`w-full font-semibold py-3 rounded transition-colors ${uploading || !amount || !selectedCrypto ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-[#0060AF] hover:bg-blue-800 text-white'}`}
              >
                {uploading ? 'Processing...' : 'Submit for Review'}
              </button>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export function DepositBankPage() {
  const { user } = useAuth()
  const bankName = user?.bank_name || 'JPMorgan Chase Bank, N.A.'
  return (
    <DashboardLayout title="Bank Details" showBack>
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Your Account Details
        </h2>
        <p className="text-gray-500 mb-8">
          Use these details to receive wire or ACH transfers.
        </p>

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Bank Name
            </p>
            <p className="text-lg font-semibold text-gray-900">{bankName}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Account Name
            </p>
            <p className="text-lg font-semibold text-gray-900">
              {user?.full_name}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Account Number
            </p>
            <p className="text-lg font-mono text-gray-900">
              {user?.account_number}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Routing Number
            </p>
            <p className="text-lg font-mono text-gray-900">
              {user?.routing_number}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
