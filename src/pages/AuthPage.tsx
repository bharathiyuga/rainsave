import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useRouter } from '../context/NavigationContext';
import { UserRole } from '../types';
import {
  Droplets,
  Layers,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  KeyRound,
  X
} from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'login' | 'signup';
}

export function AuthPage({ initialMode = 'login' }: AuthPageProps) {
  const { login, loginWithGoogle, loginWithApple, signup, availableUsers, switchUser, resetPassword } = useAuth();
  const { success, error, info } = useToast();
  const { navigate } = useRouter();

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('seller');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('Salem, Tamil Nadu');
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      error('Please enter your email ID.');
      return;
    }
    if (!password.trim()) {
      error('Please enter your password.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      success(`Welcome back! Signed in as ${email}`, 'Login Successful');
      navigate('/dashboard');
    } catch (err: any) {
      error(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      error('Please provide your name and email address.');
      return;
    }
    if (!password || password.length < 6) {
      error('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      await signup(fullName, email, role, phone, location, password);
      success('Account created and signed in!', 'Welcome to RainRevive');
      navigate('/dashboard');
    } catch (err: any) {
      error(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      info('Connecting to Google Identity Services...', 'OAuth Verification');
      const profile = await loginWithGoogle();
      success(`Signed in with Google as ${profile.full_name}`, 'Google Authenticated');
      navigate('/dashboard');
    } catch (err: any) {
      error('Google authentication was cancelled or failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    try {
      setLoading(true);
      info('Connecting to Apple ID Services...', 'Apple Authentication');
      const profile = await loginWithApple();
      success(`Signed in with Apple as ${profile.full_name}`, 'Apple Authenticated');
      navigate('/dashboard');
    } catch (err: any) {
      error('Apple authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSwitch = (id: string, name: string) => {
    switchUser(id);
    success(`Switched to ${name}'s demo account!`, 'Persona Switched');
    navigate('/dashboard');
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      error('Please enter your registered email address.');
      return;
    }
    await resetPassword(forgotEmail);
    setForgotSubmitted(true);
    success('Password reset instructions sent to ' + forgotEmail, 'Reset Email Sent');
  };

  return (
    <div className="relative min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="w-full max-w-md space-y-8">
        
        {/* Brand Header */}
        <div className="text-center space-y-2.5">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 text-white shadow-xl shadow-emerald-500/20 ring-1 ring-white/20 animate-float">
            <Droplets className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
              {mode === 'login' 
                ? 'Sign in to access your materials, rain calculations & spaces' 
                : 'Join the circular sustainability community in Tamil Nadu'}
            </p>
          </div>
        </div>

        {/* Main Auth Card */}
        <div className="relative bg-[#0c1324]/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl shadow-black/80 space-y-6">
          
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`py-2.5 rounded-xl transition-all duration-200 ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30 font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`py-2.5 rounded-xl transition-all duration-200 ${
                mode === 'signup'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30 font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Social Logins: Google & Apple */}
          <div className="space-y-2.5">
            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.37 7.34 24 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.99 0 12s.46 3.83 1.26 5.42l4.02-3.15Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.63 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                />
              </svg>
              <span>{mode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}</span>
            </button>

            {/* Apple Sign In Button */}
            <button
              type="button"
              onClick={handleAppleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-black hover:bg-slate-900 text-white font-bold text-xs sm:text-sm border border-slate-700/80 transition-all duration-200 shadow-md hover:scale-[1.01] active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.68-7.74-11.95-14.1-6.19-9.14-11.06-19.64-14.6-31.5-3.54-11.85-5.31-23.36-5.31-34.52 0-14.76 3.69-26.68 11.07-35.77 7.38-9.08 16.58-13.72 27.6-13.92 5.23 0 10.88 1.41 16.96 4.24 6.08 2.83 10.14 4.3 12.18 4.41 1.74 0 6.09-1.63 13.04-4.89 6.96-3.26 12.83-4.63 17.62-4.11 13.48.88 23.94 5.76 31.39 14.65-11.96 7.18-17.73 17.07-17.3 29.68.32 10 4.13 18.25 11.41 24.77 7.28 6.53 15.98 10.33 26.1 11.41-2.28 6.85-5.05 14.15-8.31 21.91zM119.22 31.84c0-7.39 2.61-14.35 7.82-20.87C132.25 4.45 139.31.54 148.22 0c.22 1.3.33 2.5.33 3.59 0 7.28-2.77 14.45-8.31 21.52-5.54 7.06-12.44 11.19-20.7 12.39-.22-1.85-.32-3.74-.32-5.66z" />
              </svg>
              <span>{mode === 'login' ? 'Sign in with Apple' : 'Sign up with Apple'}</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-[#0c1324] px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 shrink-0">
              Or with Email Address
            </span>
            <div className="border-t border-slate-800 w-full" />
          </div>

          {/* LOGIN FORM */}
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-300 tracking-wide flex items-center justify-between">
                  <span>Mail ID / Email</span>
                  <span className="text-[10px] text-emerald-400 font-normal">Registered user</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. priya.green@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/80 bg-slate-950 text-xs text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase text-slate-300 tracking-wide">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-700/80 bg-slate-950 text-xs text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-400 select-none">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Remember my login</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-600/30 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In with Mail ID'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* SIGNUP FORM */
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-300 tracking-wide">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Kumar"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/80 bg-slate-950 text-xs text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-300 tracking-wide">
                  Mail ID / Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. anand@buildgreen.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/80 bg-slate-950 text-xs text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-300 tracking-wide">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-700/80 bg-slate-950 text-xs text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-300 tracking-wide">
                  Primary Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-700/80 text-xs bg-slate-950 text-white font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="user">Community Scout / Homeowner (Rain harvesting & space revitalization)</option>
                  <option value="seller">Architect / Project Champion (Submit and restore spaces)</option>
                  <option value="admin">Administrator / Municipal Officer (City governance & approval)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase text-slate-300 tracking-wide">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="+91 98452 00000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-700/80 bg-slate-950 text-xs text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase text-slate-300 tracking-wide">
                    City / Location
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Salem / Chennai / Coimbatore"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-700/80 bg-slate-950 text-xs text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-600/30 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Creating Account...' : 'Complete Sign Up'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* DEMO INSTANT LOGIN SHORTCUTS */}
          <div className="pt-5 border-t border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>One-Click Test Personas:</span>
              </p>
              <span className="text-[10px] text-slate-500 font-mono">Instant Login</span>
            </div>

            <div className="space-y-2">
              {availableUsers.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleDemoSwitch(u.id, u.full_name)}
                  className="w-full flex items-center justify-between p-2.5 rounded-2xl border border-slate-800 bg-slate-950/60 hover:bg-slate-900/90 hover:border-emerald-500/40 transition-all text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={u.avatar_url}
                      alt=""
                      className="w-8 h-8 rounded-xl object-cover ring-1 ring-emerald-500/30 group-hover:ring-emerald-400"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-xs text-white group-hover:text-emerald-300 transition-colors">
                          {u.full_name}
                        </p>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800/50'
                            : u.role === 'seller'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                            : 'bg-cyan-950 text-cyan-300 border border-cyan-800/50'
                        }`}>
                          {u.role}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate max-w-[220px]">
                        {u.email} • {u.location}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-sm bg-[#0c1324] rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-4">
            <button
              onClick={() => {
                setShowForgotModal(false);
                setForgotSubmitted(false);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="font-black text-white text-base">Reset Password</h3>
            </div>

            {forgotSubmitted ? (
              <div className="space-y-4 py-2 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <p className="text-xs text-slate-300 leading-relaxed">
                  A reset link has been dispatched to <strong className="text-white">{forgotEmail}</strong>. You may now return and log in with your demo account.
                </p>
                <button
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSubmitted(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                >
                  Close & Return
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enter your registered Mail ID below. We’ll transmit a secure reset verification code to restore your account credentials.
                </p>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-slate-300">Registered Mail ID</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. user@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30"
                >
                  Send Reset Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
