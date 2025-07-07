"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../../supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Eye, EyeOff, AlertTriangle } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPreConfiguredAuth, setIsPreConfiguredAuth] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Check if we're using pre-configured admin credentials
    const checkAuthMode = async () => {
      try {
        const response = await fetch("/api/admin/auth-mode");
        if (response.ok) {
          const { preConfigured } = await response.json();
          setIsPreConfiguredAuth(preConfigured);
        }
      } catch (err) {
        console.log("Using standard auth mode");
      }
    };
    checkAuthMode();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("🔐 Starting login process...");
    console.log("📧 Email:", email);
    console.log("🔧 Pre-configured auth:", isPreConfiguredAuth);

    try {
      // If using pre-configured auth, validate against environment variables
      if (isPreConfiguredAuth) {
        console.log("🔍 Validating pre-configured credentials...");

        const response = await fetch("/api/admin/validate-credentials", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const result = await response.json();
        console.log("📋 Validation response:", {
          status: response.status,
          result,
        });

        if (!response.ok || !result.valid) {
          const errorMsg = result.error || "Invalid admin credentials";
          console.error("❌ Credential validation failed:", errorMsg);
          setError(errorMsg);
          return;
        }

        console.log("✅ Credentials validated, attempting Supabase auth...");

        // Create a session for the pre-configured admin
        const { data, error } = await supabase.auth.signInWithPassword({
          email: result.adminEmail,
          password: password, // Use the original password, not tempPassword
        });

        console.log("🔑 Supabase auth result:", { data: !!data, error });

        if (error) {
          console.error("❌ Supabase authentication failed:", error);
          setError(
            `Authentication failed: ${error.message}. Please contact system administrator.`,
          );
          return;
        }

        if (!data?.user) {
          console.error("❌ No user data returned from Supabase");
          setError("Authentication failed - no user data received");
          return;
        }

        console.log("👤 User authenticated:", data.user.id);

        // Verify admin role after authentication
        console.log("🔍 Checking admin role...");
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        console.log("👥 Profile check:", { profile, profileError });

        if (profileError) {
          console.error("❌ Error fetching profile:", profileError);
          setError("Failed to verify admin privileges");
          await supabase.auth.signOut();
          return;
        }

        if (profile?.role !== "admin") {
          console.error("❌ User does not have admin role:", profile?.role);
          setError("Access denied. Admin privileges required.");
          await supabase.auth.signOut();
          return;
        }

        console.log("✅ Admin role verified, redirecting...");
      } else {
        console.log("🔍 Using standard Supabase authentication...");

        // Standard Supabase authentication
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        console.log("🔑 Standard auth result:", { data: !!data, error });

        if (error) {
          console.error("❌ Standard authentication failed:", error);
          setError(error.message);
          return;
        }

        if (!data?.user) {
          console.error("❌ No user data returned from standard auth");
          setError("Authentication failed - no user data received");
          return;
        }

        // Check if user has admin role
        console.log("🔍 Checking admin role for standard auth...");
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        console.log("👥 Standard auth profile check:", {
          profile,
          profileError,
        });

        if (profileError) {
          console.error(
            "❌ Error fetching profile for standard auth:",
            profileError,
          );
          setError("Failed to verify admin privileges");
          await supabase.auth.signOut();
          return;
        }

        if (profile?.role !== "admin") {
          console.error(
            "❌ Standard auth user does not have admin role:",
            profile?.role,
          );
          setError("Access denied. Admin privileges required.");
          await supabase.auth.signOut();
          return;
        }

        console.log("✅ Standard auth admin role verified, redirecting...");
      }

      console.log("🚀 Redirecting to /admin...");

      // Add a small delay to ensure session is properly set
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Force a hard navigation to ensure middleware picks up the session
      window.location.href = "/admin";
    } catch (err) {
      console.error("💥 Unexpected error during login:", err);
      setError(
        `An unexpected error occurred: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
          <CardDescription>
            Sign in to access the competition management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {isPreConfiguredAuth && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Using pre-configured admin credentials. Contact your system
                  administrator for access.
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">
                {isPreConfiguredAuth ? "Admin Username/Email" : "Email"}
              </Label>
              <Input
                id="email"
                type={isPreConfiguredAuth ? "text" : "email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  isPreConfiguredAuth
                    ? "Enter admin username"
                    : "admin@example.com"
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
