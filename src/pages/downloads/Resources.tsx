
import { useState, useEffect } from "react";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";
import CodeLinkForm from "@/components/downloads/CodeLinkForm";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResourceLink {
  id: string;
  title: string;
  description: string | null;
  url: string;
  category: string;
  created_at: string;
}

const ResourcesPage = () => {
  const { isAdmin } = useIsAdmin();
  const { toast } = useToast();
  const [links, setLinks] = useState<ResourceLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("code_links")
        .select("*")
        .eq("category", "resources")
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

  const handleLinkAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    fetchLinks();
  }, [refreshTrigger]);

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Resources</h1>
        <p className="text-muted-foreground">
          Access helpful resources, documentation, and learning materials.
        </p>
      </div>

      {isAdmin && (
        <div className="mb-8">
          <CodeLinkForm category="resources" onSuccess={handleLinkAdded} />
        </div>
      )}

      <div className="space-y-6">
        {loading && links.length === 0 ? (
          <p className="text-center py-4">Loading links...</p>
        ) : links.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">
            No resource links available yet.
          </p>
        ) : (
          <div className="space-y-4 max-w-5xl">
            {links.map((link) => (
              <div key={link.id} className="p-4 border rounded-lg bg-card hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1 flex-1">
                    <h3 className="text-lg font-medium">{link.title}</h3>
                    {link.description && (
                      <p className="text-muted-foreground text-sm">{link.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(link.url, "_blank")}
                      className="whitespace-nowrap"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Access
                    </Button>
                    {isAdmin && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(link.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcesPage;
