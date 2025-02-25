
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { google } from "npm:googleapis@126.0.1";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface MeetingRequest {
  hostId: string;
  guestName: string;
  guestEmail: string;
  startTime: string;
  duration: number;
  notes?: string;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { hostId, guestName, guestEmail, startTime, duration, notes } = 
      await req.json() as MeetingRequest;

    // Get host's meeting preferences
    const { data: preferences, error: prefError } = await supabase
      .from("meeting_preferences")
      .select("*")
      .eq("user_id", hostId)
      .single();

    if (prefError) throw new Error("Failed to get meeting preferences");

    const startDateTime = new Date(startTime);
    const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

    // Create calendar event
    const oauth2Client = new google.auth.OAuth2(
      Deno.env.get("GOOGLE_CLIENT_ID"),
      Deno.env.get("GOOGLE_CLIENT_SECRET"),
      Deno.env.get("GOOGLE_REDIRECT_URI")
    );

    // Note: In a production environment, you'd need to handle token refresh
    oauth2Client.setCredentials({
      refresh_token: Deno.env.get("GOOGLE_REFRESH_TOKEN"),
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    
    const event = {
      summary: preferences.title,
      description: `${preferences.description}\n\nNotes: ${notes || "No additional notes"}`,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: "UTC",
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: "UTC",
      },
      attendees: [{ email: guestEmail }],
      conferenceData: {
        createRequest: {
          requestId: crypto.randomUUID(),
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };

    const calendarResponse = await calendar.events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1,
      requestBody: event,
    });

    // Save meeting in database
    const { data: meeting, error: meetingError } = await supabase
      .from("scheduled_meetings")
      .insert({
        host_id: hostId,
        guest_email: guestEmail,
        guest_name: guestName,
        start_time: startDateTime,
        end_time: endDateTime,
        duration,
        status: "confirmed",
        calendar_event_id: calendarResponse.data.id,
        notes,
      })
      .select()
      .single();

    if (meetingError) throw new Error("Failed to save meeting");

    // Send confirmation email
    await resend.emails.send({
      from: "Meetings <onboarding@resend.dev>",
      to: [guestEmail],
      subject: `Meeting Scheduled: ${preferences.title}`,
      html: `
        <h1>Your meeting has been scheduled!</h1>
        <p>Meeting Details:</p>
        <ul>
          <li>Date: ${startDateTime.toLocaleDateString()}</li>
          <li>Time: ${startDateTime.toLocaleTimeString()}</li>
          <li>Duration: ${duration} minutes</li>
        </ul>
        <p>A calendar invitation has been sent to your email.</p>
      `,
    });

    return new Response(
      JSON.stringify({ success: true, meeting }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
