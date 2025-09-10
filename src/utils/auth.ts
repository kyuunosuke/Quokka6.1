import { createClient } from "@/lib/supabase-server";

/**
 * Check if the current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    return profile?.role === "admin";
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

/**
 * Get the current user's role
 */
export async function getUserRole(): Promise<string | null> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    return profile?.role || "user";
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
}

/**
 * Check if user has required role
 */
export async function hasRole(requiredRole: string): Promise<boolean> {
  const userRole = await getUserRole();
  return userRole === requiredRole;
}

/**
 * Require admin role or throw error
 */
export async function requireAdmin(): Promise<void> {
  const isUserAdmin = await isAdmin();
  if (!isUserAdmin) {
    throw new Error("Admin access required");
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}