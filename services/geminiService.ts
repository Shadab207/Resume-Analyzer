
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult, CoverLetterResult, InterviewQuestionsResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        relevanceScore: { type: Type.INTEGER, description: "A score from 0 to 100 indicating how well the resume matches the job description." },
        atsScore: { type: Type.INTEGER, description: "A score from 0 to 100 for ATS compatibility based on formatting, keywords, and structure." },
        summary: { type: Type.STRING, description: "A brief, 2-3 sentence summary of the resume's strengths and weaknesses for this role." },
        missingKeywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of important keywords from the job description that are missing from the resume."
        },
        actionVerbSuggestions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    weakVerb: { type: Type.STRING },
                    strongerAlternatives: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                },
                required: ["weakVerb", "strongerAlternatives"]
            },
            description: "Suggestions for replacing weak verbs with stronger action verbs."
        },
        quantificationSuggestions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    suggestion: { type: Type.STRING, description: "The phrase that could be quantified."},
                    example: { type: Type.STRING, description: "An example of how to quantify it."}
                },
                required: ["suggestion"]
            },
            description: "Recommendations for quantifying achievements."
        },
        generalFeedback: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of general feedback points for improving the resume's impact and clarity."
        }
    },
    required: ["relevanceScore", "atsScore", "summary", "missingKeywords", "actionVerbSuggestions", "quantificationSuggestions", "generalFeedback"]
};

export const analyzeResumeAndJob = async (resumeText: string, jobDescriptionText: string): Promise<AnalysisResult> => {
    const prompt = `
        Analyze the following resume against the provided job description. Act as an expert career coach and ATS specialist.
        Provide a detailed analysis in JSON format.

        **Resume:**
        ${resumeText}

        **Job Description:**
        ${jobDescriptionText}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: analysisSchema,
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as AnalysisResult;
    } catch (error) {
        console.error("Error analyzing resume:", error);
        throw new Error("Failed to get analysis from AI. Please check the console for details.");
    }
};

export const generateCoverLetter = async (resumeText: string, jobDescriptionText: string): Promise<CoverLetterResult> => {
    const prompt = `
        Based on the following resume and job description, write a professional, compelling, and concise cover letter.
        The cover letter should highlight the candidate's most relevant skills and experiences that match the job requirements.
        The tone should be professional yet enthusiastic. Address it to the "Hiring Manager".

        **Resume:**
        ${resumeText}

        **Job Description:**
        ${jobDescriptionText}
    `;

    const coverLetterSchema = {
        type: Type.OBJECT,
        properties: {
            coverLetter: { type: Type.STRING, description: "The full text of the generated cover letter." }
        },
        required: ["coverLetter"]
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: coverLetterSchema,
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as CoverLetterResult;
    } catch (error) {
        console.error("Error generating cover letter:", error);
        throw new Error("Failed to generate cover letter.");
    }
};


export const generateInterviewQuestions = async (resumeText: string): Promise<InterviewQuestionsResult> => {
    const prompt = `
        Based on the provided resume, generate 5 insightful and challenging interview questions.
        The questions should probe the candidate's experience, skills, and accomplishments mentioned in the resume.
        Include at least one behavioral question and one technical or role-specific question.

        **Resume:**
        ${resumeText}
    `;

    const questionsSchema = {
        type: Type.OBJECT,
        properties: {
            questions: { 
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "A list of 5 generated interview questions."
             }
        },
        required: ["questions"]
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: questionsSchema,
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as InterviewQuestionsResult;
    } catch (error) {
        console.error("Error generating interview questions:", error);
        throw new Error("Failed to generate interview questions.");
    }
};
   