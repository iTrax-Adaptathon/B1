import React, { useState, useEffect } from 'react';
import { JobPosting, CandidateMatchResult } from '../types/matching';
import { SEED_CANDIDATE_APPLICATIONS } from '../data/seedData';
import EvidenceList from './EvidenceList';
import { ArrowUpDown, ChevronDown, ChevronUp, RefreshCw, AlertCircle } from 'lucide-react';

interface RankedCandidatesTabProps {
  job: JobPosting;
  onBack?: () => void;
}

type SortField = 'matchScore' | 'skillsOverlap' | 'experienceLevelFit' | 'domainRelevance';

export default function RankedCandidatesTab({ job, onBack }: RankedCandidatesTabProps) {
  const [matches, setMatches] = useState<CandidateMatchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('matchScore');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const fetchRankings = async () => {
    setLoading(true);
    setError(null);

    try {
      // Gather submitted applications or fallback to seed applications
      const allApps = JSON.parse(localStorage.getItem('mock_applications') || '[]');
      const jobApps = allApps.filter((a: any) => a.jobId === job.id);

      let resumesToScore = SEED_CANDIDATE_APPLICATIONS.map(c => ({
        candidateId: c.candidateId,
        candidateName: c.candidateName,
        resumeText: c.resumeText
      }));

      // If user applied with custom text
      if (jobApps.length > 0) {
        const customResumes = jobApps.map((a: any, idx: number) => ({
          candidateId: a.candidateId || `cand-${idx}`,
          candidateName: a.candidateName || `Applicant #${idx + 1}`,
          resumeText: a.resumeText || SEED_CANDIDATE_APPLICATIONS[idx % SEED_CANDIDATE_APPLICATIONS.length].resumeText
        }));
        // Merge without duplicating
        const ids = new Set(resumesToScore.map(r => r.candidateId));
        for (const cr of customResumes) {
          if (!ids.has(cr.candidateId)) {
            resumesToScore.push(cr);
          }
        }
      }

      const res = await fetch('/api/match/job-to-resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          job,
          resumes: resumesToScore
        })
      });

      if (!res.ok) {
        throw new Error('Failed to rank candidates via AI semantic engine');
      }

      const data = await res.json();
      setMatches(data.matches || []);
    } catch (err: any) {
      console.error('Candidate ranking failed:', err);
      setError(err.message || 'Error executing candidate ranking');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings();
  }, [job.id]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const sortedMatches = [...matches].sort((a, b) => {
    let valA = 0;
    let valB = 0;

    if (sortField === 'matchScore') {
      valA = a.matchScore;
      valB = b.matchScore;
    } else {
      valA = a.subScores[sortField];
      valB = b.subScores[sortField];
    }

    return sortAsc ? valA - valB : valB - valA;
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6 transition-colors">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 uppercase tracking-wide">
              Semantic Reverse Ranking
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">• Single Batched Gemini Call</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            Ranked Candidates for: <span className="text-blue-600 dark:text-blue-400">{job.title}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Candidates evaluated on underlying skill equivalence rather than literal keyword matching.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchRankings}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-blue-600 dark:text-blue-400' : ''} />
            <span>Re-Rank Candidates</span>
          </button>
          {onBack && (
            <button
              onClick={onBack}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-lg flex items-center justify-between text-xs text-red-800 dark:text-red-300">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-red-600 dark:text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchRankings}
            className="px-3 py-1 bg-red-600 text-white rounded font-medium hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading state skeleton */}
      {loading ? (
        <div className="space-y-3">
          <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse"></div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800 animate-pulse"></div>
          ))}
        </div>
      ) : sortedMatches.length === 0 ? (
        <div className="text-center py-10 text-slate-500 dark:text-slate-400 text-sm">
          No candidate resumes available to rank for this job yet.
        </div>
      ) : (
        /* Candidates Table View */
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Candidate</th>
                <th
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 select-none transition-colors"
                  onClick={() => handleSort('matchScore')}
                >
                  <div className="flex items-center gap-1">
                    <span>Overall Match</span>
                    <ArrowUpDown size={12} className={sortField === 'matchScore' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'} />
                  </div>
                </th>
                <th
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 select-none transition-colors"
                  onClick={() => handleSort('skillsOverlap')}
                >
                  <div className="flex items-center gap-1">
                    <span>Skills Overlap</span>
                    <ArrowUpDown size={12} className={sortField === 'skillsOverlap' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'} />
                  </div>
                </th>
                <th
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 select-none transition-colors"
                  onClick={() => handleSort('experienceLevelFit')}
                >
                  <div className="flex items-center gap-1">
                    <span>Experience Fit</span>
                    <ArrowUpDown size={12} className={sortField === 'experienceLevelFit' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'} />
                  </div>
                </th>
                <th
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 select-none transition-colors"
                  onClick={() => handleSort('domainRelevance')}
                >
                  <div className="flex items-center gap-1">
                    <span>Domain Fit</span>
                    <ArrowUpDown size={12} className={sortField === 'domainRelevance' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'} />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Evidence Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {sortedMatches.map((candidate, idx) => {
                const isExpanded = expandedId === candidate.candidateId;
                const scoreColor =
                  candidate.matchScore >= 75
                    ? 'text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/60 border-green-200 dark:border-green-800'
                    : candidate.matchScore >= 50
                    ? 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800'
                    : 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-800';

                return (
                  <React.Fragment key={candidate.candidateId || idx}>
                    <tr
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${
                        isExpanded ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                      }`}
                      onClick={() => setExpandedId(isExpanded ? null : candidate.candidateId)}
                    >
                      {/* Candidate Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs">
                            {candidate.candidateName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white text-sm">
                              {candidate.candidateName}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                              ID: {candidate.candidateId}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Match Score */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-extrabold text-xs border ${scoreColor}`}>
                          {candidate.matchScore}%
                        </span>
                      </td>

                      {/* Skills Overlap */}
                      <td className="py-3.5 px-4">
                        <div className="w-24">
                          <div className="flex justify-between text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                            <span>{candidate.subScores.skillsOverlap}%</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-1.5 rounded-full ${
                                candidate.subScores.skillsOverlap >= 75
                                  ? 'bg-green-500'
                                  : candidate.subScores.skillsOverlap >= 50
                                  ? 'bg-amber-500'
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${candidate.subScores.skillsOverlap}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      {/* Experience Fit */}
                      <td className="py-3.5 px-4">
                        <div className="w-24">
                          <div className="flex justify-between text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                            <span>{candidate.subScores.experienceLevelFit}%</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-1.5 rounded-full ${
                                candidate.subScores.experienceLevelFit >= 75
                                  ? 'bg-green-500'
                                  : candidate.subScores.experienceLevelFit >= 50
                                  ? 'bg-amber-500'
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${candidate.subScores.experienceLevelFit}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      {/* Domain Fit */}
                      <td className="py-3.5 px-4">
                        <div className="w-24">
                          <div className="flex justify-between text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                            <span>{candidate.subScores.domainRelevance}%</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-1.5 rounded-full ${
                                candidate.subScores.domainRelevance >= 75
                                  ? 'bg-green-500'
                                  : candidate.subScores.domainRelevance >= 50
                                  ? 'bg-amber-500'
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${candidate.subScores.domainRelevance}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      {/* Expand Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium py-1 px-2 rounded hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                        >
                          <span>{isExpanded ? 'Hide' : 'Evidence'}</span>
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Evidence Row */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={6} className="bg-slate-50/90 dark:bg-slate-950/50 p-4 border-t border-b border-slate-200 dark:border-slate-800">
                          <div className="max-w-4xl mx-auto">
                            <EvidenceList
                              summary={candidate.summary}
                              matchedEvidence={candidate.matchedEvidence}
                              gaps={candidate.gaps}
                              defaultExpanded={true}
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
