import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { File, Download, Eye } from "lucide-react";

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

interface PDFGridProps {
  pdfs: PDF[];
  onPreview: (pdfPath: string) => void;
}

export const PDFGrid = ({ pdfs, onPreview }: PDFGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pdfs?.map((pdf) => (
        <Card key={pdf.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <File className="h-5 w-5" />
              {pdf.title}
            </CardTitle>
            {pdf.description && <CardDescription>{pdf.description}</CardDescription>}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {pdf.views || 0} views
                </span>
                <span>{pdf.author}</span>
              </div>
              <div className="flex justify-between items-center">
                <Button variant="outline" onClick={() => onPreview(pdf.file_path)}>
                  Preview
                </Button>
                <a
                  href={`https://rtwspqivpnjszjvjspbw.supabase.co/storage/v1/object/public/pdf-storage/${pdf.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:text-primary/80"
                >
                  <Download className="h-4 w-4" />
                  Download
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};