/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import EmployerDashboard from './EmployerDashboard';
import CandidateDashboard from './CandidateDashboard';
import ResumeMatcher from './ResumeMatcher';

function RoleSelection() {
  const { setRole } = useAuth();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <h2 className="text-2xl font-bold mb-6">Select your role to continue</h2>
      <div className="flex gap-4">
        <button 
          onClick={() => setRole('employer')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          I am an Employer (Hiring)
        </button>
        <button 
          onClick={() => setRole('candidate')}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
        >
          I am a Job Seeker (Candidate)
        </button>
      </div>
    </div>
  );
}

function MainDashboard() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  if (!user.role) {
    return <RoleSelection />;
  }

  if (user.role === 'employer') {
    return <EmployerDashboard />;
  }

  return <CandidateDashboard />;
}

function LandingPage() {
  const { user, loading, login } = useAuth();

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (user) return <Navigate to="/dashboard" />;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center max-w-2xl px-4">
        <h1 className="text-5xl font-extrabold text-slate-900 mb-6">Find Talent or Get Hired</h1>
        <p className="text-lg text-slate-600 mb-8">
          A platform for employers to post jobs and screen applicants using AI, and for candidates to find their next role.
        </p>
        <button 
          onClick={login}
          className="px-8 py-4 bg-slate-900 text-white rounded-full font-semibold hover:bg-slate-800 transition-colors"
        >
          Sign in (Demo)
        </button>
      </div>
    </div>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight text-blue-600 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            TalentConnect
          </div>
          {user && (
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-slate-500">Signed in as</span>{' '}
                <span className="font-medium">{user.displayName}</span>
                {user.role && <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">{user.role}</span>}
              </div>
              <button 
                onClick={logout}
                className="text-sm px-3 py-1.5 border border-slate-200 rounded hover:bg-slate-50 text-slate-600"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>
      <main>
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<MainDashboard />} />
            <Route path="/screening" element={<ResumeMatcher />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}
