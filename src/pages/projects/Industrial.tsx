
import { useState } from "react";
import { getArticlesByCategory } from "@/data/mockArticles";
import { BlogPost } from "@/components/blog/BlogPost";
import BlogLayout from "@/components/blog/BlogLayout";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const IndustrialPage = () => {
  const articles = getArticlesByCategory("industrial");
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <BlogLayout 
      title="Industrial Projects"
      description="Explore our industrial collaborations and project case studies across various sectors."
    >
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder="Search projects..." 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {searchTerm && filteredArticles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects found matching "{searchTerm}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <BlogPost
              key={article.id}
              title={article.title}
              excerpt={article.excerpt}
              date={article.date}
              author={article.author}
              category="industrial"
              tags={article.tags}
              slug={article.slug}
              image={article.image}
              featured={article.featured}
              readTime={article.readTime}
            />
          ))}
        </div>
      )}
    </BlogLayout>
  );
};

export default IndustrialPage;
