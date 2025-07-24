"use client";

import { useRouter } from "next/navigation";
import { createClient } from "../../../supabase/client";
import ClientDashboard from "@/components/client-dashboard";
import DashboardNavbar from "@/components/dashboard-navbar";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function ClientPortal() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("[DEBUG] Starting client page data fetch");

        // Test Supabase connection first
        try {
          console.log("[DEBUG] Testing Supabase connection");
          const testResult = await supabase
            .from("profiles")
            .select("count", { count: "exact", head: true });
          console.log("[DEBUG] Connection test result:", testResult);

          if (
            testResult.error &&
            testResult.error.message.includes("not configured")
          ) {
            console.error("[ERROR] Supabase client not properly configured");
            router.push("/client/login");
            return;
          }
        } catch (connectionError) {
          console.error(
            "[ERROR] Supabase connection test failed:",
            connectionError,
          );
          router.push("/client/login");
          return;
        }

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        console.log("[DEBUG] Auth user result:", user);
        console.log("[DEBUG] Auth error:", authError);

        if (authError) {
          console.error("[ERROR] Authentication error:", authError);

          // Handle specific auth errors
          if (authError.message.includes("not configured")) {
            console.error("[ERROR] Authentication not configured properly");
          }

          router.push("/client/login");
          return;
        }

        if (!user) {
          console.log("[DEBUG] No user found, redirecting to login");
          router.push("/client/login");
          return;
        }

        console.log("[DEBUG] Setting user:", user);
        setUser(user);

        // Fetch user profile data from the profiles table
        console.log("[DEBUG] Fetching user profile for ID:", user.id);
        const { data: userData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        console.log("[DEBUG] Profile data:", userData);
        console.log("[DEBUG] Profile error:", profileError);

        // Handle profile errors gracefully
        if (profileError && profileError.code !== "PGRST116") {
          console.error("[ERROR] Profile fetch error:", profileError);

          if (profileError.message.includes("not configured")) {
            console.error("[ERROR] Database not configured properly");
            router.push("/client/login");
            return;
          }
        }

        // If no profile exists or role is not client, create/update profile
        if (!userData || userData.role !== "client") {
          console.log("[DEBUG] Creating/updating client profile");
          const { data: updatedProfile, error: upsertError } = await supabase
            .from("profiles")
            .upsert({
              id: user.id,
              email: user.email,
              role: "client",
              updated_at: new Date().toISOString(),
            })
            .select()
            .single();

          console.log("[DEBUG] Updated profile:", updatedProfile);
          console.log("[DEBUG] Upsert error:", upsertError);

          if (upsertError) {
            console.error("[ERROR] Profile upsert error:", upsertError);

            if (upsertError.message.includes("not configured")) {
              console.error(
                "[ERROR] Database not configured for profile updates",
              );
              router.push("/client/login");
              return;
            }

            throw upsertError;
          }

          setUserData(updatedProfile);
        } else {
          console.log("[DEBUG] Using existing profile:", userData);
          setUserData(userData);
        }

        console.log("[DEBUG] Client page data fetch completed successfully");
      } catch (error) {
        console.error("[ERROR] Error fetching client page data:", error);
        console.error("[ERROR] Error details:", {
          message: error?.message,
          code: error?.code,
          details: error?.details,
          hint: error?.hint,
          stack: error?.stack,
        });

        // Don't redirect on every error, only on auth-related ones
        if (
          error?.message?.includes("not configured") ||
          error?.code === "PGRST301"
        ) {
          router.push("/client/login");
        }
      } finally {
        setLoading(false);
        console.log("[DEBUG] Client page loading completed");
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <ClientDashboard user={user} userData={userData} />
      </main>
    </div>
  );
}
