import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { File, Download, Eye, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
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

interface UploadFormData {
  title: string;
  description?: string;
  author?: string;
  file: FileList;
}

const PDFs = () => {
  const { toast } = useToast();
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null);
  const form = useForm<UploadFormData>();

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

  const uploadMutation = useMutation({
    mutationFn: async (data: UploadFormData) => {
      const formData = new FormData();
      formData.append("file", data.file[0]);
      formData.append("title", data.title);
      if (data.description) formData.append("description", data.description);
      if (data.author) formData.append("author", data.author);

      const response = await fetch("/api/upload-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "PDF uploaded successfully",
      });
      form.reset();
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to upload PDF",
        variant: "destructive",
      });
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
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Upload PDF</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => uploadMutation.mutate(data))} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>PDF File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => onChange(e.target.files)}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={uploadMutation.isPending}>
              <Upload className="mr-2 h-4 w-4" />
              {uploadMutation.isPending ? "Uploading..." : "Upload PDF"}
            </Button>
          </form>
        </Form>
      </div>

      <h1 className="text-3xl font-bold mb-8">PDF Library</h1>
      
      {selectedPDF && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-4xl h-[80vh]">
            <div className="flex justify-end mb-2">
              <Button variant="ghost" onClick={() => setSelectedPDF(null)}>
                Close
              </Button>
            </div>
            <iframe
              src={selectedPDF}
              className="w-full h-full rounded-lg"
              title="PDF Preview"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pdfs?.map((pdf) => (
          <Card key={pdf.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <File className="h-5 w-5" />
                {pdf.title}
              </CardTitle>
              {pdf.description && (
                <CardDescription>{pdf.description}</CardDescription>
              )}
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
                  <Button
                    variant="outline"
                    onClick={() => handlePreview(pdf.file_path)}
                  >
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
    </div>
  );
};

export default PDFs;