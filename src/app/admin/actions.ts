"use server";

import { createClient } from "@/lib/supabase-server";
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
    participating_requirement: formData.get("participating_requirement") as string,
    rules: formData.get("rules") as string,
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
    draw_date: formData.get("draw_date") && formData.get("draw_date") !== ""
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
    participating_requirement: formData.get("participating_requirement") as string,
    rules: formData.get("rules") as string,
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

    // Clean HTML for better text extraction
    const cleanText = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      extractedData.title = titleMatch[1]
        .trim()
        .replace(/&[^;]+;/g, "")
        .substring(0, 200);
    }

    // Extract meta description
    const descMatch = html.match(
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i,
    );
    if (descMatch) {
      extractedData.description = descMatch[1].trim().substring(0, 500);
    }

    // Extract Open Graph data
    const ogTitleMatch = html.match(
      /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i,
    );
    if (ogTitleMatch && !extractedData.title) {
      extractedData.title = ogTitleMatch[1].trim().substring(0, 200);
    }

    const ogDescMatch = html.match(
      /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i,
    );
    if (ogDescMatch && !extractedData.description) {
      extractedData.description = ogDescMatch[1].trim().substring(0, 500);
    }

    const ogImageMatch = html.match(
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
    );
    if (ogImageMatch) {
      extractedData.thumbnail_url = ogImageMatch[1].trim();
    }

    // Enhanced date extraction
    const dateExtractionResults = extractDatesFromContent(cleanText, html);
    if (dateExtractionResults.startDate) {
      extractedData.start_date = dateExtractionResults.startDate;
    }
    if (dateExtractionResults.endDate) {
      extractedData.end_date = dateExtractionResults.endDate;
      extractedData.submission_deadline = dateExtractionResults.endDate;
    }
    if (dateExtractionResults.drawDate) {
      extractedData.draw_date = dateExtractionResults.drawDate;
    }
    if (dateExtractionResults.issues.length > 0) {
      issues.push(...dateExtractionResults.issues);
    }

    // Extract prize information with enhanced patterns
    const prizeInfo = extractPrizeInformation(cleanText, html);
    if (prizeInfo.description) {
      extractedData.prize_description = prizeInfo.description;
    }
    if (prizeInfo.totalPrize) {
      extractedData.total_prize = prizeInfo.totalPrize;
    }

    // Detect entry criteria
    const entryCriteria = detectEntryCriteria(cleanText);
    if (entryCriteria.length > 0) {
      extractedData.entry_criteria = entryCriteria;
    }

    // Extract participating requirements
    const participatingReqs = extractParticipatingRequirements(cleanText);
    if (participatingReqs) {
      extractedData.participating_requirement = participatingReqs;
    } else {
      extractedData.participating_requirement = "No specific requirements";
    }

    // Extract competition rules and winning methods
    const rulesAndMethods = extractRulesAndWinningMethods(cleanText);
    if (rulesAndMethods) {
      extractedData.rules = rulesAndMethods;
    }

    // Detect competition type and category
    const competitionType = detectCompetitionType(cleanText);
    extractedData.category = competitionType.category;
    extractedData.difficulty_level = competitionType.gameType;

    // Extract permit information (for game of luck)
    const permitInfo = extractPermitInformation(cleanText);
    if (permitInfo) {
      extractedData.permits = permitInfo;
    }

    // Extract region information
    const regionInfo = extractRegionInformation(cleanText);
    if (regionInfo) {
      extractedData.region = regionInfo;
    }

    // Extract organiser information
    const organiserInfo = extractOrganiserInfo(cleanText, html, url);
    if (organiserInfo.name) {
      extractedData.organizer_name = organiserInfo.name;
    }
    if (organiserInfo.website) {
      extractedData.organizer_website = organiserInfo.website;
    }
    if (organiserInfo.email) {
      extractedData.organizer_email = organiserInfo.email;
    }

    // Set fallback values for missing critical data
    if (!extractedData.title) {
      extractedData.title = "Imported Competition";
      issues.push("Title could not be extracted - using default value");
    }

    if (!extractedData.description) {
      // Try to extract first paragraph or meaningful text
      const firstParagraph = extractFirstMeaningfulParagraph(cleanText);
      if (firstParagraph) {
        extractedData.description = firstParagraph;
      } else {
        issues.push("Description could not be extracted");
      }
    }

    // Set default dates if not found
    if (!extractedData.start_date || !extractedData.end_date) {
      const now = new Date();
      const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      if (!extractedData.start_date) {
        extractedData.start_date = now.toISOString().slice(0, 16);
      }
      if (!extractedData.end_date) {
        extractedData.end_date = futureDate.toISOString().slice(0, 16);
        extractedData.submission_deadline = futureDate
          .toISOString()
          .slice(0, 16);
      }

      issues.push("Some dates could not be extracted - using default values");
    }

    // Set default status and featured
    extractedData.status = "draft";
    extractedData.featured = false;

    // Set the link URL (the import URL provided)
    extractedData.banner_url = url;

    // Extract thumbnail URL from various sources
    const thumbnailUrl = extractThumbnailUrl(html, url);
    if (thumbnailUrl) {
      extractedData.thumbnail_url = thumbnailUrl;
    }

    // Look for terms and conditions URL
    const termsUrl = extractTermsAndConditionsUrl(html, url);
    if (termsUrl) {
      extractedData.terms_conditions_url = termsUrl;
    }

    issues.push(
      "Please review and verify all extracted information before saving",
    );

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

