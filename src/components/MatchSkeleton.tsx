import React from 'react';

export default function MatchSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs animate-pulse"
        >
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
            <div className="flex-1 space-y-2.5">
              {/* Title & Location skeleton */}
              <div className="h-6 bg-slate-200 rounded w-2/5"></div>
              <div className="h-4 bg-slate-100 rounded w-1/4"></div>
              {/* Description skeleton */}
              <div className="space-y-1.5 pt-2">
                <div className="h-3.5 bg-slate-100 rounded w-full"></div>
                <div className="h-3.5 bg-slate-100 rounded w-5/6"></div>
              </div>
            </div>

            {/* Score Ring Skeleton */}
            <div className="flex flex-col items-center justify-center p-2">
              <div className="w-16 h-16 rounded-full border-4 border-slate-200 bg-slate-50 flex items-center justify-center">
                <div className="w-6 h-4 bg-slate-200 rounded"></div>
              </div>
              <div className="w-12 h-3 bg-slate-200 rounded mt-2"></div>
            </div>
          </div>

          {/* Subscores Bar Chart Skeleton */}
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 space-y-2">
            <div className="h-3 bg-slate-200 rounded w-1/4"></div>
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-4/5"></div>
            <div className="h-4 bg-slate-200 rounded w-3/5"></div>
          </div>

          {/* Collapsible toggle skeleton */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
            <div className="h-8 bg-slate-200 rounded w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
