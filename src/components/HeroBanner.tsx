import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
export function HeroBanner() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data, error } = await supabase.
      from('users').
      select('*').
      eq('username', username).
      eq('password', password).
      single();
      if (error || !data) {
        setError('Invalid username or password');
      } else {
        login(data);
        window.location.hash = '#/dashboard';
      }
    } catch (err) {
      setError('An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="w-full bg-gradient-to-r from-[#003A70] to-[#0060AF] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between">
        {/* Left Side: Offer Amount & Details */}
        <div className="w-full md:w-1/2 flex flex-col items-start mb-8 md:mb-0">
          <div className="flex flex-col mb-6">
            <span className="text-xl md:text-2xl font-light mb-[-10px] z-10">
              Enjoy
            </span>
            <h1 className="text-[5rem] md:text-[8rem] font-bold leading-none tracking-tighter">
              <span className="text-[3rem] md:text-[5rem] align-top relative top-[1rem] md:top-[2rem] mr-1">
                $
              </span>
              400
            </h1>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 leading-tight">
            New Crest checking
            <br className="hidden md:block" /> customers
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl font-light">
            Open a Crest Total Checking® account with qualifying activities.
          </p>
          <a
            href="#/enroll"
            className="bg-[#117A3E] hover:bg-[#0e6332] text-white font-semibold py-3 px-6 rounded transition-colors duration-200">
            
            Open an account
          </a>
        </div>

        {/* Right Side: Sign In Panel (Desktop Only) */}
        <div className="hidden md:block w-full md:w-[400px] bg-white rounded-lg shadow-2xl p-8 text-gray-900">
          <h2 className="text-3xl font-light mb-6 text-gray-800">Welcome</h2>

          {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

          <form onSubmit={handleSignIn}>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#0060AF] transition-colors"
                required />
              
            </div>

            <div className="mb-6 relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#0060AF] transition-colors pr-12"
                required />
              
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-2 text-[#0060AF] font-semibold text-sm hover:underline">
                
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center text-gray-600 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  className="mr-2 w-4 h-4 rounded border-gray-300 text-[#0060AF] focus:ring-[#0060AF]" />
                
                Remember me
              </label>
              <a
                href="#"
                className="text-[#0060AF] text-sm hover:underline flex items-center">
                
                Use token <span className="ml-1">›</span>
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0060AF] hover:bg-blue-800 text-white font-semibold py-3 rounded mb-4 transition-colors disabled:opacity-70">
              
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="flex flex-col space-y-2 text-sm">
              <a
                href="#"
                className="text-[#0060AF] hover:underline flex items-center">
                
                Forgot username/password? <span className="ml-1">›</span>
              </a>
              <a
                href="#/enroll"
                className="text-[#0060AF] hover:underline flex items-center">
                
                Not Enrolled? Sign Up Now. <span className="ml-1">›</span>
              </a>
            </div>
          </form>
        </div>
      </div>
    </section>);

}
