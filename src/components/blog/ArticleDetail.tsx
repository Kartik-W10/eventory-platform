
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User, Tag, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Article } from "@/data/mockArticles";

interface ArticleDetailProps {
  article: Article;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article }) => {
  const navigate = useNavigate();
  
  if (!article) {
    return <div className="container py-10">Article not found</div>;
  }

  return (
    <div className="container max-w-4xl mx-auto p-6 animate-fade-in">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => navigate(-1)} 
        className="mb-6 hover:bg-secondary/10"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      {article.image && (
        <div className="relative w-full h-64 md:h-96 mb-8 rounded-xl overflow-hidden">
          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
          <Badge 
            variant="secondary" 
            className="absolute top-4 right-4"
          >
            {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
          </Badge>
        </div>
      )}
      
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
        {article.title}
      </h1>
      
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
        <div className="flex items-center">
          <Calendar className="mr-1 h-4 w-4" />
          <span>{article.date}</span>
        </div>
        <div className="flex items-center">
          <User className="mr-1 h-4 w-4" />
          <span>{article.author}</span>
        </div>
        {article.readTime && (
          <div className="flex items-center">
            <Tag className="mr-1 h-4 w-4" />
            <span>{article.readTime}</span>
          </div>
        )}
      </div>
      
      <Separator className="my-6" />
      
      <div className="prose max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-img:rounded-lg" dangerouslySetInnerHTML={{ __html: article.content }} />
      
      <Separator className="my-8" />
      
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
          {article.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="hover:bg-secondary/10">
              {tag}
            </Badge>
          ))}
        </div>
        
        <Button variant="outline" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  );
};

export default ArticleDetail;
