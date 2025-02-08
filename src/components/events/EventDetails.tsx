
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Event } from "@/types/events";

interface EventDetailsProps {
  event: Event;
  onRegister: (event: Event) => void;
  onClose: () => void;
}

export const EventDetails = ({ event, onRegister, onClose }: EventDetailsProps) => {
  const { toast } = useToast();

  // Check if user is authenticated and get registration status
  const { data: registrationStatus, isLoading } = useQuery({
    queryKey: ["eventRegistration", event.id],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { isAuthenticated: false, isRegistered: false, isAdmin: false };

      // Check if user is admin
      const { data: adminData } = await supabase
        .from("admin_users")
        .select()
        .eq("user_id", user.id)
        .maybeSingle();

      // Check if user is registered for this event
      const { data: registrationData } = await supabase
        .from("event_registrations")
        .select()
        .eq("event_id", event.id)
        .eq("user_id", user.id)
        .maybeSingle();

      return {
        isAuthenticated: true,
        isRegistered: !!registrationData,
        isAdmin: !!adminData
      };
    }
  });

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  // If user is not authenticated, show login prompt
  if (!registrationStatus?.isAuthenticated) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-gray-600">Please log in to view event details and register.</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    );
  }

  // Only show basic details if user is not registered
  if (!registrationStatus.isRegistered) {
    return (
      <div className="space-y-4">
        <p className="text-gray-600">Register to see full event details.</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold">Date & Time</h4>
            <p>{format(new Date(event.date), "MMMM d, yyyy")} at {event.time}</p>
          </div>
          <div>
            <h4 className="font-semibold">Location</h4>
            <p>{event.location}</p>
          </div>
          <div>
            <h4 className="font-semibold">Price</h4>
            <p>${event.price.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={() => onRegister(event)}>Register Now</Button>
        </div>
      </div>
    );
  }

  // Show full details for registered users (including admins)
  return (
    <div className="space-y-4">
      <p className="text-gray-600">{event.description}</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold">Date & Time</h4>
          <p>{format(new Date(event.date), "MMMM d, yyyy")} at {event.time}</p>
        </div>
        <div>
          <h4 className="font-semibold">Location</h4>
          <p>{event.location}</p>
        </div>
        <div>
          <h4 className="font-semibold">Category</h4>
          <p>{event.category}</p>
        </div>
        <div>
          <h4 className="font-semibold">Price</h4>
          <p>${event.price.toFixed(2)}</p>
        </div>
        {/* Only show Google Meet link if user is registered */}
        {registrationStatus.isRegistered && event.google_meet_link && (
          <div className="col-span-2">
            <h4 className="font-semibold">Google Meet Link</h4>
            <a
              href={event.google_meet_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600"
            >
              Join Meeting
            </a>
          </div>
        )}
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>
    </div>
  );
};
