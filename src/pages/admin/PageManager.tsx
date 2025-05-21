
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, X } from "lucide-react";
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

// Define a type for pages
interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  created_at: string;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  content: z.string().min(1, "Content is required"),
});

const PageManager = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading } = useIsAdmin();
  const { toast } = useToast();
  const [pages, setPages] = useState<Page[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
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
      // This would be replaced with an actual fetch from your database
      // For now, we'll use mock data
      const mockPages: Page[] = [
        {
          id: "1",
          title: "Home Page",
          slug: "home",
          content: "Welcome to our website.",
          created_at: new Date().toISOString(),
        },
        {
          id: "2",
          title: "About Us",
          slug: "about",
          content: "Learn more about our company.",
          created_at: new Date().toISOString(),
        },
      ];
      setPages(mockPages);
    };

    if (isAdmin) {
      fetchPages();
    }
  }, [isAdmin]);

  const openNewPageDialog = () => {
    form.reset();
    setIsEditing(false);
    setCurrentPageId(null);
    setIsDialogOpen(true);
  };

  const openEditPageDialog = (page: Page) => {
    form.reset({
      title: page.title,
      slug: page.slug,
      content: page.content,
    });
    setIsEditing(true);
    setCurrentPageId(page.id);
    setIsDialogOpen(true);
  };

  const handleDeletePage = async (pageId: string) => {
    // This would be replaced with an actual delete operation
    const updatedPages = pages.filter(page => page.id !== pageId);
    setPages(updatedPages);
    
    toast({
      title: "Page deleted",
      description: "The page has been successfully deleted",
    });
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (isEditing && currentPageId) {
      // Update existing page
      const updatedPages = pages.map(page => 
        page.id === currentPageId ? 
          {...page, ...data} : 
          page
      );
      setPages(updatedPages);
      
      toast({
        title: "Page updated",
        description: "The page has been successfully updated",
      });
    } else {
      // Create new page
      const newPage: Page = {
        id: Math.random().toString(36).substr(2, 9), // Just for demo
        title: data.title,
        slug: data.slug,
        content: data.content,
        created_at: new Date().toISOString(),
      };
      
      setPages([...pages, newPage]);
      
      toast({
        title: "Page created",
        description: "The new page has been successfully created",
      });
    }
    
    setIsDialogOpen(false);
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
      <h1 className="text-3xl font-bold mb-6">Page Manager</h1>
      <AdminNav />
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">All Pages</h2>
        <Button onClick={openNewPageDialog} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Page
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((page) => (
              <TableRow key={page.id}>
                <TableCell className="font-medium">{page.title}</TableCell>
                <TableCell>{page.slug}</TableCell>
                <TableCell>{new Date(page.created_at).toLocaleDateString()}</TableCell>
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
                      <X className="h-4 w-4" />
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
            <DialogTitle>{isEditing ? "Edit Page" : "Create New Page"}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? "Make changes to the existing page" 
                : "Fill in the details for the new page"}
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
                      <Input placeholder="Page title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="page-slug" {...field} />
                    </FormControl>
                    <FormMessage />
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
                        placeholder="Page content" 
                        className="min-h-[200px]" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">
                  {isEditing ? "Save Changes" : "Create Page"}
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
