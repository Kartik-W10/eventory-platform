
import { ArrowRight, Calendar, Users, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    const head = document.querySelector("head");
    const script = document.createElement("script");
    script.setAttribute("src", "https://assets.calendly.com/assets/external/widget.js");
    head?.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      head?.removeChild(script);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-up">
              Welcome to YourBrand
            </h1>
            <p className="text-xl md:text-2xl mb-8 animate-fade-up">
              Empowering professionals through expert guidance and resources
            </p>
            <div className="space-x-4">
              <Link
                to="/about"
                className="inline-flex items-center bg-secondary text-primary px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors animate-fade-up"
              >
                Learn More
                <ArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Calendly Integration Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Schedule a Meeting</h2>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div 
              className="calendly-inline-widget" 
              data-url="https://calendly.com/your-calendly-username"
              style={{ minWidth: '320px', height: '700px' }} 
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-background rounded-lg card-hover">
              <Calendar className="w-12 h-12 text-secondary mb-4" />
              <h3 className="text-xl font-bold mb-2">Upcoming Events</h3>
              <p className="text-gray-600 mb-4">
                Join our workshops, webinars, and training sessions.
              </p>
              <Link
                to="/events"
                className="text-primary hover:text-secondary font-medium inline-flex items-center"
              >
                View Events <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>

            <div className="p-6 bg-background rounded-lg card-hover">
              <Users className="w-12 h-12 text-secondary mb-4" />
              <h3 className="text-xl font-bold mb-2">Expert Team</h3>
              <p className="text-gray-600 mb-4">
                Meet our experienced professionals ready to guide you.
              </p>
              <Link
                to="/about"
                className="text-primary hover:text-secondary font-medium inline-flex items-center"
              >
                Meet the Team <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>

            <div className="p-6 bg-background rounded-lg card-hover">
              <Mail className="w-12 h-12 text-secondary mb-4" />
              <h3 className="text-xl font-bold mb-2">Get in Touch</h3>
              <p className="text-gray-600 mb-4">
                Have questions? We're here to help you succeed.
              </p>
              <Link
                to="/contact"
                className="text-primary hover:text-secondary font-medium inline-flex items-center"
              >
                Contact Us <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
