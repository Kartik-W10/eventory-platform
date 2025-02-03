import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const PDFs = () => {
  const { data: pdfs, isLoading } = useQuery({
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">PDF Library</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pdfs?.map((pdf) => (
          <Card key={pdf.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <File className="h-5 w-5" />
                {pdf.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pdf.description && (
                  <p className="text-sm text-gray-600">{pdf.description}</p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {pdf.views || 0} views
                  </span>
                  <span>{pdf.author}</span>
                </div>
                <div className="flex justify-end">
                  <a
                    href={`https://rtwspqivpnjszjvjspbw.supabase.co/storage/v1/object/public/pdfs/${pdf.file_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:text-primary/80"
                  >
                    <Download className="h-4 w-4" />
                    Download PDF
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PDFs;