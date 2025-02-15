
import { Calendar, Clock, Video, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const MeetingBooking = () => {
  const meetingDurations = [
    {
      duration: "30 min",
      title: "Quick Sync",
      description: "Perfect for brief discussions and quick updates",
    },
    {
      duration: "60 min",
      title: "Deep Dive",
      description: "Ideal for detailed project discussions and strategy sessions",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Book a 1:1 Meeting with John Doe
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Let's collaborate! Whether you need project guidance, mentorship, or want
          to explore potential collaborations, I'm here to help you succeed.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {meetingDurations.map((option) => (
          <Card key={option.duration} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-secondary" />
                {option.title} ({option.duration})
              </CardTitle>
              <CardDescription>{option.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="lg">
                Schedule {option.duration} Meeting
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-background rounded-lg p-8 mb-12">
        <h2 className="text-2xl font-semibold mb-6">Meeting Details</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <Calendar className="h-6 w-6 text-secondary mt-1" />
            <div>
              <h3 className="font-medium mb-1">Availability</h3>
              <p className="text-gray-600">
                Monday - Friday
                <br />
                9:00 AM - 5:00 PM (EST)
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Video className="h-6 w-6 text-secondary mt-1" />
            <div>
              <h3 className="font-medium mb-1">Meeting Platform</h3>
              <p className="text-gray-600">
                Google Meet
                <br />
                Link will be shared upon confirmation
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Need a different time?</h2>
        <p className="text-gray-600 mb-4">
          If none of the available slots work for you, feel free to reach out
          directly.
        </p>
        <Button variant="outline" className="inline-flex items-center">
          <Mail className="mr-2 h-4 w-4" />
          Contact Me
        </Button>
      </div>
    </div>
  );
};

export default MeetingBooking;
