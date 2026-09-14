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
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResumeText(data.rawText);
      setResumeSummary(data.summary);
    } catch (err) {
      console.error(err);
      alert('Failed to parse resume');
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
      <h1 className="text-3xl font-bold mb-8">AI Resume Screening</h1>
      
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Left Column: Upload & Parse */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Upload size={20} />
              Upload Resume
            </h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <input 
                type="file" 
                accept=".pdf"
                onChange={e => setFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              <button 
                type="submit" 
                disabled={!file || isUploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isUploading ? 'Parsing...' : 'Analyze Resume'}
              </button>
            </form>

            {resumeSummary && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <FileText size={18} className="text-blue-600" />
                  AI Summary
                </h3>
                <div className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 p-4 rounded-lg">
                  {resumeSummary}
                </div>
              </div>
            )}
          </div>

          {/* Saved Applicants */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Saved Candidates</h2>
            {savedApplicants.length === 0 ? (
              <p className="text-sm text-slate-500">No candidates saved yet.</p>
            ) : (
              <div className="space-y-4">
                {savedApplicants.map(app => (
                  <div key={app.id} className="border border-slate-100 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{app.candidateName}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        app.compatibilityPercentage >= 80 ? 'bg-green-100 text-green-700' :
                        app.compatibilityPercentage >= 50 ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {app.compatibilityPercentage}% Match
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">Job: {app.jobTitle}</p>
                    <p className="text-sm text-slate-600 line-clamp-2">{app.resumeSummary}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Job Matching */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Briefcase size={20} />
              Find Job Description
            </h2>
            <form onSubmit={handleSearchJobs} className="flex gap-2 mb-6">
              <input 
                type="text" 
                placeholder="e.g. Frontend Developer"
                value={jobQuery}
                onChange={e => setJobQuery(e.target.value)}
                className="flex-grow border border-slate-300 rounded-lg p-2"
              />
              <button 
                type="submit"
                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 flex items-center gap-2"
              >
                <Search size={18} />
                Search
              </button>
            </form>

            <div className="space-y-4 max-h-[300px] overflow-y-auto">
              {jobs.map(job => (
                <div key={job.id} className="p-4 border border-slate-100 rounded-lg hover:border-blue-300 transition-colors">
                  <h4 className="font-semibold">{job.title}</h4>
                  <p className="text-xs text-slate-500 mb-3">{job.company_name}</p>
                  <button
                    onClick={() => handleRank(job)}
                    disabled={isRanking || !resumeText}
                    className="text-sm px-3 py-1.5 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 font-medium disabled:opacity-50"
                  >
                    {isRanking && selectedJob?.id === job.id ? 'Analyzing...' : 'Rank Candidate Against Job'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {rankingResult && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Percent size={20} />
                  Match Results
                </h2>
                <div className="text-right">
                  <div className={`text-3xl font-extrabold ${
                    rankingResult.compatibilityPercentage >= 80 ? 'text-green-600' :
                    rankingResult.compatibilityPercentage >= 50 ? 'text-amber-500' :
                    'text-red-500'
                  }`}>
                    {rankingResult.compatibilityPercentage}%
                  </div>
                  <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Compatibility</div>
                </div>
              </div>

              <p className="text-slate-700 mb-6 italic border-l-4 border-slate-200 pl-4">
                "{rankingResult.explanation}"
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold flex items-center gap-2 text-green-700 mb-3">
                    <CheckCircle size={16} /> Key Matches
                  </h4>
                  <ul className="space-y-2">
                    {rankingResult.keyMatches?.map((match: string, i: number) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">•</span>
                        <span>{match}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold flex items-center gap-2 text-red-700 mb-3">
                    <AlertCircle size={16} /> Skills Gaps
                  </h4>
                  <ul className="space-y-2">
                    {rankingResult.skillsGaps?.map((gap: string, i: number) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button 
                onClick={handleSaveApplicant}
                className="w-full py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
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
