
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CodeLinkFormProps {
  category: string;
  onSuccess?: () => void;
}

const CodeLinkForm = ({ category, onSuccess }: CodeLinkFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !url) {
      toast({
        title: "Missing fields",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Make sure URL has proper format
      let formattedUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        formattedUrl = `https://${url}`;
      }
      
      const { error } = await supabase.from("code_links").insert({
        title,
        description,
        url: formattedUrl,
        category,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      });

      if (error) throw error;
      
      toast({
        title: "Link added successfully",
        description: "The link has been added to the database.",
      });
      
      // Reset form
      setTitle("");
      setDescription("");
      setUrl("");
      
      // Call success callback if provided
      if (onSuccess) onSuccess();
      
    } catch (error: any) {
      console.error("Error adding link:", error);
      toast({
        title: "Error adding link",
        description: error.message || "An error occurred while adding the link.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New {category === "code" ? "Code" : "Resource"} Link</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title*</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for the link"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a description (optional)"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url">URL*</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter the URL (e.g., https://drive.google.com/...)"
              required
            />
          </div>
          
          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Link"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CodeLinkForm;