// Helper function to extract dates from content
function extractDatesFromContent(cleanText: string, html: string) {
  const issues: string[] = [];
  let startDate: string | null = null;
  let endDate: string | null = null;
  let drawDate: string | null = null;

  // Enhanced date patterns
  const datePatterns = [
    // ISO format
    /([0-9]{4}-[0-9]{2}-[0-9]{2})/g,
    // US format
    /([0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4})/g,
    // UK format
    /([0-9]{1,2}-[0-9]{1,2}-[0-9]{4})/g,
    // Written format
    /((?:january|february|march|april|may|june|july|august|september|october|november|december)\s+[0-9]{1,2},?\s+[0-9]{4})/gi,
    // Short month format
    /((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+[0-9]{1,2},?\s+[0-9]{4})/gi,
  ];

  const allDates: string[] = [];

  datePatterns.forEach((pattern) => {
    const matches = cleanText.match(pattern);
    if (matches) {
      allDates.push(...matches);
    }
  });

  // Look for contextual date information
  const startKeywords = [
    "start",
    "begin",
    "open",
    "launch",
    "commence",
    "from",
  ];
  const endKeywords = [
    "end",
    "close",
    "deadline",
    "until",
    "expires",
    "finish",
    "to",
  ];
  const drawKeywords = [
    "draw",
    "drawn",
    "drawing",
    "winner announced",
    "winner selected",
    "results announced",
    "judged",
    "judging",
    "announce",
    "announced",
    "announcement",
    "reveal",
    "revealed",
    "declare",
    "declared",
  ];

  // Try to find dates with context
  for (const keyword of startKeywords) {
    const regex = new RegExp(
      `${keyword}[^\d]*([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{4}|[0-9]{4}-[0-9]{2}-[0-9]{2}|(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+[0-9]{1,2},?\s+[0-9]{4})`,
      "gi",
    );
    const match = cleanText.match(regex);
    if (match && !startDate) {
      startDate = parseAndFormatDate(
        match[0].replace(new RegExp(keyword, "gi"), "").trim(),
      );
      break;
    }
  }

  for (const keyword of endKeywords) {
    const regex = new RegExp(
      `${keyword}[^\d]*([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{4}|[0-9]{4}-[0-9]{2}-[0-9]{2}|(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+[0-9]{1,2},?\s+[0-9]{4})`,
      "gi",
    );
    const match = cleanText.match(regex);
    if (match && !endDate) {
      endDate = parseAndFormatDate(
        match[0].replace(new RegExp(keyword, "gi"), "").trim(),
      );
      break;
    }
  }

  // Look for draw dates specifically (date of announcing the winner)
  for (const keyword of drawKeywords) {
    const regex = new RegExp(
      `${keyword}[^\d]*([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{4}|[0-9]{4}-[0-9]{2}-[0-9]{2}|(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+[0-9]{1,2},?\s+[0-9]{4})`,
      "gi",
    );
    const match = cleanText.match(regex);
    if (match && !drawDate) {
      drawDate = parseAndFormatDate(
        match[0].replace(new RegExp(keyword, "gi"), "").trim(),
      );
      break;
    }
  }

  // Enhanced draw date detection with more specific patterns
  if (!drawDate) {
    const drawPatterns = [
      /draw(?:ing)?\s+(?:date|on|will be)\s*:?\s*([^\n.!?]+)/gi,
      /winner(?:s)?\s+(?:announced|selected|drawn)\s*:?\s*([^\n.!?]+)/gi,
      /results?\s+(?:announced|available)\s*:?\s*([^\n.!?]+)/gi,
      /judg(?:ed|ing)\s+(?:on|date)\s*:?\s*([^\n.!?]+)/gi,
    ];

    for (const pattern of drawPatterns) {
      const match = cleanText.match(pattern);
      if (match && match[1]) {
        const dateStr = match[1].trim();
        const parsedDate = parseAndFormatDate(dateStr);
        if (parsedDate) {
          drawDate = parsedDate;
          break;
        }
      }
    }
  }

  // If no contextual dates found, try to infer from available dates
  if (!startDate && !endDate && allDates.length > 0) {
    const parsedDates = allDates
      .map((d) => parseAndFormatDate(d))
      .filter(Boolean)
      .sort();
    if (parsedDates.length >= 2) {
      startDate = parsedDates[0];
      endDate = parsedDates[parsedDates.length - 1];
      // If we have 3 or more dates, the middle one might be the draw date
      if (parsedDates.length >= 3 && !drawDate) {
        drawDate = parsedDates[1];
      }
      issues.push(
        "Inferred start and end dates from available dates - please verify",
      );
    } else if (parsedDates.length === 1) {
      endDate = parsedDates[0];
      issues.push(
        "Found one date, assumed as end date - please set start date",
      );
    }
  }

  return { startDate, endDate, drawDate, issues };
}

// Helper function to parse and format dates
function parseAndFormatDate(dateStr: string): string | null {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return null;
    }
    // Set time to 00:00 as requested
    date.setHours(0, 0, 0, 0);
    return date.toISOString().slice(0, 16);
  } catch {
    return null;
  }
}

