"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import {
  CheckSquare,
  FileText,
  Target,
  Clock,
  Plus,
  Bot,
  ArrowRight,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { DashboardStats, TaskType, NoteType } from "@/types";
import { PriorityBadge } from "@/components/tasks/PriorityBadge";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentTasks, setRecentTasks] = useState<TaskType[]>([]);
  const [recentNotes, setRecentNotes] = useState<NoteType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        // Fetch tasks, notes, boards in parallel
        const [, notesRes] = await Promise.all([
          fetch("/api/tasks?boardId=all").catch(() => null),
          fetch("/api/notes").catch(() => null),
        ]);

        // Process notes
        let notes: NoteType[] = [];
        if (notesRes?.ok) {
          notes = await notesRes.json();
        }

        // We'll compute stats from available data
        // For tasks, we need to get all boards first
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
          totalNotes: notes.length,
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

        setRecentNotes(notes.slice(0, 3));
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

  return (
    <>
      <Header title="Dashboard" />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6 lg:py-8 space-y-8">
          {/* Welcome Section */}
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-1">
              Welcome back, {firstName}! 👋
            </h1>
            <p className="text-muted-foreground">
              Here&apos;s what&apos;s happening with your tasks and projects.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              label="Total Tasks"
              value={stats?.totalTasks ?? 0}
              icon={CheckSquare}
              gradient="from-blue-500/10 to-blue-500/5"
              iconColor="text-blue-500"
            />
            <StatsCard
              label="Completed"
              value={stats?.completedTasks ?? 0}
              icon={Target}
              gradient="from-emerald-500/10 to-emerald-500/5"
              iconColor="text-emerald-500"
            />
            <StatsCard
              label="Total Notes"
              value={stats?.totalNotes ?? 0}
              icon={FileText}
              gradient="from-violet-500/10 to-violet-500/5"
              iconColor="text-violet-500"
            />
            <StatsCard
              label="Due Today"
              value={stats?.tasksDueToday ?? 0}
              icon={Clock}
              gradient="from-orange-500/10 to-orange-500/5"
              iconColor="text-orange-500"
            />
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              Quick Actions
            </h2>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" className="gap-2 rounded-xl">
                <Link href="/tasks">
                  <Plus className="h-4 w-4" />
                  New Task
                </Link>
              </Button>
              <Button asChild variant="outline" className="gap-2 rounded-xl">
                <Link href="/notes">
                  <Plus className="h-4 w-4" />
                  New Note
                </Link>
              </Button>
              <Button
                asChild
                className="gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700"
              >
                <Link href="/ai">
                  <Bot className="h-4 w-4" />
                  Ask AI
                </Link>
              </Button>
            </div>
          </div>

          {/* Recent Tasks & Notes */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Tasks */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-foreground">
                  Recent Tasks
                </h2>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-xs"
                >
                  <Link href="/tasks">
                    View all <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
              <div className="space-y-2">
                {recentTasks.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="py-8 text-center text-muted-foreground text-sm">
                      No tasks yet. Create your first task!
                    </CardContent>
                  </Card>
                ) : (
                  recentTasks.map((task) => (
                    <Card
                      key={task.id}
                      className="hover:shadow-sm transition-shadow"
                    >
                      <CardContent className="py-3 px-4 flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                          <span className="text-sm font-medium truncate">
                            {task.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <PriorityBadge priority={task.priority} />
                          {task.dueDate && (
                            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(task.dueDate).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric" }
                              )}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* Recent Notes */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-foreground">
                  Recent Notes
                </h2>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-xs"
                >
                  <Link href="/notes">
                    View all <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
              <div className="space-y-2">
                {recentNotes.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="py-8 text-center text-muted-foreground text-sm">
                      No notes yet. Create your first note!
                    </CardContent>
                  </Card>
                ) : (
                  recentNotes.map((note) => (
                    <Card
                      key={note.id}
                      className="hover:shadow-sm transition-shadow"
                    >
                      <CardContent className="py-3 px-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium truncate">
                            {note.title}
                          </span>
                          {note.isPinned && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] shrink-0"
                            >
                              Pinned
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Updated{" "}
                          {new Date(note.updatedAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function StatsCard({
  label,
  value,
  icon: Icon,
  gradient,
  iconColor,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  iconColor: string;
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="py-5 px-4">
        <div className="flex items-center justify-between mb-3">
          <div
            className={`rounded-xl p-2.5 bg-gradient-to-br ${gradient}`}
          >
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
        </div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </CardContent>
    </Card>
  );
}
