"use strict";

import "server-only";

import Stripe from "stripe";
import prisma from "@/lib/db";
import { SubscriptionPlan } from "@/lib/subscription-plans";
import { getStripe } from "@/lib/stripe";

async function getCustomerId(subscription: Stripe.Subscription): Promise<string> {
  return typeof subscription.customer === "string"
    ? subscription.customer
    : subscription.customer.id;
}

export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  if (session.mode !== "subscription" || !session.subscription) {
    return;
  }

  const stripeInstance = getStripe();
  const subscription = await stripeInstance.subscriptions.retrieve(
    session.subscription as string
  );
  const customerId = await getCustomerId(subscription);
  const userId = session.metadata?.userId;
  const planId = session.metadata?.planId || subscription.metadata?.planId;

  if (!userId || !planId) {
    return;
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionPlan: planId as SubscriptionPlan,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
      },
    });
  } catch (dbError) {
    // Database error handled silently - webhook should not expose internal errors
  }
}

export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<void> {
  const customerId = await getCustomerId(subscription);
  const planId = subscription.metadata?.planId as SubscriptionPlan | undefined;

  try {
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: customerId },
    });

    if (!user || !planId) {
      return;
    }

    if (subscription.status === "active" || subscription.status === "trialing") {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionPlan: planId,
          stripeSubscriptionId: subscription.id,
        },
      });
    } else if (
      subscription.status === "canceled" ||
      subscription.status === "unpaid" ||
      subscription.status === "past_due"
    ) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionPlan: "free",
          stripeSubscriptionId: null,
        },
      });
    }
  } catch (dbError) {
    // Database error handled silently - webhook should not expose internal errors
  }
}

export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<void> {
  const customerId = await getCustomerId(subscription);

  try {
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: customerId },
    });

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionPlan: "free",
          stripeSubscriptionId: null,
        },
      });
    }
  } catch (dbError) {
    // Database error handled silently - webhook should not expose internal errors
  }
}
















