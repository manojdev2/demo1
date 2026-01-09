"use strict";

import "server-only";

import prisma from "@/lib/db";
import { AuthenticationError, DatabaseError } from "@/lib/errors";
import { SUBSCRIPTION_PLANS, SubscriptionPlan } from "@/lib/subscription-plans";
import { getCurrentUser } from "@/utils/user.utils";

export interface UsageStatistics {
  jobsCount: number;
  resumesCount: number;
  aiRequestsCount: number;
  storageUsedMB: number;
}

export interface PlanInfo {
  currentPlan: SubscriptionPlan;
  planName: string;
  planPrice: number;
  limits: {
    jobs: number;
    resumes: number;
    aiRequestsPerMonth: number;
    storageMB: number;
    teamMembers: number;
  };
}

export interface BillingInfo {
  planInfo: PlanInfo;
  usage: UsageStatistics;
  remaining: {
    jobs: number | null; // null means unlimited
    resumes: number | null;
    aiRequests: number | null;
    storageMB: number | null;
  };
}

export async function getBillingInfo(): Promise<BillingInfo> {
  const user = await getCurrentUser();

  if (!user) {
    throw new AuthenticationError("Not authenticated", {
      context: { function: "getBillingInfo" },
    });
  }

  try {
    // Get user's actual subscription plan from database
    // Note: If schema hasn't been pushed yet, subscriptionPlan field won't exist
    // In that case, we'll default to "free"
    let currentPlan: SubscriptionPlan = "free";
    try {
      const userRecord = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          subscriptionPlan: true,
        },
      });

      if (userRecord && (userRecord as any).subscriptionPlan) {
        currentPlan = (userRecord as any).subscriptionPlan as SubscriptionPlan;
        // Validate plan is one of the valid options
        if (!["free", "freshers", "experience"].includes(currentPlan)) {
          currentPlan = "free";
        }
      }
    } catch (schemaError) {
      // If field doesn't exist in database yet, default to free
      // Schema error handled silently - defaulting to free plan
      currentPlan = "free";
    }

    const planConfig = SUBSCRIPTION_PLANS[currentPlan];

    // Get usage statistics
    const [jobsCount, resumesData] = await Promise.all([
      prisma.job.count({
        where: {
          userId: user.id,
          applied: true,
        },
      }),
      prisma.resume.findMany({
        where: {
          profile: {
            userId: user.id,
          },
        },
        select: {
          FileId: true,
        },
      }),
    ]);

    const resumesCount = resumesData.length;

    // Calculate storage used by all resume files
    let storageUsedBytes = 0;
    
    // Get file IDs (filter out null values)
    const fileIds = resumesData
      .map((resume) => resume.FileId)
      .filter((id): id is string => id !== null && id !== undefined);

    // Query files if there are any file IDs
    if (fileIds.length > 0) {
      try {
        // Simply get all files by their IDs
        const files = await prisma.file.findMany({
          where: {
            id: {
              in: fileIds,
            },
          },
          select: {
            fileSize: true,
          },
        });

        // Calculate storage - use fileSize if available, otherwise 0
        storageUsedBytes = files.reduce((total, file) => {
          // fileSize can be null or undefined, so check and use 0 if not available
          const size = file.fileSize ?? 0;
          return total + (size > 0 ? size : 0);
        }, 0);
      } catch (fileError) {
        // If file query fails, just set storage to 0 and continue
        // This allows the billing page to load even if file query has issues
        storageUsedBytes = 0;
      }
    }

    // Convert bytes to MB and round to 2 decimal places
    const storageUsedMB = Math.round((storageUsedBytes / (1024 * 1024)) * 100) / 100;

    // TODO: Track AI requests when SaaS transformation is implemented
    const aiRequestsCount = 0;

    const usage: UsageStatistics = {
      jobsCount,
      resumesCount,
      aiRequestsCount,
      storageUsedMB,
    };

    // Calculate remaining limits
    const calculateRemaining = (used: number, limit: number): number | null => {
      if (limit === -1) return null; // unlimited
      return Math.max(0, limit - used);
    };

    const remaining = {
      jobs: calculateRemaining(jobsCount, planConfig.limits.jobs),
      resumes: calculateRemaining(resumesCount, planConfig.limits.resumes),
      aiRequests: calculateRemaining(aiRequestsCount, planConfig.limits.aiRequestsPerMonth),
      storageMB: calculateRemaining(storageUsedMB, planConfig.limits.storageMB),
    };

    return {
      planInfo: {
        currentPlan,
        planName: planConfig.name,
        planPrice: planConfig.price,
        limits: planConfig.limits,
      },
      usage,
      remaining,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    throw new DatabaseError("Failed to fetch billing information", {
      context: {
        userId: user.id,
        errorMessage,
        errorStack,
      },
      originalError: error instanceof Error ? error : new Error(String(error)),
    });
  }
}

