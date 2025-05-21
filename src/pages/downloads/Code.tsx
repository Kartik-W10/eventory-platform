
import { useState, useEffect } from "react";
import CodeLinkForm from "@/components/downloads/CodeLinkForm";
import CodeLinksList from "@/components/downloads/CodeLinksList";
import { supabase } from "@/integrations/supabase/client";
import { useApprovalGuard } from "@/hooks/useApprovalGuard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CodePage = () => {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<number>(0);
  const [session, setSession] = useState<any>(null);
  const { isApproved, isPending, hasChecked } = useApprovalGuard({
    redirectTo: "/downloads/code",
    showToast: false,
  });
  const { toast } = useToast();

  // Get and track authentication state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch code links
  useEffect(() => {
    const getLinks = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("code_links")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setLinks(data || []);
      } catch (error) {
        console.error("Error fetching links:", error);
        toast({
          title: "Error",
          description: "Failed to fetch code links",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    getLinks();
  }, [refresh, toast]);

  // Handle link added success
  const handleLinkAdded = () => {
    setRefresh((prev) => prev + 1);
  };

  // Handle link click with access control
  const handleLinkClick = (url: string) => {
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access code resources",
        variant: "destructive",
      });
      return;
    }

    if (!isApproved && hasChecked) {
      toast({
        title: "Access Restricted",
        description: "Your account is pending approval or has been rejected.",
        variant: "destructive",
      });
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Code Resources</h1>

      {session && !isApproved && isPending && hasChecked && (
        <Alert variant="default" className="mb-6 border-yellow-400 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <AlertTitle>Account Pending Approval</AlertTitle>
          <AlertDescription>
            Your account is pending administrator approval. You can browse the code resources, but you cannot access them until your account is approved.
          </AlertDescription>
        </Alert>
      )}
      
      {session && !isApproved && !isPending && hasChecked && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Account Rejected</AlertTitle>
          <AlertDescription>
            Your account has been rejected by the administrators. You cannot access code resources.
          </AlertDescription>
        </Alert>
      )}

      {session && <CodeLinkForm category="code" onSuccess={handleLinkAdded} />}

      <div className="mt-8">
        <CodeLinksList 
          category="code"
          refreshTrigger={refresh}
          isAdmin={false}
        />
      </div>
    </div>
  );
};

export default CodePage;