// Helper function to extract prize information
function extractPrizeInformation(cleanText: string, html: string) {
  let description = "";
  let totalPrize = "";

  // Enhanced prize description patterns - anything related to winning prize
  const prizeDescriptionPatterns = [
    // Prize sentences with various keywords
    /(?:prize|win|winner|award|reward|giveaway)[^.!?]*[.!?]/gi,
    // Prize pool or total prize mentions
    /(?:prize pool|total prize|grand prize|first prize|main prize)[^.!?]*[.!?]/gi,
    // Prize items or descriptions
    /(?:you could win|chance to win|up for grabs|prizes include)[^.!?]*[.!?]/gi,
    // Prize value descriptions
    /(?:worth|valued at|value of)[^.!?]*[.!?]/gi,
  ];

  // Enhanced total prize patterns - focus on monetary amounts and totals
  const totalPrizePatterns = [
    // Total prize pool mentions
    /(?:total prize|prize pool|grand total)[^\d]*([\$£€]?[0-9,]+(?:\.[0-9]{2})?)/gi,
    // Prize worth mentions
    /(?:worth|valued at|value of)[^\d]*([\$£€]?[0-9,]+(?:\.[0-9]{2})?)/gi,
    // Win amount mentions
    /(?:win|winner receives|prize of)[^\d]*([\$£€]?[0-9,]+(?:\.[0-9]{2})?)/gi,
    // Currency amounts with context
    /([\$£€][0-9,]+(?:\.[0-9]{2})?)(?:\s*(?:prize|total|worth|value))/gi,
    // Large currency amounts (likely prizes)
    /([\$£€][0-9,]{4,}(?:\.[0-9]{2})?)/g,
  ];

  // Extract prize descriptions
  const sentences = cleanText.split(/[.!?]+/);
  const prizeDescriptions: string[] = [];

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (trimmed.length < 10) continue;

    const lowerSentence = trimmed.toLowerCase();

    // Check if sentence contains prize-related keywords
    if (
      lowerSentence.includes("prize") ||
      lowerSentence.includes("win") ||
      lowerSentence.includes("award") ||
      lowerSentence.includes("reward") ||
      lowerSentence.includes("giveaway") ||
      lowerSentence.includes("competition") ||
      lowerSentence.includes("contest") ||
      lowerSentence.includes("draw") ||
      lowerSentence.includes("raffle") ||
      lowerSentence.includes("up for grabs") ||
      lowerSentence.includes("chance to win") ||
      lowerSentence.includes("you could win")
    ) {
      // Avoid navigation, legal, or irrelevant sentences
      if (
        !lowerSentence.includes("cookie") &&
        !lowerSentence.includes("privacy") &&
        !lowerSentence.includes("terms") &&
        !lowerSentence.includes("navigation") &&
        !lowerSentence.includes("menu") &&
        !lowerSentence.includes("login") &&
        !lowerSentence.includes("search") &&
        trimmed.length <= 300
      ) {
        prizeDescriptions.push(trimmed);
      }
    }
  }

  // Combine prize descriptions
  if (prizeDescriptions.length > 0) {
    description = prizeDescriptions.slice(0, 3).join(". ").substring(0, 500);
  }

  // Extract total prize amounts
  const prizeAmounts: string[] = [];

  for (const pattern of totalPrizePatterns) {
    const matches = cleanText.match(pattern);
    if (matches) {
      for (const match of matches) {
        // Extract the monetary amount from the match
        const amountMatch = match.match(/[\$£€]?[0-9,]+(?:\.[0-9]{2})?/);
        if (amountMatch) {
          prizeAmounts.push(amountMatch[0]);
        }
      }
    }
  }

  // Select the largest or most relevant prize amount
  if (prizeAmounts.length > 0) {
    // Sort by numeric value to get the largest amount
    const sortedAmounts = prizeAmounts
      .map((amount) => ({
        original: amount,
        numeric: parseFloat(amount.replace(/[\$£€,]/g, "")),
      }))
      .filter((item) => !isNaN(item.numeric))
      .sort((a, b) => b.numeric - a.numeric);

    if (sortedAmounts.length > 0) {
      totalPrize = sortedAmounts[0].original;
    }
  }

  // If no total prize found but we have descriptions, try to extract from descriptions
  if (!totalPrize && description) {
    const amountInDescription = description.match(
      /[\$£€][0-9,]+(?:\.[0-9]{2})?/,
    );
    if (amountInDescription) {
      totalPrize = amountInDescription[0];
    }
  }

  return {
    description: description || "Prize details to be confirmed",
    totalPrize: totalPrize || "Prize value to be confirmed",
  };
}

