import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserCheck, UserX, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import AdminNav from "@/components/admin/AdminNav";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface User {
  id: string;
  email: string;
  created_at: string;
  user_metadata: {
    name?: string;
  };
  status: 'pending' | 'approved' | 'rejected';
}

const UserApprovals = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading } = useIsAdmin();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, isLoading, navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAdmin) return;
      
      try {
        setIsLoadingUsers(true);
        
        // Get all user profiles from the user_profiles table
        const { data: profiles, error: profilesError } = await supabase
          .from("user_profiles")
          .select("*");
        
        if (profilesError) {
          throw profilesError;
        }
        
        // We need to map our profiles to the User interface
        const mappedUsers = profiles.map(profile => ({
          id: profile.user_id,
          email: profile.email,
          created_at: profile.created_at,
          user_metadata: {
            name: profile.display_name
          },
          status: profile.status as 'pending' | 'approved' | 'rejected'
        }));
        
        setUsers(mappedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive"
        });
      } finally {
        setIsLoadingUsers(false);
      }
    };
    
    if (isAdmin) {
      fetchUsers();
    }

    // Set up real-time subscription to user_profiles table
    const channel = supabase
      .channel('public:user_profiles')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'user_profiles' 
        }, 
        (payload) => {
          // When a profile is updated, refresh our data
          fetchUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin, toast]);

  const handleApproveUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({ status: "approved" })
        .eq("user_id", userId);
      
      if (error) throw error;
      
      toast({
        title: "User approved",
        description: "The user has been successfully approved"
      });
    } catch (error) {
      console.error("Error approving user:", error);
      toast({
        title: "Error",
        description: "Failed to approve user",
        variant: "destructive"
      });
    }
  };

  const handleRejectUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({ status: "rejected" })
        .eq("user_id", userId);
      
      if (error) throw error;
      
      toast({
        title: "User rejected",
        description: "The user has been rejected"
      });
    } catch (error) {
      console.error("Error rejecting user:", error);
      toast({
        title: "Error",
        description: "Failed to reject user",
        variant: "destructive"
      });
    }
  };
  
  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    try {
      // Toggle between approved and rejected
      const newStatus = currentStatus === "approved" ? "rejected" : "approved";
      
      const { error } = await supabase
        .from("user_profiles")
        .update({ status: newStatus })
        .eq("user_id", userId);
      
      if (error) throw error;
      
      toast({
        title: newStatus === "approved" ? "User enabled" : "User disabled",
        description: newStatus === "approved" ? 
          "The user account has been enabled" : 
          "The user account has been disabled"
      });
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive"
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "approved": return "success";
      case "rejected": return "destructive";
      default: return "outline";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">User Approvals</h1>
      <AdminNav />
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Approve or reject new user registrations. Toggle the switch to enable or disable existing users at any time.
            Disabled users will only be able to access the home page.
          </p>
        </CardContent>
      </Card>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingUsers ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.user_metadata?.name || "Not provided"}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        getStatusBadgeVariant(user.status) as any
                      }
                    >
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {user.status === "pending" ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApproveUser(user.id)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRejectUser(user.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <UserX className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <div className="relative">
                            <Switch 
                              id={`user-toggle-${user.id}`}
                              checked={user.status === "approved"}
                              onCheckedChange={() => handleToggleUserStatus(user.id, user.status)}
                              className={`${
                                user.status === "approved" 
                                  ? "bg-green-500 hover:bg-green-600" 
                                  : "bg-red-500 hover:bg-red-600"
                              }`}
                            />
                          </div>
                          <span className={`text-sm font-medium ${
                            user.status === "approved" 
                              ? "text-green-600" 
                              : "text-red-600"
                          }`}>
                            {user.status === "approved" ? "Enabled" : "Disabled"}
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserApprovals;
