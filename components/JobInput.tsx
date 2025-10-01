
import React from 'react';

interface JobInputProps {
  value: string;
  onChange: (value: string) => void;
}

const JobInput: React.FC<JobInputProps> = ({ value, onChange }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Job Description</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Paste the job description you're applying for.</p>
      </div>
      <div className="p-4 flex-grow">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste the job description here..."
          className="w-full h-full min-h-[200px] p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition resize-none"
        />
      </div>
    </div>
  );
};

export default JobInput;
   