
export interface ActionVerbSuggestion {
  weakVerb: string;
  strongerAlternatives: string[];
}

export interface ImprovementSuggestion {
  suggestion: string;
  example?: string;
}

export interface AnalysisResult {
  relevanceScore: number;
  atsScore: number;
  summary: string;
  missingKeywords: string[];
  actionVerbSuggestions: ActionVerbSuggestion[];
  quantificationSuggestions: ImprovementSuggestion[];
  generalFeedback: string[];
}

export interface CoverLetterResult {
  coverLetter: string;
}

export interface InterviewQuestionsResult {
    questions: string[];
}
   