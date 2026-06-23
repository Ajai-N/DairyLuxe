import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigation } from '../../context/NavigationContext';
import { Landmark, Eye, EyeOff, Lock, User, AlertCircle, HelpCircle } from 'lucide-react';

export const SignIn: React.FC = () => {
  const { signIn } = useApp();
  const { navigateTo } = useNavigation();

  // Form State
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!userId.trim() || !password.trim()) {
      setError('Please fill in both User ID and Password.');
      return;
    }

    const res = signIn(userId, password);
    if (res.success) {
      if (res.role === 'admin') {
        navigateTo('admin-dashboard');
      } else if (res.role === 'partner') {
        navigateTo('partner-dashboard');
      } else if (res.role === 'customer') {
        navigateTo('subscriber-dashboard');
      } else if (res.role === 'worker') {
        navigateTo('worker-dashboard');
      } else {
        navigateTo('home');
      }
    } else {
      setError(res.error || 'Authentication failed.');
    }
  };

  return (
    <div className="bg-brand-cream-light py-20 min-h-[70vh] flex items-center justify-center animate-fade-in px-4">
      <div className="max-w-md w-full bg-brand-cream border border-brand-cream-dark p-8 sm:p-10 rounded-3xl shadow-md">
        
        {/* Header Logo */}
        <div className="text-center mb-8">
          <div className="h-12 w-12 bg-brand-green rounded-full flex items-center justify-center text-brand-cream shadow-md mx-auto mb-4 border border-brand-cream-dark">
            <Landmark className="h-6 w-6" />
          </div>
          <h2 className="font-display font-extrabold text-2xl text-brand-green-dark">Member Portal</h2>
          <p className="text-xs text-brand-charcoal/50 mt-1.5 uppercase font-bold tracking-widest">Secure Sign In</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 text-xs flex items-start gap-2.5 mb-6 animate-fade-in">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-red-600" />
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="userId" className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">
              User ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-charcoal/40">
                <User className="h-4 w-4" />
              </div>
              <input
                type="text"
                id="userId"
                required
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="e.g. admin, PRT1001, SUB1001"
                className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl pl-10 pr-4 py-3 text-sm text-brand-charcoal transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert('Please contact administrative support at admin@dairyluxe.com to reset credentials.')}
                className="text-[11px] font-semibold text-brand-brown-light hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-charcoal/40">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-brand-cream-light border border-brand-cream-dark focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none rounded-xl pl-10 pr-10 py-3 text-sm text-brand-charcoal transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-brand-charcoal/40 hover:text-brand-charcoal"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-brand-green border-brand-cream-dark rounded focus:ring-brand-green bg-brand-cream-light cursor-pointer"
            />
            <label htmlFor="rememberMe" className="ml-2.5 text-xs text-brand-charcoal/70 select-none cursor-pointer">
              Remember my session
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-brand-green text-brand-cream hover:bg-brand-green-light hover:shadow-md font-bold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            Sign In to Portal
          </button>
        </form>

        {/* Demo Credentials Help Card */}
        <div className="mt-8 border-t border-brand-cream-dark pt-6 bg-brand-green-soft/40 p-4 rounded-2xl border border-brand-green/10">
          <h4 className="text-xs uppercase font-extrabold text-brand-green-dark tracking-wider mb-2 flex items-center gap-1.5">
            <HelpCircle className="h-4 w-4" /> Demo Portal Access
          </h4>
          <ul className="space-y-1.5 text-[11px] text-brand-charcoal/80">
            <li>
              <strong>Admin:</strong> user <code className="bg-brand-cream px-1 font-mono text-[10px]">admin</code> / pass <code className="bg-brand-cream px-1 font-mono text-[10px]">admin123</code>
            </li>
            <li>
              <strong>Worker:</strong> user <code className="bg-brand-cream px-1 font-mono text-[10px]">WRK1001</code> / pass <code className="bg-brand-cream px-1 font-mono text-[10px]">worker123</code>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};
