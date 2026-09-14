import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { SubScores } from '../types/matching';
import { useTheme } from '../ThemeContext';

interface SubScoreBarChartProps {
  subScores: SubScores;
}

export default function SubScoreBarChart({ subScores }: SubScoreBarChartProps) {
  const { isDark } = useTheme();

  const data = [
    {
      name: 'Skills Overlap',
      score: subScores.skillsOverlap,
      color: subScores.skillsOverlap >= 75 ? '#16a34a' : subScores.skillsOverlap >= 50 ? '#eab308' : '#ef4444'
    },
    {
      name: 'Experience Fit',
      score: subScores.experienceLevelFit,
      color: subScores.experienceLevelFit >= 75 ? '#16a34a' : subScores.experienceLevelFit >= 50 ? '#eab308' : '#ef4444'
    },
    {
      name: 'Domain Match',
      score: subScores.domainRelevance,
      color: subScores.domainRelevance >= 75 ? '#16a34a' : subScores.domainRelevance >= 50 ? '#eab308' : '#ef4444'
    }
  ];

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-800/70 rounded-lg p-3 border border-slate-100 dark:border-slate-800 transition-colors">
      <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 flex justify-between items-center">
        <span>Sub-Score Breakdown</span>
        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-normal">Scale 0–100</span>
      </div>
      <div className="h-[95px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 2, right: 35, left: 10, bottom: 2 }}
          >
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tickLine={false}
              width={90}
              tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b', fontWeight: 500 }}
            />
            <Tooltip
              formatter={(val: any) => [`${val}%`, 'Score']}
              contentStyle={{
                backgroundColor: isDark ? '#0f172a' : '#ffffff',
                borderColor: isDark ? '#334155' : '#e2e8f0',
                color: isDark ? '#f8fafc' : '#0f172a',
                borderRadius: '0.375rem',
                fontSize: '12px',
                padding: '4px 8px'
              }}
            />
            <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={12}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-1 pt-1 border-t border-slate-200/60 dark:border-slate-700/60 text-center">
        <div>
          <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-medium">Skills</span>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{subScores.skillsOverlap}%</span>
        </div>
        <div>
          <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-medium">Experience</span>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{subScores.experienceLevelFit}%</span>
        </div>
        <div>
          <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-medium">Domain</span>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{subScores.domainRelevance}%</span>
        </div>
      </div>
    </div>
  );
}
