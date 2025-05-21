
import { Button } from "@/components/ui/button";

interface PDFPreviewModalProps {
  pdfUrl: string | null;
  pdf?: any; // Add this for backward compatibility
  isOpen?: boolean; // Add this for backward compatibility
  onClose: () => void;
}

export const PDFPreviewModal = ({ pdfUrl, pdf, onClose }: PDFPreviewModalProps) => {
  // Use pdfUrl if provided, otherwise try to get it from pdf object
  const url = pdfUrl || (pdf?.file_path ? `https://rtwspqivpnjszjvjspbw.supabase.co/storage/v1/object/public/pdf-storage/${pdf.file_path}` : null);
  
  if (!url) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-4 w-full max-w-4xl h-[80vh]">
        <div className="flex justify-end mb-2">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
        <iframe src={url} className="w-full h-full rounded-lg" title="PDF Preview" />
      </div>
    </div>
  );
};
