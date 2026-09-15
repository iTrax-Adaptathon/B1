import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth, DEFAULT_AVATARS, SignUpData } from '../AuthContext';
import { 
  Building2, 
  User, 
  Lock, 
  Mail, 
  Briefcase, 
  Award, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Eye, 
  EyeOff,
  Image as ImageIcon
} from 'lucide-react';

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, signIn, signUp, logout } = useAuth();

  const defaultMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';
  const defaultRole = searchParams.get('role') === 'employer' ? 'employer' : 'candidate';

  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode);
  const [role, setRole] = useState<'employer' | 'candidate'>(defaultRole);

  // Sign In state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign Up Common
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [userId, setUserId] = useState('');
  const [bio, setBio] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(DEFAULT_AVATARS[0]);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [deviceImagePreview, setDeviceImagePreview] = useState<string | null>(null);

  const handleDeviceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, JPEG, WebP, GIF).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image file is too large (exceeds 5MB). Please upload a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setDeviceImagePreview(dataUrl);
      setSelectedAvatar(dataUrl);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  // Sign Up Employer Specific
  const [company, setCompany] = useState('');
  const [employerQualifications, setEmployerQualifications] = useState('');

  // Sign Up Candidate Specific
  const [experienceLevel, setExperienceLevel] = useState('');
  const [candidateQualifications, setCandidateQualifications] = useState('');
  const [targetRole, setTargetRole] = useState('');

  // UI status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quick sign in for demos
  const handleDemoSignIn = async (demoRole: 'employer' | 'candidate') => {
    if (user && user.role && user.role !== demoRole) {
      setError(`You are currently signed in as a ${user.role === 'employer' ? 'Employer' : 'Candidate'}. You cannot switch between employee and employer without signing out first.`);
      return;
    }
    setLoading(true);
    setError(null);
    const identifier = demoRole === 'employer' ? 'employer@demo.com' : 'candidate@demo.com';
    const result = await signIn(identifier, 'password123');
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Demo sign in failed.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === 'signin') {
      if (!loginIdentifier || !loginPassword) {
        setError('Please enter your email/User ID and password.');
        setLoading(false);
        return;
      }
      const result = await signIn(loginIdentifier, loginPassword);
      setLoading(false);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Invalid credentials.');
      }
    } else {
      if (user && user.role && user.role !== role) {
        setError(`You are currently signed in as a ${user.role === 'employer' ? 'Employer' : 'Candidate'}. You cannot switch between employee and employer without signing out first.`);
        setLoading(false);
        return;
      }
      // Sign up validation
      if (!email || !password || !displayName) {
        setError('Please fill in all required fields (Name, Email, Password).');
        setLoading(false);
        return;
      }

      const avatarToUse = customAvatarUrl.trim() || selectedAvatar;

      const payload: SignUpData = {
        userId: userId.trim() || email.split('@')[0],
        email: email.trim(),
        password,
        displayName: displayName.trim(),
        role,
        avatarUrl: avatarToUse,
        bio: bio.trim(),
        company: role === 'employer' ? company.trim() : undefined,
        qualifications: role === 'employer' ? employerQualifications.trim() : candidateQualifications.trim(),
        experienceLevel: role === 'candidate' ? experienceLevel : undefined,
        targetRole: role === 'candidate' ? targetRole.trim() : undefined
      };

      const result = await signUp(payload);
      setLoading(false);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Registration failed.');
      }
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        {/* Top Branding & Mode Switch */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-black text-2xl text-blue-600 dark:text-blue-400 mb-2">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>TalentConnect</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {user ? 'Active Session Detected' : (mode === 'signin' ? 'Welcome Back' : 'Create Your Account')}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {user
              ? `You are currently logged in as a ${user.role === 'employer' ? 'Employer' : 'Job Seeker (Candidate)'}.`
              : (mode === 'signin'
                ? 'Sign in to access your dashboard, jobs, and candidate matches.'
                : 'Join the next generation of AI-driven talent screening and career matching.')}
          </p>
        </div>

        {/* Card Container */}
        {user ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8 transition-colors text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xs">
              {user.role === 'employer' ? <Building2 size={32} /> : <User size={32} />}
            </div>

            <div>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${
                user.role === 'employer'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                  : 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
              }`}>
                <span>Active Role: {user.role === 'employer' ? 'Employer' : 'Candidate'}</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Signed in as {user.displayName}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
                You cannot switch between employee and employer without signing out first. Please sign out if you wish to switch accounts or change roles.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Go to My Dashboard</span>
                <ArrowRight size={15} />
              </button>
              <button
                type="button"
                onClick={() => logout()}
                className="px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-red-400 rounded-xl text-xs font-bold transition-all border border-slate-200 dark:border-slate-700"
              >
                <span>Sign Out to Switch Accounts</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8 transition-colors">
            {/* Mode Switcher Tabs */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => { setMode('signin'); setError(null); }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                  mode === 'signin'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(null); }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                  mode === 'signup'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Create Account (Sign Up)
              </button>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl flex items-center gap-2.5 text-xs text-red-700 dark:text-red-400">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* SIGN IN FORM */}
            {mode === 'signin' ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address or User ID
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={e => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. employer@demo.com or candidate_demo"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? 'Signing in...' : 'Sign In to Dashboard'}
                <ArrowRight size={16} />
              </button>

              {/* Quick Demo Access Bar */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="text-center text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Or 1-Click Demo Login
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleDemoSignIn('employer')}
                    className="py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
                  >
                    <Building2 size={14} className="text-blue-600 dark:text-blue-400" />
                    <span>Demo Employer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoSignIn('candidate')}
                    className="py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
                  >
                    <User size={14} className="text-green-600 dark:text-green-400" />
                    <span>Demo Candidate</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* SIGN UP FORM */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Select Your Account Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('employer')}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      role === 'employer'
                        ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 dark:border-blue-500 ring-2 ring-blue-500'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 size={18} className="text-blue-600 dark:text-blue-400" />
                      <span className="font-bold text-xs text-slate-900 dark:text-white">Employer</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                      Post jobs & screen applicants with semantic AI.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('candidate')}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      role === 'candidate'
                        ? 'border-green-600 bg-green-50/70 dark:bg-green-950/40 dark:border-green-500 ring-2 ring-green-500'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <User size={18} className="text-green-600 dark:text-green-400" />
                      <span className="font-bold text-xs text-slate-900 dark:text-white">Job Seeker</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                      Match resumes against live roles instantly.
                    </p>
                  </button>
                </div>
              </div>

              {/* Core Credentials */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder={role === 'employer' ? 'e.g. Sarah Jenkins' : 'e.g. Alex Rivers'}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    User ID (Optional handle)
                  </label>
                  <input
                    type="text"
                    value={userId}
                    onChange={e => setUserId(e.target.value)}
                    placeholder="e.g. alex_rivers"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full pl-3.5 pr-8 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-slate-400"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* ROLE SPECIFIC FIELDS */}
              {role === 'employer' ? (
                /* Employer Details */
                <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                        <Building2 size={13} className="text-blue-500" />
                        <span>Where do you work? (Company)</span>
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={e => setCompany(e.target.value)}
                        placeholder="e.g. TalentConnect, Stripe, Google"
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                        <Award size={13} className="text-blue-500" />
                        <span>Your Role & Qualifications</span>
                      </label>
                      <input
                        type="text"
                        value={employerQualifications}
                        onChange={e => setEmployerQualifications(e.target.value)}
                        placeholder="e.g. Head of Engineering, Senior Recruiter"
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                      <FileText size={13} className="text-blue-500" />
                      <span>Employer Bio / Company Overview</span>
                    </label>
                    <textarea
                      rows={2}
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      placeholder="Brief overview of your team, company culture, or hiring focus..."
                      className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              ) : (
                /* Candidate / Employee Details */
                <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                        <Briefcase size={13} className="text-green-500" />
                        <span>Target Role</span>
                      </label>
                      <input
                        type="text"
                        value={targetRole}
                        onChange={e => setTargetRole(e.target.value)}
                        placeholder="e.g. Senior Backend Engineer"
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                        <Award size={13} className="text-green-500" />
                        <span>Qualifications / Degree</span>
                      </label>
                      <input
                        type="text"
                        value={candidateQualifications}
                        onChange={e => setCandidateQualifications(e.target.value)}
                        placeholder="e.g. B.S. Computer Science • 4 Yrs Exp"
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                      <FileText size={13} className="text-green-500" />
                      <span>Professional Bio & Summary</span>
                    </label>
                    <textarea
                      rows={2}
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      placeholder="Highlight your core capabilities, languages, frameworks, and architectural experience..."
                      className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {/* Profile Avatar Selection */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1">
                  <ImageIcon size={13} className="text-blue-500" />
                  <span>Choose Profile Picture / Avatar</span>
                </label>
                <div className="flex items-center gap-3">
                  {DEFAULT_AVATARS.map((avatar, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => { setSelectedAvatar(avatar); setCustomAvatarUrl(''); }}
                      className={`relative rounded-full overflow-hidden w-10 h-10 border-2 transition-transform hover:scale-105 ${
                        selectedAvatar === avatar && !customAvatarUrl
                          ? 'border-blue-600 ring-2 ring-blue-400'
                          : 'border-slate-300 dark:border-slate-700 opacity-70'
                      }`}
                    >
                      <img src={avatar} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Sign Up */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
              >
                {loading ? 'Creating Profile...' : `Complete Registration & Go to Dashboard`}
                <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>
        )}
      </div>
    </div>
  );
}
