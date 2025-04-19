import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus } from "lucide-react";
import { format } from "date-fns";
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
import { PaymentVerification } from "@/components/events/PaymentVerification";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import type { Event, EventFilters, RegistrationFormData, EventRegistration } from "@/types/events";

const categories = [
  { value: "all", label: "All Events" },
  { value: "live_session", label: "Live Sessions" },
  { value: "webinar", label: "Webinars" },
  { value: "workshop", label: "Workshops" },
  { value: "short_course", label: "Short Courses" },
];

const Events = () => {
  const { toast } = useToast();
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  
  // Log admin status for debugging
  useEffect(() => {
    console.log("Admin status in Events page:", isAdmin);
  }, [isAdmin]);
  
  const [filters, setFilters] = useState<EventFilters>({
    category: "all",
    searchQuery: "",
  });
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentVerification, setShowPaymentVerification] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [currentRegistration, setCurrentRegistration] = useState<EventRegistration | null>(null);

  const { data: events = [], isLoading, refetch } = useQuery({
    queryKey: ["events", filters],
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

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching events:", error);
        throw error;
      }

      return data as Event[];
    },
  });

  // Fetch user registrations
  const { data: userRegistrations = [], refetch: refetchRegistrations } = useQuery({
    queryKey: ["userRegistrations"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("event_registrations")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching registrations:", error);
        throw error;
      }

      return data as EventRegistration[];
    },
  });

  const handleRegister = async (event: Event, formData?: RegistrationFormData) => {
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

      // Check if user is already registered
      const existingRegistration = userRegistrations.find(reg => reg.event_id === event.id);
      
      if (existingRegistration) {
        setCurrentRegistration(existingRegistration);
        setSelectedEvent(event);
        setShowPaymentVerification(true);
        return;
      }

      // Create new registration
      const { data: registration, error } = await supabase.from("event_registrations").insert({
        event_id: event.id,
        user_id: user.id,
        payment_status: "pending",
        attendee_name: formData?.name,
        attendee_email: formData?.email,
        attendee_phone: formData?.phone,
      }).select().single();

      if (error) throw error;

      toast({
        title: "Registration initiated",
        description: "Your registration has been started. Please proceed with payment verification.",
      });
      
      // TypeScript was complaining here - we need to explicitly cast to EventRegistration
      setCurrentRegistration(registration as EventRegistration);
      setSelectedEvent(event);
      setShowPaymentVerification(true);
      refetchRegistrations();
      
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
      console.log("Payment successful, sending confirmation email...");
      
      if (!selectedEvent) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await refetchRegistrations();
      
      toast({
        title: "Registration complete!",
        description: "Your payment was successful. You'll receive a confirmation email shortly.",
      });
      
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

  const handlePaymentVerificationComplete = async () => {
    await refetchRegistrations();
    refetch();
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

  const getRegistrationStatus = (eventId: string) => {
    const registration = userRegistrations.find(reg => reg.event_id === eventId);
    return registration?.payment_status || null;
  };

  if (isLoading || isAdminLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6">Upcoming Events</h1>
          <p className="text-xl text-gray-600">
            Join our events to learn, grow, and connect with industry professionals.
          </p>
        </div>

        {isAdmin ? (
          <div className="mb-8">
            <Button onClick={() => setShowEventForm(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New Event
            </Button>
          </div>
        ) : (
          <div className="mb-8 p-4 border rounded-md bg-yellow-50 text-yellow-800">
            <p>You need admin privileges to add events.</p>
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
            getRegistrationStatus={getRegistrationStatus}
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
        
        {/* Payment Verification Modal */}
        {selectedEvent && currentRegistration && (
          <PaymentVerification
            isOpen={showPaymentVerification}
            onClose={() => setShowPaymentVerification(false)}
            event={selectedEvent}
            registrationId={currentRegistration.id}
            onSuccess={handlePaymentVerificationComplete}
          />
        )}
      </div>
    </div>
  );
};

export default Events;
