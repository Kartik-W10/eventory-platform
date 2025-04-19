
import { useState, useEffect } from "react";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";
import CodeLinkForm from "@/components/downloads/CodeLinkForm";
import CodeLinksList from "@/components/downloads/CodeLinksList";
import { useToast } from "@/hooks/use-toast";

const CodePage = () => {
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const { toast } = useToast();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Log admin status for debugging
  useEffect(() => {
    console.log("Admin status in Code page:", isAdmin);
  }, [isAdmin]);

  const handleLinkAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (isAdminLoading) {
    return <p className="text-center py-8">Loading...</p>;
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Code Downloads</h1>
        <p className="text-muted-foreground">
          Find and download useful code resources for your projects.
        </p>
      </div>

      {isAdmin ? (
        <div className="mb-8">
          <CodeLinkForm category="code" onSuccess={handleLinkAdded} />
        </div>
      ) : (
        <div className="mb-8 p-4 border rounded-md bg-yellow-50 text-yellow-800">
          <p>You need admin privileges to add code links.</p>
        </div>
      )}

      <CodeLinksList 
        category="code" 
        refreshTrigger={refreshTrigger} 
        isAdmin={isAdmin} 
      />
    </div>
  );
};

export default CodePage;
