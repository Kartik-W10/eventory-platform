
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EventConfirmationRequest {
  userEmail: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  googleMeetLink?: string;
  registrationId?: string;
  attendeeName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      userEmail,
      eventTitle,
      eventDate,
      eventTime,
      eventLocation,
      googleMeetLink,
      registrationId,
      attendeeName,
    }: EventConfirmationRequest = await req.json();

    console.log("Sending confirmation email for event:", eventTitle);
    console.log("To email:", userEmail);

    const meetingDetails = googleMeetLink
      ? `<p>Join the meeting using this link: <a href="${googleMeetLink}">${googleMeetLink}</a></p>`
      : "";

    const registrationDetails = registrationId
      ? `<p>Registration ID: ${registrationId}</p>`
      : "";

    const attendeeGreeting = attendeeName
      ? `<p>Dear ${attendeeName},</p>`
      : `<p>Dear Participant,</p>`;

    const emailResponse = await resend.emails.send({
      from: "Events <onboarding@resend.dev>",
      to: [userEmail],
      subject: `Registration Confirmed: ${eventTitle}`,
      html: `
        <h1>Your registration is confirmed!</h1>
        ${attendeeGreeting}
        <h2>${eventTitle}</h2>
        <p>Date: ${eventDate}</p>
        <p>Time: ${eventTime}</p>
        <p>Location: ${eventLocation}</p>
        ${meetingDetails}
        ${registrationDetails}
        <p>Thank you for registering! Your payment has been verified and your spot is secured.</p>
        <p>We look forward to seeing you at the event.</p>
        <p>Best regards,<br/>The Events Team</p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending confirmation email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
