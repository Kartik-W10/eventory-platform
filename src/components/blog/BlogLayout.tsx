
import React, { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface BlogLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
  tabs?: Array<{
    value: string;
    label: string;
    content: ReactNode;
  }>;
}

const BlogLayout: React.FC<BlogLayoutProps> = ({
  title,
  description,
  children,
  tabs,
}) => {
  return (
    <div className="container max-w-7xl mx-auto p-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">{title}</h1>
        {description && <p className="text-muted-foreground text-lg">{description}</p>}
      </div>
      
      <Separator className="my-6" />
      
      {tabs ? (
        <Tabs defaultValue={tabs[0].value} className="space-y-6">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 md:grid-cols-4">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="space-y-6">
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        children
      )}
    </div>
  );
};

export default BlogLayout;
