
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Event } from "@/types/events";
import type { StripeElementsOptions, Appearance } from "@stripe/stripe-js";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

const CheckoutForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.error("Stripe not initialized");
      return;
    }

    setIsProcessing(true);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw submitError;
      }

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: "if_required",
      });

      if (error) {
        throw error;
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        toast({
          title: "Payment successful!",
          description: "You have been registered for the event.",
        });
        onSuccess();
      } else {
        throw new Error(`Unexpected payment state: ${paymentIntent?.status}`);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment failed",
        description: error.message || "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
      >
        {isProcessing ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  );
};

interface PaymentModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  clientSecret: string | null;
}

export const PaymentModal = ({
  event,
  isOpen,
  onClose,
  onSuccess,
  clientSecret,
}: PaymentModalProps) => {
  const [stripeLoaded, setStripeLoaded] = useState(false);

  useEffect(() => {
    if (isOpen && clientSecret) {
      setStripeLoaded(true);
    } else {
      setStripeLoaded(false);
    }
  }, [isOpen, clientSecret]);

  if (!clientSecret || !stripeLoaded) return null;

  const appearance: Appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#0F172A',
    },
  };

  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Payment for {event.title}</DialogTitle>
          <DialogDescription>
            Please enter your payment details below to complete your registration.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm onSuccess={onSuccess} />
          </Elements>
        </div>
      </DialogContent>
    </Dialog>
  );
};
