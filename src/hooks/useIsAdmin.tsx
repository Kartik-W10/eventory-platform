
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useIsAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setIsLoading(true);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log("No authenticated user found");
          setIsAdmin(false);
          return;
        }
        
        console.log("Checking admin status for user:", user.email);
        
        // Check if user is in admin_users table
        const { data, error } = await supabase
          .from("admin_users")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();
        
        if (error) {
          console.error("Error checking admin status:", error);
          throw error;
        }
        
        const hasAdminRole = !!data;
        console.log("Admin status result:", hasAdminRole ? "Is admin" : "Not admin");
        setIsAdmin(hasAdminRole);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  return { isAdmin, isLoading };
};
