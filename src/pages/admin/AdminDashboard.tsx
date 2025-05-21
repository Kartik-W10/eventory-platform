
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminNav from "@/components/admin/AdminNav";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  contentBlocksCount: number;
  totalUsersCount: number;
  pendingUsersCount: number;
  rejectedUsersCount: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading } = useIsAdmin();
  const [stats, setStats] = useState<DashboardStats>({
    contentBlocksCount: 0,
    totalUsersCount: 0,
    pendingUsersCount: 0,
    rejectedUsersCount: 0
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, isLoading, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoadingStats(true);
        
        // Get content blocks count
        const { count: contentBlocksCount, error: contentError } = await supabase
          .from("page_contents")
          .select("*", { count: "exact", head: true });
          
        if (contentError) throw contentError;
        
        // Get user counts
        const { data: userData, error: userError } = await supabase
          .from("user_profiles")
          .select("status");
          
        if (userError) throw userError;
        
        const totalUsersCount = userData.length;
        const pendingUsersCount = userData.filter(u => u.status === 'pending').length;
        const rejectedUsersCount = userData.filter(u => u.status === 'rejected').length;
        
        setStats({
          contentBlocksCount: contentBlocksCount || 0,
          totalUsersCount,
          pendingUsersCount,
          rejectedUsersCount
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoadingStats(false);
      }
    };
    
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <AdminNav />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Content Blocks</CardTitle>
            <CardDescription>Total editable content blocks</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-3xl font-bold">{stats.contentBlocksCount}</p>
            )}
            <div className="mt-2">
              <a href="/admin/pages" className="text-sm text-primary hover:underline">
                Manage content
              </a>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Users</CardTitle>
            <CardDescription>Registered users</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-3xl font-bold">{stats.totalUsersCount}</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Users awaiting approval</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-3xl font-bold">{stats.pendingUsersCount}</p>
            )}
            {stats.pendingUsersCount > 0 && (
              <div className="mt-2">
                <a href="/admin/users" className="text-sm text-primary hover:underline">
                  Review users
                </a>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Rejected Users</CardTitle>
            <CardDescription>Users denied access</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-3xl font-bold">{stats.rejectedUsersCount}</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-10 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Admin Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/admin/pages" className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col">
            <strong>Content Management</strong>
            <span className="text-sm text-gray-500">Edit website content</span>
          </a>
          <a href="/admin/users" className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col">
            <strong>User Approvals</strong>
            <span className="text-sm text-gray-500">Manage user access</span>
          </a>
          <a href="/admin/settings" className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col">
            <strong>Site Settings</strong>
            <span className="text-sm text-gray-500">Configure site options</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
