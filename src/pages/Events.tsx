import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, MapPin, Search } from "lucide-react";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
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

  // Fetch events from Supabase
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events", filters, selectedDate],
    queryFn: async () => {
      console.log("Fetching events with filters:", filters);
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

  const handleRegister = async (eventId: string) => {
    try {
      const { error } = await supabase.from("event_registrations").insert({
        event_id: eventId,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        payment_status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Registration successful!",
        description: "You have been registered for this event.",
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
                <h2 className="text-2xl font-bold mb-4">{event.title}</h2>
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
                  <Button onClick={() => handleRegister(event.id)}>
                    Register Now
                  </Button>
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