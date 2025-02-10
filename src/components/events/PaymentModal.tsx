
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Event } from "@/types/events";
import type { StripeElementsOptions, Appearance } from "@stripe/stripe-js";

// Initialize Stripe
const stripePromise = loadStripe("pk_test_51OyQfHJhDOOVVZXxHZNFLPjbHedD9pALtAHj7GaJF4i0Hht8r3NhqxPBnmUEPaUH7zDKmgWkwPnYnRHsXEXBMivd00iuIgPHCI");

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
      console.log("Starting payment confirmation...");
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

      console.log("Payment confirmation result:", { error, paymentIntent });

      if (error) {
        console.error("Payment error:", error);
        toast({
          title: "Payment failed",
          description: error.message || "Please try again or contact support.",
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        console.log("Payment successful");
        toast({
          title: "Payment successful!",
          description: "You have been registered for the event.",
        });
        onSuccess();
      } else {
        console.error("Unexpected payment state:", paymentIntent?.status);
        toast({
          title: "Payment status unclear",
          description: "Please contact support to confirm your registration.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }

    setIsProcessing(false);
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
  if (!clientSecret) return null;

  const appearance: Appearance = {
    theme: 'stripe',
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
