"use server";

import { createClient } from "../../../supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCompetition(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return encodedRedirect("error", "/admin/login", "Authentication required");
  }

  // Check admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return encodedRedirect("error", "/admin", "Admin access required");
  }

  const competitionData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    detailed_description: formData.get("detailed_description") as string,
    category: formData.get("category") as string,
    subcategory: formData.get("subcategory") as string,
    difficulty_level: formData.get("difficulty_level") as string,
    prize_amount: parseFloat(formData.get("prize_amount") as string) || null,
    prize_currency: (formData.get("prize_currency") as string) || "USD",
    prize_description: formData.get("prize_description") as string,
    start_date: formData.get("start_date") as string,
    end_date: formData.get("end_date") as string,
    submission_deadline: formData.get("submission_deadline") as string,
    max_participants:
      parseInt(formData.get("max_participants") as string) || null,
    entry_fee: parseFloat(formData.get("entry_fee") as string) || 0,
    is_team_competition: formData.get("is_team_competition") === "true",
    max_team_size: parseInt(formData.get("max_team_size") as string) || null,
    min_team_size: parseInt(formData.get("min_team_size") as string) || 1,
    organizer_name: formData.get("organizer_name") as string,
    organizer_email: formData.get("organizer_email") as string,
    organizer_website: formData.get("organizer_website") as string,
    thumbnail_url: formData.get("thumbnail_url") as string,
    banner_url: formData.get("banner_url") as string,
    status: (formData.get("status") as string) || "draft",
    featured: formData.get("featured") === "true",
    organizer_id: user.id,
  };

  const { error } = await supabase
    .from("competitions")
    .insert([competitionData]);

  if (error) {
    console.error("Error creating competition:", error);
    return encodedRedirect("error", "/admin", "Failed to create competition");
  }

  revalidatePath("/admin");
  return encodedRedirect(
    "success",
    "/admin",
    "Competition created successfully",
  );
}

export async function updateCompetition(
  competitionId: string,
  formData: FormData,
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return encodedRedirect("error", "/admin/login", "Authentication required");
  }

  // Check admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return encodedRedirect("error", "/admin", "Admin access required");
  }

  const competitionData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    detailed_description: formData.get("detailed_description") as string,
    category: formData.get("category") as string,
    subcategory: formData.get("subcategory") as string,
    difficulty_level: formData.get("difficulty_level") as string,
    prize_amount: parseFloat(formData.get("prize_amount") as string) || null,
    prize_currency: (formData.get("prize_currency") as string) || "USD",
    prize_description: formData.get("prize_description") as string,
    start_date: formData.get("start_date") as string,
    end_date: formData.get("end_date") as string,
    submission_deadline: formData.get("submission_deadline") as string,
    max_participants:
      parseInt(formData.get("max_participants") as string) || null,
    entry_fee: parseFloat(formData.get("entry_fee") as string) || 0,
    is_team_competition: formData.get("is_team_competition") === "true",
    max_team_size: parseInt(formData.get("max_team_size") as string) || null,
    min_team_size: parseInt(formData.get("min_team_size") as string) || 1,
    organizer_name: formData.get("organizer_name") as string,
    organizer_email: formData.get("organizer_email") as string,
    organizer_website: formData.get("organizer_website") as string,
    thumbnail_url: formData.get("thumbnail_url") as string,
    banner_url: formData.get("banner_url") as string,
    status: formData.get("status") as string,
    featured: formData.get("featured") === "true",
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("competitions")
    .update(competitionData)
    .eq("id", competitionId);

  if (error) {
    console.error("Error updating competition:", error);
    return encodedRedirect("error", "/admin", "Failed to update competition");
  }

  revalidatePath("/admin");
  return encodedRedirect(
    "success",
    "/admin",
    "Competition updated successfully",
  );
}

export async function archiveCompetition(competitionId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return encodedRedirect("error", "/admin/login", "Authentication required");
  }

  // Check admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return encodedRedirect("error", "/admin", "Admin access required");
  }

  const { error } = await supabase
    .from("competitions")
    .update({
      status: "cancelled",
      updated_at: new Date().toISOString(),
    })
    .eq("id", competitionId);

  if (error) {
    console.error("Error archiving competition:", error);
    return encodedRedirect("error", "/admin", "Failed to archive competition");
  }

  revalidatePath("/admin");
  return encodedRedirect(
    "success",
    "/admin",
    "Competition archived successfully",
  );
}

export async function deleteCompetition(competitionId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return encodedRedirect("error", "/admin/login", "Authentication required");
  }

  // Check admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return encodedRedirect("error", "/admin", "Admin access required");
  }

  const { error } = await supabase
    .from("competitions")
    .delete()
    .eq("id", competitionId);

  if (error) {
    console.error("Error deleting competition:", error);
    return encodedRedirect("error", "/admin", "Failed to delete competition");
  }

  revalidatePath("/admin");
  return encodedRedirect(
    "success",
    "/admin",
    "Competition deleted successfully",
  );
}
