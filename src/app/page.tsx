"use client";

import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
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
import { FlipCard } from "@/components/ui/flip-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowUpRight,
  Trophy,
  Target,
  Users,
  Star,
  Calendar,
  DollarSign,
  Filter,
  Clock,
  MoreHorizontal,
} from "lucide-react";
import { createClient } from "../../supabase/client";

// Component for expandable text
function ExpandableText({
  text,
  maxLength = 150,
}: {
  text: string;
  maxLength?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = text.length > maxLength;
  const displayText =
    shouldTruncate && !isExpanded ? text.slice(0, maxLength) + "..." : text;

  return (
    <div>
      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
        {displayText}
      </p>
      {shouldTruncate && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="mt-2 flex items-center gap-1 text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors"
        >
          {isExpanded ? (
            <>
              Show less <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Show more <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
}

// Component for competition details card
function CompetitionDetailsCard({
  requirements,
  rules,
}: {
  requirements: string[];
  rules: string;
}) {
  return (
    <Card className="bg-neuro-light shadow-neuro overflow-hidden w-full h-full">
      <CardContent className="p-6 space-y-6 h-full overflow-y-auto">
        {/* Requirements Section */}
        <div>
          <h4 className="font-semibold text-lg mb-4 text-purple-600 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Requirements
          </h4>
          <div className="space-y-3">
            {requirements.map((requirement, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                <ExpandableText text={requirement} maxLength={100} />
              </div>
            ))}
          </div>
        </div>

        {/* Rules Section */}
        <div className="border-t pt-6">
          <h4 className="font-semibold text-lg mb-4 text-blue-600 flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Rules
          </h4>
          <ExpandableText text={rules} maxLength={200} />
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 p-4 border-t bg-white/50">
        <Button
          className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          onClick={() => {
            // This will be handled by the parent component's data
            console.log("Go to competition clicked");
          }}
        >
          Go to competition
        </Button>
        <Button variant="outline" size="icon">
          <Star className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

export default function Home() {
  const [competitions, setCompetitions] = useState<any[] | null>(null);
  const [error, setError] = useState<any | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [savedCompetitions, setSavedCompetitions] = useState<Set<string>>(
    new Set(),
  );
  const [savingCompetition, setSavingCompetition] = useState<string | null>(
    null,
  );
  const [prizeDialogOpen, setPrizeDialogOpen] = useState(false);
  const [selectedPrizeDescription, setSelectedPrizeDescription] = useState("");
  const router = useRouter();

  const handleSaveCompetition = async (competitionId: string) => {
    if (!user) {
      // Redirect to sign in if not authenticated
      router.push("/sign-in");
      return;
    }

    if (savedCompetitions.has(competitionId)) {
      // Competition is already saved, remove it
      setSavingCompetition(competitionId);
      try {
        const supabase = createClient();
        const { error } = await supabase
          .from("saved_competitions")
          .delete()
          .eq("user_id", user.id)
          .eq("competition_id", competitionId);

        if (error) throw error;

        // Update local state
        setSavedCompetitions((prev) => {
          const newSet = new Set(prev);
          newSet.delete(competitionId);
          return newSet;
        });
      } catch (error) {
        console.error("Error removing competition from saved:", error);
      } finally {
        setSavingCompetition(null);
      }
    } else {
      // Save the competition
      setSavingCompetition(competitionId);
      try {
        const supabase = createClient();
        const { error } = await supabase.from("saved_competitions").insert({
          user_id: user.id,
          competition_id: competitionId,
          saved_at: new Date().toISOString(),
        });

        if (error) throw error;

        // Update local state
        setSavedCompetitions((prev) => new Set([...prev, competitionId]));
      } catch (error) {
        console.error("Error saving competition:", error);
      } finally {
        setSavingCompetition(null);
      }
    }
  };

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      // Fetch competitions from Supabase
      try {
        const result = await supabase
          .from("competitions")
          .select(
            `
            *,
            competition_requirements_selected(
              requirement_option_id,
              requirement_options(
                id,
                name,
                description
              )
            )
          `,
          )
          .eq("status", "active")
          .order("created_at", { ascending: false });

        setCompetitions(result.data);
        setError(result.error);

        // If user is authenticated, fetch their saved competitions
        if (user) {
          const savedResult = await supabase
            .from("saved_competitions")
            .select("competition_id")
            .eq("user_id", user.id);

          if (savedResult.data) {
            const savedIds = new Set(
              savedResult.data.map((item) => item.competition_id),
            );
            setSavedCompetitions(savedIds);
          }
        }
      } catch (fetchError) {
        console.error("Error fetching competitions:", fetchError);
        setError(fetchError);
      }
    }

    fetchData();
  }, []);

  if (error) {
    console.error("Error fetching competitions:", error);
  }

  // Debug logging
  console.log("Competitions data:", competitions);
  console.log("Error:", error);

  // Ensure we have valid data and filter out null/undefined entries
  const competitionsData = Array.isArray(competitions)
    ? competitions.filter((comp) => comp && typeof comp === "object" && comp.id)
    : [];

  // Generate categories from actual data
  const categoryCount = competitionsData.reduce(
    (acc: Record<string, number>, comp) => {
      try {
        if (
          comp &&
          typeof comp === "object" &&
          comp.category &&
          typeof comp.category === "string" &&
          comp.category.trim().length > 0
        ) {
          const category = comp.category.trim();
          acc[category] = (acc[category] || 0) + 1;
        }
      } catch (categoryError) {
        console.warn(
          "Error processing category for competition:",
          comp?.id,
          categoryError,
        );
      }
      return acc;
    },
    {},
  );

  const categories = [
    { name: "All Categories", count: competitionsData.length },
    ...Object.entries(categoryCount).map(([name, count]) => ({ name, count })),
  ];

  return (
    <div className="min-h-screen bg-neuro-light">
      <Navbar />

      {/* Competition Directory Section */}
      <section
        id="competitions"
        className="py-16 bg-gradient-to-br from-purple-600 to-blue-600 text-white"
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Active Competitions
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Discover amazing competitions, showcase your talents, and win
              incredible prizes
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">
                  {competitionsData.length}
                </div>
                <div className="text-sm text-purple-100">
                  Active Competitions
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">
                  $
                  {competitionsData
                    .reduce((sum, comp) => {
                      try {
                        const amount =
                          comp && typeof comp.prize_amount === "number"
                            ? comp.prize_amount
                            : 0;
                        return sum + amount;
                      } catch {
                        return sum;
                      }
                    }, 0)
                    .toLocaleString()}
                </div>
                <div className="text-sm text-purple-100">Total Prizes</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">
                  {competitionsData.reduce((sum, comp) => {
                    try {
                      const participants =
                        comp && typeof comp.current_participants === "number"
                          ? comp.current_participants
                          : 0;
                      return sum + participants;
                    } catch {
                      return sum;
                    }
                  }, 0)}
                </div>
                <div className="text-sm text-purple-100">Participants</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">
                  {Object.keys(categoryCount).length}
                </div>
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
                  key={`category-${index}`}
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
      <section className="py-12 bg-neuro-light">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {competitionsData
              .map((competition, index) => {
                // Check if competition is valid
                if (
                  !competition ||
                  typeof competition !== "object" ||
                  !competition.id
                ) {
                  console.warn(
                    "Invalid competition data at index",
                    index,
                    ":",
                    competition,
                  );
                  return null;
                }

                try {
                  // Safe date formatting function
                  const formatDeadline = (deadline: any) => {
                    if (
                      !deadline ||
                      deadline === null ||
                      deadline === undefined
                    )
                      return "TBD";
                    try {
                      const date = new Date(deadline);
                      if (isNaN(date.getTime())) {
                        return "TBD";
                      }
                      return date.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      });
                    } catch (error) {
                      console.warn(
                        "Error formatting date for competition",
                        competition.id,
                        ":",
                        error,
                      );
                      return "TBD";
                    }
                  };

                  // Safe requirements formatting from requirement_options table - each as single sentence
                  const formatRequirements = (requirementsSelected: any) => {
                    try {
                      if (
                        !requirementsSelected ||
                        requirementsSelected === null ||
                        requirementsSelected === undefined ||
                        !Array.isArray(requirementsSelected) ||
                        requirementsSelected.length === 0
                      ) {
                        return [
                          "Requirements will be provided upon registration.",
                        ];
                      }

                      const validRequirements = requirementsSelected
                        .filter(
                          (req) =>
                            req &&
                            typeof req === "object" &&
                            req !== null &&
                            req.requirement_options &&
                            typeof req.requirement_options === "object",
                        )
                        .map((req) => {
                          try {
                            const option = req.requirement_options;
                            let text = option.description || option.name || "";
                            // Ensure single sentence - remove extra periods and add one at the end
                            text = text.trim().replace(/\.+$/, "") + ".";
                            return text;
                          } catch {
                            return "";
                          }
                        })
                        .filter(
                          (desc) =>
                            desc &&
                            typeof desc === "string" &&
                            desc.trim().length > 0,
                        );

                      return validRequirements.length > 0
                        ? validRequirements
                        : ["Requirements will be provided upon registration."];
                    } catch (error) {
                      console.warn(
                        "Error formatting requirements for competition",
                        competition.id,
                        ":",
                        error,
                      );
                      return [
                        "Requirements will be provided upon registration.",
                      ];
                    }
                  };

                  // Safe rules formatting from competitions.rules field
                  const formatRules = (rulesText: any) => {
                    try {
                      if (
                        !rulesText ||
                        rulesText === null ||
                        rulesText === undefined ||
                        typeof rulesText !== "string" ||
                        rulesText.trim().length === 0
                      ) {
                        return "Rules will be provided upon registration.";
                      }

                      return rulesText.trim();
                    } catch (error) {
                      console.warn(
                        "Error formatting rules for competition",
                        competition.id,
                        ":",
                        error,
                      );
                      return "Rules will be provided upon registration.";
                    }
                  };

                  // Format the data to match the expected structure
                  const formattedCompetition = {
                    id: competition.id || `temp-${index}`,
                    title:
                      competition.title &&
                      typeof competition.title === "string" &&
                      competition.title.trim()
                        ? competition.title.trim()
                        : "Untitled Competition",
                    description:
                      competition.description &&
                      typeof competition.description === "string" &&
                      competition.description.trim()
                        ? competition.description.trim()
                        : competition.detailed_description &&
                            typeof competition.detailed_description ===
                              "string" &&
                            competition.detailed_description.trim()
                          ? competition.detailed_description.trim()
                          : "No description available",
                    thumbnail:
                      competition.thumbnail_url &&
                      typeof competition.thumbnail_url === "string" &&
                      competition.thumbnail_url.trim()
                        ? competition.thumbnail_url.trim()
                        : competition.banner_url &&
                            typeof competition.banner_url === "string" &&
                            competition.banner_url.trim()
                          ? competition.banner_url.trim()
                          : "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&q=80",
                    prize:
                      competition.prize_amount &&
                      typeof competition.prize_amount === "number" &&
                      !isNaN(competition.prize_amount)
                        ? `${competition.prize_amount.toLocaleString()}`
                        : "TBD",
                    prizeDescription:
                      competition.prize_description &&
                      typeof competition.prize_description === "string" &&
                      competition.prize_description.trim()
                        ? competition.prize_description.trim()
                        : "No prize description available",
                    termsConditionsUrl:
                      competition.terms_conditions_url &&
                      typeof competition.terms_conditions_url === "string" &&
                      competition.terms_conditions_url.trim()
                        ? competition.terms_conditions_url.trim()
                        : null,
                    deadline: formatDeadline(competition.submission_deadline),
                    category:
                      competition.category &&
                      typeof competition.category === "string" &&
                      competition.category.trim()
                        ? competition.category.trim()
                        : "Uncategorized",
                    difficulty:
                      competition.difficulty_level &&
                      typeof competition.difficulty_level === "string" &&
                      competition.difficulty_level.trim()
                        ? competition.difficulty_level.trim()
                        : "Not specified",
                    organizer:
                      competition.organizer_name &&
                      typeof competition.organizer_name === "string" &&
                      competition.organizer_name.trim()
                        ? competition.organizer_name.trim()
                        : competition.organizer &&
                            typeof competition.organizer === "string" &&
                            competition.organizer.trim()
                          ? competition.organizer.trim()
                          : "Unknown Organizer",
                    requirements: formatRequirements(
                      competition.competition_requirements_selected,
                    ),
                    rules: formatRules(competition.rules),
                    featured: competition.featured === true,
                  };

                  return (
                    <FlipCard
                      key={`competition-${formattedCompetition.id}-${index}`}
                      className={`w-full ${formattedCompetition.featured ? "h-[550px]" : "h-[500px]"}`}
                      frontContent={
                        <Card className="bg-neuro-light shadow-neuro hover:shadow-neuro-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden w-full h-full">
                          {formattedCompetition.featured && (
                            <CardHeader className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white py-2 px-4">
                              <div className="flex items-center justify-center gap-2">
                                <Star className="w-5 h-5 fill-current" />
                                <span className="font-bold text-sm">
                                  FEATURED COMPETITION
                                </span>
                                <Star className="w-5 h-5 fill-current" />
                              </div>
                            </CardHeader>
                          )}
                          <div className="relative">
                            <img
                              src={formattedCompetition.thumbnail}
                              alt={formattedCompetition.title}
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute top-4 left-4 flex gap-2">
                              <Badge className="bg-white/90 text-gray-900 hover:bg-white">
                                {formattedCompetition.category || "Category"}
                              </Badge>
                              <Badge className="bg-blue-100/90 text-blue-800 hover:bg-blue-100">
                                {formattedCompetition.difficulty ||
                                  "Not specified"}
                              </Badge>
                            </div>
                          </div>

                          <CardHeader>
                            <CardTitle className="text-xl mb-2">
                              {formattedCompetition.title}
                            </CardTitle>
                            <CardDescription className="text-gray-600">
                              {formattedCompetition.description}
                            </CardDescription>
                          </CardHeader>

                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-1 text-green-600">
                                <DollarSign className="w-4 h-4" />
                                <span className="font-semibold">
                                  {formattedCompetition.prize}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-orange-600">
                                <Calendar className="w-4 h-4" />
                                <span>{formattedCompetition.deadline}</span>
                              </div>
                            </div>

                            <div className="flex items-center text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>by {formattedCompetition.organizer}</span>
                              </div>
                            </div>
                          </CardContent>

                          <CardFooter
                            className="flex gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                              onClick={() => {
                                const bannerUrl = competition.banner_url;
                                if (
                                  bannerUrl &&
                                  typeof bannerUrl === "string" &&
                                  bannerUrl.trim()
                                ) {
                                  window.open(bannerUrl.trim(), "_blank");
                                }
                              }}
                            >
                              Go to competition
                            </Button>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                      handleSaveCompetition(
                                        formattedCompetition.id,
                                      )
                                    }
                                    disabled={
                                      savingCompetition ===
                                      formattedCompetition.id
                                    }
                                    className={
                                      savedCompetitions.has(
                                        formattedCompetition.id,
                                      )
                                        ? "bg-yellow-100 text-yellow-600 border-yellow-300"
                                        : ""
                                    }
                                  >
                                    {savingCompetition ===
                                    formattedCompetition.id ? (
                                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    ) : (
                                      <Star
                                        className={`w-4 h-4 ${savedCompetitions.has(formattedCompetition.id) ? "fill-current" : ""}`}
                                      />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {savedCompetitions.has(
                                      formattedCompetition.id,
                                    )
                                      ? "Remove from saved competitions"
                                      : "Save to my competitions"}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Prize Description</DialogTitle>
                                  <DialogDescription>
                                    Details about the prize for this competition
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="mt-4 space-y-4">
                                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                                    {formattedCompetition.prizeDescription}
                                  </p>
                                  {formattedCompetition.termsConditionsUrl && (
                                    <div className="pt-3 border-t">
                                      <p className="text-sm font-medium text-gray-900 mb-2">
                                        Terms & Conditions
                                      </p>
                                      <a
                                        href={
                                          formattedCompetition.termsConditionsUrl
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:text-blue-800 underline break-all"
                                      >
                                        {
                                          formattedCompetition.termsConditionsUrl
                                        }
                                      </a>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </CardFooter>
                        </Card>
                      }
                      backContent={
                        <CompetitionDetailsCard
                          requirements={formattedCompetition.requirements}
                          rules={formattedCompetition.rules}
                        />
                      }
                    />
                  );
                } catch (renderError) {
                  console.error(
                    "Error rendering competition at index",
                    index,
                    ":",
                    renderError,
                    competition,
                  );
                  return null;
                }
              })
              .filter(Boolean)}
          </div>
        </div>
      </section>

      {/* Debug Section - Remove this after testing */}
      <section className="py-8 bg-gray-100 text-center">
        <div className="container mx-auto px-4">
          <p className="text-sm text-gray-600">
            Debug: Found {competitionsData.length} competitions
            {error && ` | Error: ${error.message}`}
          </p>
        </div>
      </section>

      {/* Load More Section */}
      {competitionsData.length === 0 ? (
        <section className="py-16 text-center bg-neuro-light">
          <div className="text-gray-500 text-lg">
            No competitions available at the moment. Check back soon!
            {error && (
              <div className="text-red-500 text-sm mt-2">
                Error: {error.message}
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="py-8 text-center bg-neuro-light">
          <Button
            variant="outline"
            size="lg"
            className="shadow-neuro hover:shadow-neuro-lg"
          >
            Load More Competitions
          </Button>
        </section>
      )}

      <Hero />

      {/* Features Section */}
      <section className="py-24 bg-neuro-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Why Compete With Us?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join the ultimate platform for creative competitions with fair
              judging, amazing prizes, and a supportive community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Trophy className="w-6 h-6" />,
                title: "Amazing Prizes",
                description: "Win cash, products, and exclusive opportunities",
              },
              {
                icon: <Target className="w-6 h-6" />,
                title: "Fair Judging",
                description: "Transparent evaluation by industry experts",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Global Community",
                description: "Connect with creators from around the world",
              },
              {
                icon: <Star className="w-6 h-6" />,
                title: "All Skill Levels",
                description: "Competitions for beginners to professionals",
              },
            ].map((feature, index) => (
              <div
                key={`feature-${index}`}
                className="p-6 bg-neuro-light rounded-xl shadow-neuro hover:shadow-neuro-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="text-purple-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-neuro-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Getting started is simple. Follow these easy steps to join
              competitions and start winning.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Browse & Filter",
                description:
                  "Find competitions that match your skills and interests using our smart filters",
              },
              {
                step: "2",
                title: "Submit Your Entry",
                description:
                  "Upload your work following the competition guidelines and requirements",
              },
              {
                step: "3",
                title: "Win & Celebrate",
                description:
                  "Get judged by experts and win amazing prizes while building your portfolio",
              },
            ].map((item, index) => (
              <div key={`step-${index}`} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 shadow-neuro">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Competing?</h2>
          <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already showcasing their talents
            and winning amazing prizes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center px-8 py-4 text-purple-600 bg-white rounded-xl hover:bg-gray-100 transition-colors text-lg font-medium shadow-neuro"
            >
              Sign Up Free
              <ArrowUpRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/member"
              className="inline-flex items-center px-8 py-4 text-gray-700 bg-neuro-light rounded-xl shadow-neuro hover:shadow-neuro-lg transition-all duration-300 text-lg font-medium transform hover:-translate-y-1"
            >
              View Member Portal
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
