"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  Calendar,
  DollarSign,
  Users,
  ExternalLink,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface JoinedCompetitionsProps {
  submissions: any[];
  title?: string;
}

export default function JoinedCompetitions({
  submissions = [],
  title = "Joined Competitions",
}: JoinedCompetitionsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-green-100 text-green-800 border-green-200";
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <CheckCircle className="h-4 w-4" />;
      case "draft":
        return <FileText className="h-4 w-4" />;
      case "in_progress":
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getCompetitionStatusColor = (status: string) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrize = (amount: number, currency: string) => {
    if (!amount) return "No prize specified";
    return `${currency || "$"}${amount.toLocaleString()}`;
  };

  const calculateTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return "Ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} day${days !== 1 ? "s" : ""} left`;
    if (hours > 0) return `${hours} hour${hours !== 1 ? "s" : ""} left`;
    return "Less than 1 hour left";
  };

  const calculateProgress = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();

    const progress = Math.max(0, Math.min(100, (elapsed / total) * 100));
    return Math.round(progress);
  };

  if (submissions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {title === "Past Competitions"
              ? "No Past Competitions"
              : "No Active Competitions"}
          </h3>
          <p className="text-muted-foreground text-center mb-4">
            {title === "Past Competitions"
              ? "You haven't completed any competitions yet."
              : "You haven't joined any active competitions yet. Start participating!"}
          </p>
          <Button disabled className="opacity-50 cursor-not-allowed">
            Browse Competitions
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground">
            {submissions.length} competition
            {submissions.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {submissions.map((submission) => {
          const competition = submission.competitions;
          if (!competition) return null;

          const timeRemaining = calculateTimeRemaining(competition.end_date);
          const progress = calculateProgress(
            competition.start_date,
            competition.end_date,
          );

          return (
            <Card
              key={submission.id}
              className="group hover:shadow-lg transition-all duration-200"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={getCompetitionStatusColor(competition.status)}
                    >
                      {competition.status}
                    </Badge>
                    <Badge variant="secondary">{competition.category}</Badge>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${getStatusColor(submission.status)} flex items-center gap-1`}
                  >
                    {getStatusIcon(submission.status)}
                    {submission.status.replace("_", " ")}
                  </Badge>
                </div>

                <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                  {competition.title}
                </CardTitle>

                {competition.thumbnail_url && (
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted mt-3">
                    <img
                      src={competition.thumbnail_url}
                      alt={competition.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                <CardDescription className="line-clamp-2">
                  {competition.description || "No description available"}
                </CardDescription>

                {/* Submission Details */}
                <div className="p-3 bg-muted rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Your Submission:
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {submission.team_name && `Team: ${submission.team_name}`}
                    </span>
                  </div>
                  <p className="text-sm font-semibold">
                    {submission.submission_title}
                  </p>
                  {submission.submission_description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {submission.submission_description}
                    </p>
                  )}
                  {submission.submitted_at && (
                    <p className="text-xs text-muted-foreground">
                      Submitted on {formatDate(submission.submitted_at)}
                    </p>
                  )}
                </div>

                {/* Competition Progress */}
                {competition.status === "active" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Competition Progress
                      </span>
                      <span className="font-medium">{timeRemaining}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {competition.status === "completed"
                        ? `Ended: ${formatDate(competition.end_date)}`
                        : `Ends: ${formatDate(competition.end_date)}`}
                    </span>
                  </div>

                  {competition.prize_amount && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span>
                        {formatPrize(
                          competition.prize_amount,
                          competition.prize_currency,
                        )}
                      </span>
                    </div>
                  )}

                  {competition.current_participants && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>
                        {competition.current_participants} participants
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-muted-foreground">
                    Joined {formatDate(submission.created_at)}
                  </div>
                  <div className="flex gap-2">
                    {submission.status !== "submitted" &&
                      competition.status === "active" && (
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          Edit Submission
                        </Button>
                      )}
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/competitions/${competition.id}`}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Competition
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
