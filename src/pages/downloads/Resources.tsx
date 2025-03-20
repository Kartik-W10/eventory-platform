
import { useState } from "react";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import CodeLinkForm from "@/components/downloads/CodeLinkForm";
import CodeLinksList from "@/components/downloads/CodeLinksList";

const ResourcesPage = () => {
  const { isAdmin, isLoading: isCheckingAdmin } = useIsAdmin();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleLinkAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

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

      <div>
        <h2 className="text-2xl font-semibold mb-4">Available Resources</h2>
        <CodeLinksList 
          category="resources" 
          refreshTrigger={refreshTrigger} 
          isAdmin={isAdmin}
        />
      </div>
    </div>
  );
};

export default ResourcesPage;
