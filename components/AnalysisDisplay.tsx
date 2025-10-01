
import React from 'react';
import type { AnalysisResult, CoverLetterResult, InterviewQuestionsResult } from '../types';
import { ScoreCard } from './ScoreCard';

interface AnalysisDisplayProps {
  result: AnalysisResult;
  coverLetter: CoverLetterResult | null;
  interviewQuestions: InterviewQuestionsResult | null;
  onGenerateCoverLetter: () => void;
  onGenerateQuestions: () => void;
  activeTab: 'analysis' | 'coverLetter' | 'questions';
  setActiveTab: (tab: 'analysis' | 'coverLetter' | 'questions') => void;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ result, coverLetter, interviewQuestions, onGenerateCoverLetter, onGenerateQuestions, activeTab, setActiveTab }) => {

  const TabButton: React.FC<{tabName: 'analysis' | 'coverLetter' | 'questions', label: string}> = ({ tabName, label }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tabName ? 'bg-primary-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Analysis & Tools</h2>
        <div className="mt-3 flex space-x-2 border-b border-gray-200 dark:border-gray-700 pb-3">
          <TabButton tabName="analysis" label="Resume Analysis" />
          <TabButton tabName="coverLetter" label="Cover Letter" />
          <TabButton tabName="questions" label="Interview Questions" />
        </div>
      </div>
      <div className="p-6 flex-grow overflow-y-auto bg-gray-50 dark:bg-gray-900/50">
        {activeTab === 'analysis' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ScoreCard title="Relevance Score" score={result.relevanceScore} description="How well your resume matches the job description." />
              <ScoreCard title="ATS Compatibility" score={result.atsScore} description="How well an Applicant Tracking System can parse your resume." />
            </div>
            <FeedbackSection title="Overall Summary">
              <p className="text-gray-600 dark:text-gray-300">{result.summary}</p>
            </FeedbackSection>
            <FeedbackSection title="Missing Keywords">
              {result.missingKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords.map((keyword, index) => (
                    <span key={index} className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-1 rounded-full dark:bg-red-900 dark:text-red-300">{keyword}</span>
                  ))}
                </div>
              ) : <p className="text-gray-600 dark:text-gray-300">Great job! No critical keywords seem to be missing.</p>}
            </FeedbackSection>
            <FeedbackSection title="Action Verb Suggestions">
                {result.actionVerbSuggestions.map((s, i) => (
                    <div key={i} className="py-2">
                        <p className="text-gray-600 dark:text-gray-300">
                            Replace "<span className="font-semibold text-yellow-600 dark:text-yellow-400">{s.weakVerb}</span>" with stronger alternatives like: <span className="font-semibold text-green-600 dark:text-green-400">{s.strongerAlternatives.join(', ')}</span>.
                        </p>
                    </div>
                ))}
            </FeedbackSection>
            <FeedbackSection title="Quantify Your Achievements">
                {result.quantificationSuggestions.map((s, i) => (
                    <div key={i} className="py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                        <p className="text-gray-600 dark:text-gray-300">
                            Instead of: "<span className="italic">{s.suggestion}</span>"
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                            Try quantifying it, e.g., "<span className="italic font-semibold text-primary-600 dark:text-primary-400">{s.example}</span>"
                        </p>
                    </div>
                ))}
            </FeedbackSection>
            <FeedbackSection title="General Feedback">
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                {result.generalFeedback.map((fb, index) => (
                  <li key={index}>{fb}</li>
                ))}
              </ul>
            </FeedbackSection>
          </div>
        )}
        {activeTab === 'coverLetter' && (
          <div className="animate-fade-in">
            {coverLetter ? (
               <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                 {coverLetter.coverLetter}
               </div>
            ) : (
                <ToolPlaceholder
                    title="AI Cover Letter Generator"
                    description="Generate a professional cover letter tailored to your resume and the job description in seconds."
                    buttonText="Generate Cover Letter"
                    onClick={onGenerateCoverLetter}
                />
            )}
          </div>
        )}
        {activeTab === 'questions' && (
          <div className="animate-fade-in">
            {interviewQuestions ? (
                 <div className="space-y-4">
                     {interviewQuestions.questions.map((q, i) => (
                         <div key={i} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                            <p className="font-semibold text-gray-700 dark:text-gray-200">{i+1}. {q}</p>
                         </div>
                     ))}
                 </div>
            ) : (
                 <ToolPlaceholder
                    title="AI Interview Question Generator"
                    description="Get a list of potential interview questions based on your resume to help you prepare."
                    buttonText="Generate Questions"
                    onClick={onGenerateQuestions}
                />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const FeedbackSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-3">{title}</h3>
        {children}
    </div>
);

const ToolPlaceholder: React.FC<{title: string, description: string, buttonText: string, onClick: () => void}> = ({ title, description, buttonText, onClick}) => (
    <div className="text-center p-8">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-md mx-auto">{description}</p>
        <button onClick={onClick} className="mt-6 bg-primary-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-700 transition-colors">
            {buttonText}
        </button>
    </div>
);


export default AnalysisDisplay;
   