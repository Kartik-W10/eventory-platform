
import { useEffect } from "react";
import { Clock, Video, Mail, Calendar } from "lucide-react";

const MeetingBooking = () => {
  useEffect(() => {
    const head = document.querySelector("head");
    const script = document.createElement("script");
    script.setAttribute("src", "https://assets.calendly.com/assets/external/widget.js");
    head?.appendChild(script);

    return () => {
      head?.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Header Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Schedule a Meeting
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Book a one-on-one session to discuss your needs, explore collaboration opportunities, or get expert guidance.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mb-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <Clock className="w-10 h-10 text-secondary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Flexible Scheduling</h3>
              <p className="text-gray-600">
                Choose a time that works best for you from my available slots.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <Video className="w-10 h-10 text-secondary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Video Conferencing</h3>
              <p className="text-gray-600">
                Meet virtually through a secure and reliable video platform.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <Calendar className="w-10 h-10 text-secondary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Calendar Integration</h3>
              <p className="text-gray-600">
                Automatic calendar invites and reminders for our meeting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Calendly Widget */}
      <section className="max-w-4xl mx-auto px-4 mb-16">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div 
            className="calendly-inline-widget" 
            data-url="https://calendly.com/researchbuddyhq"
            style={{ minWidth: '320px', height: '700px' }} 
          />
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold mb-4">Need assistance?</h2>
          <p className="text-gray-600 mb-6">
            If you have any questions or need to make special arrangements, feel free to reach out directly.
          </p>
          <a
            href="mailto:contact@example.com"
            className="inline-flex items-center text-primary hover:text-secondary transition-colors"
          >
            <Mail className="w-5 h-5 mr-2" />
            Contact Support
          </a>
        </div>
      </section>
    </div>
  );
};

export default MeetingBooking;
