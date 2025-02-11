
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Stripe } from "https://esm.sh/stripe@11.1.0?target=deno";
import { corsHeaders } from "../_shared/cors.ts";

const createPaymentRecord = async (data: {
  amount: number;
  eventId: string;
  userId: string;
  paymentIntentId: string;
}) => {
  const response = await fetch(
    `${Deno.env.get('SUPABASE_URL')}/rest/v1/payments`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ApiKey': Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        amount: data.amount,
        event_id: data.eventId,
        user_id: data.userId,
        stripe_payment_intent_id: data.paymentIntentId,
        status: 'pending',
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create payment record: ${errorText}`);
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { amount, eventId, userId } = await req.json();
    
    if (!amount || !eventId || !userId) {
      throw new Error("Missing required fields: amount, eventId, or userId");
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      httpClient: Stripe.createFetchHttpClient(),
      apiVersion: '2023-10-16',
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      metadata: {
        eventId,
        userId,
      },
    });

    await createPaymentRecord({
      amount,
      eventId,
      userId,
      paymentIntentId: paymentIntent.id,
    });

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
