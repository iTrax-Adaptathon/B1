import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { MatchResult, JobPosting } from '../types/matching';
import { SEED_JOBS, SAMPLE_RESUMES, initializeSeedData } from '../data/seedData';
import ScoreRing from '../components/ScoreRing';
import SubScoreBarChart from '../components/SubScoreBarChart';
import EvidenceList from '../components/EvidenceList';
import MatchSkeleton from '../components/MatchSkeleton';
import { 
  Sparkles, 
  Upload, 
  FileText, 
  Building2, 
  MapPin, 
  AlertCircle, 
  Info
} from 'lucide-react';

export default function MatchesPage() {
  const { user } = useAuth();
  const [resumeText, setResumeText] = useState<string>('');
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [parsingFile, setParsingFile] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [truncated, setTruncated] = useState<boolean>(false);

  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [filterTier, setFilterTier] = useState<'all' | 'high' | 'moderate' | 'low'>('all');

  // Load jobs and existing applications
  useEffect(() => {
    initializeSeedData();
    const storedJobs = JSON.parse(localStorage.getItem('mock_jobs') || '[]');
    setJobs(storedJobs.length > 0 ? storedJobs : SEED_JOBS);

    const storedApps = JSON.parse(localStorage.getItem('mock_applications') || '[]');
    if (user) {
      const userApps = storedApps
        .filter((a: any) => a.candidateId === user.uid)
        .map((a: any) => a.jobId);
      setAppliedJobIds(new Set(userApps));
    }
  }, [user]);

  // Quick-load a sample resume
  const handleSelectSampleResume = (id: string) => {
    const sample = SAMPLE_RESUMES.find(r => r.id === id);
    if (sample) {
      setSelectedResumeId(sample.id);
      setFile(null);
      setResumeText(sample.text);
      setError(null);
    }
  };

  // Handle PDF file upload and parse
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setSelectedResumeId(null);
    setParsingFile(true);
    setError(null);

    const formData = new FormData();
    formData.append('resume', uploadedFile);

    try {
      const res = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to parse uploaded PDF resume');
      }

      const data = await res.json();
      if (data.rawText) {
        setResumeText(data.rawText);
      }
    } catch (err: any) {
      console.error(err);
      setError('Could not extract text from the PDF. You can paste your resume text below directly.');
    } finally {
      setParsingFile(false);
    }
  };

  // Run the Batched Semantic Matcher
  const handleMatch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!resumeText.trim()) {
      setError('Please paste your resume text or select one of the sample resumes.');
      return;
    }

    setLoading(true);
    setError(null);
    setTruncated(false);

    try {
      const allJobs = JSON.parse(localStorage.getItem('mock_jobs') || '[]');
      const targetJobs = allJobs.length > 0 ? allJobs : SEED_JOBS;

      const res = await fetch('/api/match/resume-to-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          jobs: targetJobs
        })
      });

      if (!res.ok) {
        throw new Error('Failed to compute semantic match scores. Please try again.');
      }

      const data = await res.json();
      const rawMatches: MatchResult[] = data.matches || [];
      
      // Sort matches descending by matchScore
      const sorted = [...rawMatches].sort((a, b) => b.matchScore - a.matchScore);
      setMatches(sorted);
      setTruncated(!!data.truncated);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred while contacting semantic scoring engine.');
    } finally {
      setLoading(false);
    }
  };

  // Handle application click
  const handleApply = (jobId: string) => {
    if (appliedJobIds.has(jobId)) return;

    const allApps = JSON.parse(localStorage.getItem('mock_applications') || '[]');
    allApps.push({
      id: Date.now().toString(),
      jobId,
      candidateId: user?.uid || 'guest-candidate',
      candidateName: user?.displayName || 'Candidate',
      resumeText,
      appliedAt: new Date().toISOString()
    });
    localStorage.setItem('mock_applications', JSON.stringify(allApps));
    setAppliedJobIds(new Set([...appliedJobIds, jobId]));
  };

  // Map job details to matches
  const jobMap = new Map<string, JobPosting>(jobs.map(j => [j.id, j]));

  // Filter matches by score tier
  const filteredMatches = matches.filter(m => {
    if (filterTier === 'high') return m.matchScore >= 75;
    if (filterTier === 'moderate') return m.matchScore >= 50 && m.matchScore < 75;
    if (filterTier === 'low') return m.matchScore < 50;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 mb-2">
            <Sparkles size={14} />
            <span>AI Semantic Match Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Find Your Highest-Scoring Job Matches
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 max-w-2xl">
            Our AI evaluates your underlying skills, responsibilities, and architectural experience — not just verbatim keywords.
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6 transition-colors">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <FileText size={18} className="text-blue-600 dark:text-blue-400" />
            <span>Step 1: Choose or Provide Your Resume</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Pick one of our pre-configured sample resumes to see how differing terminology maps to job requirements, or paste your own resume.
          </p>

          {/* Sample Resumes Grid */}
          <div className="grid md:grid-cols-3 gap-3 mb-4">
            {SAMPLE_RESUMES.map(sample => {
              const isSelected = selectedResumeId === sample.id;
              return (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleSelectSampleResume(sample.id)}
                  className={`text-left p-3.5 rounded-lg border text-xs transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 dark:border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 shadow-xs ring-1 ring-blue-500'
                      : 'border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100/80 dark:hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 dark:text-white">{sample.name}</span>
                      {isSelected && <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">Active</span>}
                    </div>
                    <div className="text-slate-600 dark:text-slate-300 font-medium mb-1.5">{sample.roleTitle}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 italic line-clamp-2">"{sample.expectedFit}"</div>
                  </div>
                  <div className="mt-3 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                    {isSelected ? '✓ Selected' : 'Load Sample →'}
                  </div>
                </button>
              );
            })}
          </div>

          {/* File Upload Option */}
          <div className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 mb-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Upload size={16} className="text-slate-500 dark:text-slate-400" />
              <span>Or Upload PDF Resume:</span>
            </div>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
            />
            {parsingFile && <span className="text-xs text-blue-600 dark:text-blue-400 font-medium animate-pulse">Extracting text from PDF...</span>}
            {file && !parsingFile && <span className="text-xs text-green-700 dark:text-green-400 font-medium">✓ {file.name} loaded</span>}
          </div>

          {/* Resume Textarea */}
          <div>
            <div className="flex justify-between items-center mb-1 text-xs font-medium text-slate-600 dark:text-slate-400">
              <label>Resume Content</label>
              <span>{resumeText.length.toLocaleString()} characters {resumeText.length > 5000 && '(will be truncated to 5,000)'}</span>
            </div>
            <textarea
              rows={5}
              value={resumeText}
              onChange={e => {
                setResumeText(e.target.value);
                setSelectedResumeId(null);
              }}
              placeholder="Paste candidate resume text here, or select a sample resume above..."
              className="w-full text-xs font-mono p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Truncation warning notice */}
        {truncated && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-lg text-xs text-amber-800 dark:text-amber-300">
            <Info size={16} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <span>Note: Resume content was gracefully truncated to 5,000 characters to optimize token usage and latency.</span>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-lg text-xs text-red-800 dark:text-red-300">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-red-600 dark:text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => handleMatch()}
              className="px-3 py-1 bg-red-600 text-white rounded font-medium hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          {resumeText && (
            <button
              type="button"
              onClick={() => {
                setResumeText('');
                setSelectedResumeId(null);
                setFile(null);
                setMatches([]);
              }}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-medium"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={() => handleMatch()}
            disabled={loading || !resumeText.trim()}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-xs"
          >
            <Sparkles size={16} />
            <span>{loading ? 'Analyzing Batched Jobs with AI...' : 'Match Against All Open Jobs'}</span>
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        {loading && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <Sparkles size={14} className="text-blue-500 animate-spin" />
              <span>Evaluating semantic equivalence across {jobs.length} jobs in a single batched prompt...</span>
            </div>
            <MatchSkeleton count={3} />
          </div>
        )}

        {!loading && matches.length > 0 && (
          <div className="space-y-4">
            {/* Filter / Sort bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Ranked Results:</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Showing {filteredMatches.length} of {matches.length} jobs, sorted by Match Score descending
                </span>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
                <button
                  onClick={() => setFilterTier('all')}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    filterTier === 'all' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  All ({matches.length})
                </button>
                <button
                  onClick={() => setFilterTier('high')}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    filterTier === 'high' ? 'bg-white dark:bg-slate-700 text-green-700 dark:text-green-400 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  High Fit (≥75%)
                </button>
                <button
                  onClick={() => setFilterTier('moderate')}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    filterTier === 'moderate' ? 'bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-400 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Moderate (50–74%)
                </button>
                <button
                  onClick={() => setFilterTier('low')}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    filterTier === 'low' ? 'bg-white dark:bg-slate-700 text-red-700 dark:text-red-400 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Low (&lt;50%)
                </button>
              </div>
            </div>

            {/* Match Cards List */}
            <div className="space-y-4">
              {filteredMatches.map(match => {
                const job = jobMap.get(match.jobId);
                const isApplied = appliedJobIds.has(match.jobId);

                return (
                  <div
                    key={match.jobId}
                    className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 transition-all hover:border-blue-400 dark:hover:border-blue-500"
                  >
                    {/* Header with Title and Score Ring */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                            {job?.title || `Job #${match.jobId}`}
                          </h3>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400 mb-3">
                          <div className="flex items-center gap-1.5">
                            <Building2 size={14} className="text-slate-400 dark:text-slate-500" />
                            <span>{job?.companyName || 'TalentConnect Partner'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-slate-400 dark:text-slate-500" />
                            <span>{job?.location || 'Remote'}</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                          {job?.description}
                        </p>
                      </div>

                      {/* Score Ring Component */}
                      <div className="flex-shrink-0 flex items-center justify-center pl-2">
                        <ScoreRing score={match.matchScore} size={84} strokeWidth={7} showTierBadge={true} />
                      </div>
                    </div>

                    {/* Middle: SubScores Horizontal Bar Chart */}
                    <div className="mt-4">
                      <SubScoreBarChart subScores={match.subScores} />
                    </div>

                    {/* Expandable Evidence Mapping */}
                    <EvidenceList
                      summary={match.summary}
                      matchedEvidence={match.matchedEvidence}
                      gaps={match.gaps}
                      defaultExpanded={false}
                    />

                    {/* Card Footer with Apply Action */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        Job ID: {match.jobId}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleApply(match.jobId)}
                        disabled={isApplied}
                        className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                          isApplied
                            ? 'bg-green-100 dark:bg-green-950/60 text-green-800 dark:text-green-300 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
                        }`}
                      >
                        {isApplied ? '✓ Application Submitted' : 'Apply for this Job'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
