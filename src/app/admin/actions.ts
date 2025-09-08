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

  // Handle entry criteria checkboxes
  const entryCriteria = formData.getAll("entry_criteria") as string[];
  const entryCriteriaText =
    entryCriteria.length > 0 ? entryCriteria.join(", ") : null;

  // Handle tags array
  const tags = formData.getAll("tags") as string[];
  const tagsArray = tags.length > 0 ? tags : null;

  const competitionData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    detailed_description: entryCriteriaText,
    rules: formData.get("participating_requirement") as string,
    category: formData.get("category") as string,
    subcategory: formData.get("subcategory") as string,
    difficulty_level: formData.get("difficulty_level") as string,
    prize_description: formData.get("prize_description") as string,
    total_prize: formData.get("total_prize") as string,
    start_date: formData.get("start_date") as string,
    end_date: formData.get("end_date") as string,
    submission_deadline: formData.get("submission_deadline") as string,

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
    draw_date: formData.get("draw_date")
      ? new Date(formData.get("draw_date") as string).toISOString()
      : null,
    permits: (formData.get("permits") as string) || null,
    region: (formData.get("region") as string) || null,
    tags: tagsArray,
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

  // Handle entry criteria checkboxes for update
  const entryCriteria = formData.getAll("entry_criteria") as string[];
  const entryCriteriaText =
    entryCriteria.length > 0 ? entryCriteria.join(", ") : null;

  // Handle tags array for update
  const tags = formData.getAll("tags") as string[];
  const tagsArray = tags.length > 0 ? tags : null;

  const competitionData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    detailed_description: entryCriteriaText,
    rules: formData.get("participating_requirement") as string,
    category: formData.get("category") as string,
    subcategory: formData.get("subcategory") as string,
    difficulty_level: formData.get("difficulty_level") as string,
    prize_description: formData.get("prize_description") as string,
    total_prize: formData.get("total_prize") as string,
    start_date: formData.get("start_date") as string,
    end_date: formData.get("end_date") as string,
    submission_deadline: formData.get("submission_deadline") as string,

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
    draw_date: formData.get("draw_date")
      ? new Date(formData.get("draw_date") as string).toISOString()
      : null,
    permits: (formData.get("permits") as string) || null,
    region: (formData.get("region") as string) || null,
    tags: tagsArray,
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

export async function importCompetitionFromUrl(
  formData: FormData,
): Promise<ActionResult & { data?: any; issues?: string[] }> {
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

  const url = formData.get("url") as string;

  if (!url?.trim()) {
    return {
      success: false,
      message: "URL is required",
      error: "URL cannot be empty",
    };
  }

  try {
    // Validate URL format
    new URL(url);
  } catch {
    return {
      success: false,
      message: "Invalid URL format",
      error: "Please provide a valid URL",
    };
  }

  try {
    // Fetch the webpage content
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
      return {
        success: false,
        message: "Failed to fetch URL",
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const html = await response.text();
    const issues: string[] = [];
    const extractedData: any = {};

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      extractedData.title = titleMatch[1].trim();
    } else {
      issues.push("Could not extract title from the page");
    }

    // Extract meta description
    const descMatch = html.match(
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i,
    );
    if (descMatch) {
      extractedData.description = descMatch[1].trim();
    } else {
      issues.push("Could not extract description from meta tags");
    }

    // Extract Open Graph data
    const ogTitleMatch = html.match(
      /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i,
    );
    if (ogTitleMatch && !extractedData.title) {
      extractedData.title = ogTitleMatch[1].trim();
    }

    const ogDescMatch = html.match(
      /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i,
    );
    if (ogDescMatch && !extractedData.description) {
      extractedData.description = ogDescMatch[1].trim();
    }

    const ogImageMatch = html.match(
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
    );
    if (ogImageMatch) {
      extractedData.thumbnail_url = ogImageMatch[1].trim();
    }

    // Try to extract dates (basic patterns)
    const datePatterns = [
      /(?:start|begin|from)[^\d]*([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{4})/i,
      /(?:end|until|to)[^\d]*([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{4})/i,
      /([0-9]{4}-[0-9]{2}-[0-9]{2})/g,
    ];

    // Extract prize information
    const prizePatterns = [
      /\$([0-9,]+(?:\.[0-9]{2})?)/g,
      /prize[^\d]*\$?([0-9,]+)/i,
      /win[^\d]*\$?([0-9,]+)/i,
    ];

    let prizeMatch;
    for (const pattern of prizePatterns) {
      prizeMatch = html.match(pattern);
      if (prizeMatch) {
        extractedData.prize_description = prizeMatch[0];
        break;
      }
    }

    // Set default values and add issues for missing critical data
    if (!extractedData.title) {
      extractedData.title = "Imported Competition";
      issues.push("Title could not be extracted - using default value");
    }

    if (!extractedData.description) {
      issues.push("Description could not be extracted");
    }

    // Set default dates (current date + 30 days)
    const now = new Date();
    const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    extractedData.start_date = now.toISOString().slice(0, 16);
    extractedData.end_date = futureDate.toISOString().slice(0, 16);
    extractedData.submission_deadline = futureDate.toISOString().slice(0, 16);

    issues.push("Start and end dates set to default values (today + 30 days)");

    // Set default category and status
    extractedData.category = "Open (free)";
    extractedData.difficulty_level = "Game of Skill";
    extractedData.status = "draft";
    extractedData.featured = false;

    // Add the source URL
    extractedData.banner_url = url;

    issues.push("Category, game type, and status set to default values");
    issues.push("Please review and update all fields before saving");

    return {
      success: true,
      message: "Competition data imported successfully",
      data: extractedData,
      issues: issues,
    };
  } catch (error) {
    console.error("Error importing from URL:", error);
    return {
      success: false,
      message: "Failed to import competition data",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
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
