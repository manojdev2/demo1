"use client";

import Link from "next/link";
import Image from "next/image";

function handlePricingClick(e: React.MouseEvent<HTMLAnchorElement>) {
  const pathname = window.location.pathname;
  if (pathname === "/") {
    e.preventDefault();
    const pricingSection = document.getElementById("pricing");
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
}

export function FooterLinksGrid() {
  return (
    <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="Anentaa Logo"
            width={120}
            height={100}
            className="h-200 w-200"
          />
          <span className="text-lg font-bold"></span>
        </div>
        <p className="text-sm text-muted-foreground max-w-sm">
          Your all-in-one platform for job tracking, resume management, and career growth.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Quick Links</h3>
        <ul className="space-y-3">
          <li>
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/#pricing"
              onClick={handlePricingClick}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Support</h3>
        <ul className="space-y-3">
          <li>
            <Link
              href="/forgot-password"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Forgot Password
            </Link>
          </li>
          <li>
            <a
              href="mailto:support@Anentaa.com"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact Support
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export function FooterBottomBar() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col items-center justify-between gap-4 pt-8 border-t md:flex-row">
      <p className="text-sm text-muted-foreground">
        © {currentYear} Anentaa.ai by Krossark. All rights reserved.
      </p>
      <div className="flex items-center gap-6">
        <Link
          href="/terms"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Terms
        </Link>
        <Link
          href="/privacy"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Privacy
        </Link>
      </div>
    </div>
  );
}
