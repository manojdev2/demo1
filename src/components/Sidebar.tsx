"use client";
import Link from "next/link";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Briefcase, Settings } from "lucide-react";
import { SIDEBAR_LINKS } from "@/lib/constants";
import NavLink from "./NavLink";
import { usePathname } from "next/navigation";

function Sidebar() {
  const path = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-16 flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:flex">
      <div className="flex flex-col items-center gap-6 py-6">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
          title="Anentaa"
        >
          <Briefcase className="h-5 w-5 transition-transform group-hover:rotate-6" />
          <span className="sr-only">Anentaa</span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex flex-col items-center gap-2">
          <TooltipProvider delayDuration={300}>
            {SIDEBAR_LINKS.map((item) => {
              return (
                <NavLink
                  key={item.label}
                  label={item.label}
                  Icon={item.icon}
                  route={item.route}
                  pathname={path}
                />
              );
            })}
          </TooltipProvider>
        </nav>
      </div>

      {/* Settings at Bottom */}
      <div className="mt-auto border-t border-border py-6">
        <nav className="flex flex-col items-center">
          <TooltipProvider delayDuration={300}>
            <NavLink
              label="Settings"
              Icon={Settings}
              route="/dashboard/settings"
              pathname={path}
            />
          </TooltipProvider>
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
