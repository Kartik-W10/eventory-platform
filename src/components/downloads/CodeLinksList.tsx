import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Trash } from "lucide-react";

interface CodeLink {
  id: string;
  title: string;
  description: string | null;
  url: string;
  category: string;
  created_at: string;
}

interface CodeLinksListProps {
  category: string;
  refreshTrigger?: number;
  isAdmin?: boolean;
}

const CodeLinksList = ({ category, refreshTrigger = 0, isAdmin = false }: CodeLinksListProps) => {
  const { toast } = useToast();
  const [links, setLinks] = useState<CodeLink[]>([]);
  const [loading, setLoading] = useState(true);

  // Log admin status for debugging
  useEffect(() => {
    console.log(`Admin status in CodeLinksList (${category}):`, isAdmin);
  }, [isAdmin, category]);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("code_links")
        .select("*")
        .eq("category", category)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLinks(data || []);
    } catch (error: any) {
      console.error("Error fetching links:", error);
      toast({
        title: "Error fetching links",
        description: error.message || "An error occurred while fetching links.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("code_links").delete().eq("id", id);
      if (error) throw error;
      
      // Update local state
      setLinks(links.filter(link => link.id !== id));
      
      toast({
        title: "Link deleted",
        description: "The link has been removed.",
      });
    } catch (error: any) {
      console.error("Error deleting link:", error);
      toast({
        title: "Error deleting link",
        description: error.message || "An error occurred while deleting the link.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchLinks();
  }, [category, refreshTrigger]);

  if (loading && links.length === 0) {
    return <p className="text-center py-8">Loading links...</p>;
  }

  if (links.length === 0) {
    return (
      <p className="text-center py-8 text-muted-foreground">
        No {category === "code" ? "code" : "resource"} links available yet.
      </p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {links.map((link) => (
        <Card key={link.id}>
          <CardHeader>
            <CardTitle>{link.title}</CardTitle>
            {link.description && (
              <CardDescription>{link.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground overflow-hidden text-ellipsis">
              {link.url}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => window.open(link.url, "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Link
            </Button>
            
            {isAdmin && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => handleDelete(link.id)}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default CodeLinksList;
