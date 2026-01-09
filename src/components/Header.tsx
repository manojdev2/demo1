import {
  PanelLeft,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sheet,
  SheetTrigger,
} from "@/components/ui/sheet";
import UserAvatar from "./UserAvatar";
import { getCurrentUser } from "@/utils/user.utils";
import { HeaderMobileMenu } from "./HeaderMobileMenu";
import { HeaderUserMenu } from "./HeaderUserMenu";

async function Header() {
  // const session = await auth();
  const user = await getCurrentUser();
  const isAuthenticated = !!user;
  
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      {isAuthenticated && (
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <HeaderMobileMenu />
        </Sheet>
      )}
      <h1 className="font-semibold">Anentaa - Job Search Assistant</h1>
      <div className="relative ml-auto flex-1 md:grow-0"></div>
      {isAuthenticated && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full hover:ring-2 hover:ring-ring focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            >
              <UserAvatar user={user} />
            </button>
          </DropdownMenuTrigger>
          <HeaderUserMenu userName={user?.name} userEmail={user?.email} />
        </DropdownMenu>
      )}
    </header>
  );
}

export default Header;
