"use strict";

import "server-only";

import Stripe from "stripe";
import { DatabaseError } from "@/lib/errors";
import { SubscriptionPlan } from "@/lib/subscription-plans";

let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-11-17.clover" as Stripe.LatestApiVersion,
    typescript: true,
  });
}

export { stripe };

export function getStripe(): Stripe {
  if (!stripe) {
    throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
  }
  return stripe;
}

export interface CreateCheckoutSessionParams {
  userId: string;
  userEmail: string;
  planId: SubscriptionPlan;
  successUrl: string;
  cancelUrl: string;
}

export async function createCheckoutSession(
  params: CreateCheckoutSessionParams
): Promise<Stripe.Checkout.Session> {
  try {
    const stripeInstance = getStripe();
    const { userId, userEmail, planId, successUrl, cancelUrl } = params;

    // Get plan details
    const planMap: Record<SubscriptionPlan, { priceId: string; amount: number }> = {
      free: {
        priceId: process.env.STRIPE_PRICE_ID_FREE || "",
        amount: 0,
      },
      freshers: {
        priceId: process.env.STRIPE_PRICE_ID_FRESHERS || "",
        amount: 2900, // $29 in cents
      },
      experience: {
        priceId: process.env.STRIPE_PRICE_ID_EXPERIENCE || "",
        amount: 9900, // $99 in cents
      },
    };

    const plan = planMap[planId];

    if (!plan.priceId && planId !== "free") {
      throw new Error(`Price ID not configured for plan: ${planId}`);
    }

    // For free plan, no checkout session needed
    if (planId === "free") {
      throw new Error("Free plan does not require checkout");
    }

    const session = await stripeInstance.checkout.sessions.create({
      customer_email: userEmail,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        planId,
      },
      subscription_data: {
        metadata: {
          userId,
          planId,
        },
      },
    });

    return session;
  } catch (error) {
    throw new DatabaseError("Failed to create Stripe checkout session", {
      context: { planId: params.planId, userId: params.userId },
      originalError: error instanceof Error ? error : new Error(String(error)),
    });
  }
}

export async function createPortalSession(
  customerId: string,
  returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
  try {
    const stripeInstance = getStripe();
    const session = await stripeInstance.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return session;
  } catch (error) {
    throw new DatabaseError("Failed to create Stripe portal session", {
      context: { customerId },
      originalError: error instanceof Error ? error : new Error(String(error)),
    });
  }
}

export async function getCustomerByEmail(
  email: string
): Promise<Stripe.Customer | null> {
  try {
    const stripeInstance = getStripe();
    const customers = await stripeInstance.customers.list({
      email,
      limit: 1,
    });

    return customers.data[0] || null;
  } catch (error) {
    throw new DatabaseError("Failed to get Stripe customer", {
      context: { email },
      originalError: error instanceof Error ? error : new Error(String(error)),
    });
  }
}

export async function getSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription | null> {
  try {
    const stripeInstance = getStripe();
    const subscription = await stripeInstance.subscriptions.retrieve(subscriptionId, {
      expand: ["default_payment_method", "customer"],
    });

    return subscription;
  } catch (error) {
    throw new DatabaseError("Failed to get Stripe subscription", {
      context: { subscriptionId },
      originalError: error instanceof Error ? error : new Error(String(error)),
    });
  }
}

