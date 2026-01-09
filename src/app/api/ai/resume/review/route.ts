"use strict";
import "server-only";

import { auth } from "@/auth";
import { getResumeReviewByOpenAi } from "@/actions/ai.actions";
import { NextRequest, NextResponse } from "next/server";
import { Resume } from "@/models/profile.model";
import { AiModel } from "@/models/ai.model";
import { ExternalServiceError, ValidationError } from "@/lib/errors";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const session = await auth();

  if (!session || !session.user || !session.accessToken) {
    return NextResponse.json(
      { error: "Not Authenticated" },
      { status: 401 }
    );
  }
  
  const userId = session.accessToken.sub;
  const { selectedModel, resume } = (await req.json()) as {
    selectedModel: AiModel;
    resume: Resume;
  };
  try {
    if (!resume || !selectedModel) {
      throw new ValidationError("Resume or selected model is required", {
        context: { hasResume: !!resume, hasSelectedModel: !!selectedModel },
      });
    }

    // Validate AI request limit
    const { validateAIRequest } = await import("@/lib/plan-validation");
    const aiValidation = await validateAIRequest();
    if (!aiValidation.allowed) {
      throw new ValidationError(aiValidation.message || "AI request limit reached", {
        context: { function: "AI Resume Review" },
      });
    }

    const response = await getResumeReviewByOpenAi(resume, selectedModel.model);

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
              ? `Fetch failed, please make sure selected AI provider (${selectedModel?.provider || "unknown"}) service is running.`
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
