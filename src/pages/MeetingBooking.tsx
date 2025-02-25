
import { useState, useEffect } from "react";
import { Calendar, Clock, Video, Mail, ArrowRight } from "lucide-react";
import { format, addDays } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const MeetingBooking = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState<any>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    notes: "",
  });

  useEffect(() => {
    const fetchPreferences = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to manage your meeting preferences.",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("meeting_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        // Create default preferences if none exist
        const { data: newPrefs, error: createError } = await supabase
          .from("meeting_preferences")
          .insert([{ user_id: user.id }])
          .select()
          .single();

        if (createError) {
          console.error("Error creating preferences:", createError);
          return;
        }
        setPreferences(newPrefs);
      } else {
        setPreferences(data);
      }
    };

    fetchPreferences();
  }, []);

  const handleScheduleMeeting = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const startTime = addDays(new Date(), 1);
      startTime.setHours(10, 0, 0, 0);

      const response = await supabase.functions.invoke("schedule-meeting", {
        body: {
          hostId: user.id,
          guestName: bookingForm.name,
          guestEmail: bookingForm.email,
          startTime: startTime.toISOString(),
          duration: parseInt(selectedDuration),
          notes: bookingForm.notes,
        },
      });

      if (response.error) throw response.error;

      toast({
        title: "Meeting scheduled!",
        description: "A confirmation email has been sent with the details.",
      });

      setShowBookingDialog(false);
      setBookingForm({ name: "", email: "", notes: "" });
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      toast({
        title: "Failed to schedule meeting",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const meetingDurations = preferences?.duration_options.map((mins: number) => ({
    duration: `${mins} min`,
    title: mins === 30 ? "Quick Sync" : "Deep Dive",
    description: mins === 30
      ? "Perfect for brief discussions and quick updates"
      : "Ideal for detailed project discussions and strategy sessions",
  })) || [];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Book a 1:1 Meeting
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {preferences?.description || 
            "Let's collaborate! Whether you need project guidance, mentorship, or want to explore potential collaborations, I'm here to help you succeed."}
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
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => {
                  setSelectedDuration(option.duration.split(" ")[0]);
                  setShowBookingDialog(true);
                }}
              >
                Schedule {option.duration} Meeting
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule a Meeting</DialogTitle>
            <DialogDescription>
              Fill out the details below to schedule your {selectedDuration} minute meeting.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="John Smith"
                value={bookingForm.name}
                onChange={(e) => setBookingForm(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Your Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={bookingForm.email}
                onChange={(e) => setBookingForm(prev => ({
                  ...prev,
                  email: e.target.value
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="What would you like to discuss?"
                value={bookingForm.notes}
                onChange={(e) => setBookingForm(prev => ({
                  ...prev,
                  notes: e.target.value
                }))}
              />
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setShowBookingDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleScheduleMeeting}
              disabled={loading || !bookingForm.name || !bookingForm.email}
            >
              {loading ? "Scheduling..." : "Confirm Booking"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
                {preferences?.availability_start?.slice(0, 5)} - {preferences?.availability_end?.slice(0, 5)} (EST)
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
