
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageContent from "@/components/PageContent";

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          <PageContent 
            pageKey="home-hero" 
            fallback="Welcome to Our Platform" 
            as="span"
          />
        </h1>
        
        <p className="text-lg mb-8 text-gray-600">
          <PageContent 
            pageKey="home-about" 
            fallback="We provide cutting-edge tools and information for researchers and developers worldwide."
            as="span" 
          />
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/about">
            <Button size="lg">Learn More</Button>
          </Link>
          <Link to="/events">
            <Button size="lg" variant="outline">View Events</Button>
          </Link>
        </div>

        {/* Feature sections */}
        <div className="grid md:grid-cols-3 gap-8 mt-16 w-full">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-xl mb-3">Research Resources</h3>
            <p className="text-gray-600 mb-4">Access our library of academic publications and research materials.</p>
            <Link to="/publications/research" className="text-primary hover:underline">
              Browse Research →
            </Link>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-xl mb-3">Industry Insights</h3>
            <p className="text-gray-600 mb-4">Discover the latest trends and developments in the industry.</p>
            <Link to="/publications/newspaper" className="text-primary hover:underline">
              Read Updates →
            </Link>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-xl mb-3">Download Resources</h3>
            <p className="text-gray-600 mb-4">Get access to our collection of PDFs, papers, and tools.</p>
            <Link to="/pdfs" className="text-primary hover:underline">
              View Downloads →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
