"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SubscriptionPlan } from "@/lib/subscription-plans";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface CheckoutButtonProps {
  planId: SubscriptionPlan;
  planName: string;
  disabled?: boolean;
  className?: string;
  variant?: "default" | "secondary" | "outline";
}

export default function CheckoutButton({
  planId,
  planName,
  disabled = false,
  className = "",
  variant = "default",
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (planId === "free") {
      toast({
        title: "Free Plan",
        description: "You are already on the free plan.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      toast({
        variant: "destructive",
        title: "Checkout Error",
        description: errorMessage,
      });
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={disabled || loading || planId === "free"}
      className={className}
      variant={variant}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : planId === "free" ? (
        "Current Plan"
      ) : (
        `Subscribe to ${planName}`
      )}
    </Button>
  );
}

