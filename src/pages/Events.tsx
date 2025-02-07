import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, MapPin, Search, Plus, Edit, Trash } from "lucide-react";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
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

  // Check if user is admin
  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("admin_users")
        .select()
        .eq("user_id", user.id)
        .single();
      setIsAdmin(!!data);
    }
  };

  // Call checkAdminStatus when component mounts
  useEffect(() => {
    checkAdminStatus();
  }, []);

  // Fetch events from Supabase
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

  // Form for creating/editing events
  const eventForm = useForm({
    defaultValues: {
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      category: "webinar",
      capacity: 100,
      price: 0,
      registration_deadline: "",
      google_meet_link: "",
    },
  });

  const handleSubmitEvent = async (data: any) => {
    try {
      const { error } = await supabase
        .from("events")
        .insert([data]);

      if (error) throw error;

      toast({
        title: "Event created successfully!",
        description: "The event has been added to the calendar.",
      });
      setShowEventForm(false);
      refetch();
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error creating event",
        description: "Please try again or contact support.",
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

      // Send confirmation email
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-event-confirmation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            userEmail: user.email,
            eventTitle: event.title,
            eventDate: format(new Date(event.date), "MMMM d, yyyy"),
            eventTime: event.time,
            eventLocation: event.location,
            googleMeetLink: event.google_meet_link,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send confirmation email");
      }

      toast({
        title: "Registration successful!",
        description: "You have been registered for this event. Check your email for confirmation.",
      });
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
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

        {/* Admin Controls */}
        {isAdmin && (
          <div className="mb-8">
            <Button onClick={() => setShowEventForm(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New Event
            </Button>
          </div>
        )}

        {/* Event Form Dialog */}
        <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <Form {...eventForm}>
              <form onSubmit={eventForm.handleSubmit(handleSubmitEvent)} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={eventForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} className="w-full" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={eventForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="h-20" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={eventForm.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={eventForm.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={eventForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={eventForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <select {...field} className="w-full p-2 border rounded">
                            {categories.map((cat) => (
                              <option key={cat.value} value={cat.value}>
                                {cat.label}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={eventForm.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacity</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={eventForm.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={eventForm.control}
                    name="registration_deadline"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Registration Deadline</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={eventForm.control}
                    name="google_meet_link"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Google Meet Link (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://meet.google.com/..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full mt-4">Create Event</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Event Details Dialog */}
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="max-w-lg">
            {selectedEvent && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedEvent.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-gray-600">{selectedEvent.description}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold">Date & Time</h4>
                      <p>{format(new Date(selectedEvent.date), "MMMM d, yyyy")} at {selectedEvent.time}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Location</h4>
                      <p>{selectedEvent.location}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Category</h4>
                      <p>{selectedEvent.category}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Price</h4>
                      <p>${selectedEvent.price.toFixed(2)}</p>
                    </div>
                    {selectedEvent.google_meet_link && (
                      <div className="col-span-2">
                        <h4 className="font-semibold">Google Meet Link</h4>
                        <a
                          href={selectedEvent.google_meet_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-600"
                        >
                          Join Meeting
                        </a>
                      </div>
                    )}
                  </div>
                  <Button onClick={() => handleRegister(selectedEvent)} className="w-full">
                    Register Now
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Filters Section */}
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

          {/* Calendar Filter */}
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

        {/* Events Grid */}
        {isLoading ? (
          <div className="text-center">Loading events...</div>
        ) : (
          <div className="grid gap-8">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold">{event.title}</h2>
                  {isAdmin && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          eventForm.reset(event);
                          setShowEventForm(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-2 text-secondary" />
                    {format(new Date(event.date), "MMMM d, yyyy")}
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
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">
                    ${event.price.toFixed(2)}
                  </span>
                  <div className="space-x-2">
                    <Button variant="outline" onClick={() => setSelectedEvent(event)}>
                      View Details
                    </Button>
                    <Button onClick={() => handleRegister(event.id)}>
                      Register Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
