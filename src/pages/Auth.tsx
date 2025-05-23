import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkUserStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("status")
        .eq("user_id", userId)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data && data.status === "rejected") {
        // Log the user out if their account is rejected/disabled
        await supabase.auth.signOut();
        toast({
          variant: "destructive",
          title: "Account disabled",
          description: "Your account has been disabled. Please contact support for assistance.",
        });
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error checking user status:", error);
      return true; // Default to allowing access if status check fails
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        // Check if the user's account is disabled
        if (data.user) {
          const isActive = await checkUserStatus(data.user.id);
          if (!isActive) {
            return; // Don't navigate if account is disabled
          }
        }
        
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast({
          title: "Success!",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/auth",
      });
      
      if (error) throw error;
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for a link to reset your password.",
      });
      
      // Return to login screen after sending the reset email
      setIsForgotPassword(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderForgotPasswordForm = () => (
    <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-lg">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary">Reset Password</h2>
        <p className="mt-2 text-gray-600">
          Enter your email to receive a password reset link
        </p>
      </div>

      <form onSubmit={handlePasswordReset} className="mt-8 space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </Button>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsForgotPassword(false)}
            className="text-secondary flex items-center justify-center mx-auto hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> 
            Back to login
          </button>
        </div>
      </form>
    </div>
  );

  const renderAuthForm = () => (
    <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-lg">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="mt-2 text-gray-600">
          {isLogin
            ? "Sign in to access your account"
            : "Sign up to get started"}
        </p>
      </div>

      <form onSubmit={handleAuth} className="mt-8 space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              required
              minLength={6}
            />
          </div>
        </div>

        {isLogin && (
          <div className="text-right">
            <button
              type="button"
              onClick={() => setIsForgotPassword(true)}
              className="text-sm text-secondary hover:underline"
            >
              Forgot password?
            </button>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            "Loading..."
          ) : isLogin ? (
            "Sign In"
          ) : (
            "Sign Up"
          )}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-secondary hover:underline"
        >
          {isLogin
            ? "Need an account? Sign up"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      {isForgotPassword ? renderForgotPasswordForm() : renderAuthForm()}
    </div>
  );
};

export default Auth;
