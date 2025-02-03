import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

interface UploadFormData {
  title: string;
  description?: string;
  author?: string;
  file: FileList;
}

interface PDFUploadFormProps {
  onSuccess: () => void;
}

export const PDFUploadForm = ({ onSuccess }: PDFUploadFormProps) => {
  const { toast } = useToast();
  const form = useForm<UploadFormData>();

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
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload PDF",
        variant: "destructive",
      });
    },
  });

  return (
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
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>PDF File</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files) {
                        onChange(files);
                      }
                    }}
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
  );
};