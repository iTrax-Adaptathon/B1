/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { ThemeProvider, useTheme } from './ThemeContext';
import EmployerDashboard from './EmployerDashboard';
import CandidateDashboard from './CandidateDashboard';
import ResumeMatcher from './ResumeMatcher';
import MatchesPage from './pages/MatchesPage';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import { Sparkles, Sun, Moon, LogIn, UserPlus, LogOut, LayoutDashboard, Briefcase, FileSearch } from 'lucide-react';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth?mode=signin" replace />;
  }

  return <>{children}</>;
}

function RoleSelection() {
  const { setRole } = useAuth();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Select Your Role</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Choose how you wish to experience TalentConnect.</p>
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => setRole('employer')}
            className="w-full px-6 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <Briefcase size={16} />
            <span>I am an Employer (Hiring Team)</span>
          </button>
          <button 
            onClick={() => setRole('candidate')}
            className="w-full px-6 py-3.5 bg-green-600 text-white rounded-xl hover:bg-green-700 font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles size={16} />
            <span>I am a Job Seeker (Candidate)</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function MainDashboard() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth?mode=signin" replace />;
  }

  if (!user.role) {
    return <RoleSelection />;
  }

  if (user.role === 'employer') {
    return <EmployerDashboard />;
  }

  return <CandidateDashboard />;
}

function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Top Navigation Bar */}
      <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6 md:gap-8">
            {/* Logo */}
            <Link to="/" className="font-black text-xl tracking-tight text-blue-600 dark:text-blue-400 flex items-center gap-2 hover:opacity-90 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-extrabold tracking-tight">TalentConnect</span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden sm:flex items-center gap-1.5">
              <Link
                to="/"
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  location.pathname === '/'
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Home
              </Link>

              {user && (
                <Link
                  to="/dashboard"
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    location.pathname === '/dashboard'
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Dashboard
                </Link>
              )}

              <Link
                to="/matches"
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  location.pathname === '/matches'
                    ? 'text-blue-700 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-900/60 shadow-xs'
                    : 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100/70 dark:hover:bg-blue-900/40'
                }`}
              >
                <Sparkles size={14} className="text-blue-600 dark:text-blue-400" />
                <span>AI Semantic Matcher</span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-blue-600 text-white uppercase font-black tracking-wider">New</span>
              </Link>

              {user?.role === 'employer' && (
                <Link
                  to="/screening"
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    location.pathname === '/screening'
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  AI Screening
                </Link>
              )}
            </nav>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
            </button>

            {user ? (
              /* Signed In Profile and Actions */
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.displayName}
                      className="w-8 h-8 rounded-full object-cover border-2 border-blue-500/40"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      {user.displayName.charAt(0)}
                    </div>
                  )}
                  <div className="hidden md:block text-left text-xs">
                    <div className="font-bold text-slate-900 dark:text-white leading-tight">
                      {user.displayName}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-sm ${
                        user.role === 'employer'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                      }`}>
                        {user.role}
                      </span>
                      {user.company && (
                        <span className="text-[10px] text-slate-400 truncate max-w-[100px]">
                          • {user.company}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={logout}
                  title="Sign out of your account"
                  className="p-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              /* Signed Out CTAs */
              <div className="flex items-center gap-2">
                <Link
                  to="/auth?mode=signin"
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <LogIn size={15} />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/auth?mode=signup"
                  className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <UserPlus size={15} />
                  <span>Create Account</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Page Body */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Modern Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-10 px-4 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-slate-800 dark:text-white">TalentConnect</span>
            <span>•</span>
            <span>AI-Powered Semantic Resume-to-Job Matching</span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Home</Link>
            <Link to="/matches" className="hover:text-slate-900 dark:hover:text-white transition-colors">AI Matcher</Link>
            <Link to="/auth?mode=signin" className="hover:text-slate-900 dark:hover:text-white transition-colors">Sign In</Link>
            <Link to="/auth?mode=signup" className="hover:text-slate-900 dark:hover:text-white transition-colors">Sign Up</Link>
          </div>

          <div className="text-[11px]">
            &copy; {new Date().getFullYear()} TalentConnect. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/login" element={<Navigate to="/auth?mode=signin" replace />} />
              <Route path="/signup" element={<Navigate to="/auth?mode=signup" replace />} />
              <Route path="/dashboard" element={<ProtectedRoute><MainDashboard /></ProtectedRoute>} />
              <Route path="/matches" element={<MatchesPage />} />
              <Route path="/screening" element={<ProtectedRoute><ResumeMatcher /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
