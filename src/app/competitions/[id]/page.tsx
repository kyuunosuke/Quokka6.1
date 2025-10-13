import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  DollarSign,
  Users,
  Trophy,
  Target,
  ExternalLink,
  ArrowLeft,
  Clock,
  MapPin,
  FileText,
  Star,
} from "lucide-react";
import Navbar from "@/components/navbar";

interface CompetitionPageProps {
  params: Promise<{ id: string }>;
}

export default async function CompetitionPage({
  params,
}: CompetitionPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch competition data with related requirements
  const { data: competition, error } = await supabase
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
    .eq("id", id)
    .single();

  if (error || !competition) {
    notFound();
  }

  // Format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format prize
  const formatPrize = (totalPrize: string | null) => {
    if (!totalPrize || totalPrize.trim().length === 0) return "Prize TBD";
    return totalPrize.trim();
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Calculate time remaining
  const calculateTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return "Competition ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} day${days !== 1 ? "s" : ""} remaining`;
    if (hours > 0) return `${hours} hour${hours !== 1 ? "s" : ""} remaining`;
    return "Less than 1 hour remaining";
  };

  // Format requirements
  const formatRequirements = (requirementsSelected: any[]) => {
    if (!requirementsSelected || requirementsSelected.length === 0) {
      return ["Requirements will be provided upon registration."];
    }

    return requirementsSelected
      .filter(
        (req) =>
          req &&
          req.requirement_options &&
          (req.requirement_options.description || req.requirement_options.name),
      )
      .map((req) => {
        const option = req.requirement_options;
        return option.description || option.name || "";
      })
      .filter((desc) => desc.trim().length > 0);
  };

  const requirements = formatRequirements(
    competition.competition_requirements_selected,
  );
  const timeRemaining = calculateTimeRemaining(competition.end_date);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            href="/member"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        {/* Competition Header */}
        <div className="mb-8">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge
                variant="outline"
                className={getStatusColor(competition.status)}
              >
                {competition.status}
              </Badge>
              <Badge variant="secondary">{competition.category}</Badge>
              {competition.featured && (
                <Badge className="bg-yellow-500 text-yellow-900">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {competition.title}
            </h1>
            <p className="text-muted-foreground text-lg">
              by {competition.organizer_name || "Unknown Organizer"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  About This Competition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    {competition.description ||
                      "No description available for this competition."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Entry Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {requirements.map((requirement, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <p className="text-muted-foreground">{requirement}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Rules */}
            {competition.rules && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Competition Rules
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {competition.rules}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Terms & Conditions */}
            {competition.terms_conditions_url && (
              <Card>
                <CardHeader>
                  <CardTitle>Terms & Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" asChild>
                    <a
                      href={competition.terms_conditions_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Terms & Conditions
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Competition Info */}
            <Card>
              <CardHeader>
                <CardTitle>Competition Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Prize */}
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-semibold">
                      {formatPrize(competition.total_prize)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Prize</p>
                  </div>
                </div>

                <Separator />

                {/* Dates */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-semibold">Start Date</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(competition.start_date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-semibold">End Date</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(competition.end_date)}
                      </p>
                    </div>
                  </div>
                  {competition.submission_deadline && (
                    <div className="flex items-center gap-3">
                      <Target className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-semibold">Submission Deadline</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(competition.submission_deadline)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Additional Info */}
                <div className="space-y-3">
                  {competition.current_participants && (
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-semibold">
                          {competition.current_participants} participants
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Currently joined
                        </p>
                      </div>
                    </div>
                  )}

                  {competition.difficulty_level && (
                    <div className="flex items-center gap-3">
                      <Target className="h-5 w-5 text-indigo-600" />
                      <div>
                        <p className="font-semibold">
                          {competition.difficulty_level}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Difficulty Level
                        </p>
                      </div>
                    </div>
                  )}

                  {competition.type_of_game && (
                    <div className="flex items-center gap-3">
                      <Trophy className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="font-semibold">{competition.type_of_game}</p>
                        <p className="text-sm text-muted-foreground">
                          Game Type
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Time Remaining */}
            {competition.status === "active" && (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <p className="font-semibold text-orange-900">
                      {timeRemaining}
                    </p>
                    <p className="text-sm text-orange-700">Time remaining</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Prize Description */}
            {competition.prize_description && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Prize Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {competition.prize_description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/member">Back to Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}