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

  // Helper function to handle date fields with required fallback
  const formatDate = (dateString: string | null, fallback?: string): string => {
    if (!dateString || dateString.trim() === "") {
      return fallback || new Date().toISOString();
    }
    return dateString;
  };

  // Helper function to handle numeric fields
  const parseNumber = (value: string | null): number | null => {
    if (!value || value.trim() === "") return null;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  };

  // Map form data to actual database columns with proper null handling
  const competitionData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    detailed_description: formData.get("detailed_description") as string,
    category: formData.get("category") as string,
    type_of_game: formData.get("type_of_game") as string,
    start_date: formatDate(formData.get("start_date") as string),
    end_date: formatDate(formData.get("end_date") as string),
    submission_deadline: formatDate(formData.get("draw_date") as string), // Always provide a value
    prize_description: formData.get("prize_description") as string,
    prize_amount: parseNumber(formData.get("total_prize") as string),
    prize_currency: "AUD",
    thumbnail_url: formData.get("thumbnail_url") as string,
    organizer_name: formData.get("organiser_name") as string,
    organizer_website: formData.get("organiser_website") as string,
    organizer_email: formData.get("organiser_email") as string,
    status: "draft",
    organizer_id: user.id,
  };

  const { error } = await supabase
    .from("competitions")
    .insert([competitionData]);

  if (error) {
    console.error("Error creating competition:", error);
    return {
      success: false,
      message: "Failed to create competition",
      error: error.message || "Unknown database error",
    };
  }

  revalidatePath("/admin");
  return {
    success: true,
    message: "Competition created successfully",
  };
}

export async function updateCompetition(
  id: string,
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

  // Helper function to handle date fields with required fallback
  const formatDate = (dateString: string | null, fallback?: string): string => {
    if (!dateString || dateString.trim() === "") {
      return fallback || new Date().toISOString();
    }
    return dateString;
  };

  // Helper function to handle numeric fields
  const parseNumber = (value: string | null): number | null => {
    if (!value || value.trim() === "") return null;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  };

  // Map form data to actual database columns with proper null handling
  const competitionData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    detailed_description: formData.get("detailed_description") as string,
    category: formData.get("category") as string,
    type_of_game: formData.get("type_of_game") as string,
    start_date: formatDate(formData.get("start_date") as string),
    end_date: formatDate(formData.get("end_date") as string),
    submission_deadline: formatDate(formData.get("draw_date") as string), // Always provide a value
    prize_description: formData.get("prize_description") as string,
    prize_amount: parseNumber(formData.get("total_prize") as string),
    prize_currency: "AUD",
    thumbnail_url: formData.get("thumbnail_url") as string,
    organizer_name: formData.get("organiser_name") as string,
    organizer_website: formData.get("organiser_website") as string,
    organizer_email: formData.get("organiser_email") as string,
    status: formData.get("status") as string, // Include status field
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("competitions")
    .update(competitionData)
    .eq("id", id);

  if (error) {
    console.error("Error updating competition:", error);
    return {
      success: false,
      message: "Failed to update competition",
      error: error.message || "Unknown database error",
    };
  }

  revalidatePath("/admin");
  return {
    success: true,
    message: "Competition updated successfully",
  };
}

