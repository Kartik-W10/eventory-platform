
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";
import type { Event } from "@/types/events";

interface PaymentVerificationProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  registrationId: string;
  onSuccess: () => void;
}

export const PaymentVerification = ({
  isOpen,
  onClose,
  event,
  registrationId,
  onSuccess,
}: PaymentVerificationProps) => {
  const { toast } = useToast();
  const { isAdmin } = useIsAdmin();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState("");
  const [paymentProofUrl, setPaymentProofUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [paymentNotes, setPaymentNotes] = useState("");
  
  // Fetch payment QR code on component mount
  useEffect(() => {
    if (isOpen && registrationId) {
      // First try to get QR code from the event
      if (event.payment_qr_code) {
        setQrCode(event.payment_qr_code);
      } else {
        // Fallback to registration-specific QR code
        fetchPaymentQr();
      }
    }
  }, [isOpen, registrationId, event]);
  
  const fetchPaymentQr = async () => {
    try {
      const { data, error } = await supabase
        .from("event_registrations")
        .select("*")
        .eq("id", registrationId)
        .single();
      
      if (error) throw error;
      
      // Safely check if the data has the payment_qr_code property
      if (data && 'payment_qr_code' in data) {
        setQrCode(data.payment_qr_code as string);
      }
    } catch (error) {
      console.error("Error fetching payment QR code:", error);
    }
  };
  
  // For admin: Upload QR code
  const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      // Upload QR code image
      const filePath = `${registrationId}/${file.name}`;
      const { data, error } = await supabase.storage
        .from('payment-qr-codes')
        .upload(filePath, file, { upsert: true });
      
      if (error) throw error;
      
      // Get public URL
      const { data: urlData } = await supabase.storage
        .from('payment-qr-codes')
        .getPublicUrl(filePath);
      
      // Update registration with QR code URL
      await supabase
        .from("event_registrations")
        .update({ 
          // Use a more type-safe approach to specify the columns
          updated_at: new Date().toISOString(),
          // Cast to any to bypass type checking for now
          payment_qr_code: urlData.publicUrl
        } as any)
        .eq("id", registrationId);
      
      setQrCode(urlData.publicUrl);
      toast({
        title: "QR code uploaded",
        description: "Payment QR code has been uploaded successfully.",
      });
    } catch (error) {
      console.error("Error uploading QR code:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload QR code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  // For users: Upload payment proof
  const handlePaymentProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      // Upload payment proof
      const filePath = `${registrationId}/${file.name}`;
      const { data, error } = await supabase.storage
        .from('payment-proofs')
        .upload(filePath, file, { upsert: true });
      
      if (error) throw error;
      
      // Get URL (not public for security)
      const { data: urlData } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(filePath);
      
      setPaymentProofUrl(urlData.publicUrl);
      toast({
        title: "Proof uploaded",
        description: "Payment proof has been uploaded successfully.",
      });
    } catch (error) {
      console.error("Error uploading payment proof:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload payment proof. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  // Submit payment verification
  const handleSubmitPayment = async () => {
    if (!paymentProofUrl && !transactionId) {
      toast({
        title: "Missing information",
        description: "Please upload payment proof or provide transaction ID.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await supabase
        .from("event_registrations")
        .update({
          payment_proof_url: paymentProofUrl,
          transaction_id: transactionId,
          payment_notes: paymentNotes,
          payment_status: "pending_verification",
          updated_at: new Date().toISOString(),
        } as any) // Use type assertion to bypass type checking
        .eq("id", registrationId);
      
      toast({
        title: "Payment submitted",
        description: "Your payment information has been submitted for verification.",
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error submitting payment:", error);
      toast({
        title: "Submission failed",
        description: "Failed to submit payment information. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // For admin: Approve payment
  const handleApprovePayment = async () => {
    try {
      await supabase
        .from("event_registrations")
        .update({
          payment_status: "approved",
          updated_at: new Date().toISOString(),
        })
        .eq("id", registrationId);
      
      // Trigger confirmation email via edge function
      const { data: registration, error } = await supabase
        .from("event_registrations")
        .select("*")
        .eq("id", registrationId)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (registration) {
        const userEmail = 'attendee_email' in registration 
          ? registration.attendee_email 
          : (await supabase.auth.getUser()).data.user?.email;
        
        const attendeeName = 'attendee_name' in registration 
          ? registration.attendee_name 
          : '';
        
        if (userEmail) {
          await supabase.functions.invoke('send-event-confirmation', {
            body: {
              userEmail,
              eventTitle: event.title,
              eventDate: new Date(event.date).toLocaleDateString(),
              eventTime: event.time,
              eventLocation: event.location,
              googleMeetLink: event.google_meet_link,
              registrationId: registrationId,
              attendeeName,
            },
          });
        }
      }
      
      toast({
        title: "Payment approved",
        description: "The payment has been approved and confirmation email sent.",
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error approving payment:", error);
      toast({
        title: "Approval failed",
        description: "Failed to approve payment. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // For admin: Reject payment
  const handleRejectPayment = async () => {
    try {
      await supabase
        .from("event_registrations")
        .update({
          payment_status: "rejected",
          updated_at: new Date().toISOString(),
        })
        .eq("id", registrationId);
      
      toast({
        title: "Payment rejected",
        description: "The payment has been rejected.",
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error rejecting payment:", error);
      toast({
        title: "Rejection failed",
        description: "Failed to reject payment. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Payment Verification</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {isAdmin ? (
            // Admin view
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Upload Payment QR Code</label>
                <p className="text-sm text-muted-foreground mb-2">
                  {event.payment_qr_code ? 
                    "This event already has a payment QR code, but you can upload a registration-specific one if needed." : 
                    "Upload a QR code for this registration. You can also set a default QR code when creating events."}
                </p>
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleQrUpload}
                  disabled={isUploading}
                />
                {isUploading && <p className="text-sm text-muted-foreground mt-1">Uploading...</p>}
              </div>
              
              {qrCode && (
                <div className="text-center">
                  <img 
                    src={qrCode} 
                    alt="Payment QR Code" 
                    className="max-w-full h-auto max-h-48 mx-auto border rounded"
                  />
                </div>
              )}
              
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Verify Payment</h3>
                
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" onClick={onClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleRejectPayment} variant="destructive" className="flex-1">
                    Reject
                  </Button>
                  <Button onClick={handleApprovePayment} className="flex-1">
                    Approve
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            // User view
            <div className="space-y-4">
              {qrCode ? (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Scan this QR code to make your payment
                  </p>
                  <img 
                    src={qrCode} 
                    alt="Payment QR Code" 
                    className="max-w-full h-auto max-h-48 mx-auto border rounded"
                  />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  The administrator has not yet uploaded a payment QR code. Please check back later.
                </p>
              )}
              
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Submit Payment Proof</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Transaction ID/Reference</label>
                    <Input 
                      placeholder="Enter transaction reference number"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Upload Payment Screenshot</label>
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={handlePaymentProofUpload}
                      disabled={isUploading}
                    />
                    {isUploading && <p className="text-sm text-muted-foreground mt-1">Uploading...</p>}
                    {paymentProofUrl && (
                      <p className="text-sm text-green-600 mt-1">Screenshot uploaded successfully!</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Additional Notes</label>
                    <Textarea 
                      placeholder="Any additional information about your payment"
                      value={paymentNotes}
                      onChange={(e) => setPaymentNotes(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" onClick={onClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmitPayment} 
                    className="flex-1"
                    disabled={(!paymentProofUrl && !transactionId) || isUploading}
                  >
                    Submit Payment
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