// Helper function to detect entry criteria
function detectEntryCriteria(cleanText: string): string[] {
  const criteria: string[] = [];
  const text = cleanText.toLowerCase();

  // Check for age restrictions
  if (
    text.includes("18+") ||
    text.includes("18 and over") ||
    text.includes("eighteen") ||
    text.includes("adult") ||
    text.includes("must be 18")
  ) {
    criteria.push("18+");
  }

  // Check for residency requirements
  if (
    text.includes("australia") ||
    text.includes("australian") ||
    text.includes("au resident") ||
    text.includes("aus only") ||
    text.includes("australia only")
  ) {
    criteria.push("AU Residents");
  }

  // Check for membership requirements
  if (
    text.includes("member") ||
    text.includes("membership") ||
    text.includes("members only") ||
    text.includes("join") ||
    text.includes("sign up")
  ) {
    criteria.push("Members only");
  }

  return criteria;
}

// Helper function to extract participating requirements
function extractParticipatingRequirements(cleanText: string): string | null {
  const requirementKeywords = [
    "follow",
    "like",
    "share",
    "comment",
    "subscribe",
    "tag",
    "post",
    "upload",
    "purchase",
    "buy",
    "visit",
    "download",
    "register",
    "sign up",
    "enter",
    "complete",
    "fill",
    "answer",
    "submit",
    "photo",
    "video",
    "review",
  ];

  const sentences = cleanText.split(/[.!?]+/);

  for (const sentence of sentences) {
    const lowerSentence = sentence.toLowerCase();

    // Look for sentences containing requirement keywords
    if (
      requirementKeywords.some((keyword) => lowerSentence.includes(keyword))
    ) {
      // Check if it's describing what to do
      if (
        lowerSentence.includes("to enter") ||
        lowerSentence.includes("must") ||
        lowerSentence.includes("need to") ||
        lowerSentence.includes("required") ||
        lowerSentence.includes("how to") ||
        lowerSentence.includes("steps")
      ) {
        return sentence.trim().substring(0, 300);
      }
    }
  }

  return null;
}

