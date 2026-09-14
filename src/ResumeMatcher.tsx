import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';
import { Upload, Search, Briefcase, FileText, CheckCircle, AlertCircle, Percent } from 'lucide-react';

export default function ResumeMatcher() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [jobQuery, setJobQuery] = useState('');
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [resumeSummary, setResumeSummary] = useState('');
  const [uploadError, setUploadError] = useState('');
  
  const [isRanking, setIsRanking] = useState(false);
  const [rankingResult, setRankingResult] = useState<any>(null);

  const [savedApplicants, setSavedApplicants] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchApplicants = () => {
      const allApps = JSON.parse(localStorage.getItem('mock_applicants') || '[]');
      setSavedApplicants(allApps.filter((a: any) => a.employerId === user.uid));
    };
    fetchApplicants();
    const interval = setInterval(fetchApplicants, 2000);
    return () => clearInterval(interval);
  }, [user]);

  if (!user || user.role !== 'employer') {
    return <Navigate to="/dashboard" />;
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setUploadError('');
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'The resume could not be analyzed.');
      }
      setResumeText(typeof data.rawText === 'string' ? data.rawText : '');
      setResumeSummary(typeof data.summary === 'string' ? data.summary : 'Resume parsed successfully.');
    } catch (err) {
      console.error(err);
      setUploadError(err instanceof Error ? err.message : 'Failed to parse resume.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSearchJobs = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobQuery) return;
    
    try {
      const res = await fetch(`/api/jobs?q=${encodeURIComponent(jobQuery)}`);
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch jobs');
    }
  };

  const handleRank = async (job: any) => {
    if (!resumeText) {
      alert("Please upload and parse a resume first.");
      return;
    }
    
    setSelectedJob(job);
    setIsRanking(true);
    
    try {
      const res = await fetch('/api/rank-applicant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          jobDescription: job.description
        })
      });
      const result = await res.json();
      setRankingResult(result);
    } catch (err) {
      console.error(err);
      alert('Failed to rank applicant');
    } finally {
      setIsRanking(false);
    }
  };

  const handleSaveApplicant = () => {
    if (!rankingResult || !selectedJob) return;
    
    const newApp = {
      id: Date.now().toString(),
      employerId: user.uid,
      candidateName: file?.name || "Unknown Candidate",
      resumeSummary,
      jobTitle: selectedJob.title,
      compatibilityPercentage: rankingResult.compatibilityPercentage,
      keyMatches: rankingResult.keyMatches,
      skillsGaps: rankingResult.skillsGaps,
      createdAt: new Date().toISOString()
    };
    
    const allApps = JSON.parse(localStorage.getItem('mock_applicants') || '[]');
    allApps.push(newApp);
    localStorage.setItem('mock_applicants', JSON.stringify(allApps));
    setSavedApplicants([...savedApplicants, newApp]);
    
    alert("Applicant saved successfully!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8">AI Resume Screening</h1>
      
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Left Column: Upload & Parse */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Upload size={20} className="text-blue-600 dark:text-blue-400" />
              Upload Resume
            </h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <input 
                type="file" 
                accept=".pdf"
                onChange={e => setFile(e.target.files?.[0] || null)}
                className="block w-full text-xs text-slate-500 dark:text-slate-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-xs file:font-semibold
                  file:bg-blue-50 dark:file:bg-blue-950/60 file:text-blue-700 dark:file:text-blue-300
                  hover:file:bg-blue-100"
              />
              <button 
                type="submit" 
                disabled={!file || isUploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-xs font-bold transition-colors"
              >
                {isUploading ? 'Parsing...' : 'Analyze Resume'}
              </button>
            </form>

            {uploadError && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300" role="alert">
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {resumeSummary && (
              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2 text-xs">
                  <FileText size={16} className="text-blue-600 dark:text-blue-400" />
                  AI Summary
                </h3>
                <div className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl leading-relaxed">
                  {resumeSummary}
                </div>
              </div>
            )}
          </div>

          {/* Saved Applicants */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Saved Candidates</h2>
            {savedApplicants.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">No candidates saved yet.</p>
            ) : (
              <div className="space-y-4">
                {savedApplicants.map(app => (
                  <div key={app.id} className="border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-4 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{app.candidateName}</h4>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        app.compatibilityPercentage >= 80 ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300' :
                        app.compatibilityPercentage >= 50 ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' :
                        'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                      }`}>
                        {app.compatibilityPercentage}% Match
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">Job: {app.jobTitle}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{app.resumeSummary}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Job Matching */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Briefcase size={20} className="text-blue-600 dark:text-blue-400" />
              Find Job Description
            </h2>
            <form onSubmit={handleSearchJobs} className="flex gap-2 mb-6">
              <input 
                type="text" 
                placeholder="e.g. Frontend Developer"
                value={jobQuery}
                onChange={e => setJobQuery(e.target.value)}
                className="flex-grow bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs text-slate-900 dark:text-white"
              />
              <button 
                type="submit"
                className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-700 flex items-center gap-2 text-xs font-semibold"
              >
                <Search size={16} />
                Search
              </button>
            </form>

            <div className="space-y-4 max-h-[300px] overflow-y-auto">
              {jobs.map(job => (
                <div key={job.id} className="p-4 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 rounded-xl hover:border-blue-300 dark:hover:border-blue-500 transition-colors">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{job.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{job.company_name}</p>
                  <button
                    onClick={() => handleRank(job)}
                    disabled={isRanking || !resumeText}
                    className="text-xs px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/60 font-semibold disabled:opacity-50"
                  >
                    {isRanking && selectedJob?.id === job.id ? 'Analyzing...' : 'Rank Candidate Against Job'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {rankingResult && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Percent size={20} />
                  Match Results
                </h2>
                <div className="text-right">
                  <div className={`text-3xl font-extrabold ${
                    rankingResult.compatibilityPercentage >= 80 ? 'text-green-600 dark:text-green-400' :
                    rankingResult.compatibilityPercentage >= 50 ? 'text-amber-500 dark:text-amber-400' :
                    'text-red-500 dark:text-red-400'
                  }`}>
                    {rankingResult.compatibilityPercentage}%
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Compatibility</div>
                </div>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 mb-6 italic border-l-4 border-slate-200 dark:border-slate-700 pl-4">
                "{rankingResult.explanation}"
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6 text-xs">
                <div>
                  <h4 className="font-bold flex items-center gap-2 text-green-700 dark:text-green-400 mb-3">
                    <CheckCircle size={15} /> Key Matches
                  </h4>
                  <ul className="space-y-2">
                    {rankingResult.keyMatches?.map((match: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                        <span className="text-green-500 mt-0.5">•</span>
                        <span>{match}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold flex items-center gap-2 text-red-700 dark:text-red-400 mb-3">
                    <AlertCircle size={15} /> Skills Gaps
                  </h4>
                  <ul className="space-y-2">
                    {rankingResult.skillsGaps?.map((gap: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                        <span className="text-red-500 mt-0.5">•</span>
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button 
                onClick={handleSaveApplicant}
                className="w-full py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-700 shadow-sm transition-colors"
              >
                Save Applicant to Local Storage
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
