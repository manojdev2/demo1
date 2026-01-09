export interface ResumeReviewResponse {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  score: number;
}
export interface JobMatchResponse {
  matching_score: number;
  detailed_analysis: JobMatchAnalysis[];
  suggestions: JobMatchAnalysis[];
  additional_comments: string[];
}

export type JobMatchAnalysis = {
  category: string;
  value: string[];
};

export interface AiModel {
  provider: AiProvider;
  model: string | undefined;
}

export enum AiProvider {
  OPENAI = "openai",
  GEMINI = "gemini",
}

export enum OpenaiModel {
  GPT3_5 = "gpt-3.5-turbo",
  GPT4O_MINI = "gpt-4o-mini",
  // GPT4o = "gpt-4o",
  // GPT4_TURBO = "gpt-4-turbo", // expensive model, but faster
}

export enum GeminiModel {
  GEMINI_2_0_FLASH_EXP = "gemini-2.0-flash-exp",
}

export const defaultModel: AiModel = {
  provider: AiProvider.GEMINI,
  model: GeminiModel.GEMINI_2_0_FLASH_EXP,
};
