
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isApproved, setIsApproved] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    const checkAuthAndStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsAuthenticated(false);
          setIsApproved(false);
          return;
        }
        
        setIsAuthenticated(true);
        
        // Check user status in user_profiles
        const { data, error } = await supabase
          .from("user_profiles")
          .select("status")
          .eq("user_id", user.id)
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching user status:", error);
          setIsApproved(true); // Default to approved if error occurs
        } else {
          // User is approved if status is "approved"
          setIsApproved(data?.status === "approved");
          
          // Show toast if user is rejected/disabled
          if (data?.status === "rejected") {
            toast({
              variant: "destructive",
              title: "Account disabled",
              description: "Your account has been disabled. You can only access the home page.",
            });
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
        setIsApproved(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthAndStatus();
  }, [toast]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Handle authentication status
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // Handle approval status - redirect to home if not approved
  if (!isApproved) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  // User is authenticated and approved, render the protected content
  return <Outlet />;
};

export default ProtectedRoute;
