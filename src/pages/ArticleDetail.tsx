
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ArticleDetailComponent from "@/components/blog/ArticleDetail";
import { getArticleBySlug } from "@/data/mockArticles";

const ArticleDetail = () => {
  const { category, slug } = useParams();
  const navigate = useNavigate();
  
  const article = category && slug ? getArticleBySlug(category, slug) : undefined;
  
  // If article not found, redirect to appropriate category page
  useEffect(() => {
    if (!article && category) {
      navigate(`/${category}`);
    }
  }, [article, category, navigate]);

  if (!article) {
    return (
      <div className="container py-10 text-center">
        <h1 className="text-2xl font-bold">Article not found</h1>
        <p className="mt-4">The article you're looking for doesn't exist.</p>
      </div>
    );
  }

  return <ArticleDetailComponent article={article} />;
};

export default ArticleDetail;
