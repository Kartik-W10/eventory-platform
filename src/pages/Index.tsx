
import { ArrowRight, Calendar, Users, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with improved responsiveness */}
      <section className="bg-gradient-to-br from-primary to-secondary/70 text-white py-16 md:py-20 px-4 rounded-b-3xl">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-up">
              Welcome to YourBrand
            </h1>
            <p className="text-base md:text-xl mb-8 max-w-2xl mx-auto animate-fade-up opacity-90">
              Empowering professionals through expert guidance and resources
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              <Link
                to="/about"
                className="inline-flex items-center justify-center bg-white/90 text-primary px-5 py-2.5 rounded-full font-medium hover:bg-white transition-colors animate-fade-up shadow-md"
              >
                Learn More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                to="/meeting-booking"
                className="inline-flex items-center justify-center bg-secondary/80 text-white border border-white/30 px-5 py-2.5 rounded-full font-medium hover:bg-secondary transition-colors animate-fade-up shadow-md"
              >
                Book a Meeting
                <Calendar className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with improved responsiveness and hover effects */}
      <section className="py-12 md:py-16 bg-background px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-primary">Our Services</h2>
            <p className="text-base text-gray-600 mt-2 max-w-2xl mx-auto">
              Discover what we offer to help you succeed
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group">
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6">
                <Calendar className="w-10 h-10 text-secondary mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold mb-2 text-primary">Upcoming Events</h3>
                <p className="text-gray-600 mb-3 text-sm">
                  Join our workshops, webinars, and training sessions designed to enhance your professional skills.
                </p>
              </div>
              <div className="px-6 py-4 bg-white">
                <Link
                  to="/events"
                  className="text-primary hover:text-secondary font-medium inline-flex items-center text-sm"
                >
                  View Events <ArrowRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group">
              <div className="bg-gradient-to-r from-secondary/10 to-primary/10 p-6">
                <Users className="w-10 h-10 text-secondary mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold mb-2 text-primary">Expert Team</h3>
                <p className="text-gray-600 mb-3 text-sm">
                  Meet our experienced professionals ready to guide you through your journey to success.
                </p>
              </div>
              <div className="px-6 py-4 bg-white">
                <Link
                  to="/about"
                  className="text-primary hover:text-secondary font-medium inline-flex items-center text-sm"
                >
                  Meet the Team <ArrowRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group">
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6">
                <BookOpen className="w-10 h-10 text-secondary mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold mb-2 text-primary">Resources</h3>
                <p className="text-gray-600 mb-3 text-sm">
                  Access our library of PDFs, guides, and templates to support your professional development.
                </p>
              </div>
              <div className="px-6 py-4 bg-white">
                <Link
                  to="/downloads/resources"
                  className="text-primary hover:text-secondary font-medium inline-flex items-center text-sm"
                >
                  Browse Resources <ArrowRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
