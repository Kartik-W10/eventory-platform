import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { File, Download, Eye, Calendar } from "lucide-react";
import { format } from "date-fns";

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {pdfs?.map((pdf) => (
        <Card key={pdf.id} className="group hover:shadow-lg transition-all duration-300 bg-white">
          <CardHeader className="space-y-2">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg font-semibold line-clamp-2 flex-1">
                {pdf.title}
              </CardTitle>
              <File className="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" />
            </div>
            {pdf.description && (
              <CardDescription className="text-sm text-gray-500 line-clamp-2">
                {pdf.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{pdf.views || 0} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {pdf.upload_date
                      ? format(new Date(pdf.upload_date), "MMM d, yyyy")
                      : "No date"}
                  </span>
                </div>
              </div>
              {pdf.author && (
                <div className="text-sm text-gray-600">
                  By {pdf.author}
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onPreview(pdf.file_path)}
                  className="hover:bg-primary hover:text-primary-foreground"
                >
                  Preview
                </Button>
                <a
                  href={`https://rtwspqivpnjszjvjspbw.supabase.co/storage/v1/object/public/pdf-storage/${pdf.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
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