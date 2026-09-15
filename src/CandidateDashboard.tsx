import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';
import { Building2, MapPin, X, Sparkles, ArrowRight, Award, Briefcase } from 'lucide-react';
import { initializeSeedData } from './data/seedData';

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

  useEffect(() => {
    if (!user) return;
    
    const fetchJobs = () => {
      let allJobs = JSON.parse(localStorage.getItem('mock_jobs') || '[]');
      if (allJobs.length === 0) {
        initializeSeedData();
        allJobs = JSON.parse(localStorage.getItem('mock_jobs') || '[]');
      }
      setJobs(allJobs); // Candidates can see all jobs
      
      const allApps = JSON.parse(localStorage.getItem('mock_applications') || '[]');
      const userApps = allApps
        .filter((a: any) => a.candidateId === user.uid)
        .map((a: any) => a.jobId);
      setAppliedJobs(new Set(userApps));
    };

    fetchJobs();
    const interval = setInterval(fetchJobs, 2000);
    return () => clearInterval(interval);
  }, [user]);

  const handleApply = (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    if (appliedJobs.has(jobId)) return;
    
    const allApps = JSON.parse(localStorage.getItem('mock_applications') || '[]');
    allApps.push({
      id: Date.now().toString(),
      jobId,
      candidateId: user?.uid,
      candidateName: user?.displayName || 'Candidate',
      resumeText: user?.bio ? `${user.displayName} - ${user.targetRole || ''}. ${user.qualifications || ''}. ${user.bio}` : undefined,
      appliedAt: new Date().toISOString()
    });
    localStorage.setItem('mock_applications', JSON.stringify(allApps));
    
    setAppliedJobs(prev => new Set([...prev, jobId]));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Candidate Profile Overview Banner */}
      {user && (
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
          <div className="flex items-start sm:items-center gap-4">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.displayName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-green-500/40 shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-green-600 text-white flex items-center justify-center font-bold text-xl shadow-sm">
                {user.displayName.charAt(0)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">{user.displayName}</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300">
                  Candidate Profile
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                {user.targetRole && (
                  <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                    <Briefcase size={13} className="text-green-500" />
                    <span>{user.targetRole}</span>
                  </span>
                )}
                {user.qualifications && (
                  <span className="flex items-center gap-1">
                    <Award size={13} className="text-blue-500" />
                    <span>{user.qualifications}</span>
                  </span>
                )}
              </div>

              {user.bio && (
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 max-w-2xl leading-relaxed italic">
                  "{user.bio}"
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300">
              {appliedJobs.size} Applications Submitted
            </span>
          </div>
        </div>
      )}

      {/* AI Semantic Matcher Callout Banner */}
      <div className="p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white mb-2">
            <Sparkles size={13} />
            <span>AI Semantic Job Matcher</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Upload Your Resume & Get Ranked Job Matches</h2>
          <p className="text-blue-100 text-xs mt-1 max-w-xl">
            Our AI evaluates your underlying skills and experience against all open positions in a single batched prompt.
          </p>
        </div>
        <Link
          to="/matches"
          className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 bg-white text-blue-700 rounded-xl font-bold text-xs hover:bg-blue-50 transition-colors shadow-sm"
        >
          <span>Find My Matches</span>
          <ArrowRight size={15} />
        </Link>
      </div>

      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Available Jobs</h1>
      
      {jobs.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400">No jobs are currently available. Check back later!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map(job => {
            const isApplied = appliedJobs.has(job.id);
            return (
              <div 
                key={job.id} 
                onClick={() => setSelectedJob(job)}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-xl text-slate-900 dark:text-white">{job.title}</h3>
                </div>
                <div className="flex flex-col gap-1 mb-4 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Building2 size={15} />
                    <span>{job.companyName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={15} />
                    <span>{job.location}</span>
                  </div>
                </div>
                
                <p className="text-slate-700 dark:text-slate-300 text-xs mb-6 flex-grow line-clamp-4 leading-relaxed">{job.description}</p>
                
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-auto">
                  <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${
                    job.status === 'open' 
                      ? 'bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {job.status.toUpperCase()}
                  </span>
                  
                  <button 
                    onClick={(e) => handleApply(e, job.id)}
                    disabled={isApplied}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      isApplied 
                        ? 'bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isApplied ? '✓ Applied' : 'Apply Now'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-8 relative flex flex-col max-h-[90vh] shadow-2xl transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedJob(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-full p-2 transition-colors"
            >
              <X size={18} />
            </button>
            
            <h2 className="text-2xl font-black mb-3 pr-12 text-slate-900 dark:text-white">{selectedJob.title}</h2>
            
            <div className="flex gap-6 text-slate-600 dark:text-slate-400 text-xs mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Building2 size={16} />
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedJob.companyName}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedJob.location}</span>
              </div>
            </div>
            
            <div className="flex-grow overflow-y-auto pr-4 mb-6 space-y-6 text-xs leading-relaxed">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">About the Role</h3>
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                  {selectedJob.description}
                </p>
              </div>
              
              {selectedJob.requirements && (
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">Requirements</h3>
                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                    {selectedJob.requirements}
                  </p>
                </div>
              )}
            </div>
            
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className={`px-3 py-1.5 text-xs font-bold rounded-full ${
                selectedJob.status === 'open' ? 'bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}>
                {selectedJob.status === 'open' ? 'Accepting Applications' : selectedJob.status.toUpperCase()}
              </span>
              <button
                onClick={(e) => handleApply(e, selectedJob.id)}
                disabled={appliedJobs.has(selectedJob.id)}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-colors shadow-sm ${
                  appliedJobs.has(selectedJob.id) 
                    ? 'bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {appliedJobs.has(selectedJob.id) ? '✓ Application Submitted' : 'Apply for this Job'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
