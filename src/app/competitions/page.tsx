import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  DollarSign,
  Filter,
  Heart,
  Trophy,
  Users,
  Clock,
  Star,
} from "lucide-react";
import { createClient } from "../../../supabase/server";
import Link from "next/link";
import { Tables } from "@/types/supabase";

type Competition = Tables<"competitions">;

// Helper function to format prize amount
function formatPrize(amount: number | null, currency: string | null): string {
  if (!amount || amount <= 0) return "TBD";
  try {
    const currencySymbol = currency === "USD" ? "$" : currency || "$";
    return `${currencySymbol}${amount.toLocaleString()}`;
  } catch {
    return "TBD";
  }
}

// Helper function to format date
function formatDate(dateString: string | null): string {
  if (!dateString) return "TBD";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "TBD";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "TBD";
  }
}

// Helper function to get requirements text
function getRequirementsText(competition: Competition): string {
  try {
    return (
      competition?.detailed_description?.trim() ||
      competition?.description?.trim() ||
      "No specific requirements listed."
    );
  } catch {
    return "No specific requirements listed.";
  }
}

// Helper function to get rules text
function getRulesText(competition: Competition): string {
  try {
    return (
      competition?.rules?.trim() ||
      "Please follow all competition guidelines and submit original work only."
    );
  } catch {
    return "Please follow all competition guidelines and submit original work only.";
  }
}

// Helper function to safely get string value
function safeString(
  value: string | null | undefined,
  fallback: string = "",
): string {
  try {
    if (value === null || value === undefined) return fallback;
    const trimmed = String(value).trim();
    return trimmed || fallback;
  } catch {
    return fallback;
  }
}

// Helper function to safely get number value
function safeNumber(
  value: number | null | undefined,
  fallback: number = 0,
): number {
  try {
    if (value === null || value === undefined) return fallback;
    const num = Number(value);
    return !isNaN(num) && isFinite(num) ? num : fallback;
  } catch {
    return fallback;
  }
}

