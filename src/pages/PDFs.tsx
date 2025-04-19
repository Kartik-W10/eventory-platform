import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PDFUploadForm } from "@/components/pdf/PDFUploadForm";
import { PDFGrid } from "@/components/pdf/PDFGrid";
import { PDFPreviewModal } from "@/components/pdf/PDFPreviewModal";
import { useToast } from "@/components/ui/use-toast";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Button } from "@/components/ui/button";

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
  const { isAdmin, userId } = useIsAdmin();
  const { toast } = useToast();

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

  const handleDelete = async (id: string, filePath: string) => {
    try {
      // First delete from storage
      const { error: storageError } = await supabase.storage
        .from("pdf-storage")
        .remove([filePath]);

      if (storageError) {
        throw storageError;
      }

      // Then delete from database
      const { error: dbError } = await supabase
        .from("pdfs")
        .delete()
        .eq("id", id);

      if (dbError) {
        throw dbError;
      }

      toast({
        title: "Success",
        description: "PDF deleted successfully",
      });

      refetch();
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete PDF",
        variant: "destructive",
      });
    }
  };

  const addSelfAsAdmin = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "No user logged in",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("admin_users")
        .insert({ user_id: userId });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Added as admin successfully. Please refresh the page.",
      });
      
      // Force reload to reflect new admin status
      window.location.reload();
    } catch (error) {
      console.error("Error adding admin:", error);
      toast({
        title: "Error",
        description: "Failed to add as admin",
        variant: "destructive",
      });
    }
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
      
      {userId && !isAdmin && (
        <div className="mb-8 p-4 border rounded-md bg-slate-50">
          <p className="mb-2">Current user ID: <code className="bg-slate-100 p-1 rounded">{userId}</code></p>
          <p className="mb-4">You're not currently an admin. You can add yourself as admin:</p>
          <Button onClick={addSelfAsAdmin}>Make myself admin</Button>
        </div>
      )}
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold">PDF Library</h1>
        <p className="text-gray-600 mt-2">Browse and download our collection of PDFs</p>
      </div>
      <PDFGrid 
        pdfs={pdfs || []} 
        onPreview={handlePreview} 
        onDelete={isAdmin ? handleDelete : undefined}
        isAdmin={isAdmin}
      />
      <PDFPreviewModal
        pdfUrl={selectedPDF}
        onClose={() => setSelectedPDF(null)}
      />
    </div>
  );
};

export default PDFs;
