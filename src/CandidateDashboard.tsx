import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { Briefcase, Building2, MapPin, X } from 'lucide-react';

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

  useEffect(() => {
    if (!user) return;
    
    const fetchJobs = () => {
      const allJobs = JSON.parse(localStorage.getItem('mock_jobs') || '[]');
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
      appliedAt: new Date().toISOString()
    });
    localStorage.setItem('mock_applications', JSON.stringify(allApps));
    
    setAppliedJobs(prev => new Set([...prev, jobId]));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Jobs</h1>
      
      {jobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500">No jobs are currently available. Check back later!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map(job => {
            const isApplied = appliedJobs.has(job.id);
            return (
              <div 
                key={job.id} 
                onClick={() => setSelectedJob(job)}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col hover:border-blue-300 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-xl">{job.title}</h3>
                </div>
                <div className="flex flex-col gap-1 mb-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Building2 size={16} />
                    <span>{job.companyName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{job.location}</span>
                  </div>
                </div>
                
                <p className="text-slate-700 text-sm mb-6 flex-grow line-clamp-4">{job.description}</p>
                
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                    job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {job.status.toUpperCase()}
                  </span>
                  
                  <button 
                    onClick={(e) => handleApply(e, job.id)}
                    disabled={isApplied}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isApplied 
                        ? 'bg-green-100 text-green-700 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isApplied ? 'Applied' : 'Apply Now'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedJob && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div 
            className="bg-white rounded-xl max-w-2xl w-full p-8 relative flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedJob(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition-colors"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-3xl font-bold mb-4 pr-12 text-slate-900">{selectedJob.title}</h2>
            
            <div className="flex gap-6 text-slate-600 mb-6 border-b border-slate-200 pb-6">
              <div className="flex items-center gap-2">
                <Building2 size={18} />
                <span className="font-medium">{selectedJob.companyName}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                <span className="font-medium">{selectedJob.location}</span>
              </div>
            </div>
            
            <div className="flex-grow overflow-y-auto pr-4 mb-6 space-y-6">
              <div>
                <h3 className="font-semibold text-lg text-slate-900 mb-2">About the Role</h3>
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {selectedJob.description}
                </p>
              </div>
              
              {selectedJob.requirements && (
                <div>
                  <h3 className="font-semibold text-lg text-slate-900 mb-2">Requirements</h3>
                  <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {selectedJob.requirements}
                  </p>
                </div>
              )}
            </div>
            
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
              <span className={`px-3 py-1.5 text-sm font-bold rounded-full ${
                selectedJob.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
              }`}>
                {selectedJob.status === 'open' ? 'Accepting Applications' : selectedJob.status.toUpperCase()}
              </span>
              <button
                onClick={(e) => handleApply(e, selectedJob.id)}
                disabled={appliedJobs.has(selectedJob.id)}
                className={`px-8 py-3 rounded-lg font-bold transition-colors shadow-sm ${
                  appliedJobs.has(selectedJob.id) 
                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
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
