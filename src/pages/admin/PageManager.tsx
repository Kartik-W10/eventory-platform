
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import AdminNav from "@/components/admin/AdminNav";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";

// Define a type for pages
interface PageContent {
  id: string;
  page_key: string;
  title: string;
  content: string;
  created_at: string;
  last_updated_at: string;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  page_key: z.string().min(1, "Key is required").regex(/^[a-z0-9-]+$/, "Key must contain only lowercase letters, numbers, and hyphens"),
  content: z.string().min(1, "Content is required"),
});

const PageManager = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading } = useIsAdmin();
  const { toast } = useToast();
  const [pages, setPages] = useState<PageContent[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      page_key: "",
      content: "",
    },
  });

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, isLoading, navigate]);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const { data, error } = await supabase
          .from("page_contents")
          .select("*")
          .order("page_key");

        if (error) {
          throw error;
        }

        setPages(data || []);
      } catch (error) {
        console.error("Error fetching pages:", error);
        toast({
          title: "Error",
          description: "Failed to fetch pages",
          variant: "destructive"
        });
      }
    };

    if (isAdmin) {
      fetchPages();
    }
  }, [isAdmin, toast]);

  const openNewPageDialog = () => {
    form.reset({
      title: "",
      page_key: "",
      content: "",
    });
    setIsEditing(false);
    setCurrentPageId(null);
    setIsDialogOpen(true);
  };

  const openEditPageDialog = (page: PageContent) => {
    form.reset({
      title: page.title,
      page_key: page.page_key,
      content: page.content,
    });
    setIsEditing(true);
    setCurrentPageId(page.id);
    setIsDialogOpen(true);
  };

  const handleDeletePage = async (pageId: string) => {
    try {
      const { error } = await supabase
        .from("page_contents")
        .delete()
        .eq("id", pageId);

      if (error) {
        throw error;
      }
      
      setPages(pages.filter(page => page.id !== pageId));
      
      toast({
        title: "Page deleted",
        description: "The page has been successfully deleted",
      });
    } catch (error) {
      console.error("Error deleting page:", error);
      toast({
        title: "Error",
        description: "Failed to delete page",
        variant: "destructive"
      });
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      if (isEditing && currentPageId) {
        // Update existing page
        const { error } = await supabase
          .from("page_contents")
          .update({
            title: data.title,
            page_key: data.page_key,
            content: data.content,
            last_updated_at: new Date().toISOString(),
            last_updated_by: (await supabase.auth.getUser()).data.user?.id,
          })
          .eq("id", currentPageId);

        if (error) {
          throw error;
        }
        
        setPages(pages.map(page => 
          page.id === currentPageId ? 
            {...page, ...data, last_updated_at: new Date().toISOString()} : 
            page
        ));
        
        toast({
          title: "Page updated",
          description: "The page has been successfully updated",
        });
      } else {
        // Create new page
        const { data: newPage, error } = await supabase
          .from("page_contents")
          .insert({
            title: data.title,
            page_key: data.page_key,
            content: data.content,
            last_updated_by: (await supabase.auth.getUser()).data.user?.id,
          })
          .select("*")
          .single();

        if (error) {
          throw error;
        }
        
        setPages([...pages, newPage]);
        
        toast({
          title: "Page created",
          description: "The new page has been successfully created",
        });
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving page:", error);
      toast({
        title: "Error",
        description: isEditing ? "Failed to update page" : "Failed to create page",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
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
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Page Content Manager</h1>
      <AdminNav />
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Website Content Blocks</h2>
        <Button onClick={openNewPageDialog} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Content Block
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Content Key</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No content blocks found. Create one to get started.
                </TableCell>
              </TableRow>
            )}
            {pages.map((page) => (
              <TableRow key={page.id}>
                <TableCell className="font-medium">{page.title}</TableCell>
                <TableCell>
                  <Badge variant="outline">{page.page_key}</Badge>
                </TableCell>
                <TableCell>{new Date(page.last_updated_at || page.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => openEditPageDialog(page)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeletePage(page.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Content Block" : "Create New Content Block"}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? "Make changes to the existing content" 
                : "Add new content that can be displayed on your website"}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Content title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="page_key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Key</FormLabel>
                    <FormControl>
                      <Input placeholder="home-hero" {...field} disabled={isEditing} />
                    </FormControl>
                    <FormMessage />
                    <p className="text-sm text-muted-foreground">
                      A unique identifier for this content block (e.g., home-hero, about-mission)
                    </p>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Content text" 
                        className="min-h-[200px]" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Content"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PageManager;
