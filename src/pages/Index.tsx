
import { ArrowRight, Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with softer gradient and rounded elements */}
      <section className="bg-gradient-to-br from-primary to-secondary/70 text-white py-24 rounded-b-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-up">
              Welcome to YourBrand
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto animate-fade-up opacity-90">
              Empowering professionals through expert guidance and resources
            </p>
            <div className="space-x-4">
              <Link
                to="/about"
                className="inline-flex items-center bg-white/90 text-primary px-6 py-3 rounded-full font-medium hover:bg-white transition-colors animate-fade-up shadow-md"
              >
                Learn More
                <ArrowRight className="ml-2" />
              </Link>
              <Link
                to="/meeting-booking"
                className="inline-flex items-center bg-secondary/80 text-white border border-white/30 px-6 py-3 rounded-full font-medium hover:bg-secondary transition-colors animate-fade-up shadow-md"
              >
                Book a Meeting
                <Calendar className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with organic cards */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary">Our Services</h2>
            <p className="text-lg text-gray-600 mt-2 max-w-2xl mx-auto">
              Discover what we offer to help you succeed
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group">
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6">
                <Calendar className="w-12 h-12 text-secondary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2 text-primary">Upcoming Events</h3>
                <p className="text-gray-600 mb-4">
                  Join our workshops, webinars, and training sessions.
                </p>
              </div>
              <div className="px-6 py-4 bg-white">
                <Link
                  to="/events"
                  className="text-primary hover:text-secondary font-medium inline-flex items-center"
                >
                  View Events <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group">
              <div className="bg-gradient-to-r from-secondary/10 to-primary/10 p-6">
                <Users className="w-12 h-12 text-secondary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2 text-primary">Expert Team</h3>
                <p className="text-gray-600 mb-4">
                  Meet our experienced professionals ready to guide you.
                </p>
              </div>
              <div className="px-6 py-4 bg-white">
                <Link
                  to="/about"
                  className="text-primary hover:text-secondary font-medium inline-flex items-center"
                >
                  Meet the Team <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group">
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6">
                <Calendar className="w-12 h-12 text-secondary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2 text-primary">Book a Meeting</h3>
                <p className="text-gray-600 mb-4">
                  Schedule a one-on-one session with one of our experts.
                </p>
              </div>
              <div className="px-6 py-4 bg-white">
                <Link
                  to="/meeting-booking"
                  className="text-primary hover:text-secondary font-medium inline-flex items-center"
                >
                  Book Now <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
