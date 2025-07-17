"use server";

import { createClient } from "../../../supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type ActionResult = {
  success: boolean;
  message: string;
  error?: string;
};

export async function createCompetition(
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      success: false,
      message: "Authentication required",
      error: "User not authenticated",
    };
  }

  // Check admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return {
      success: false,
      message: "Admin access required",
      error: "Insufficient permissions",
    };
  }

  // Debug: Log the featured field value
  const featuredValue = formData.get("featured");
  console.log(
    "🔍 DEBUG - Featured field value:",
    featuredValue,
    "Type:",
    typeof featuredValue,
  );
  console.log("🔍 DEBUG - Featured boolean result:", featuredValue === "true");

  const competitionData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    detailed_description: formData.get("detailed_description") as string,
    rules: formData.get("rules") as string,
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
    terms_conditions_url: formData.get("terms_conditions_url") as string,
    thumbnail_url: formData.get("thumbnail_url") as string,
    banner_url: formData.get("banner_url") as string,
    status: (formData.get("status") as string) || "draft",
    featured: featuredValue === "true",
    organizer_id: user.id,
  };

  console.log(
    "🔍 DEBUG - Competition data featured field:",
    competitionData.featured,
  );

  const { data: competition, error } = await supabase
    .from("competitions")
    .insert([competitionData])
    .select()
    .single();

  if (error) {
    console.error("Error creating competition:", error);
    return {
      success: false,
      message: "Failed to create competition",
      error: error.message || "Unknown database error",
    };
  }

  // Handle selected requirements
  const selectedRequirements = formData.getAll("requirements") as string[];
  if (selectedRequirements.length > 0 && competition) {
    const requirementInserts = selectedRequirements.map((reqId) => ({
      competition_id: competition.id,
      requirement_option_id: reqId,
    }));

    const { error: reqError } = await supabase
      .from("competition_requirements_selected")
      .insert(requirementInserts);

    if (reqError) {
      console.error("Error saving requirements:", reqError);
      // Don't fail the whole operation, just log the error
    }
  }

  revalidatePath("/admin");
  return {
    success: true,
    message: "Competition created successfully",
  };
}

export async function updateCompetition(
  competitionId: string,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      success: false,
      message: "Authentication required",
      error: "User not authenticated",
    };
  }

  // Check admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return {
      success: false,
      message: "Admin access required",
      error: "Insufficient permissions",
    };
  }

  // Debug: Log the featured field value for update
  const featuredValue = formData.get("featured");
  console.log(
    "🔍 DEBUG UPDATE - Featured field value:",
    featuredValue,
    "Type:",
    typeof featuredValue,
  );
  console.log(
    "🔍 DEBUG UPDATE - Featured boolean result:",
    featuredValue === "true",
  );

  const competitionData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    detailed_description: formData.get("detailed_description") as string,
    rules: formData.get("rules") as string,
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
    terms_conditions_url: formData.get("terms_conditions_url") as string,
    thumbnail_url: formData.get("thumbnail_url") as string,
    banner_url: formData.get("banner_url") as string,
    status: formData.get("status") as string,
    featured: featuredValue === "true",
    updated_at: new Date().toISOString(),
  };

  console.log(
    "🔍 DEBUG UPDATE - Competition data featured field:",
    competitionData.featured,
  );

  const { error } = await supabase
    .from("competitions")
    .update(competitionData)
    .eq("id", competitionId);

  if (error) {
    console.error("Error updating competition:", error);
    return {
      success: false,
      message: "Failed to update competition",
      error: error.message || "Unknown database error",
    };
  }

  // Update selected requirements
  // First, delete existing requirements for this competition
  await supabase
    .from("competition_requirements_selected")
    .delete()
    .eq("competition_id", competitionId);

  // Then insert new requirements
  const selectedRequirements = formData.getAll("requirements") as string[];
  if (selectedRequirements.length > 0) {
    const requirementInserts = selectedRequirements.map((reqId) => ({
      competition_id: competitionId,
      requirement_option_id: reqId,
    }));

    const { error: reqError } = await supabase
      .from("competition_requirements_selected")
      .insert(requirementInserts);

    if (reqError) {
      console.error("Error updating requirements:", reqError);
      // Don't fail the whole operation, just log the error
    }
  }

  revalidatePath("/admin");
  return {
    success: true,
    message: "Competition updated successfully",
  };
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

export async function createRequirementOption(
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      success: false,
      message: "Authentication required",
      error: "User not authenticated",
    };
  }

  // Check admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return {
      success: false,
      message: "Admin access required",
      error: "Insufficient permissions",
    };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name?.trim()) {
    return {
      success: false,
      message: "Requirement name is required",
      error: "Name cannot be empty",
    };
  }

  const { error } = await supabase.from("requirement_options").insert([
    {
      name: name.trim(),
      description: description?.trim() || null,
    },
  ]);

  if (error) {
    console.error("Error creating requirement option:", error);
    return {
      success: false,
      message: "Failed to create requirement option",
      error: error.message || "Unknown database error",
    };
  }

  return {
    success: true,
    message: "Requirement option created successfully",
  };
}
