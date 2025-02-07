
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Event } from "@/types/events";

const categories = [
  { value: "all", label: "All Events" },
  { value: "live_session", label: "Live Sessions" },
  { value: "webinar", label: "Webinars" },
  { value: "workshop", label: "Workshops" },
  { value: "short_course", label: "Short Courses" },
];

interface EventFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const EventForm = ({ onSuccess, onCancel }: EventFormProps) => {
  const { toast } = useToast();
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
      onSuccess();
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error creating event",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  return (
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
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Create Event</Button>
        </div>
      </form>
    </Form>
  );
};

