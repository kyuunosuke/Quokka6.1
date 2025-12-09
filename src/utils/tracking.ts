/**
 * Utility functions for outgoing link tracking with UTM parameters
 */

import { createClient } from "../../supabase/client";

interface UTMParams {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
}

/**
 * Appends UTM parameters to an outgoing URL for tracking purposes.
 * Uses minimal but expressive parameters that are safe for client-side use.
 * 
 * @param targetUrl - The destination URL to append UTM params to
 * @param options - Optional UTM parameters to customize tracking
 * @returns The URL with UTM parameters appended
 */
export function appendUTMParams(
  targetUrl: string,
  options: UTMParams = {}
): string {
  if (!targetUrl || typeof targetUrl !== 'string') {
    return targetUrl;
  }

  try {
    const url = new URL(targetUrl);
    
    // Default UTM parameters
    const params = {
      utm_source: options.source || 'quokkamole.com',
      utm_medium: options.medium || 'referral',
      utm_campaign: options.campaign || 'competition_click',
    };

    // Add optional content parameter if provided
    if (options.content) {
      url.searchParams.set('utm_content', options.content);
    }

    // Set UTM parameters
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    return url.toString();
  } catch {
    // If URL parsing fails, return original URL
    return targetUrl;
  }
}

/**
 * Opens a competition URL in a new tab with UTM tracking parameters
 * and records the click in the database
 * 
 * @param bannerUrl - The competition's banner/external URL
 * @param competitionId - Optional competition ID for tracking
 * @param competitionName - Optional competition name for tracking
 */
export async function openCompetitionWithTracking(
  bannerUrl: string | null | undefined,
  competitionId?: string,
  competitionName?: string
): Promise<void> {
  if (!bannerUrl || typeof bannerUrl !== 'string' || !bannerUrl.trim()) {
    return;
  }

  const trackedUrl = appendUTMParams(bannerUrl.trim(), {
    source: 'quokkamole.com',
    medium: 'referral',
    campaign: 'competition_click',
    content: competitionId || undefined,
  });

  // Record the click in the database
  if (competitionId) {
    try {
      const supabase = createClient();
      await supabase.rpc('increment_outbound_clicks', { competition_id: competitionId });
    } catch (error) {
      console.error('Failed to record outbound click:', error);
    }
  }

  window.open(trackedUrl, '_blank', 'noopener,noreferrer');
}
