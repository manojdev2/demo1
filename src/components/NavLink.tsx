import React, { ForwardRefExoticComponent, RefAttributes } from "react";
import Link from "next/link";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  label: string;
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  route: string;
  pathname: string;
}

function NavLink({ label, Icon, route, pathname }: NavLinkProps) {
  const isActive =
    route === pathname || (route !== "/dashboard" && pathname.startsWith(route));
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={route}
          className={cn(
            "relative flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200",
            "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            "group",
            {
              "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary": isActive,
            }
          )}
        >
          {isActive && (
            <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
          )}
          <Icon
            className={cn("h-5 w-5 transition-transform duration-200", {
              "scale-110": isActive,
              "group-hover:scale-110": !isActive,
            })}
          />
          <span className="sr-only">{label}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" className="font-medium">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

export default NavLink;
