import React from 'react';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showTierBadge?: boolean;
}

export default function ScoreRing({
  score,
  size = 72,
  strokeWidth = 6,
  label = "Match",
  showTierBadge = false
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
  const offset = circumference - (clampedScore / 100) * circumference;

  // Tier color definitions: Green >= 75, Yellow 50-74, Red < 50
  let strokeColor = "#ef4444"; // red-500
  let textColor = "text-red-600";
  let bgBadge = "bg-red-50 text-red-700 border-red-200";
  let tierLabel = "Low Fit";

  if (clampedScore >= 75) {
    strokeColor = "#16a34a"; // green-600
    textColor = "text-green-600";
    bgBadge = "bg-green-50 text-green-700 border-green-200";
    tierLabel = "Strong Match";
  } else if (clampedScore >= 50) {
    strokeColor = "#eab308"; // yellow-500
    textColor = "text-amber-600";
    bgBadge = "bg-amber-50 text-amber-700 border-amber-200";
    tierLabel = "Moderate Fit";
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-base font-black tracking-tight ${textColor}`}>
            {clampedScore}%
          </span>
          {label && (
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {label}
            </span>
          )}
        </div>
      </div>
      {showTierBadge && (
        <span className={`mt-1.5 px-2 py-0.5 text-[11px] font-semibold rounded-full border ${bgBadge}`}>
          {tierLabel}
        </span>
      )}
    </div>
  );
}
