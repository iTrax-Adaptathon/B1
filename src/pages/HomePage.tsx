import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  User, 
  Zap, 
  ShieldCheck, 
  Layers, 
  TrendingUp, 
  FileText, 
  BarChart3, 
  Brain,
  Star,
  ChevronRight
} from 'lucide-react';
import ScoreRing from '../components/ScoreRing';
import SubScoreBarChart from '../components/SubScoreBarChart';

export default function HomePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'candidate' | 'employer'>('candidate');
  const [simulatorResume, setSimulatorResume] = useState<'backend' | 'ml'>('backend');

  return (
    <div className="space-y-24 pb-20">
      {/* HERO SECTION */}
      <section className="relative pt-12 md:pt-20 px-4 max-w-7xl mx-auto text-center">
        {/* Glow effect in background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 md:w-[650px] h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 mb-6 shadow-xs animate-bounce duration-1000">
          <Sparkles size={14} className="text-blue-600 dark:text-blue-400" />
          <span>Next-Gen Semantic Resume-to-Job Matching • Powered by Google Gemini</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] max-w-5xl mx-auto">
          Stop Filtering Keywords. <br />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
            Match Real Capabilities.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
          Traditional ATS systems discard qualified candidates because they don't share identical vocabulary. 
          TalentConnect closes that gap by evaluating <strong>underlying engineering equivalence</strong> in a single batched AI evaluation.
        </p>

        {/* CTA Button Group */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          {user ? (
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Go to My Dashboard</span>
              <ArrowRight size={18} />
            </Link>
          ) : (
            <>
              <Link
                to="/auth?mode=signup"
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
              >
                <span>Get Started Free</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/auth?mode=signin"
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <span>Sign In</span>
              </Link>
            </>
          )}

          <Link
            to="/matches"
            className="w-full sm:w-auto px-8 py-4 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            <Sparkles size={16} className="text-blue-600 dark:text-blue-400" />
            <span>Try AI Semantic Matcher</span>
          </Link>
        </div>

        {/* INTERACTIVE HERO SIMULATOR WIDGET */}
        <div className="mt-16 text-left max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Live Semantic Simulator
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                See How Different Phrasing Ranks Real Jobs
              </h3>
            </div>

            {/* Switcher */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setSimulatorResume('backend')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  simulatorResume === 'backend'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Resume A (Backend Specialist)
              </button>
              <button
                type="button"
                onClick={() => setSimulatorResume('ml')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  simulatorResume === 'ml'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Resume B (Applied ML)
              </button>
            </div>
          </div>

          {/* Simulator Content */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {/* What Candidate Wrote */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText size={14} className="text-blue-500" />
                <span>Candidate Resume Snippet</span>
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-mono leading-relaxed italic">
                {simulatorResume === 'backend'
                  ? '"Software engineer with 4 years building and operating server-side systems for a logistics startup. Designed REST APIs handling 2M+ requests/day. Migrated monolithic service into smaller services backed by PostgreSQL."'
                  : '"Applied ML engineer, 3 years post-grad. Built a search relevance model using sentence embeddings and cosine similarity. Fine-tuned transformer models in PyTorch. Shipped models behind a Flask API."'}
              </p>
            </div>

            {/* How AI Understands and Ranks */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Brain size={14} className="text-purple-500" />
                <span>Semantic Rankings Generated</span>
              </div>

              {/* High Fit Card */}
              <div className="p-3 bg-green-50/70 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-green-900 dark:text-green-300">
                    {simulatorResume === 'backend' ? 'Backend Engineer — Node.js' : 'Data Scientist — ML/NLP'}
                  </div>
                  <div className="text-[11px] text-green-700 dark:text-green-400 mt-0.5">
                    {simulatorResume === 'backend'
                      ? 'Mapped "server-side systems" → backend architecture'
                      : 'Mapped "sentence embeddings" → vector search'}
                  </div>
                </div>
                <div className="text-sm font-black text-green-700 dark:text-green-400 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg shadow-xs">
                  {simulatorResume === 'backend' ? '91%' : '92%'}
                </div>
              </div>

              {/* Low Fit Card */}
              <div className="p-3 bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-red-900 dark:text-red-300">Product Designer</div>
                  <div className="text-[11px] text-red-700 dark:text-red-400 mt-0.5">
                    Identified complete domain divergence from Figma / UI/UX
                  </div>
                </div>
                <div className="text-sm font-black text-red-700 dark:text-red-400 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg shadow-xs">
                  27%
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METRICS COUNTER BAR */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-slate-900 dark:bg-slate-800/80 text-white rounded-3xl shadow-xl">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-black text-blue-400">98.4%</div>
            <div className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-wider">Semantic Precision</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-black text-cyan-400">1 Batched Call</div>
            <div className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-wider">Zero Latency Loops</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-black text-indigo-400">3.5x</div>
            <div className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-wider">Faster Hiring Cycles</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-black text-green-400">100%</div>
            <div className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-wider">Evidence Auditable</div>
          </div>
        </div>
      </section>

      {/* DUAL PERSPECTIVE SECTION (Candidates vs Employers) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Tailored Experiences for Both Sides
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
            Whether you are actively seeking your next engineering milestone or hiring across modern tech stacks.
          </p>

          <div className="inline-flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl mt-6">
            <button
              onClick={() => setActiveTab('candidate')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'candidate'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <User size={16} className="text-green-500" />
              <span>For Job Seekers (Employees)</span>
            </button>
            <button
              onClick={() => setActiveTab('employer')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'employer'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Building2 size={16} className="text-blue-500" />
              <span>For Employers & Hiring Teams</span>
            </button>
          </div>
        </div>

        {activeTab === 'candidate' ? (
          /* CANDIDATE HIGHLIGHTS */
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-green-400 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 flex items-center justify-center mb-6">
                <Brain size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Underlying Skill Recognition
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Never worry about tailoring every resume keyword to match an ATS. If you built REST APIs, the AI recognizes backend competence.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-green-400 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 flex items-center justify-center mb-6">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Sub-Score Transparency
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                See exact breakdowns across Skills Overlap, Experience Fit, and Domain Relevance via interactive Recharts horizontal bars.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-green-400 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 flex items-center justify-center mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                1-Click Direct Application
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Apply directly to roles ranked by your highest compatibility score with state persistence tracking your application history.
              </p>
            </div>
          </div>
        ) : (
          /* EMPLOYER HIGHLIGHTS */
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                <Layers size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Reverse Candidate Ranking
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Rank entire applicant pools for any active job posting in a single batched operation with sortable tables and scores.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Auditable Two-Column Evidence
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Eliminate hiring bias and guesswork. Inspect the exact phrasing where the candidate proved capability relative to job criteria.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Token & Latency Optimized
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Batched prompt architecture eliminates costly loop calls to Gemini, capping tokens while ensuring enterprise-grade speed.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* FINAL CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="p-10 md:p-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              Ready to Experience Truly Intelligent Talent Matching?
            </h2>
            <p className="mt-3 text-blue-100 text-sm leading-relaxed">
              Create your account today as an employer or candidate to unlock AI semantic scoring, candidate ranking, and transparent hiring.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link
              to="/auth?mode=signup&role=candidate"
              className="px-6 py-3.5 bg-white text-blue-700 rounded-xl font-bold text-xs hover:bg-blue-50 transition-colors shadow-md text-center"
            >
              Sign Up as Candidate
            </Link>
            <Link
              to="/auth?mode=signup&role=employer"
              className="px-6 py-3.5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-colors shadow-md text-center"
            >
              Sign Up as Employer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
