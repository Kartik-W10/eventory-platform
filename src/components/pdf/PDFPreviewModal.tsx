import { Button } from "@/components/ui/button";

interface PDFPreviewModalProps {
  pdfUrl: string | null;
  onClose: () => void;
}

export const PDFPreviewModal = ({ pdfUrl, onClose }: PDFPreviewModalProps) => {
  if (!pdfUrl) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-4 w-full max-w-4xl h-[80vh]">
        <div className="flex justify-end mb-2">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
        <iframe src={pdfUrl} className="w-full h-full rounded-lg" title="PDF Preview" />
      </div>
    </div>
  );
};