import React, { useState } from 'react';
import { IconLock, IconUser, IconClose, IconEye, IconEyeOff, IconCheck } from './Icons';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      // Valid credentials: admin / admin123
      if (
        (username.trim().toLowerCase() === 'admin' || username.trim().toLowerCase() === 'admin@rscomputer.com') &&
        password === 'admin123'
      ) {
        localStorage.setItem('rs_admin_logged_in', 'true');
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setErrorMessage();
      }
    }, 600);
  };

  const fillDemoCredentials = () => {
    setUsername('admin');
    setPassword('admin123');
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all">
      <div 
        className="relative w-full max-w-md bg-[#09122c] border border-blue-900/60 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-sky-950/80 overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Glowing Cyan Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-blue-900/40 transition-colors cursor-pointer"
        >
          <IconClose className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-sky-500 to-indigo-600 p-[1.5px] mx-auto mb-3 shadow-lg shadow-sky-500/30">
            <div className="w-full h-full bg-[#070e24] rounded-[14px] flex items-center justify-center text-sky-400">
              <IconLock className="w-7 h-7" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Admin Portal Login
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            RS Computer Cyber Cafe • Operations Dashboard
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-600/40 text-rose-300 text-xs text-center">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Admin ID / Username */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Admin ID / Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <IconUser className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin ID "
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#060c20] border border-blue-900/50 text-white text-sm focus:outline-none focus:border-sky-400 transition-colors placeholder-slate-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <IconLock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password "
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-[#060c20] border border-blue-900/50 text-white text-sm focus:outline-none focus:border-sky-400 transition-colors placeholder-slate-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-sky-300 transition-colors cursor-pointer"
              >
                {showPassword ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Demo Credentials Helper */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-xs text-sky-400 hover:text-sky-300 hover:underline flex items-center gap-1 cursor-pointer"
            >
              
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-blue-700 hover:from-sky-400 hover:to-blue-600 text-white font-bold text-sm shadow-xl shadow-blue-600/30 hover:shadow-sky-500/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <IconLock className="w-4 h-4" />
                <span>Login to Admin Dashboard</span>
              </>
            )}
          </button>
        </form>

        {/* Security Badge */}
        <div className="mt-6 pt-4 border-t border-blue-950/80 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Encrypted Session • Store Manager Access</span>
        </div>

      </div>
    </div>
  );
}
