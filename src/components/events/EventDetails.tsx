
import { useState } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { Event } from "@/types/events";

const registrationSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

interface EventDetailsProps {
  event: Event;
  onRegister: (event: Event, formData: RegistrationFormValues) => void;
  onClose: () => void;
}

export const EventDetails = ({ event, onRegister, onClose }: EventDetailsProps) => {
  const { toast } = useToast();
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

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

  const handleSubmitRegistration = (values: RegistrationFormValues) => {
    onRegister(event, values);
  };

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

  // Show registration form if not yet registered
  if (!registrationStatus.isRegistered && showRegistrationForm) {
    return (
      <div className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitRegistration)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowRegistrationForm(false)}>Cancel</Button>
              <Button type="submit">Register</Button>
            </div>
          </form>
        </Form>
      </div>
    );
  }

  // Only show basic details if user is not registered
  if (!registrationStatus.isRegistered) {
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
            <h4 className="font-semibold">Price</h4>
            <p>${event.price.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={() => setShowRegistrationForm(true)}>Start Registration</Button>
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
