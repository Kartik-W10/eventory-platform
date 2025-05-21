
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserCheck, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import AdminNav from "@/components/admin/AdminNav";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  email: string;
  created_at: string;
  display_name?: string;
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
        
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        setUsers(data || []);
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
  }, [isAdmin, toast]);

  const handleApproveUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ status: 'approved', updated_at: new Date().toISOString() })
        .eq('user_id', userId);
      
      if (error) {
        throw error;
      }
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: 'approved' } : user
      ));
      
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
        .from('user_profiles')
        .update({ status: 'rejected', updated_at: new Date().toISOString() })
        .eq('user_id', userId);
      
      if (error) {
        throw error;
      }
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: 'rejected' } : user
      ));
      
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
                    {user.display_name || "Not provided"}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "approved"
                          ? "success"
                          : user.status === "rejected"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {user.status !== "approved" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApproveUser(user.id)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <UserCheck className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      )}
                      {user.status !== "rejected" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRejectUser(user.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <UserX className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
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