export default async function CompetitionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch competitions from Supabase (try all statuses first to debug)
  let competitions: Competition[] = [];
  let error = null;
  let debugInfo = "";

  try {
    // First, let's see what competitions exist with any status
    const { data: allData, error: allError } = await supabase
      .from("competitions")
      .select("id, title, status, created_at")
      .order("created_at", { ascending: false });

    if (allError) {
      console.error("Error fetching all competitions:", allError);
      debugInfo = `Debug: Error fetching competitions - ${allError.message}`;
    } else {
      const allCompetitions = allData || [];
      debugInfo = `Debug: Found ${allCompetitions.length} total competitions. Statuses: ${[...new Set(allCompetitions.map((c) => c.status))].join(", ")}`;
      console.log("All competitions:", allCompetitions);
    }

    // Now fetch the actual competition data
    // Try multiple status values that might be used
    const { data, error: fetchError } = await supabase
      .from("competitions")
      .select("*")
      .in("status", ["active", "open", "published", "live"])
      .order("created_at", { ascending: false });

    if (fetchError) {
      console.error("Error fetching competitions:", fetchError);
      error = fetchError.message;
    } else {
      competitions = data || [];
      console.log("Fetched competitions:", competitions);
    }

    // If no competitions found with specific statuses, try fetching all
    if (competitions.length === 0 && !fetchError) {
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("competitions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (!fallbackError && fallbackData) {
        competitions = fallbackData;
        debugInfo += ` | Fallback: Using all competitions (${competitions.length} found)`;
      }
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    error = "Failed to load competitions";
  }

  // Generate categories from actual data
  const categoryMap = new Map<string, number>();
  try {
    if (Array.isArray(competitions)) {
      competitions.forEach((comp) => {
        try {
          if (comp && typeof comp === "object" && comp.id) {
            const category = safeString(comp.category, "Other");
            categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
          }
        } catch (err) {
          console.error(
            "Error processing individual competition category:",
            err,
          );
        }
      });
    }
  } catch (error) {
    console.error("Error processing categories:", error);
  }

  const categories = [
    { name: "All Categories", count: competitions.length },
    ...Array.from(categoryMap.entries()).map(([name, count]) => ({
      name,
      count,
    })),
  ];

  // Calculate total prize money
  const totalPrizes = Array.isArray(competitions)
    ? competitions.reduce((sum, comp) => {
        try {
          if (comp && typeof comp === "object") {
            return sum + safeNumber(comp.prize_amount, 0);
          }
          return sum;
        } catch {
          return sum;
        }
      }, 0)
    : 0;

  // Calculate total participants
  const totalParticipants = Array.isArray(competitions)
    ? competitions.reduce((sum, comp) => {
        try {
          if (comp && typeof comp === "object") {
            return sum + safeNumber(comp.current_participants, 0);
          }
          return sum;
        } catch {
          return sum;
        }
      }, 0)
    : 0;

  return (
    <div className="min-h-screen bg-neuro-light">
      <Navbar />

      {/* Header Section */}
      <section className="py-16 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Competition Directory
            </h1>
            <p className="text-xl text-purple-100 mb-8">
              Discover amazing competitions, showcase your talents, and win
              incredible prizes
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">{competitions.length}</div>
                <div className="text-sm text-purple-100">
                  Active Competitions
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">
                  {totalPrizes > 0
                    ? `${(totalPrizes / 1000).toFixed(0)}K+`
                    : "TBD"}
                </div>
                <div className="text-sm text-purple-100">Total Prizes</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">{totalParticipants}</div>
                <div className="text-sm text-purple-100">Participants</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">{categoryMap.size}</div>
                <div className="text-sm text-purple-100">Categories</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Filter by:</span>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <Badge
                  key={index}
                  variant={index === 0 ? "default" : "outline"}
                  className="cursor-pointer hover:bg-purple-100 transition-colors"
                >
                  {category.name} ({category.count})
                </Badge>
              ))}
            </div>

            {/* Additional Filters */}
            <div className="flex flex-wrap gap-2 ml-auto">
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-purple-100"
              >
                Prize: High to Low
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-purple-100"
              >
                Deadline: Soon
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-purple-100"
              >
                All Levels
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Competitions Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <p className="text-red-800">
                Error loading competitions: {error}
              </p>
            </div>
          )}

          {debugInfo && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <p className="text-blue-800 text-sm">{debugInfo}</p>
            </div>
          )}

          {(!Array.isArray(competitions) || competitions.length === 0) &&
          !error ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No Active Competitions
              </h3>
              <p className="text-gray-500">
                Check back soon for new competitions!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.isArray(competitions) &&
                competitions
                  .map((competition, index) => {
                    // Safety check for competition object
                    if (
                      !competition ||
                      typeof competition !== "object" ||
                      !competition.id
                    ) {
                      console.warn(
                        `Invalid competition at index ${index}:`,
                        competition,
                      );
                      return null;
                    }

                    try {
                      const competitionId = safeString(
                        competition.id,
                        `comp-${index}`,
                      );
                      return (
                        <Card
                          key={competitionId}
                          className="bg-neuro-light shadow-neuro hover:shadow-neuro-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                        >
                          <div className="relative">
                            <img
                              src={
                                safeString(competition?.thumbnail_url) ||
                                safeString(competition?.banner_url) ||
                                "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&q=80"
                              }
                              alt={safeString(
                                competition?.title,
                                "Competition",
                              )}
                              className="w-full h-48 object-cover"
                              onError={(e) => {
                                try {
                                  const target = e.target as HTMLImageElement;
                                  if (target) {
                                    target.src =
                                      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&q=80";
                                  }
                                } catch (err) {
                                  console.error(
                                    "Error setting fallback image:",
                                    err,
                                  );
                                }
                              }}
                            />
                            <div className="absolute top-4 left-4">
                              <Badge className="bg-white/90 text-gray-900 hover:bg-white">
                                {safeString(competition?.category, "General")}
                              </Badge>
                            </div>
                            <div className="absolute top-4 right-4">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="bg-white/90 hover:bg-white"
                              >
                                <Heart className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <CardHeader>
                            <CardTitle className="text-xl mb-2">
                              {safeString(
                                competition?.title,
                                "Untitled Competition",
                              )}
                            </CardTitle>
                            <CardDescription className="text-gray-600">
                              {safeString(
                                competition?.description,
                                "No description available.",
                              )}
                            </CardDescription>
                          </CardHeader>

                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-1 text-green-600">
                                <DollarSign className="w-4 h-4" />
                                <span className="font-semibold">
                                  {formatPrize(
                                    competition?.prize_amount,
                                    competition?.prize_currency,
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-orange-600">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {formatDate(competition?.submission_deadline)}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>
                                  {safeNumber(
                                    competition?.current_participants,
                                    0,
                                  )}{" "}
                                  participants
                                </span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {safeString(
                                  competition?.difficulty_level,
                                  "All Levels",
                                )}
                              </Badge>
                            </div>

                            {/* Requirements and Rules - Always Visible */}
                            <div className="space-y-3 pt-4 border-t">
                              <div>
                                <h4 className="font-semibold text-sm mb-1 text-purple-700">
                                  Requirements:
                                </h4>
                                <p className="text-xs text-gray-600 line-clamp-2">
                                  {getRequirementsText(competition)}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-semibold text-sm mb-1 text-purple-700">
                                  Rules:
                                </h4>
                                <p className="text-xs text-gray-600 line-clamp-2">
                                  {getRulesText(competition)}
                                </p>
                              </div>
                            </div>
                          </CardContent>

                          <CardFooter className="flex gap-2">
                            <Button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                              Enter Competition
                            </Button>
                            <Button variant="outline" size="icon">
                              <Star className="w-4 h-4" />
                            </Button>
                          </CardFooter>
                        </Card>
                      );
                    } catch (error) {
                      console.error(
                        `Error rendering competition ${competition?.id || "unknown"}:`,
                        error,
                      );
                      return null;
                    }
                  })
                  .filter(Boolean)}
            </div>
          )}
        </div>
      </section>

      {/* Load More Section */}
      <section className="py-8 text-center">
        <Button
          variant="outline"
          size="lg"
          className="shadow-neuro hover:shadow-neuro-lg"
        >
          Load More Competitions
        </Button>
      </section>

      <Footer />
    </div>
  );
}
