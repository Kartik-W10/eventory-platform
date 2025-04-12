
import { FC } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, User, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface BlogPostProps {
  title: string;
  excerpt: string;
  date: string;
  author?: string;
  category: string;
  tags?: string[];
  slug: string;
  image?: string;
  featured?: boolean;
  readTime?: string;
}

export const BlogPost: FC<BlogPostProps> = ({
  title,
  excerpt,
  date,
  author = "The Team",
  category,
  tags = [],
  slug,
  image,
  featured = false,
  readTime = "5 min read",
}) => {
  return (
    <Card className={`overflow-hidden border ${featured ? "shadow-lg" : "shadow-sm"} transition-all hover:shadow-md`}>
      {image && (
        <div className="relative overflow-hidden h-48 w-full">
          <img 
            src={image} 
            alt={title} 
            className="h-full w-full object-cover transition-all hover:scale-105"
          />
          <Badge 
            variant="secondary" 
            className="absolute top-2 right-2 bg-opacity-90"
          >
            {category}
          </Badge>
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-2">
          <div className="flex items-center">
            <Calendar className="mr-1 h-3 w-3" />
            <span>{date}</span>
          </div>
          <div className="flex items-center">
            <User className="mr-1 h-3 w-3" />
            <span>{author}</span>
          </div>
          <div className="flex items-center">
            <Tag className="mr-1 h-3 w-3" />
            <span>{readTime}</span>
          </div>
        </div>
        <Link to={`/${category}/${slug}`} className="group">
          <h3 className="text-xl md:text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-3">
          {excerpt}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 sm:flex-row sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="hover:bg-secondary/10 cursor-pointer">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline">+{tags.length - 3}</Badge>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="group"
          asChild
        >
          <Link to={`/${category}/${slug}`}>
            Read more 
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
