import { Calendar, Clock, MapPin } from "lucide-react";

const events = [
  {
    title: "Professional Development Workshop",
    date: "March 15, 2024",
    time: "2:00 PM - 4:00 PM",
    location: "Virtual Event",
    description:
      "Join us for an interactive workshop focused on career growth and leadership skills.",
  },
  {
    title: "Networking Masterclass",
    date: "March 20, 2024",
    time: "1:00 PM - 3:00 PM",
    location: "Business Center, Downtown",
    description:
      "Learn effective networking strategies and build meaningful professional connections.",
  },
  {
    title: "Industry Insights Webinar",
    date: "March 25, 2024",
    time: "11:00 AM - 12:30 PM",
    location: "Virtual Event",
    description:
      "Expert panel discussion on current trends and future opportunities in the industry.",
  },
];

const Events = () => {
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6">Upcoming Events</h1>
          <p className="text-xl text-gray-600">
            Join our events to learn, grow, and connect with industry professionals.
          </p>
        </div>

        <div className="grid gap-8">
          {events.map((event, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h2 className="text-2xl font-bold mb-4">{event.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-2 text-secondary" />
                  {event.date}
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-2 text-secondary" />
                  {event.time}
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2 text-secondary" />
                  {event.location}
                </div>
              </div>
              <p className="text-gray-600 mb-4">{event.description}</p>
              <button className="bg-secondary text-primary px-6 py-2 rounded font-medium hover:bg-opacity-90 transition-colors">
                Register Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;