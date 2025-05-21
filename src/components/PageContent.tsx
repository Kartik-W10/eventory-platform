
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PageContentProps {
  pageKey: string;
  fallback?: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

const PageContent: React.FC<PageContentProps> = ({
  pageKey,
  fallback = "Loading content...",
  className = "",
  as: Component = "div",
}) => {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("page_contents")
          .select("content")
          .eq("page_key", pageKey)
          .single();

        if (error) {
          console.error("Error fetching content:", error);
          setContent(fallback);
        } else {
          setContent(data.content);
        }
      } catch (error) {
        console.error("Error:", error);
        setContent(fallback);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [pageKey, fallback]);

  const handleEditClick = () => {
    navigate("/admin/pages");
  };

  if (loading) {
    return <Skeleton className={`h-8 w-full ${className}`} />;
  }

  return (
    <div className="relative group">
      <Component className={className}>{content || fallback}</Component>
      
      {isAdmin && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleEditClick}
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      )}
    </div>
  );
};

export default PageContent;
