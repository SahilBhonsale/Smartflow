"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import {
  Download,
  Plus,
  ClipboardList,
  Zap,
  Sparkles,
  LineChart,
  Edit3,
  CheckCircle2,
  MessageSquare,
  AlertCircle,
  Rocket,
  Paintbrush,
  Database,
  MoreVertical,
  PlusCircle,
  Bot
} from "lucide-react";
import Link from "next/link";
import { DashboardStats, TaskType, NoteType } from "@/types";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentTasks, setRecentTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const boardsRes = await fetch("/api/boards");
        let allTasks: TaskType[] = [];

        if (boardsRes.ok) {
          const boards = await boardsRes.json();
          for (const board of boards.slice(0, 5)) {
            const boardRes = await fetch(`/api/boards/${board.id}`);
            if (boardRes.ok) {
              const boardData = await boardRes.json();
              const tasks = boardData.columns.flatMap(
                (col: { tasks: TaskType[] }) => col.tasks
              );
              allTasks = [...allTasks, ...tasks];
            }
          }
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const completedTasks = allTasks.filter((t) => t.status === "Done");
        const tasksDueToday = allTasks.filter((t) => {
          if (!t.dueDate) return false;
          const due = new Date(t.dueDate);
          return due >= today && due < tomorrow;
        });

        setStats({
          totalTasks: allTasks.length,
          completedTasks: completedTasks.length,
          totalNotes: 0,
          tasksDueToday: tasksDueToday.length,
        });

        setRecentTasks(
          allTasks
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .slice(0, 5)
        );
      } catch (error) {
        console.error("Dashboard load error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <>
        <Header title="Dashboard" />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading dashboard..." />
        </div>
      </>
    );
  }

  const firstName = session?.user?.name?.split(" ")[0] ?? "there";
  const activeTasksCount = (stats?.totalTasks ?? 0) - (stats?.completedTasks ?? 0);

  return (
    <>
      <Header title="Dashboard" />
      <div className="flex-1 overflow-y-auto bg-background">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Good Morning, {firstName}
              </h1>
              <p className="text-muted-foreground mt-1 text-base md:text-lg">
                Here&apos;s your productivity overview for today.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-border bg-card text-foreground text-sm font-semibold rounded flex items-center gap-2 hover:bg-muted transition-colors">
                <Download className="h-5 w-5" />
                Export Report
              </button>
              <Link href="/tasks">
                <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded flex items-center gap-2 hover:opacity-90 transition-opacity">
                  <Plus className="h-5 w-5" />
                  New Task
                </button>
              </Link>
            </div>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Metric 1: Active Tasks */}
            <div className="md:col-span-3 bg-card border border-border/40 rounded-xl p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="p-2 bg-blue-500/10 text-blue-500 rounded">
                    <ClipboardList className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                    +12%
                  </span>
                </div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Active Tasks
                </p>
                <h2 className="text-4xl font-bold text-foreground mt-1">
                  {activeTasksCount}
                </h2>
              </div>
              <div className="mt-4 pt-4 border-t border-border/40">
                <p className="text-xs text-muted-foreground">
                  {stats?.tasksDueToday} tasks due today
                </p>
              </div>
            </div>

            {/* Metric 2: Focus Score */}
            <div className="md:col-span-3 bg-card border border-border/40 rounded-xl p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="p-2 bg-amber-500/10 text-amber-500 rounded">
                    <Zap className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    Steady
                  </span>
                </div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Focus Score
                </p>
                <h2 className="text-4xl font-bold text-foreground mt-1 flex items-baseline">
                  92<span className="text-lg text-muted-foreground font-medium ml-1">/100</span>
                </h2>
              </div>
              <div className="mt-4 pt-4 border-t border-border/40">
                <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[92%]"></div>
                </div>
              </div>
            </div>

            {/* AI Insights Card */}
            <div className="md:col-span-6 bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-xl p-6 relative overflow-hidden shadow-sm">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-indigo-200" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-indigo-200">
                    AI Insights
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-3">
                  You&apos;re 15% more productive during morning standups.
                </h3>
                <p className="text-indigo-100 max-w-md text-sm leading-relaxed">
                  Try scheduling your high-focus deep work tasks between 9:00 AM
                  and 11:00 AM for maximum efficiency.
                </p>
                <Link href="/ai">
                  <button className="mt-6 px-4 py-2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 text-sm font-semibold rounded transition-colors">
                    View Full Analysis
                  </button>
                </Link>
              </div>
              {/* Decorative Graphic */}
              <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none">
                <LineChart className="w-48 h-48" />
              </div>
            </div>

            {/* Daily Progress Chart */}
            <div className="md:col-span-8 bg-card border border-border/40 rounded-xl p-6 lg:p-8 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    Daily Progress
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tasks completed vs planned
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-primary rounded-full"></span>
                    <span className="text-xs font-medium text-muted-foreground">
                      Completed
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-muted-foreground/20 rounded-full"></span>
                    <span className="text-xs font-medium text-muted-foreground">
                      Planned
                    </span>
                  </div>
                </div>
              </div>

              {/* Simplified Visual Representation of a Chart */}
              <div className="flex-1 min-h-[200px] flex items-end justify-between gap-2 lg:gap-4 mt-auto">
                {[
                  { day: "Mon", planned: 60, completed: 45 },
                  { day: "Tue", planned: 70, completed: 80 },
                  { day: "Wed", planned: 55, completed: 65 },
                  { day: "Thu", planned: 85, completed: 90 },
                  { day: "Fri", planned: 40, completed: 35 },
                  { day: "Sat", planned: 30, completed: 20 },
                  { day: "Sun", planned: 45, completed: 50 },
                ].map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full max-w-[40px] flex items-end gap-1 h-full">
                      <div
                        className="w-1/2 bg-muted-foreground/20 rounded-t-sm transition-all"
                        style={{ height: `${item.planned}%` }}
                      ></div>
                      <div
                        className="w-1/2 bg-primary rounded-t-sm transition-all"
                        style={{ height: `${item.completed}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="md:col-span-4 bg-card border border-border/40 rounded-xl flex flex-col shadow-sm">
              <div className="p-6 border-b border-border/40">
                <h3 className="text-xl font-bold text-foreground">
                  Recent Activity
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Activity Item 1 */}
                <div className="flex gap-4">
                  <div className="mt-1 shrink-0">
                    <span className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                      <Edit3 className="h-4 w-4" />
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-foreground">
                      You updated{" "}
                      <span className="font-semibold">Q4 Strategic Goals</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      2 hours ago
                    </p>
                  </div>
                </div>
                {/* Activity Item 2 */}
                <div className="flex gap-4">
                  <div className="mt-1 shrink-0">
                    <span className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4" />
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-foreground">
                      SmartFlow AI prioritized{" "}
                      <span className="font-semibold">Development Tasks</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      4 hours ago
                    </p>
                  </div>
                </div>
                {/* Activity Item 3 */}
                <div className="flex gap-4">
                  <div className="mt-1 shrink-0">
                    <span className="w-8 h-8 rounded-full bg-slate-500/10 text-slate-500 flex items-center justify-center">
                      <MessageSquare className="h-4 w-4" />
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-foreground">
                      You added a note{" "}
                      <span className="font-semibold">UI Redesign Ideas</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Yesterday
                    </p>
                  </div>
                </div>
                {/* Activity Item 4 */}
                <div className="flex gap-4">
                  <div className="mt-1 shrink-0">
                    <span className="w-8 h-8 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center">
                      <AlertCircle className="h-4 w-4" />
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-foreground">
                      Deadline approaching for{" "}
                      <span className="font-semibold">Database Migration</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Oct 22, 11:45 PM
                    </p>
                  </div>
                </div>
              </div>
              <button className="p-4 border-t border-border/40 text-primary text-sm font-semibold hover:bg-muted/50 transition-colors text-center rounded-b-xl">
                View All Activity
              </button>
            </div>

            {/* Collaborative Projects Section */}
            <div className="md:col-span-12 mt-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground">
                  Active Projects
                </h3>
                <Link
                  href="/tasks"
                  className="text-primary text-sm font-semibold hover:underline"
                >
                  Manage Boards
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Project Card 1 */}
                <div className="bg-card border border-border/40 rounded-xl p-5 hover:border-primary/50 transition-colors cursor-pointer group shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-muted flex items-center justify-center rounded-lg">
                      <Rocket className="h-5 w-5 text-foreground/70" />
                    </div>
                    <MoreVertical className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h4 className="text-lg font-bold text-foreground mb-1">
                    Product Launch 2.0
                  </h4>
                  <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                    Marketing, engineering, and logistics tracking for Q1 2024.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      <div className="w-7 h-7 rounded-full border-2 border-background bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700">
                        SR
                      </div>
                      <div className="w-7 h-7 rounded-full border-2 border-background bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-700">
                        JD
                      </div>
                      <div className="w-7 h-7 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                        +3
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded">
                      On Track
                    </span>
                  </div>
                </div>

                {/* Project Card 2 */}
                <div className="bg-card border border-border/40 rounded-xl p-5 hover:border-primary/50 transition-colors cursor-pointer group shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-muted flex items-center justify-center rounded-lg">
                      <Paintbrush className="h-5 w-5 text-foreground/70" />
                    </div>
                    <MoreVertical className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h4 className="text-lg font-bold text-foreground mb-1">
                    UI Modernization
                  </h4>
                  <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                    Transitioning design system to glassmorphism and Tailwind.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      <div className="w-7 h-7 rounded-full border-2 border-background bg-violet-100 flex items-center justify-center text-[10px] font-bold text-violet-700">
                        AL
                      </div>
                      <div className="w-7 h-7 rounded-full border-2 border-background bg-orange-100 flex items-center justify-center text-[10px] font-bold text-orange-700">
                        MK
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-1 bg-blue-500/10 text-blue-500 rounded">
                      In Progress
                    </span>
                  </div>
                </div>

                {/* Project Card 3 */}
                <div className="bg-card border border-border/40 rounded-xl p-5 hover:border-primary/50 transition-colors cursor-pointer group shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-muted flex items-center justify-center rounded-lg">
                      <Database className="h-5 w-5 text-foreground/70" />
                    </div>
                    <MoreVertical className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h4 className="text-lg font-bold text-foreground mb-1">
                    Core API Sync
                  </h4>
                  <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                    Optimizing database queries and real-time syncing.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      <div className="w-7 h-7 rounded-full border-2 border-background bg-rose-100 flex items-center justify-center text-[10px] font-bold text-rose-700">
                        DB
                      </div>
                      <div className="w-7 h-7 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                        +8
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-1 bg-orange-500/10 text-orange-500 rounded">
                      Delayed
                    </span>
                  </div>
                </div>

                {/* Add New Project Card */}
                <Link href="/tasks">
                  <div className="h-full border-2 border-dashed border-border/60 rounded-xl p-5 flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all cursor-pointer bg-muted/20">
                    <PlusCircle className="h-8 w-8 mb-2" />
                    <span className="text-sm font-semibold">
                      Start New Project
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAB Action */}
      <Link href="/ai">
        <button className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-violet-500 to-indigo-600 text-white rounded-full shadow-xl shadow-indigo-500/20 flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50">
          <Bot className="h-6 w-6" />
        </button>
      </Link>
    </>
  );
}
