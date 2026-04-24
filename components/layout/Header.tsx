"use client";

import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, User, Settings } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import Link from "next/link";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { data: session } = useSession();
  const toggleMobileNav = useUIStore((s) => s.toggleMobileNav);

  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() ?? "U";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 py-4 bg-background/80 backdrop-blur-xl border-b border-border/50">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={toggleMobileNav}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Page title */}
      <h2 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">
        {title}
      </h2>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        
        {/* User Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full ring-2 ring-border/50 hover:ring-primary/30 transition-all"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={session?.user?.image ?? ""}
                  alt={session?.user?.name ?? "User"}
                />
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-sm font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="flex items-center gap-3 p-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={session?.user?.image ?? ""} />
              <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-medium">{session?.user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {session?.user?.email}
              </p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
              <User className="h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-red-500 focus:text-red-500 cursor-pointer"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      </div>
    </header>
  );
}
