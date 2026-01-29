import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Search, Shield, ShieldOff, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { BACKEND_URL } from "@/integrations/backend/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserWithRoles {
  id: string;
  email: string;
  created_at: string;
  roles: string[];
}

export default function AdminUsers() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingAction, setPendingAction] = useState<{
    userId: string;
    email: string;
    role: string;
    action: "add" | "remove";
  } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const searchUsers = async (query: string = "") => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BACKEND_URL}/functions/v1/admin-users?action=search&q=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to search users");
      }

      const result = await response.json();
      setUsers(result.users);
    } catch (error) {
      console.error("Failed to search users:", error);
      toast({
        title: "Error searching users",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleAction = async () => {
    if (!pendingAction) return;

    setActionLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/functions/v1/admin-users`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: pendingAction.userId,
          role: pendingAction.role,
          action: pendingAction.action,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update role");
      }

      toast({
        title: "Role updated",
        description: `Successfully ${pendingAction.action === "add" ? "added" : "removed"} ${pendingAction.role} role`,
      });

      // Refresh the user list
      await searchUsers(searchQuery);
    } catch (error) {
      console.error("Failed to update role:", error);
      toast({
        title: "Error updating role",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
      setPendingAction(null);
    }
  };

  useEffect(() => {
    if (session?.access_token) {
      searchUsers();
    }
  }, [session?.access_token]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchUsers(searchQuery);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">
            Search users and manage their roles
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              User Lookup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Search"
                )}
              </Button>
            </form>

            {loading && users.length === 0 ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : users.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">
                No users found
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(user.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {user.roles.length === 0 ? (
                            <Badge variant="secondary">No roles</Badge>
                          ) : (
                            user.roles.map((role) => (
                              <Badge
                                key={role}
                                variant={role === "admin" ? "default" : "secondary"}
                                className={
                                  role === "admin"
                                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                                    : ""
                                }
                              >
                                {role}
                              </Badge>
                            ))
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          {user.roles.includes("admin") ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setPendingAction({
                                  userId: user.id,
                                  email: user.email || "Unknown",
                                  role: "admin",
                                  action: "remove",
                                })
                              }
                              className="text-destructive hover:text-destructive"
                            >
                              <ShieldOff className="h-4 w-4 mr-1" />
                              Remove Admin
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setPendingAction({
                                  userId: user.id,
                                  email: user.email || "Unknown",
                                  role: "admin",
                                  action: "add",
                                })
                              }
                            >
                              <Shield className="h-4 w-4 mr-1" />
                              Make Admin
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <AlertDialog
          open={!!pendingAction}
          onOpenChange={() => setPendingAction(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {pendingAction?.action === "add" ? "Grant" : "Revoke"} Admin Role
              </AlertDialogTitle>
              <AlertDialogDescription>
                {pendingAction?.action === "add"
                  ? `This will grant admin privileges to ${pendingAction?.email}. They will be able to access the admin dashboard and manage other users.`
                  : `This will revoke admin privileges from ${pendingAction?.email}. They will no longer have access to admin features.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRoleAction}
                disabled={actionLoading}
                className={
                  pendingAction?.action === "remove"
                    ? "bg-destructive hover:bg-destructive/90"
                    : ""
                }
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {pendingAction?.action === "add" ? "Grant Admin" : "Revoke Admin"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
