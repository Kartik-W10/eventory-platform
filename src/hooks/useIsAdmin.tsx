
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useIsAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setIsLoading(true);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log("No user found");
          setIsAdmin(false);
          setUserId(null);
          return;
        }
        
        // Set the user ID so we can see it for debugging
        setUserId(user.id);
        
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
        
        console.log("Admin check result:", data ? "Is admin" : "Not admin");
        setIsAdmin(!!data);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  return { isAdmin, isLoading, userId };
};
