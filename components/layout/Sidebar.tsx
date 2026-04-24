"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  Bot,
  Settings,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/notes", label: "Notes", icon: FileText },
  { href: "/ai", label: "AI Assistant", icon: Bot },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-[260px] min-h-screen bg-card/60 backdrop-blur-xl border-r border-border/50">
      {/* Logo Area */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-border/50">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/20">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground tracking-tight">
            SmartFlow
          </h1>
          <p className="text-[11px] text-muted-foreground font-medium -mt-0.5">
            AI Productivity
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-violet-500/15 to-indigo-500/10 text-violet-600 dark:text-violet-300 shadow-sm"
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
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-600 dark:bg-violet-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-border/50">
        <div className="rounded-xl bg-gradient-to-br from-violet-500/10 to-indigo-500/5 p-4 border border-violet-500/10">
          <p className="text-xs text-foreground font-medium mb-1">
            ✨ Powered by AI
          </p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Use AI to summarize notes, prioritize tasks, and boost productivity.
          </p>
        </div>
      </div>
    </aside>
  );
}
