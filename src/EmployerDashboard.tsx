import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, Plus, Users } from 'lucide-react';

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  
  // New job form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    if (!user) return;
    
    // Fetch jobs from local storage
    const fetchJobs = () => {
      const allJobs = JSON.parse(localStorage.getItem('mock_jobs') || '[]');
      setJobs(allJobs.filter((j: any) => j.employerId === user.uid));
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
      companyName: user?.displayName || "Demo Company",
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Employer Dashboard</h1>
        <div className="flex gap-4">
          <Link 
            to="/screening" 
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800"
          >
            <FileText size={18} />
            AI Resume Screening
          </Link>
          <button 
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus size={18} />
            Post a Job
          </button>
        </div>
      </div>

      {isCreating && (
        <div className="mb-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold mb-4">New Job Posting</h2>
          <form onSubmit={handleCreateJob} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Job Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2"
                required
                placeholder="e.g. Senior Frontend Engineer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location / Type</label>
              <input 
                type="text" 
                value={location} 
                onChange={e => setLocation(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2"
                required
                placeholder="e.g. Remote, Hybrid, New York"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Job Description</label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 h-24"
                placeholder="Describe the responsibilities..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Requirements</label>
              <textarea 
                value={requirements} 
                onChange={e => setRequirements(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 h-24"
                placeholder="List skills, experience, and other requirements..."
                required
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button 
                type="button" 
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Post Job
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map(job => (
          <div key={job.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-lg">{job.title}</h3>
              <Briefcase className="text-blue-500" size={20} />
            </div>
            <p className="text-slate-600 text-sm mb-2 font-medium">{job.location}</p>
            <p className="text-slate-600 text-sm mb-4 flex-grow line-clamp-3">{job.description}</p>
            
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
              }`}>
                {job.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
        {jobs.length === 0 && !isCreating && (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-500">
            No jobs posted yet. Click "Post a Job" to start seeking talent.
          </div>
        )}
      </div>
    </div>
  );
}
