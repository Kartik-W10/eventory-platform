
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Define public routes that don't require authentication
const PUBLIC_ROUTES = ["/about", "/events", "/contact"];

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isApproved, setIsApproved] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    const checkAuthAndStatus = async () => {
      try {
        // Check if the current route is a public route
        const isPublicRoute = PUBLIC_ROUTES.some(route => 
          location.pathname === route || location.pathname.startsWith(`${route}/`)
        );
        
        // If it's a public route, we can skip authentication checks
        if (isPublicRoute) {
          setIsAuthenticated(true); // Allow access
          setIsApproved(true); // Allow access
          setIsLoading(false);
          return;
        }
        
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
              description: "Your account has been disabled. You can only access limited pages.",
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
  }, [toast, location.pathname]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Check if current path is in public routes
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    location.pathname === route || location.pathname.startsWith(`${route}/`)
  );
  
  // Allow access to public routes for everyone
  if (isPublicRoute) {
    return <Outlet />;
  }
  
  // For non-public routes, require authentication
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // Handle approval status - if rejected but on allowed path, let them through
  if (!isApproved) {
    // We keep the allowed routes for rejected users as they are
    const isAllowedForRejected = PUBLIC_ROUTES.some(route => 
      location.pathname === route || location.pathname.startsWith(`${route}/`)
    );
    
    if (!isAllowedForRejected) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }
  }
  
  // User is authenticated and either approved or on an allowed path
  return <Outlet />;
};

export default ProtectedRoute;
