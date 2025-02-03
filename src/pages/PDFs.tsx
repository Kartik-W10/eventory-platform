import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PDFUploadForm } from "@/components/pdf/PDFUploadForm";
import { PDFGrid } from "@/components/pdf/PDFGrid";
import { PDFPreviewModal } from "@/components/pdf/PDFPreviewModal";
import { useToast } from "@/components/ui/use-toast";

interface PDF {
  id: string;
  title: string;
  description: string | null;
  file_path: string;
  thumbnail_path: string | null;
  author: string | null;
  upload_date: string | null;
  views: number | null;
}

const PDFs = () => {
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: adminData } = await supabase
          .from("admin_users")
          .select("user_id")
          .eq("user_id", user.id)
          .single();
        
        setIsAdmin(!!adminData);
      }
    };

    checkAdminStatus();
  }, []);

  const { data: pdfs, isLoading, refetch } = useQuery({
    queryKey: ["pdfs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pdfs")
        .select("*")
        .order("upload_date", { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch PDFs",
          variant: "destructive",
        });
        throw error;
      }
      return data as PDF[];
    },
  });

  const handlePreview = async (pdfPath: string) => {
    setSelectedPDF(`https://rtwspqivpnjszjvjspbw.supabase.co/storage/v1/object/public/pdf-storage/${pdfPath}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {isAdmin && <PDFUploadForm onSuccess={refetch} />}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">PDF Library</h1>
        <p className="text-gray-600 mt-2">Browse and download our collection of PDFs</p>
      </div>
      <PDFGrid pdfs={pdfs || []} onPreview={handlePreview} />
      <PDFPreviewModal
        pdfUrl={selectedPDF}
        onClose={() => setSelectedPDF(null)}
      />
    </div>
  );
};

export default PDFs;