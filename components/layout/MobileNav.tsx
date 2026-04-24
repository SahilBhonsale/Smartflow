"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  Bot,
  Settings,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/useUIStore";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/notes", label: "Notes", icon: FileText },
  { href: "/ai", label: "AI Assistant", icon: Bot },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  const { mobileNavOpen, setMobileNavOpen } = useUIStore();

  return (
    <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
      <SheetContent side="left" className="w-[280px] p-0 bg-card/60 backdrop-blur-xl border-r border-border/50">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-foreground">SmartFlow</span>
          </div>
          <button
            onClick={() => setMobileNavOpen(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-gradient-to-r from-violet-500/15 to-indigo-500/10 text-violet-600 dark:text-violet-300"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]"
                )}
              >
                <item.icon
                  className={cn(
                    "h-[18px] w-[18px]",
                    isActive ? "text-violet-600 dark:text-violet-400" : "text-muted-foreground"
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
