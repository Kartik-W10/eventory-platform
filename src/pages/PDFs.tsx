import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PDFUploadForm } from "@/components/pdf/PDFUploadForm";
import { PDFGrid } from "@/components/pdf/PDFGrid";
import { PDFPreviewModal } from "@/components/pdf/PDFPreviewModal";

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

  const { data: pdfs, isLoading, refetch } = useQuery({
    queryKey: ["pdfs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pdfs")
        .select("*")
        .order("upload_date", { ascending: false });

      if (error) throw error;
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
      <PDFUploadForm onSuccess={refetch} />
      <h1 className="text-3xl font-bold mb-8">PDF Library</h1>
      <PDFGrid pdfs={pdfs || []} onPreview={handlePreview} />
      <PDFPreviewModal
        pdfUrl={selectedPDF}
        onClose={() => setSelectedPDF(null)}
      />
    </div>
  );
};

export default PDFs;