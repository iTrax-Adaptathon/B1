import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, Plus, Users, Database, Building2, Award, UserCheck } from 'lucide-react';
import RankedCandidatesTab from './components/RankedCandidatesTab';
import { initializeSeedData, SEED_JOBS } from './data/seedData';

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedJobForRanking, setSelectedJobForRanking] = useState<any | null>(null);
  
  // New job form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [location, setLocation] = useState('');

  const handleLoadSeedData = () => {
    initializeSeedData(true, user?.uid);
    const allJobs = JSON.parse(localStorage.getItem('mock_jobs') || '[]');
    setJobs(allJobs.filter((j: any) => j.employerId === user?.uid));
  };

  useEffect(() => {
    if (!user) return;
    
    // Fetch jobs from local storage
    const fetchJobs = () => {
      let allJobs = JSON.parse(localStorage.getItem('mock_jobs') || '[]');
      if (allJobs.length === 0) {
        initializeSeedData(false, user.uid);
        allJobs = JSON.parse(localStorage.getItem('mock_jobs') || '[]');
      }
      let employerJobs = allJobs.filter((j: any) => j.employerId === user.uid || (!j.employerId && user.uid === 'mock-user-123'));
      if (employerJobs.length === 0) {
        initializeSeedData(true, user.uid);
        allJobs = JSON.parse(localStorage.getItem('mock_jobs') || '[]');
        employerJobs = allJobs.filter((j: any) => j.employerId === user.uid);
      }
      setJobs(employerJobs);
    };

    fetchJobs();

    // Poll for changes in this basic demo app
    const interval = setInterval(fetchJobs, 2000);
    return () => clearInterval(interval);
  }, [user]);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    
    const newJob = {
      id: Date.now().toString(),
      title,
      description,
      requirements,
      location,
      employerId: user?.uid,
      companyName: user?.company || user?.displayName || "Demo Company",
      status: 'open',
      createdAt: new Date().toISOString()
    };
    
    const allJobs = JSON.parse(localStorage.getItem('mock_jobs') || '[]');
    allJobs.push(newJob);
    localStorage.setItem('mock_jobs', JSON.stringify(allJobs));
    
    setJobs([...jobs, newJob]);
    setTitle('');
    setDescription('');
    setRequirements('');
    setLocation('');
    setIsCreating(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Employer Profile Overview Banner */}
      {user && (
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
          <div className="flex items-start sm:items-center gap-4">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.displayName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500/40 shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-sm">
                {user.displayName.charAt(0)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">{user.displayName}</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  Employer
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                {user.company && (
                  <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                    <Building2 size={13} className="text-blue-500" />
                    <span>{user.company}</span>
                  </span>
                )}
                {user.qualifications && (
                  <span className="flex items-center gap-1">
                    <Award size={13} className="text-amber-500" />
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
            <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <UserCheck size={14} className="text-green-500" />
              <span>Verified Employer</span>
            </span>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Active Job Postings</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your open positions and screen candidate pools using the AI Semantic Ranker.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleLoadSeedData}
            title="Populate or reset the 5 standardized seed jobs"
            className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-3.5 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold transition-colors"
          >
            <Database size={15} />
            Reset / Load Seed Jobs
          </button>
          <Link 
            to="/screening" 
            className="flex items-center gap-2 bg-slate-900 dark:bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold"
          >
            <FileText size={16} />
            AI Resume Screening
          </Link>
          <button 
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-xs font-semibold"
          >
            <Plus size={16} />
            Post a Job
          </button>
        </div>
      </div>

      {/* Job Creation Form */}
      {isCreating && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">New Job Posting</h2>
          <form onSubmit={handleCreateJob} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Job Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs text-slate-900 dark:text-white"
                required
                placeholder="e.g. Senior Frontend Engineer"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Location / Type</label>
              <input 
                type="text" 
                value={location} 
                onChange={e => setLocation(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs text-slate-900 dark:text-white"
                required
                placeholder="e.g. Remote, Hybrid, New York"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Job Description</label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs text-slate-900 dark:text-white h-24"
                placeholder="Describe the responsibilities..."
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Requirements</label>
              <textarea 
                value={requirements} 
                onChange={e => setRequirements(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs text-slate-900 dark:text-white h-24"
                placeholder="List skills, experience, and other requirements..."
                required
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button 
                type="button" 
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-semibold"
              >
                Post Job
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Selected Job Reverse Ranking View */}
      {selectedJobForRanking && (
        <RankedCandidatesTab
          job={selectedJobForRanking}
          onBack={() => setSelectedJobForRanking(null)}
        />
      )}

      {/* Jobs Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map(job => (
          <div key={job.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">{job.title}</h3>
              <Briefcase className="text-blue-500" size={20} />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs mb-2 font-semibold">{job.location}</p>
            <p className="text-slate-600 dark:text-slate-300 text-xs mb-4 flex-grow line-clamp-3 leading-relaxed">{job.description}</p>
            
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-auto gap-2">
              <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${
                job.status === 'open' 
                  ? 'bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}>
                {job.status.toUpperCase()}
              </span>

              <button
                type="button"
                onClick={() => setSelectedJobForRanking(job)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-bold transition-colors"
              >
                <Users size={14} />
                <span>Ranked Candidates</span>
              </button>
            </div>
          </div>
        ))}

        {jobs.length === 0 && !isCreating && (
          <div className="col-span-full text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
            No jobs posted yet. Click "Post a Job" or "Reset / Load Seed Jobs" to start seeking talent.
          </div>
        )}
      </div>
    </div>
  );
}
