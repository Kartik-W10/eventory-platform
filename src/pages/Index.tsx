
import { ArrowRight, Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="flex flex-col">
      {/* Full-width hero section with gradient background */}
      <section className="bg-gradient-to-r from-[#1a365d] to-[#4fd1c5] text-white py-20 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Welcome to YourBrand
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
            Your go-to platform for research guidance, expert insights, and academic growth. 
            Whether you're a student, scholar, or professional, we provide the tools, 
            resources, and mentorship needed to excel in your research journey.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/about"
              className="inline-flex items-center bg-[#4fd1c5]/90 text-white px-6 py-3 rounded-md font-medium hover:bg-[#4fd1c5] transition-colors"
            >
              Learn More
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/meeting-booking"
              className="inline-flex items-center bg-white text-[#1a365d] px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              Book a Meeting
              <Calendar className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section with improved spacing */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary">Our Services</h2>
            <p className="text-lg text-gray-600 mt-3 max-w-2xl mx-auto">
              Discover what we offer to help you succeed
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="p-6">
                <Calendar className="w-12 h-12 text-secondary mb-4" />
                <h3 className="text-xl font-bold mb-3 text-primary">Upcoming Events</h3>
                <p className="text-gray-600 mb-4">
                  Join our workshops, webinars, and training sessions designed to enhance your skills.
                </p>
                <Link
                  to="/events"
                  className="text-primary hover:text-secondary font-medium inline-flex items-center"
                >
                  View Events <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="p-6">
                <Users className="w-12 h-12 text-secondary mb-4" />
                <h3 className="text-xl font-bold mb-3 text-primary">Expert Team</h3>
                <p className="text-gray-600 mb-4">
                  Meet our experienced professionals ready to guide you through your academic journey.
                </p>
                <Link
                  to="/about"
                  className="text-primary hover:text-secondary font-medium inline-flex items-center"
                >
                  Meet the Team <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="p-6">
                <Calendar className="w-12 h-12 text-secondary mb-4" />
                <h3 className="text-xl font-bold mb-3 text-primary">Book a Meeting</h3>
                <p className="text-gray-600 mb-4">
                  Schedule a one-on-one session with one of our experts to discuss your specific needs.
                </p>
                <Link
                  to="/meeting-booking"
                  className="text-primary hover:text-secondary font-medium inline-flex items-center"
                >
                  Book Now <ArrowRight className="ml-2 w-4 h-4" />
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
