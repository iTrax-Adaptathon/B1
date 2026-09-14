import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { MatchEvidence } from '../types/matching';

interface EvidenceListProps {
  summary: string;
  matchedEvidence: MatchEvidence[];
  gaps: string[];
  defaultExpanded?: boolean;
}

export default function EvidenceList({
  summary,
  matchedEvidence,
  gaps,
  defaultExpanded = false
}: EvidenceListProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="mt-3 border-t border-slate-100 dark:border-slate-800 pt-3">
      {/* Summary line */}
      {summary && (
        <div className="flex items-start gap-2 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100/80 dark:border-blue-900/50 rounded-lg p-3 text-xs text-blue-900 dark:text-blue-300 mb-3">
          <Sparkles size={16} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-blue-950 dark:text-blue-200">AI Fit Summary: </span>
            {summary}
          </div>
        </div>
      )}

      {/* Expand/Collapse Header Button */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-2 px-3 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
      >
        <span className="flex items-center gap-1.5">
          <span>Semantic Evidence & Gaps</span>
          <span className="px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px]">
            {matchedEvidence.length} matches • {gaps.length} gaps
          </span>
        </span>
        <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
          <span>{isExpanded ? 'Hide Evidence' : 'View Semantic Mapping'}</span>
          {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </span>
      </button>

      {/* Expandable Body */}
      {isExpanded && (
        <div className="mt-3 space-y-4 text-xs animate-in fade-in duration-200">
          {/* Matched Evidence: Two-column layout */}
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-green-600 dark:text-green-400" />
              <span>Semantic Skill Alignments ("Different wording, same skill")</span>
            </h4>

            {matchedEvidence.length === 0 ? (
              <p className="text-slate-400 italic pl-5">No direct semantic equivalence detected.</p>
            ) : (
              <div className="space-y-2.5">
                {matchedEvidence.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-800 shadow-xs"
                  >
                    <div className="grid md:grid-cols-2 gap-3 mb-2">
                      {/* Left: What Resume Said */}
                      <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded border border-slate-200/60 dark:border-slate-700/60">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                          Resume Phrase
                        </div>
                        <p className="text-slate-800 dark:text-slate-200 font-medium italic">
                          "{item.resumePhrase}"
                        </p>
                      </div>

                      {/* Right: What Job Asked For */}
                      <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded border border-slate-200/60 dark:border-slate-700/60">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          Job Requirement
                        </div>
                        <p className="text-slate-800 dark:text-slate-200 font-medium italic">
                          "{item.jobPhrase}"
                        </p>
                      </div>
                    </div>

                    {/* Reasoning explanation */}
                    <div className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 p-2 rounded">
                      <ArrowRight size={13} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-amber-900 dark:text-amber-300">Semantic Equivalence: </span>
                        {item.reasoning}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Gaps Section */}
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
              <AlertCircle size={14} className="text-red-500 dark:text-red-400" />
              <span>Identified Gaps & Missing Requisites</span>
            </h4>
            {gaps.length === 0 ? (
              <p className="text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/30 p-2 rounded text-xs">
                No significant qualification gaps identified relative to this position.
              </p>
            ) : (
              <ul className="space-y-1 pl-1">
                {gaps.map((gap, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                    <span className="text-red-500 dark:text-red-400 font-bold">•</span>
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