// Helper function to extract thumbnail URL
function extractThumbnailUrl(html: string, baseUrl: string): string | null {
  const thumbnailPatterns = [
    // Open Graph image (most reliable)
    /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
    // Twitter card image
    /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i,
    // Standard meta image
    /<meta[^>]*name=["']image["'][^>]*content=["']([^"']+)["']/i,
    // Link rel image
    /<link[^>]*rel=["']image_src["'][^>]*href=["']([^"']+)["']/i,
    // Favicon as fallback
    /<link[^>]*rel=["'](?:icon|shortcut icon)["'][^>]*href=["']([^"']+)["']/i,
  ];

  for (const pattern of thumbnailPatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      let imageUrl = match[1].trim();

      // Convert relative URLs to absolute
      if (imageUrl.startsWith("/")) {
        try {
          const urlObj = new URL(baseUrl);
          imageUrl = `${urlObj.protocol}//${urlObj.host}${imageUrl}`;
        } catch {
          continue;
        }
      } else if (imageUrl.startsWith("//")) {
        try {
          const urlObj = new URL(baseUrl);
          imageUrl = `${urlObj.protocol}${imageUrl}`;
        } catch {
          continue;
        }
      }

      // Validate that it's a proper image URL
      if (
        imageUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ||
        imageUrl.includes("image")
      ) {
        return imageUrl;
      }
    }
  }

  return null;
}

// Helper function to extract terms and conditions URL
function extractTermsAndConditionsUrl(
  html: string,
  baseUrl: string,
): string | null {
  const termsPatterns = [
    // Link elements with terms-related text
    /<a[^>]*href=["']([^"']*(?:terms|conditions|rules|legal|privacy)[^"']*)["'][^>]*>(?:terms|conditions|rules|legal|privacy)/gi,
    // More specific terms and conditions links
    /<a[^>]*href=["']([^"']+)["'][^>]*>\s*(?:terms\s*(?:and|&)?\s*conditions|terms\s*of\s*(?:use|service)|competition\s*rules|legal\s*terms)/gi,
    // Footer links (common location for terms)
    /<footer[^>]*>[\s\S]*?<a[^>]*href=["']([^"']*(?:terms|conditions|rules)[^"']*)["']/gi,
  ];

  for (const pattern of termsPatterns) {
    const matches = html.match(pattern);
    if (matches) {
      for (const match of matches) {
        const linkMatch = pattern.exec(match);
        if (linkMatch && linkMatch[1]) {
          let termsUrl = linkMatch[1].trim();

          // Convert relative URLs to absolute
          if (termsUrl.startsWith("/")) {
            try {
              const urlObj = new URL(baseUrl);
              termsUrl = `${urlObj.protocol}//${urlObj.host}${termsUrl}`;
            } catch {
              continue;
            }
          } else if (termsUrl.startsWith("//")) {
            try {
              const urlObj = new URL(baseUrl);
              termsUrl = `${urlObj.protocol}${termsUrl}`;
            } catch {
              continue;
            }
          }

          // Validate that it looks like a terms URL
          const lowerUrl = termsUrl.toLowerCase();
          if (
            lowerUrl.includes("terms") ||
            lowerUrl.includes("conditions") ||
            lowerUrl.includes("rules") ||
            lowerUrl.includes("legal")
          ) {
            return termsUrl;
          }
        }
      }
    }
  }

  return null;
}

// Helper function to extract rules and winning methods
function extractRulesAndWinningMethods(cleanText: string): string | null {
  const ruleKeywords = [
    "rules",
    "terms",
    "conditions",
    "winner",
    "draw",
    "judge",
    "selection",
    "criteria",
    "eligible",
    "disqualified",
    "random",
    "merit",
    "best",
  ];

  const sentences = cleanText.split(/[.!?]+/);
  const relevantSentences: string[] = [];

  for (const sentence of sentences) {
    const lowerSentence = sentence.toLowerCase();

    if (ruleKeywords.some((keyword) => lowerSentence.includes(keyword))) {
      relevantSentences.push(sentence.trim());
    }
  }

  if (relevantSentences.length > 0) {
    return relevantSentences.slice(0, 3).join(". ").substring(0, 500);
  }

  return null;
}

// Helper function to detect competition type
function detectCompetitionType(cleanText: string) {
  const text = cleanText.toLowerCase();

  let category = "Open (free)";
  let gameType = "Game of Skill";

  // Detect category based on enhanced criteria
  if (
    text.includes("purchase") ||
    text.includes("buy") ||
    text.includes("payment") ||
    text.includes("by invitation") ||
    text.includes("closed group") ||
    text.includes("members only") ||
    text.includes("exclusive")
  ) {
    category = "Purchase Required";
  } else if (
    text.includes("survey") ||
    text.includes("engagement") ||
    text.includes("participation entry") ||
    text.includes("complete") ||
    text.includes("answer") ||
    text.includes("quiz") ||
    text.includes("form") ||
    text.includes("entry fee") ||
    text.includes("cost") ||
    text.includes("pay")
  ) {
    category = "Barrier (Medium)";
  } else if (
    text.includes("email") ||
    text.includes("subscribe") ||
    text.includes("newsletter") ||
    text.includes("marketing") ||
    text.includes("consent") ||
    text.includes("personal information") ||
    text.includes("share") ||
    text.includes("sign up") ||
    text.includes("register")
  ) {
    category = "Barrier (Low)";
  }

  // Detect game type - Game of Luck vs Game of Skill
  if (
    text.includes("random draw") ||
    text.includes("randomly selected") ||
    text.includes("draw") ||
    text.includes("luck") ||
    text.includes("chance") ||
    text.includes("lottery") ||
    text.includes("raffle") ||
    text.includes("sweepstake") ||
    text.includes("giveaway") ||
    text.includes("random")
  ) {
    gameType = "Game of Luck";
  } else if (
    text.includes("best") ||
    text.includes("judge") ||
    text.includes("merit") ||
    text.includes("skill") ||
    text.includes("creative") ||
    text.includes("talent") ||
    text.includes("competition") ||
    text.includes("contest") ||
    text.includes("vote") ||
    text.includes("winner selected")
  ) {
    gameType = "Game of Skill";
  }

  return { category, gameType };
}

// Helper function to extract permit information
function extractPermitInformation(cleanText: string): string | null {
  const text = cleanText.toLowerCase();
  const permitKeywords = [
    "permit",
    "licence",
    "license",
    "authority",
    "gaming",
    "lottery",
    "raffle",
    "acma",
    "austrac",
    "gambling",
    "regulation",
    "compliance",
  ];

  const sentences = cleanText.split(/[.!?]+/);

  for (const sentence of sentences) {
    const lowerSentence = sentence.toLowerCase();

    if (permitKeywords.some((keyword) => lowerSentence.includes(keyword))) {
      // Look for permit numbers or specific permit information
      if (
        lowerSentence.includes("permit") ||
        lowerSentence.includes("licence") ||
        lowerSentence.includes("license") ||
        lowerSentence.includes("authority")
      ) {
        return sentence.trim().substring(0, 200);
      }
    }
  }

  return null;
}

// Helper function to extract region information
function extractRegionInformation(cleanText: string): string | null {
  const text = cleanText.toLowerCase();
  const regions = [
    {
      name: "Nationwide",
      keywords: ["nationwide", "australia wide", "all states", "national"],
    },
    { name: "Victoria", keywords: ["victoria", "vic", "melbourne"] },
    { name: "NSW", keywords: ["new south wales", "nsw", "sydney"] },
    {
      name: "Western Australia",
      keywords: ["western australia", "wa", "perth"],
    },
    { name: "Queensland", keywords: ["queensland", "qld", "brisbane"] },
    {
      name: "Northern Territory",
      keywords: ["northern territory", "nt", "darwin"],
    },
    { name: "Tasmania", keywords: ["tasmania", "tas", "hobart"] },
    {
      name: "South Australia",
      keywords: ["south australia", "sa", "adelaide"],
    },
    {
      name: "ACT",
      keywords: ["act", "australian capital territory", "canberra"],
    },
  ];

  // Check for specific regions
  for (const region of regions) {
    if (region.keywords.some((keyword) => text.includes(keyword))) {
      return region.name;
    }
  }

  // Look for residency requirements
  if (
    text.includes("australian residents") ||
    text.includes("australia only") ||
    text.includes("au residents")
  ) {
    return "Nationwide";
  }

  return null;
}

// Helper function to extract organiser information
function extractOrganiserInfo(cleanText: string, html: string, url: string) {
  let name = "";
  let website = "";
  let email = "";

  // Try to get organiser from URL domain as fallback
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace("www.", "");
    const domainName = domain.split(".")[0];
    // Capitalize first letter for better presentation
    const fallbackName =
      domainName.charAt(0).toUpperCase() + domainName.slice(1);
    website = `${urlObj.protocol}//${urlObj.hostname}`;

    // Use domain as fallback name only if no better name is found
    name = fallbackName;
  } catch {}

  // Look for brand/business names in meta tags and structured data
  const orgPatterns = [
    // Open Graph site name (most reliable)
    /<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']+)["']/i,
    // Author meta tag
    /<meta[^>]*name=["']author["'][^>]*content=["']([^"']+)["']/i,
    // Publisher meta tag
    /<meta[^>]*name=["']publisher["'][^>]*content=["']([^"']+)["']/i,
    // Application name
    /<meta[^>]*name=["']application-name["'][^>]*content=["']([^"']+)["']/i,
    // JSON-LD structured data for organization
    /"@type"\s*:\s*"Organization"[^}]*"name"\s*:\s*"([^"]+)"/i,
    // Title tag (extract brand name before separators)
    /<title[^>]*>([^<]*?)(?:\s*[-|–—]\s*[^<]*)?<\/title>/i,
  ];

  for (const pattern of orgPatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      const extractedName = match[1].trim();
      // Filter out generic terms and competition-related words
      const lowerName = extractedName.toLowerCase();
      if (
        !lowerName.includes("competition") &&
        !lowerName.includes("contest") &&
        !lowerName.includes("giveaway") &&
        !lowerName.includes("win") &&
        !lowerName.includes("prize") &&
        !lowerName.includes("draw") &&
        !lowerName.includes("raffle") &&
        !lowerName.includes("sweepstake") &&
        extractedName.length > 2 &&
        extractedName.length < 100
      ) {
        name = extractedName.substring(0, 50);
        break;
      }
    }
  }

  // Look for business/brand mentions in content with better context
  const brandPatterns = [
    // Direct brand mentions
    /(?:presented by|sponsored by|brought to you by|in partnership with|by)\s+([A-Z][A-Za-z0-9\s&.,-]{2,40})/gi,
    // Copyright mentions
    /©\s*(?:[0-9]{4}\s+)?([A-Z][A-Za-z0-9\s&.,-]{2,40})/gi,
    // Company/brand context
    /(?:company|brand|business|retailer|store)\s+([A-Z][A-Za-z0-9\s&.,-]{2,40})/gi,
  ];

  for (const pattern of brandPatterns) {
    const matches = cleanText.match(pattern);
    if (matches) {
      for (const match of matches) {
        const brandMatch = pattern.exec(match);
        if (brandMatch && brandMatch[1] && !name.includes(brandMatch[1])) {
          const brandName = brandMatch[1].trim();
          if (brandName.length > 2 && brandName.length < 50) {
            name = brandName;
            break;
          }
        }
      }
      if (name && name.length > 10) break; // Found a good brand name
    }
  }

  // Extract contact email addresses (prioritize contact/info emails)
  const emailPatterns = [
    // Contact emails (highest priority)
    /(?:contact|info|hello|support|enquir[yi]es?)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi,
    // General email pattern
    /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
  ];

  for (const pattern of emailPatterns) {
    const emailMatches = cleanText.match(pattern) || html.match(pattern);
    if (emailMatches && emailMatches.length > 0) {
      // Filter out non-contact emails
      const validEmails = emailMatches.filter((emailAddr) => {
        const lowerEmail = emailAddr.toLowerCase();
        return (
          !lowerEmail.includes("noreply") &&
          !lowerEmail.includes("no-reply") &&
          !lowerEmail.includes("donotreply") &&
          !lowerEmail.includes("unsubscribe") &&
          !lowerEmail.includes("bounce") &&
          !lowerEmail.includes("mailer-daemon")
        );
      });

      if (validEmails.length > 0) {
        // Prioritize contact-type emails
        const contactEmails = validEmails.filter((emailAddr) => {
          const lowerEmail = emailAddr.toLowerCase();
          return (
            lowerEmail.includes("contact") ||
            lowerEmail.includes("info") ||
            lowerEmail.includes("hello") ||
            lowerEmail.includes("support") ||
            lowerEmail.includes("enquir")
          );
        });

        email = contactEmails.length > 0 ? contactEmails[0] : validEmails[0];
        break;
      }
    }
  }

  // Look for website links in the content
  if (!website || website.includes(new URL(url).hostname)) {
    const websitePatterns = [
      // Direct website mentions
      /(?:visit|website|site)\s*:?\s*(https?:\/\/[^\s<>"']+)/gi,
      // Link elements with website-like text
      /<a[^>]*href=["'](https?:\/\/[^"']+)["'][^>]*>(?:website|visit|home|official)/gi,
    ];

    for (const pattern of websitePatterns) {
      const match = cleanText.match(pattern) || html.match(pattern);
      if (match && match[1]) {
        const foundWebsite = match[1].trim();
        // Make sure it's not the same as the import URL
        if (
          foundWebsite !== url &&
          !foundWebsite.includes("facebook") &&
          !foundWebsite.includes("twitter")
        ) {
          website = foundWebsite;
          break;
        }
      }
    }
  }

  return { name, website, email };
}

// Helper function to extract first meaningful paragraph
function extractFirstMeaningfulParagraph(cleanText: string): string | null {
  const sentences = cleanText.split(/[.!?]+/);

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (trimmed.length > 50 && trimmed.length < 300) {
      // Skip sentences that are likely navigation or boilerplate
      const lower = trimmed.toLowerCase();
      if (
        !lower.includes("cookie") &&
        !lower.includes("privacy") &&
        !lower.includes("navigation") &&
        !lower.includes("menu") &&
        !lower.includes("search") &&
        !lower.includes("login")
      ) {
        return trimmed;
      }
    }
  }

  return null;
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