
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useUserStatus = () => {
  const [status, setStatus] = useState<string | null>(null);
  const [isApproved, setIsApproved] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        setIsLoading(true);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setStatus(null);
          setIsApproved(false);
          setIsRejected(false);
          setIsPending(false);
          return;
        }
        
        // Check user status in profiles
        const { data, error } = await supabase
          .from("user_profiles")
          .select("status")
          .eq("user_id", user.id)
          .single();
        
        if (error) {
          console.error("Error checking user status:", error);
          setStatus(null);
        } else {
          setStatus(data.status);
          setIsApproved(data.status === "approved");
          setIsRejected(data.status === "rejected");
          setIsPending(data.status === "pending");
        }
      } catch (error) {
        console.error("Error checking user status:", error);
        setStatus(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial check
    checkUserStatus();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkUserStatus();
    });

    return () => subscription.unsubscribe();
  }, []);

  return { status, isApproved, isRejected, isPending, isLoading };
};
