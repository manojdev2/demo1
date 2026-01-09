"use client";

import Link from "next/link";
import { Briefcase } from "lucide-react";
import {
  SheetClose,
  SheetContent,
} from "@/components/ui/sheet";
import { SIDEBAR_LINKS } from "@/lib/constants";

export function HeaderMobileMenu() {
  return (
    <SheetContent side="left" className="sm:max-w-xs">
      <nav className="grid gap-6 text-lg font-medium">
        <SheetClose asChild>
          <Link
            href="/"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
          >
            <Briefcase className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">Anentaa</span>
          </Link>
        </SheetClose>
        {SIDEBAR_LINKS.map((item) => {
          return (
            <SheetClose asChild key={item.label}>
              <Link
                href={item.route}
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            </SheetClose>
          );
        })}
      </nav>
    </SheetContent>
  );
}









