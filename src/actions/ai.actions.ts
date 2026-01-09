"use strict";
"use server";

import { Resume } from "@/models/profile.model";
import { JobResponse } from "@/models/job.model";
import { CoverLetterTemplate } from "@/models/coverLetter.model";
import { convertJobToText, convertResumeToText } from "@/utils/ai.utils";
import { ExternalServiceError } from "@/lib/errors";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const getResumeReviewByOpenAi = async (
  resume: Resume,
  aImodel?: string
): Promise<ReadableStream | undefined> => {
  const resumeText = await convertResumeToText(resume);

  if (!process.env.GEMINI_API_KEY) {
    throw new ExternalServiceError(
      "GEMINI_API_KEY is not configured. Please set it in your environment variables.",
      {
        context: { provider: "Gemini", function: "getResumeReviewByOpenAi" },
      }
    );
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    systemInstruction: `
      You are an expert resume writer and career coach. You must only return JSON object with following property structure.
    
        summary: Provide a brief summary of the resume review.
        strengths: List the strengths in the resume.
        weaknesses: List the weaknesses in the resume.
        suggestions: Provide suggestions for improvement in a list of string.
        score: Provide a score for the resume (0-100), scoring should be strict and criteria should include skills, ATS friendliness, and formatting.
      `,
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const prompt = `
      Review the resume provided below and and provide feedback in the specified JSON format.
      
      ${resumeText}
      `;

  const result = await model.generateContentStream(prompt);
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
      } catch (error) {
        console.error("Error generating resume review:", error);
        controller.enqueue(encoder.encode("\n⚠️ Error generating response"));
      } finally {
        controller.close();
      }
    },
  });
};

export const getJobMatchByOpenAi = async (
  resume: Resume,
  job: JobResponse,
  aiModel?: string
): Promise<ReadableStream | undefined> => {
  const resumeText = await convertResumeToText(resume);

  const jobText = await convertJobToText(job);

  const buildPrompt = (resume: string, jobDescription: string) => `
You are an expert assistant tasked with matching job seekers' resumes with job descriptions and providing suggestions to improve their resumes.

You will:
- Analyze the resume against the job description
- Provide a matching score between 0 and 100
- Score must be based on ATS friendliness, skills, and keyword matching
- Be strict with scoring and always leave room for improvement
- Be verbose and highlight details

⚠️ IMPORTANT:
Your response MUST be a valid JSON object and NOTHING else.

JSON STRUCTURE (MANDATORY):

{
  "detailed_analysis": [
    {
      "category": "ATS Friendliness(60/100):",
      "value": [
        "<ATS friendliness analysis 1>",
        "<ATS friendliness analysis 2>"
      ]
    },
    {
      "category": "Skill and Keyword Match(65/100):",
      "value": [
        "<skill match analysis>",
        "<keyword match analysis>"
      ]
    }
  ],
  "suggestions": [
    {
      "category": "Emphasize Keywords and Skills:",
      "value": [
        "<missing keyword>",
        "<missing skill>"
      ]
    },
    {
      "category": "Format for clarity and ATS optimization:",
      "value": [
        "<format change 1>",
        "<format change 2>"
      ]
    },
    {
      "category": "Enhancement for relevant experience:",
      "value": [
        "<experience improvement>"
      ]
    }
  ],
  "additional_comments": [
    "<summary comment>"
  ],
  "matching_score": <number>
}

Now analyze the following:

Resume:
"""
${resume}
"""

Job Description:
"""
${jobDescription}
"""
`;

  if (!process.env.GEMINI_API_KEY) {
    throw new ExternalServiceError(
      "GEMINI_API_KEY is not configured. Please set it in your environment variables.",
      {
        context: { provider: "Gemini", function: "getJobMatchByOpenAi" },
      }
    );
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const prompt = buildPrompt(resumeText, jobText);
  const result = await model.generateContentStream(prompt);
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
      } catch (error) {
        console.error("Error generating job match:", error);
        controller.enqueue(encoder.encode("\n⚠️ Error generating response"));
      } finally {
        controller.close();
      }
    },
  });
};

export const generateCoverLetterByOpenAI = async (
  resume: Resume,
  job: JobResponse,
  template?: CoverLetterTemplate,
  aiModel?: string
): Promise<ReadableStream | undefined> => {
  const resumeText = await convertResumeToText(resume);
  const jobText = await convertJobToText(job);

  const templateContext = template
    ? `\n\nUse the following template as a guide for structure and tone:\n${template.content}`
    : "";

  const systemPrompt = `You are an expert cover letter writer. Your task is to write a professional, compelling cover letter that:
1. Highlights the candidate's relevant skills and experience from their resume
2. Demonstrates understanding of the job requirements
3. Shows enthusiasm for the specific role and company
4. Is personalized and not generic
5. Is concise (ideally 3-4 paragraphs, maximum 400 words)
6. Uses professional but engaging language
7. Includes a strong opening that grabs attention
8. Connects the candidate's experience to the job requirements
9. Ends with a clear call to action

${templateContext}

Return ONLY the cover letter content, without any additional commentary, explanations, or JSON formatting. Write it as if it's ready to be sent.`;

  const humanPrompt = `
Please write a cover letter for the following position:

Job Details:
"""
${jobText}
"""

Candidate Resume:
"""
${resumeText}
"""

Write a compelling cover letter that connects the candidate's experience with the job requirements.
    `;

  if (!process.env.GEMINI_API_KEY) {
    throw new ExternalServiceError(
      "GEMINI_API_KEY is not configured. Please set it in your environment variables.",
      {
        context: {
          provider: "Gemini",
          function: "generateCoverLetterByOpenAI",
        },
      }
    );
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    systemInstruction: systemPrompt,
  });

  const result = await model.generateContentStream(humanPrompt);
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
      } catch (error) {
        console.error("Error generating cover letter:", error);
        controller.enqueue(encoder.encode("\n⚠️ Error generating response"));
      } finally {
        controller.close();
      }
    },
  });
};
