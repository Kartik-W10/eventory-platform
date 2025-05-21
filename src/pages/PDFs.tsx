
import { useEffect, useState } from "react";
import { PDFUploadForm } from "@/components/pdf/PDFUploadForm";
import { PDFGrid } from "@/components/pdf/PDFGrid";
import { PDFPreviewModal } from "@/components/pdf/PDFPreviewModal";
import { supabase } from "@/integrations/supabase/client";
import { useApprovalGuard } from "@/hooks/useApprovalGuard";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const PDFs = () => {
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfs, setPdfs] = useState([]);
  const [session, setSession] = useState(null);
  const { isApproved, isPending, hasChecked } = useApprovalGuard({
    redirectTo: "/pdfs", // Stay on page but show restriction message
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

  // Fetch PDFs
  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("pdfs")
          .select("*")
          .order("upload_date", { ascending: false });

        if (error) throw error;
        setPdfs(data || []);
      } catch (error) {
        console.error("Error fetching PDFs:", error);
        toast({
          title: "Error",
          description: "Failed to fetch PDFs. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPdfs();
  }, [refresh, toast]);

  const handlePdfSelect = (pdf) => {
    // Restrict PDF access to approved users
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please log in to view PDFs",
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
    
    setSelectedPdf(pdf);
    setShowModal(true);
  };

  const handleUploadComplete = () => {
    setRefresh((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">PDF Resources</h1>

      {session && !isApproved && isPending && hasChecked && (
        <Alert variant="warning" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Account Pending Approval</AlertTitle>
          <AlertDescription>
            Your account is pending administrator approval. You can browse the PDFs, but you cannot view them until your account is approved.
          </AlertDescription>
        </Alert>
      )}
      
      {session && !isApproved && !isPending && hasChecked && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Account Rejected</AlertTitle>
          <AlertDescription>
            Your account has been rejected by the administrators. You cannot access PDF resources.
          </AlertDescription>
        </Alert>
      )}

      {session && <PDFUploadForm onUploadComplete={handleUploadComplete} />}

      <PDFGrid
        pdfs={pdfs}
        isLoading={isLoading}
        onSelect={handlePdfSelect}
        isApproved={isApproved}
      />

      {showModal && (
        <PDFPreviewModal
          pdf={selectedPdf}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default PDFs;
