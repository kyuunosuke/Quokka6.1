import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import AdminNavbar from "./components/AdminNavbar";
import AdminDashboard from "./components/AdminDashboard";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/admin/login");
  }

  // Check if user has admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <AdminDashboard />
    </div>
  );
}