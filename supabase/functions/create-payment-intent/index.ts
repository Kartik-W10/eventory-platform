
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Stripe } from "https://esm.sh/stripe@11.1.0?target=deno";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log("Creating payment intent...");
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      httpClient: Stripe.createFetchHttpClient(),
      apiVersion: '2023-10-16',
    });

    const { amount, eventId, userId } = await req.json();
    console.log("Received payment request:", { amount, eventId, userId });

    if (!amount || !eventId || !userId) {
      throw new Error("Missing required fields: amount, eventId, or userId");
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        eventId,
        userId,
      },
    });

    console.log("Payment intent created:", paymentIntent.id);

    // Create payment record in database
    const response = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/rest/v1/payments`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ApiKey': Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          'Prefer': 'return=minimal', // Don't return the inserted row
        },
        body: JSON.stringify({
          amount,
          event_id: eventId,
          user_id: userId,
          stripe_payment_intent_id: paymentIntent.id,
          status: 'pending',
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Database error response:", errorText);
      throw new Error("Failed to create payment record");
    }

    console.log("Payment record created in database");

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error("Error in create-payment-intent:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
