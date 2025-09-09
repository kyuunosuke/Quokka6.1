"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { RefreshCw, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { updateCompetitionStatuses, getExpiredCompetitions, manuallyCompleteCompetition } from "@/utils/competition-status";

interface ExpiredCompetition {
  id: string;
  title: string;
  end_date: string;
  status: string;
  organizer_name: string | null;
}

export default function CompetitionStatusManager() {
  const [expiredCompetitions, setExpiredCompetitions] = useState<ExpiredCompetition[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchExpiredCompetitions = async () => {
    setLoading(true);
    try {
      const result = await getExpiredCompetitions();
      if (result.success && result.data) {
        setExpiredCompetitions(result.data);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to fetch expired competitions",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAllStatuses = async () => {
    setUpdating("all");
    try {
      const result = await updateCompetitionStatuses();
      if (result.success) {
        toast({
          title: "Success",
          description: result.message || "Competition statuses updated successfully",
        });
        // Refresh the list
        await fetchExpiredCompetitions();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update competition statuses",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const handleManualComplete = async (competitionId: string) => {
    setUpdating(competitionId);
    try {
      const result = await manuallyCompleteCompetition(competitionId);
      if (result.success) {
        toast({
          title: "Success",
          description: "Competition marked as completed",
        });
        // Remove from the list
        setExpiredCompetitions(prev => prev.filter(comp => comp.id !== competitionId));
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update competition status",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysOverdue = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = today.getTime() - end.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  useEffect(() => {
    fetchExpiredCompetitions();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Competition Status Management</h2>
          <p className="text-muted-foreground">
            Monitor and update competition statuses automatically
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={fetchExpiredCompetitions}
            variant="outline"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={handleUpdateAllStatuses}
            disabled={updating === "all"}
          >
            {updating === "all" ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            Update All Statuses
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Expired Competitions
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiredCompetitions.length}</div>
            <p className="text-xs text-muted-foreground">
              Competitions past end date
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Auto-Update Status
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">
              Database triggers enabled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Last Check
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Now</div>
            <p className="text-xs text-muted-foreground">
              Real-time monitoring
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Competitions Requiring Status Update</CardTitle>
          <CardDescription>
            These competitions have passed their end date but are not marked as completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading...</span>
            </div>
          ) : expiredCompetitions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p className="text-lg font-medium">All competitions are up to date!</p>
              <p className="text-sm">No competitions require status updates.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {expiredCompetitions.map((competition) => {
                const daysOverdue = getDaysOverdue(competition.end_date);
                return (
                  <div
                    key={competition.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{competition.title}</h3>
                        <Badge variant="secondary">{competition.status}</Badge>
                        {daysOverdue > 0 && (
                          <Badge variant="destructive">
                            {daysOverdue} day{daysOverdue > 1 ? 's' : ''} overdue
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>Organizer: {competition.organizer_name || 'Unknown'}</p>
                        <p>End Date: {formatDate(competition.end_date)}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleManualComplete(competition.id)}
                      disabled={updating === competition.id}
                      size="sm"
                    >
                      {updating === competition.id ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        "Mark Complete"
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}