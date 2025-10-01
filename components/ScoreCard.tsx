
import React from 'react';

interface ScoreCardProps {
  title: string;
  score: number;
  description: string;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ title, score, description }) => {
  const circumference = 2 * Math.PI * 45; // a bit smaller than half the width/height
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = (s: number) => {
    if (s >= 85) return 'text-green-500';
    if (s >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStrokeColor = (s: number) => {
    if (s >= 85) return 'stroke-green-500';
    if (s >= 60) return 'stroke-yellow-500';
    return 'stroke-red-500';
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex items-center space-x-4">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            className="text-gray-200 dark:text-gray-700"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
          <circle
            className={getStrokeColor(score)}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.5s ease-out' }}
          />
        </svg>
        <div className={`absolute inset-0 flex items-center justify-center text-2xl font-bold ${getScoreColor(score)}`}>
          {score}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-700 dark:text-gray-200">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </div>
  );
};
   