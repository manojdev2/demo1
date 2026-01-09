"use strict";

export type SubscriptionPlan = "free" | "freshers" | "experience";

export interface PlanLimits {
  jobs: number; // -1 means unlimited
  resumes: number; // -1 means unlimited
  aiRequestsPerMonth: number; // -1 means unlimited
  storageMB: number; // -1 means unlimited
  teamMembers: number; // -1 means unlimited
}

export interface SubscriptionPlanConfig {
  name: string;
  price: number;
  limits: PlanLimits;
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionPlan, SubscriptionPlanConfig> = {
  free: {
    name: "Free",
    price: 0,
    limits: {
      jobs: 10,
      resumes: 1,
      aiRequestsPerMonth: 5,
      storageMB: 5,
      teamMembers: 1,
    },
  },
  freshers: {
    name: "Freshers",
    price: 29, // $29/month
    limits: {
      jobs: 50,
      resumes: 5,
      aiRequestsPerMonth: 50,
      storageMB: 20,
      teamMembers: 5,
    },
  },
  experience: {
    name: "Experience",
    price: 99, // $99/month
    limits: {
      jobs: 500,
      resumes: 20,
      aiRequestsPerMonth: -1, // unlimited
      storageMB: 100,
      teamMembers: -1,
    },
  },
} as const;

