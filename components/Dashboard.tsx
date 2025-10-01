
import React, { useState, useCallback } from 'react';
import type { AnalysisResult, CoverLetterResult, InterviewQuestionsResult } from '../types';
import { analyzeResumeAndJob, generateCoverLetter, generateInterviewQuestions } from '../services/geminiService';
import Header from './Header';
import ResumeInput from './ResumeInput';
import JobInput from './JobInput';
import AnalysisDisplay from './AnalysisDisplay';
import { Spinner } from './common/Spinner';

interface DashboardProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ isDarkMode, toggleTheme }) => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescriptionText, setJobDescriptionText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [coverLetter, setCoverLetter] = useState<CoverLetterResult | null>(null);
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestionsResult | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'analysis' | 'coverLetter' | 'questions'>('analysis');
  
  const handleAnalyze = useCallback(async () => {
    if (!resumeText || !jobDescriptionText) {
      setError('Please provide both a resume and a job description.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setCoverLetter(null);
    setInterviewQuestions(null);
    setActiveTab('analysis');

    try {
      const result = await analyzeResumeAndJob(resumeText, jobDescriptionText);
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [resumeText, jobDescriptionText]);

  const handleGenerateCoverLetter = useCallback(async () => {
      if (!resumeText || !jobDescriptionText) return;
      setIsLoading(true);
      setError(null);
      try {
          const result = await generateCoverLetter(resumeText, jobDescriptionText);
          setCoverLetter(result);
          setActiveTab('coverLetter');
      } catch (err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
          setIsLoading(false);
      }
  }, [resumeText, jobDescriptionText]);

  const handleGenerateQuestions = useCallback(async () => {
      if (!resumeText) return;
      setIsLoading(true);
      setError(null);
      try {
          const result = await generateInterviewQuestions(resumeText);
          setInterviewQuestions(result);
          setActiveTab('questions');
      } catch (err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
          setIsLoading(false);
      }
  }, [resumeText]);


  return (
    <div className="flex flex-col h-screen">
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <main className="flex-grow p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto">
        <div className="flex flex-col gap-6">
          <ResumeInput value={resumeText} onChange={setResumeText} />
          <JobInput value={jobDescriptionText} onChange={setJobDescriptionText} />
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
            <button
              onClick={handleAnalyze}
              disabled={isLoading || !resumeText || !jobDescriptionText}
              className="w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading && activeTab === 'analysis' ? <Spinner /> : 'Analyze Resume'}
            </button>
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          </div>
        </div>
        <div className="flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          {isLoading ? (
             <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <Spinner size="lg" />
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">AI is analyzing... this may take a moment.</p>
                </div>
             </div>
          ) : analysisResult ? (
            <AnalysisDisplay 
              result={analysisResult} 
              coverLetter={coverLetter}
              interviewQuestions={interviewQuestions}
              onGenerateCoverLetter={handleGenerateCoverLetter}
              onGenerateQuestions={handleGenerateQuestions}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-center p-8">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200">Analysis Results</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Your resume analysis will appear here. Paste your resume and a job description, then click "Analyze Resume" to start.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
   