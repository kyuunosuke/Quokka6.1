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
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Heart,
  Calendar,
  DollarSign,
  Users,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { createClient } from "../../supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface LikedCompetitionsProps {
  competitions: any[];
  title?: string;
}

export default function LikedCompetitions({
  competitions = [],
  title = "Liked Competitions",
}: LikedCompetitionsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const handleUnlike = async (competitionId: string, savedId: string) => {
    setLoading(savedId);
    try {
      const { error } = await supabase
        .from("saved_competitions")
        .delete()
        .eq("id", savedId);

      if (error) throw error;

      router.refresh();
    } catch (error) {
      console.error("Error removing from liked:", error);
    } finally {
      setLoading(null);
    }
  };

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrize = (totalPrize: string | null) => {
    if (!totalPrize || totalPrize.trim().length === 0) return "No prize specified";
    return totalPrize.trim();
  };

  if (competitions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Heart className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Liked Competitions</h3>
          <p className="text-muted-foreground text-center mb-4">
            You haven't liked any competitions yet. Start exploring and save
            your favorites!
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
            {competitions.length} competition
            {competitions.length !== 1 ? "s" : ""} saved
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {competitions.map((item) => {
          const competition = item.competitions;
          if (!competition) return null;

          return (
            <Card
              key={item.id}
              className="group hover:shadow-lg transition-all duration-200"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant="outline"
                        className={getStatusColor(competition.status)}
                      >
                        {competition.status}
                      </Badge>
                      <Badge variant="secondary">{competition.category}</Badge>
                    </div>
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                      {competition.title}
                    </CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUnlike(competition.id, item.id)}
                    disabled={loading === item.id}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    {loading === item.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <Heart className="h-4 w-4 fill-current" />
                    )}
                  </Button>
                </div>

                {competition.thumbnail_url && (
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    <img
                      src={competition.thumbnail_url}
                      alt={competition.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                <CardDescription className="line-clamp-3">
                  {competition.description || "No description available"}
                </CardDescription>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Ends: {formatDate(competition.end_date)}</span>
                  </div>

                  {competition.total_prize && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span>
                        {formatPrize(competition.total_prize)}
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

                {item.notes && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-1">Your Notes:</p>
                    <p className="text-sm text-muted-foreground">
                      {item.notes}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-muted-foreground">
                    Saved {formatDate(item.saved_at)}
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/competitions/${competition.id}`}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}