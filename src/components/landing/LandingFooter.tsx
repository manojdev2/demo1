"use strict";

import { FooterLinksGrid, FooterBottomBar } from "./LandingFooterSection";

export function LandingFooter() {
  return (
    <footer className="relative border-t bg-gradient-to-b from-white to-gray-50">
      <div className="container px-4 md:px-6 py-12 md:py-16">
        <FooterLinksGrid />
        <FooterBottomBar />
      </div>
    </footer>
  );
}
