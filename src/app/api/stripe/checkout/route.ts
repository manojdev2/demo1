"use strict";

import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe";
import { SubscriptionPlan } from "@/lib/subscription-plans";
import { getCurrentUser } from "@/utils/user.utils";
import { AuthenticationError, ValidationError } from "@/lib/errors";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { planId } = body as { planId: SubscriptionPlan };

    if (!planId || !["freshers", "experience"].includes(planId)) {
      throw new ValidationError("Invalid plan ID", {
        context: { planId },
      });
    }

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const successUrl = `${baseUrl}/dashboard/billing?success=true`;
    const cancelUrl = `${baseUrl}/dashboard/pricing?canceled=true`;

    const session = await createCheckoutSession({
      userId: user.id,
      userEmail: user.email,
      planId,
      successUrl,
      cancelUrl,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    if (error instanceof ValidationError || error instanceof AuthenticationError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

