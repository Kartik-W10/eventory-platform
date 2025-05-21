
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from './use-toast';
import { useUserStatus } from './useUserStatus';

interface UseApprovalGuardOptions {
  redirectTo?: string;
  showToast?: boolean;
}

export const useApprovalGuard = (options: UseApprovalGuardOptions = {}) => {
  const [hasChecked, setHasChecked] = useState(false);
  const { isApproved, isLoading, isPending } = useUserStatus();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { redirectTo = "/auth", showToast = true } = options;

  useEffect(() => {
    if (!isLoading) {
      setHasChecked(true);
      
      if (!isApproved) {
        if (showToast) {
          toast({
            title: "Access Denied",
            description: "Your account is pending approval or has been rejected. Please contact an administrator.",
            variant: "destructive"
          });
        }
        
        navigate(redirectTo);
      }
    }
  }, [isApproved, isLoading, navigate, redirectTo, showToast, toast]);

  return { isApproved, isLoading, hasChecked, isPending };
};
