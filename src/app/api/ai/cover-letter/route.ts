"use strict";
import "server-only";

import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { Resume } from "@/models/profile.model";
import { JobResponse } from "@/models/job.model";
import { CoverLetterTemplate } from "@/models/coverLetter.model";
import { generateCoverLetterByOpenAI } from "@/actions/ai.actions";
import { getResumeById } from "@/actions/profile.actions";
import { getJobDetails } from "@/actions/job.actions";
import { getCoverLetterTemplates } from "@/actions/coverLetter.actions";
import { ExternalServiceError, ValidationError } from "@/lib/errors";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not Authenticated" }, { status: 401 });
  }

  let resumeId: string;
  let jobId: string;
  let templateId: string | undefined;
  let model: string | undefined;

  try {
    const body = await req.json();
    resumeId = body.resumeId;
    jobId = body.jobId;
    templateId = body.templateId;
    model = body.model;
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body. Please ensure the request contains valid JSON." },
      { status: 400 }
    );
  }

  try {
    if (!resumeId || !jobId) {
      throw new ValidationError("ResumeId and JobId are required", {
        context: {
          hasResumeId: !!resumeId,
          hasJobId: !!jobId,
        },
      });
    }

    const [resume, jobResult] = await Promise.all([
      getResumeById(resumeId),
      getJobDetails(jobId),
    ]);

    if (!resume) {
      throw new ValidationError("Resume not found", {
        context: { resumeId },
      });
    }

    if (!jobResult.success || !jobResult.job) {
      throw new ValidationError("Job not found", {
        context: { jobId },
      });
    }

    const job = jobResult.job;
    let template: CoverLetterTemplate | undefined;

    // Try to load template if templateId is provided, but don't fail if it doesn't exist
    if (templateId) {
      try {
        const templatesResult = await getCoverLetterTemplates();
        if (templatesResult?.success && templatesResult.templates) {
          template = templatesResult.templates.find((t) => t.id === templateId);
        }
      } catch (error) {
        // Template loading failed, but we can still generate without it
        // Continue without template
      }
    }

    // Ensure Gemini API key is set
    if (!process.env.GEMINI_API_KEY) {
      throw new ExternalServiceError(
        "Gemini API key is not configured. Please set GEMINI_API_KEY in your environment variables.",
        { context: { provider: "Gemini" } }
      );
    }

    // Use Gemini model - default to gemini-2.0-flash-exp if not specified
    const geminiModel = model || "gemini-2.0-flash-exp";

    const response = await generateCoverLetterByOpenAI(
      resume,
      job,
      template,
      geminiModel
    );

    if (!response) {
      throw new ExternalServiceError("Failed to generate cover letter", {
        context: { provider: "Gemini" },
      });
    }

    return new NextResponse(response, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    if (error instanceof ExternalServiceError || error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }

    let errorMessage = "Error generating cover letter with Gemini.";
    let statusCode = 502;

    if (error instanceof Error) {
      if (error.message.includes("GEMINI_API_KEY") || error.message.includes("API key")) {
        errorMessage = "Gemini API key is not configured. Please set GEMINI_API_KEY in your environment variables.";
        statusCode = 500;
      } else if (error.message.includes("fetch") || error.message.includes("Failed to fetch") || error.message.includes("ECONNREFUSED")) {
        errorMessage = "Failed to connect to Gemini API. Please check your internet connection and API key.";
        statusCode = 502;
      } else if (error.message.includes("401") || error.message.includes("Unauthorized")) {
        errorMessage = "Invalid Gemini API key. Please check your API key.";
        statusCode = 401;
      } else if (error.message.includes("429") || error.message.includes("rate limit")) {
        errorMessage = "Gemini API rate limit exceeded. Please try again later.";
        statusCode = 429;
      } else {
        errorMessage = `Gemini Error: ${error.message}`;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
};

