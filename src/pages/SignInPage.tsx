import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { Facebook, Instagram, Twitter, Youtube, Linkedin } from 'lucide-react';
export function SignInPage() {
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
    <div
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{
        backgroundImage:
        'url(https://static.chasecdn.com/content/services/rendition/image.large.jpg/structured-images/geo-images/background/new_york/new_york_night_6.jpg)'
      }}>
      
      {/* Header */}
      <header className="w-full py-6 flex justify-center bg-gradient-to-b from-black/50 to-transparent">
        <a href="#/">
          <img
            src="/chasebank.png"
            alt="Crest"
            className="h-8 object-contain brightness-0 invert" />
          
        </a>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center md:justify-end md:pr-32 px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-8 text-gray-900">
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
      </main>

      {/* Footer */}
      <footer className="bg-white/90 backdrop-blur-sm py-6 px-4 border-t border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="flex space-x-6 text-gray-500 mb-4">
            <a href="#" className="hover:text-gray-900">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-gray-900">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-gray-900">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-gray-900">
              <Youtube className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-gray-900">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-gray-600 mb-4">
            <a href="#" className="hover:underline">
              Contact us
            </a>
            <a href="#" className="hover:underline">
              Privacy & security
            </a>
            <a href="#" className="hover:underline">
              Terms of use
            </a>
            <a href="#" className="hover:underline">
              Accessibility
            </a>
            <a href="#" className="hover:underline">
              SAFE Act: Chase Mortgage Loan Originators
            </a>
            <a href="#" className="hover:underline">
              Fair Lending
            </a>
            <a href="#" className="hover:underline">
              About Crest
            </a>
            <a href="#" className="hover:underline">
              Anthony
            </a>
            <a href="#" className="hover:underline">
              Crest & Co.
            </a>
            <a href="#" className="hover:underline">
              Careers
            </a>
            <a href="#" className="hover:underline">
              Español
            </a>
            <a href="#" className="hover:underline">
              Crest United Kingdom
            </a>
            <a href="#" className="hover:underline">
              Site map
            </a>
            <a href="#" className="hover:underline">
              Member FDIC
            </a>
            <span className="flex items-center">Equal Housing Opportunity</span>
          </div>
          <div className="text-xs text-gray-500">© 2010 Crest</div>
        </div>
      </footer>
    </div>);

}
