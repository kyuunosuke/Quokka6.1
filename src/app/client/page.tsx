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
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/client/login");
          return;
        }

        setUser(user);

        // Fetch user profile data from the profiles table
        const { data: userData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        // If no profile exists or role is not client, create/update profile
        if (!userData || userData.role !== "client") {
          const { data: updatedProfile } = await supabase
            .from("profiles")
            .upsert({
              id: user.id,
              email: user.email,
              role: "client",
              updated_at: new Date().toISOString(),
            })
            .select()
            .single();

          setUserData(updatedProfile);
        } else {
          setUserData(userData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        router.push("/client/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, supabase]);

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
