"use strict";
import "server-only";

import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { Resume } from "@/models/profile.model";
import { getJobMatchByOpenAi } from "@/actions/ai.actions";
import { getResumeById } from "@/actions/profile.actions";
import { getJobDetails } from "@/actions/job.actions";
import { AiModel } from "@/models/ai.model";
import { JobResponse } from "@/models/job.model";
import { ExternalServiceError, ValidationError } from "@/lib/errors";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const session = await auth();
  const userId = session?.accessToken?.sub;

  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Not Authenticated" },
      { status: 401 }
    );
  }

  const { resumeId, jobId, selectedModel } = (await req.json()) as {
    resumeId: string;
    jobId: string;
    selectedModel: AiModel;
  };

  try {
    if (!resumeId || !jobId || !selectedModel) {
      throw new ValidationError(
        "ResumeId, Job Id and selectedModel is required",
        {
          context: {
            hasResumeId: !!resumeId,
            hasJobId: !!jobId,
            hasSelectedModel: !!selectedModel,
          },
        }
      );
    }

    const [resume, jobDetails] = await Promise.all([
      getResumeById(resumeId),
      getJobDetails(jobId),
    ]);

    if (!jobDetails.success || !jobDetails.job) {
      throw new ValidationError("Job not found", {
        context: { jobId },
      });
    }

    const job = jobDetails.job;

    // Validate AI request limit
    const { validateAIRequest } = await import("@/lib/plan-validation");
    const aiValidation = await validateAIRequest();
    if (!aiValidation.allowed) {
      throw new ValidationError(aiValidation.message || "AI request limit reached", {
        context: { function: "AI Job Match" },
      });
    }

    const response = await getJobMatchByOpenAi(resume, job, selectedModel.model);

    if (!response) {
      throw new ExternalServiceError("Failed to get AI response", {
        context: { provider: selectedModel.provider },
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
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    const wrappedError =
      error instanceof Error
        ? new ExternalServiceError(
            error.message.includes("fetch")
              ? "Fetch failed, please make sure selected AI provider service is running."
              : "Error getting AI response.",
            {
              context: { provider: selectedModel?.provider },
              originalError: error,
            }
          )
        : new ExternalServiceError("Error getting AI response.", {
            context: { provider: selectedModel?.provider },
          });

    return NextResponse.json(
      { error: wrappedError.message },
      { status: wrappedError.statusCode }
    );
  }
};
