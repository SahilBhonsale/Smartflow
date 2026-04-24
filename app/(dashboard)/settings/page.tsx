"use client";

import { useSession, signOut } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useState } from "react";
import { LogOut, AlertTriangle, User, Mail, Calendar } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() ?? "U";

  const handleDeleteAccount = async () => {
    // In a real app, this would call an API to delete the account
    signOut({ callbackUrl: "/login" });
  };

  return (
    <>
      <Header title="Settings" />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 lg:px-8 py-6 lg:py-8 space-y-6">
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={session?.user?.image ?? ""}
                    alt={session?.user?.name ?? "User"}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-xl font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">
                    {session?.user?.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {session?.user?.email}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Name</p>
                    <p className="text-sm text-muted-foreground">
                      {session?.user?.name ?? "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">
                      {session?.user?.email ?? "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Auth Provider</p>
                    <p className="text-sm text-muted-foreground">Google</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sign Out */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Session</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/30">
            <CardHeader>
              <CardTitle className="text-lg text-destructive flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Once you delete your account, there is no going back. This will
                permanently delete your account and all associated data
                including tasks, notes, and boards.
              </p>
              <Button
                variant="destructive"
                onClick={() => setDeleteConfirmOpen(true)}
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Account"
        description="Are you sure you want to delete your account? This action is permanent and cannot be undone. All your data will be lost."
        confirmText="Delete Account"
        variant="destructive"
        onConfirm={handleDeleteAccount}
      />
    </>
  );
}