export async function updateCompetitionStatus(
  competitionId: string,
  newStatus: string,
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

  // Validate status
  const validStatuses = ["draft", "active", "completed", "cancelled"];
  if (!validStatuses.includes(newStatus)) {
    return {
      success: false,
      message: "Invalid status",
      error: "Status must be one of: draft, active, completed, cancelled",
    };
  }

  const { error } = await supabase
    .from("competitions")
    .update({
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", competitionId);

  if (error) {
    console.error("Error updating competition status:", error);
    return {
      success: false,
      message: "Failed to update competition status",
      error: error.message || "Unknown database error",
    };
  }

  revalidatePath("/admin");
  return {
    success: true,
    message: `Competition status updated to ${newStatus} successfully`,
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

    // Enhanced date extraction function with Australian date format support
    function extractDatesFromContent(cleanText: string, html: string): {
      startDate: string | null;
      endDate: string | null;
      drawDate: string | null;
      issues: string[];
    } {
      const issues: string[] = [];
      let startDate: string | null = null;
      let endDate: string | null = null;
      let drawDate: string | null = null;

      // Australian timezone mapping
      const timezoneMap: { [key: string]: string } = {
        'AEST': '+10:00',
        'AEDT': '+11:00',
        'ACST': '+09:30',
        'ACDT': '+10:30',
        'AWST': '+08:00',
        'AWDT': '+09:00',
      };

      // Enhanced date patterns for Australian formats
      const datePatterns = [
        // Australian DD/MM/YY and DD/MM/YYYY formats with times and timezones
        /(?:begins?|starts?|commences?|opens?).*?(?:at\s+)?(\d{1,2}):(\d{2})\s*([ap]m)\s*([A-Z]{3,4})\s*on\s*(\d{1,2})\/(\d{1,2})\/(\d{2,4})/gi,
        /(?:ends?|closes?|finishes?).*?(?:at\s+)?(\d{1,2}):(\d{2})\s*([ap]m)\s*([A-Z]{3,4})\s*on\s*(\d{1,2})\/(\d{1,2})\/(\d{2,4})/gi,
        
        // More flexible patterns for start/end dates
        /(?:from|starting)\s*(\d{1,2})\/(\d{1,2})\/(\d{2,4}).*?(?:to|until|ending)\s*(\d{1,2})\/(\d{1,2})\/(\d{2,4})/gi,
        /(\d{1,2})\/(\d{1,2})\/(\d{2,4})\s*(?:-|to|until)\s*(\d{1,2})\/(\d{1,2})\/(\d{2,4})/gi,
        
        // Draw/winner announcement dates
        /(?:winner|draw|result).*?(?:announced?|drawn?|selected?).*?(?:on\s*)?(\d{1,2})\/(\d{1,2})\/(\d{2,4})/gi,
        /(?:judging|selection).*?(?:date|on)\s*(\d{1,2})\/(\d{1,2})\/(\d{2,4})/gi,
        
        // ISO format fallback
        /(\d{4})-(\d{1,2})-(\d{1,2})/g,
        
        // US format fallback
        /(\d{1,2})\/(\d{1,2})\/(\d{4})/g,
      ];

      // Function to convert 2-digit year to 4-digit year
      function expandYear(year: string): string {
        const yearNum = parseInt(year);
        if (year.length === 2) {
          // Assume years 00-30 are 2000-2030, 31-99 are 1931-1999
          return yearNum <= 30 ? `20${year}` : `19${year}`;
        }
        return year;
      }

      // Function to parse Australian date format (DD/MM/YYYY)
      function parseAustralianDate(day: string, month: string, year: string, hour?: string, minute?: string, ampm?: string, timezone?: string): string | null {
        try {
          const expandedYear = expandYear(year);
          const dayNum = parseInt(day);
          const monthNum = parseInt(month);
          
          // Validate date components
          if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12) {
            return null;
          }

          let hourNum = 0;
          let minuteNum = 0;

          if (hour && minute && ampm) {
            hourNum = parseInt(hour);
            minuteNum = parseInt(minute);
            
            // Convert to 24-hour format
            if (ampm.toLowerCase() === 'pm' && hourNum !== 12) {
              hourNum += 12;
            } else if (ampm.toLowerCase() === 'am' && hourNum === 12) {
              hourNum = 0;
            }
          }

          // Create date in local time first
          const date = new Date(parseInt(expandedYear), monthNum - 1, dayNum, hourNum, minuteNum);
          
          // Convert to ISO string format for datetime-local input
          return date.toISOString().slice(0, 16);
        } catch (error) {
          console.error('Error parsing Australian date:', error);
          return null;
        }
      }

      // Look for narrative date patterns like "begins at X and ends at Y"
      const narrativePattern = /(?:promotion|competition|contest).*?begins?\s+at\s+(\d{1,2}):(\d{2})\s*([ap]m)\s*([A-Z]{3,4})\s+on\s+(\d{1,2})\/(\d{1,2})\/(\d{2,4}).*?ends?\s+at\s+(\d{1,2}):(\d{2})\s*([ap]m)\s*([A-Z]{3,4})\s+on\s+(\d{1,2})\/(\d{1,2})\/(\d{2,4})/gi;
      
      let narrativeMatch;
      while ((narrativeMatch = narrativePattern.exec(cleanText)) !== null) {
        // Start date components
        const [, startHour, startMinute, startAmPm, startTz, startDay, startMonth, startYear,
               endHour, endMinute, endAmPm, endTz, endDay, endMonth, endYear] = narrativeMatch;
        
        if (!startDate) {
          startDate = parseAustralianDate(startDay, startMonth, startYear, startHour, startMinute, startAmPm, startTz);
          if (startDate) {
            issues.push(`Extracted start date: ${startDay}/${startMonth}/${startYear} ${startHour}:${startMinute} ${startAmPm} ${startTz}`);
          }
        }
        
        if (!endDate) {
          endDate = parseAustralianDate(endDay, endMonth, endYear, endHour, endMinute, endAmPm, endTz);
          if (endDate) {
            issues.push(`Extracted end date: ${endDay}/${endMonth}/${endYear} ${endHour}:${endMinute} ${endAmPm} ${endTz}`);
          }
        }
      }

      // Look for individual start date patterns
      if (!startDate) {
        const startPatterns = [
          /(?:begins?|starts?|commences?|opens?).*?(?:at\s+)?(\d{1,2}):(\d{2})\s*([ap]m)\s*([A-Z]{3,4})\s*on\s*(\d{1,2})\/(\d{1,2})\/(\d{2,4})/gi,
          /(?:from|starting).*?(\d{1,2})\/(\d{1,2})\/(\d{2,4})/gi,
        ];

        for (const pattern of startPatterns) {
          let match;
          while ((match = pattern.exec(cleanText)) !== null) {
            if (match.length >= 7) {
              // Pattern with time
              const [, hour, minute, ampm, tz, day, month, year] = match;
              startDate = parseAustralianDate(day, month, year, hour, minute, ampm, tz);
            } else if (match.length >= 4) {
              // Pattern without time
              const [, day, month, year] = match;
              startDate = parseAustralianDate(day, month, year);
            }
            
            if (startDate) {
              issues.push(`Extracted start date from: "${match[0]}"`);
              break;
            }
          }
          if (startDate) break;
        }
      }

      // Look for individual end date patterns
      if (!endDate) {
        const endPatterns = [
          /(?:ends?|closes?|finishes?).*?(?:at\s+)?(\d{1,2}):(\d{2})\s*([ap]m)\s*([A-Z]{3,4})\s*on\s*(\d{1,2})\/(\d{1,2})\/(\d{2,4})/gi,
          /(?:to|until|ending).*?(\d{1,2})\/(\d{1,2})\/(\d{2,4})/gi,
        ];

        for (const pattern of endPatterns) {
          let match;
          while ((match = pattern.exec(cleanText)) !== null) {
            if (match.length >= 7) {
              // Pattern with time
              const [, hour, minute, ampm, tz, day, month, year] = match;
              endDate = parseAustralianDate(day, month, year, hour, minute, ampm, tz);
            } else if (match.length >= 4) {
              // Pattern without time
              const [, day, month, year] = match;
              endDate = parseAustralianDate(day, month, year);
            }
            
            if (endDate) {
              issues.push(`Extracted end date from: "${match[0]}"`);
              break;
            }
          }
          if (endDate) break;
        }
      }

      // Look for draw/winner announcement dates
      const drawPatterns = [
        /(?:winner|draw|result).*?(?:announced?|drawn?|selected?).*?(?:on\s*)?(\d{1,2})\/(\d{1,2})\/(\d{2,4})/gi,
        /(?:judging|selection).*?(?:date|on)\s*(\d{1,2})\/(\d{1,2})\/(\d{2,4})/gi,
      ];

      for (const pattern of drawPatterns) {
        let match;
        while ((match = pattern.exec(cleanText)) !== null) {
          const [, day, month, year] = match;
          drawDate = parseAustralianDate(day, month, year);
          if (drawDate) {
            issues.push(`Extracted draw date from: "${match[0]}"`);
            break;
          }
        }
        if (drawDate) break;
      }

      // Fallback: Look for any date ranges
      if (!startDate || !endDate) {
        const rangePattern = /(\d{1,2})\/(\d{1,2})\/(\d{2,4})\s*(?:-|to|until)\s*(\d{1,2})\/(\d{1,2})\/(\d{2,4})/gi;
        let rangeMatch;
        while ((rangeMatch = rangePattern.exec(cleanText)) !== null) {
          const [, startDay, startMonth, startYear, endDay, endMonth, endYear] = rangeMatch;
          
          if (!startDate) {
            startDate = parseAustralianDate(startDay, startMonth, startYear);
          }
          if (!endDate) {
            endDate = parseAustralianDate(endDay, endMonth, endYear);
          }
          
          if (startDate && endDate) {
            issues.push(`Extracted date range from: "${rangeMatch[0]}"`);
            break;
          }
        }
      }

      return {
        startDate,
        endDate,
        drawDate,
        issues,
      };
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
    extractedData.type_of_game = competitionType.gameType;

    // Extract permit information with permit number extraction
    const permitInfo = extractPermitInformation(cleanText);
    if (permitInfo.permitNumber) {
      extractedData.permit_number = permitInfo.permitNumber;
    }
    if (permitInfo.permitText) {
      extractedData.permits = permitInfo.permitText;
    }

    // Extract thumbnail URL from various sources (image file URL location)
    const thumbnailUrl = extractThumbnailUrl(html, url);
    if (thumbnailUrl) {
      extractedData.thumbnail_url = thumbnailUrl;
    }

    // Extract organiser information with email extraction
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

// Helper functions for data extraction
function extractPrizeInformation(cleanText: string, html: string): {
  description: string | null;
  totalPrize: string | null;
} {
  let description: string | null = null;
  let totalPrize: string | null = null;

  // Enhanced prize value patterns - more comprehensive
  const prizeValuePatterns = [
    // Direct monetary values
    /(?:prize|reward|win|winner|value|worth).*?(\$[\d,]+(?:\.\d{2})?)/gi,
    /(\$[\d,]+(?:\.\d{2})?).*?(?:prize|reward|cash|value|worth|win)/gi,
    /(?:total|grand|major).*?prize.*?(\$[\d,]+(?:\.\d{2})?)/gi,
    // Trip values and approximations
    /trip.*?(?:worth|value|valued).*?(\$[\d,]+(?:\.\d{2})?)/gi,
    /(\$[\d,]+(?:\.\d{2})?).*?trip/gi,
    // Gift card values
    /gift.*?(?:card|voucher).*?(\$[\d,]+(?:\.\d{2})?)/gi,
    /(\$[\d,]+(?:\.\d{2})?).*?gift.*?(?:card|voucher)/gi,
  ];

  // Try to find monetary values
  for (const pattern of prizeValuePatterns) {
    const match = pattern.exec(cleanText);
    if (match && match[1]) {
      totalPrize = match[1];
      break;
    }
  }

  // Enhanced prize description patterns - more comprehensive
  const prizeDescPatterns = [
    // Major prize descriptions
    /(?:major|main|grand|first).*?prize.*?:?\s*([^.!?\n]{20,300})/gi,
    /(?:winner|winners).*?(?:will receive|receive|gets?|wins?).*?([^.!?\n]{20,300})/gi,
    /(?:you could win|win|prize includes?).*?([^.!?\n]{20,300})/gi,
    // Trip descriptions
    /trip.*?to.*?([^.!?\n]{20,200})/gi,
    /(?:family of \d+|for \d+ people).*?([^.!?\n]{20,200})/gi,
    // Gift descriptions
    /(?:gift cards?|vouchers?).*?([^.!?\n]{20,200})/gi,
    // Multiple prizes
    /(?:minor prizes?|additional prizes?).*?([^.!?\n]{20,200})/gi,
    // Value approximations
    /(?:value|worth|includes?).*?([^.!?\n]{30,300})/gi,
  ];

  // Try to find prize descriptions
  for (const pattern of prizeDescPatterns) {
    const match = pattern.exec(cleanText);
    if (match && match[1]) {
      const desc = match[1].trim();
      // Filter out very short or generic descriptions
      if (desc.length > 15 && !desc.toLowerCase().includes('click here') && !desc.toLowerCase().includes('read more')) {
        description = desc;
        break;
      }
    }
  }

  // If no specific description found, try to extract from context around prize mentions
  if (!description) {
    const contextPatterns = [
      /prize[^.!?\n]*([^.!?\n]{50,250})/gi,
      /win[^.!?\n]*([^.!?\n]{50,250})/gi,
    ];

    for (const pattern of contextPatterns) {
      const match = pattern.exec(cleanText);
      if (match && match[1]) {
        const desc = match[1].trim();
        if (desc.length > 30) {
          description = desc;
          break;
        }
      }
    }
  }

  return { description, totalPrize };
}

function detectEntryCriteria(cleanText: string): string[] {
  const criteria: string[] = [];
  const criteriaPatterns = [
    /(?:must be|need to be|required to be).*?(\d+).*?(?:years? old|or older)/gi,
    /(?:resident|citizen).*?(?:of|in)\s+([A-Za-z\s]+)/gi,
    /(?:follow|like|subscribe)/gi,
    /(?:share|repost|tag)/gi,
  ];

  for (const pattern of criteriaPatterns) {
    const matches = cleanText.match(pattern);
    if (matches) {
      criteria.push(...matches.map(m => m.trim()));
    }
  }

  return criteria;
}

function extractParticipatingRequirements(cleanText: string): string | null {
  const reqPatterns = [
    // Specific requirement patterns
    /(?:to enter|to participate|entry requirements?|eligibility).*?:?\s*([^.!?\n]{30,300})/gi,
    /(?:must|need to|required to|you must).*?([^.!?\n]{30,300})/gi,
    /(?:eligible|eligibility).*?([^.!?\n]{30,300})/gi,
    /(?:requirements?|criteria).*?([^.!?\n]{30,300})/gi,
    // Age and residency requirements
    /(?:18\+|18 years|over 18|aged 18).*?([^.!?\n]{20,200})/gi,
    /(?:australian residents?|residents? of australia).*?([^.!?\n]{20,200})/gi,
    // Purchase requirements
    /(?:purchase|buy|receipt).*?required.*?([^.!?\n]{20,200})/gi,
    /(?:retain receipt|proof of purchase).*?([^.!?\n]{20,200})/gi,
  ];

  for (const pattern of reqPatterns) {
    const match = pattern.exec(cleanText);
    if (match && match[1]) {
      const req = match[1].trim();
      // Filter out very short or generic requirements
      if (req.length > 20 && !req.toLowerCase().includes('click here')) {
        return req;
      }
    }
  }

  // Look for bullet points or numbered lists that might contain requirements
  const listPatterns = [
    /(?:•|\*|\d+\.)\s*([^•*\n]{20,200})/g,
    /(?:requirements?|eligibility)[\s\S]*?(?:•|\*|\d+\.)\s*([^•*\n]{20,200})/gi,
  ];

  for (const pattern of listPatterns) {
    let match;
    while ((match = pattern.exec(cleanText)) !== null) {
      const req = match[1].trim();
      if (req.length > 20) {
        return req;
      }
    }
  }

  return null;
}

function extractRulesAndWinningMethods(cleanText: string): string | null {
  const rulePatterns = [
    /(?:rules|terms|conditions).*?([^.!?]{50,500})/gi,
    /(?:how to win|winning method).*?([^.!?]{50,300})/gi,
    /(?:judging|selection).*?criteria.*?([^.!?]{50,300})/gi,
  ];

  for (const pattern of rulePatterns) {
    const match = pattern.exec(cleanText);
    if (match) {
      return match[1].trim();
    }
  }

  return null;
}

function detectCompetitionType(cleanText: string): {
  category: string;
  gameType: string;
} {
  const text = cleanText.toLowerCase();
  
  // Category detection - MUST use only these 4 values
  let category = "Open (free)"; // Default to free
  
  // Check for purchase requirements first (highest barrier)
  if (text.includes("purchase") || text.includes("buy") || text.includes("spend") || 
      text.includes("receipt") || text.includes("proof of purchase") ||
      text.includes("must retain receipt") || text.includes("purchase required")) {
    category = "Purchase Required";
  }
  // Check for medium barriers
  else if (text.includes("entry fee") || text.includes("registration fee") || 
           text.includes("membership required") || text.includes("subscription") ||
           text.includes("premium") || text.includes("paid account")) {
    category = "Barrier (Medium)";
  }
  // Check for low barriers  
  else if (text.includes("follow") || text.includes("like") || text.includes("subscribe") ||
           text.includes("share") || text.includes("tag") || text.includes("repost") ||
           text.includes("sign up") || text.includes("register") || text.includes("email required") ||
           text.includes("social media") || text.includes("facebook") || text.includes("instagram")) {
    category = "Barrier (low)";
  }
  // Otherwise remains "Open (free)"

  // Game type detection - MUST use only these 2 values
  let gameType = "Game of Skill"; // Default to skill-based
  
  // Check for luck/chance indicators
  if (text.includes("random") || text.includes("draw") || text.includes("luck") || 
      text.includes("chance") || text.includes("lottery") || text.includes("raffle") ||
      text.includes("sweepstakes") || text.includes("randomly selected") ||
      text.includes("winner will be drawn") || text.includes("chance to win") ||
      text.includes("game of chance")) {
    gameType = "Game of Luck";
  }
  // Check for skill indicators (reinforces default)
  else if (text.includes("judg") || text.includes("best") || text.includes("creative") ||
           text.includes("skill") || text.includes("talent") || text.includes("competition") ||
           text.includes("contest") || text.includes("submit") || text.includes("entry") ||
           text.includes("criteria") || text.includes("winner selected")) {
    gameType = "Game of Skill";
  }

  return { category, gameType };
}

function extractPermitInformation(cleanText: string): {
  permitNumber: string | null;
  permitText: string | null;
} {
  let permitNumber: string | null = null;
  let permitText: string | null = null;

  // Permit number patterns
  const permitPatterns = [
    /permit.*?(?:no|number|#).*?([A-Z0-9\/\-]{5,20})/gi,
    /licence.*?(?:no|number|#).*?([A-Z0-9\/\-]{5,20})/gi,
    /authorization.*?([A-Z0-9\/\-]{5,20})/gi,
  ];

  for (const pattern of permitPatterns) {
    const match = pattern.exec(cleanText);
    if (match) {
      permitNumber = match[1].trim();
      permitText = match[0].trim();
      break;
    }
  }

  return { permitNumber, permitText };
}

function extractThumbnailUrl(html: string, baseUrl: string): string | null {
  // Try Open Graph image first
  const ogImageMatch = html.match(
    /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i
  );
  if (ogImageMatch) {
    return ogImageMatch[1];
  }

  // Try Twitter card image
  const twitterImageMatch = html.match(
    /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i
  );
  if (twitterImageMatch) {
    return twitterImageMatch[1];
  }

  // Try to find first large image
  const imgMatches = html.match(/<img[^>]*src=["']([^"']+)["'][^>]*>/gi);
  if (imgMatches) {
    for (const imgMatch of imgMatches) {
      const srcMatch = imgMatch.match(/src=["']([^"']+)["']/i);
      if (srcMatch) {
        const src = srcMatch[1];
        // Skip small images, icons, and logos
        if (!src.includes('icon') && !src.includes('logo') && !src.includes('favicon')) {
          return src.startsWith('http') ? src : new URL(src, baseUrl).href;
        }
      }
    }
  }

  return null;
}

function extractOrganiserInfo(cleanText: string, html: string, url: string): {
  name: string | null;
  website: string | null;
  email: string | null;
} {
  let name: string | null = null;
  let website: string | null = null;
  let email: string | null = null;

  // Extract organizer name
  const namePatterns = [
    /(?:organized by|presented by|hosted by|brought to you by)\s+([^.!?\n]{5,50})/gi,
    /(?:organizer|organiser).*?([A-Za-z\s&]{5,50})/gi,
  ];

  for (const pattern of namePatterns) {
    const match = pattern.exec(cleanText);
    if (match) {
      name = match[1].trim();
      break;
    }
  }

  // Extract website (use the base URL as fallback)
  try {
    const urlObj = new URL(url);
    website = `${urlObj.protocol}//${urlObj.hostname}`;
  } catch (e) {
    // Ignore URL parsing errors
  }

  // Extract email
  const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  const emailMatch = cleanText.match(emailPattern);
  if (emailMatch) {
    email = emailMatch[0];
  }

  return { name, website, email };
}

function extractFirstMeaningfulParagraph(cleanText: string): string | null {
  // Split into paragraphs and sentences
  const paragraphs = cleanText.split(/\n\s*\n/).filter(p => p.trim().length > 30);
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 20);
  
  // Keywords that indicate meaningful competition content
  const competitionKeywords = [
    'competition', 'contest', 'win', 'prize', 'enter', 'participate', 'submit',
    'chance', 'opportunity', 'reward', 'winner', 'entry', 'promotion'
  ];
  
  // Keywords that indicate navigation/header content to skip
  const skipKeywords = [
    'menu', 'navigation', 'skip to', 'home', 'about us', 'contact', 'login',
    'register', 'search', 'categories', 'browse', 'footer', 'header', 'sidebar'
  ];

  // Function to score content relevance
  function scoreContent(text: string): number {
    const lowerText = text.toLowerCase();
    let score = 0;
    
    // Add points for competition keywords
    competitionKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) score += 2;
    });
    
    // Subtract points for skip keywords
    skipKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) score -= 3;
    });
    
    // Add points for length (longer content is often more meaningful)
    if (text.length > 100) score += 1;
    if (text.length > 200) score += 1;
    
    // Add points for sentence structure
    if (text.includes('.') || text.includes('!') || text.includes('?')) score += 1;
    
    return score;
  }

  // Try paragraphs first
  let bestContent = null;
  let bestScore = -1;

  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim();
    if (trimmed.length < 50) continue;
    
    const score = scoreContent(trimmed);
    if (score > bestScore) {
      bestScore = score;
      bestContent = trimmed;
    }
  }

  // If no good paragraph found, try sentences
  if (!bestContent || bestScore < 2) {
    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (trimmed.length < 40) continue;
      
      const score = scoreContent(trimmed);
      if (score > bestScore) {
        bestScore = score;
        bestContent = trimmed;
      }
    }
  }

  // Clean up and return
  if (bestContent) {
    // Remove extra whitespace and limit length
    bestContent = bestContent.replace(/\s+/g, ' ').trim();
    if (bestContent.length > 500) {
      bestContent = bestContent.substring(0, 500) + '...';
    }
    return bestContent;
  }
  
  // Fallback to first substantial paragraph
  return paragraphs[0]?.trim().substring(0, 500) || null;
}

function extractTermsAndConditionsUrl(html: string, baseUrl: string): string | null {
  const termsPatterns = [
    /<a[^>]*href=["']([^"']*(?:terms|conditions|rules)[^"']*)["'][^>]*>/gi,
    /<a[^>]*href=["']([^"']*(?:legal|privacy)[^"']*)["'][^>]*>/gi,
  ];

  for (const pattern of termsPatterns) {
    const match = pattern.exec(html);
    if (match) {
      const href = match[1];
      return href.startsWith('http') ? href : new URL(href, baseUrl).href;
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

  const requirementData = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    category: formData.get("category") as string,
    is_active: formData.get("is_active") === "true",
  };

  const { error } = await supabase
    .from("requirement_options")
    .insert([requirementData]);

  if (error) {
    console.error("Error creating requirement option:", error);
    return {
      success: false,
      message: "Failed to create requirement option",
      error: error.message || "Unknown database error",
    };
  }

  revalidatePath("/admin");
  return {
    success: true,
    message: "Requirement option created successfully",
  };
}