import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus } from "lucide-react";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { EventForm } from "@/components/events/EventForm";
import { EventDetails } from "@/components/events/EventDetails";
import { EventList } from "@/components/events/EventList";
import { PaymentModal } from "@/components/events/PaymentModal";
import type { Event, EventFilters } from "@/types/events";

const categories = [
  { value: "all", label: "All Events" },
  { value: "live_session", label: "Live Sessions" },
  { value: "webinar", label: "Webinars" },
  { value: "workshop", label: "Workshops" },
  { value: "short_course", label: "Short Courses" },
];

const Events = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<EventFilters>({
    category: "all",
    searchQuery: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("admin_users")
        .select()
        .eq("user_id", user.id)
        .maybeSingle();
      setIsAdmin(!!data);
    }
  };

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const { data: events = [], isLoading, refetch } = useQuery({
    queryKey: ["events", filters, selectedDate],
    queryFn: async () => {
      let query = supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });

      if (filters.category && filters.category !== "all") {
        query = query.eq("category", filters.category);
      }

      if (filters.searchQuery) {
        query = query.ilike("title", `%${filters.searchQuery}%`);
      }

      if (selectedDate) {
        const dateStr = format(selectedDate, "yyyy-MM-dd");
        query = query.gte("date", dateStr).lt("date", dateStr + "T23:59:59");
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching events:", error);
        throw error;
      }

      return data as Event[];
    },
  });

  const handleRegister = async (event: Event) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Please log in",
          description: "You need to be logged in to register for events.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("event_registrations").insert({
        event_id: event.id,
        user_id: user.id,
        payment_status: "pending",
      });

      if (error) throw error;

      console.log("Sending confirmation email to:", user.email);
      
      const response = await supabase.functions.invoke('create-payment-intent', {
        body: {
          amount: event.price,
          eventId: event.id,
          userId: user.id,
        },
      });

      if (response.error) throw response.error;

      setClientSecret(response.data.clientSecret);
      setShowPaymentModal(true);
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      console.log("Sending confirmation email...");
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !selectedEvent) return;

      const response = await supabase.functions.invoke('send-event-confirmation', {
        body: {
          userEmail: user.email,
          eventTitle: selectedEvent.title,
          eventDate: format(new Date(selectedEvent.date), "MMMM d, yyyy"),
          eventTime: selectedEvent.time,
          eventLocation: selectedEvent.location,
          googleMeetLink: selectedEvent.google_meet_link,
        },
      });

      if (!response.data) {
        throw new Error("Failed to send confirmation email");
      }

      setShowPaymentModal(false);
      setSelectedEvent(null);
      refetch();
    } catch (error) {
      console.error("Error sending confirmation:", error);
      toast({
        title: "Error sending confirmation",
        description: "Please contact support.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);

      if (error) throw error;

      toast({
        title: "Event deleted successfully!",
        description: "The event has been removed from the calendar.",
      });
      refetch();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error deleting event",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6">Upcoming Events</h1>
          <p className="text-xl text-gray-600">
            Join our events to learn, grow, and connect with industry professionals.
          </p>
        </div>

        {isAdmin && (
          <div className="mb-8">
            <Button onClick={() => setShowEventForm(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New Event
            </Button>
          </div>
        )}

        <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <EventForm
              onSuccess={() => {
                setShowEventForm(false);
                refetch();
              }}
              onCancel={() => setShowEventForm(false)}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="max-w-lg">
            {selectedEvent && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedEvent.title}</DialogTitle>
                </DialogHeader>
                <EventDetails
                  event={selectedEvent}
                  onRegister={handleRegister}
                  onClose={() => setSelectedEvent(null)}
                />
              </>
            )}
          </DialogContent>
        </Dialog>

        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search events..."
                  className="pl-10"
                  value={filters.searchQuery}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      searchQuery: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="w-full md:w-auto">
              <RadioGroup
                value={filters.category}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, category: value }))
                }
                className="flex flex-wrap gap-2"
              >
                {categories.map((category) => (
                  <div key={category.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={category.value} id={category.value} />
                    <Label htmlFor={category.value}>{category.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Filter by Date</h3>
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center">Loading events...</div>
        ) : (
          <EventList
            events={events}
            isAdmin={isAdmin}
            onViewDetails={setSelectedEvent}
            onEdit={(event) => {
              setSelectedEvent(event);
              setShowEventForm(true);
            }}
            onDelete={handleDeleteEvent}
          />
        )}

        {selectedEvent && (
          <PaymentModal
            event={selectedEvent}
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            onSuccess={handlePaymentSuccess}
            clientSecret={clientSecret}
          />
        )}
      </div>
    </div>
  );
};

export default Events;
