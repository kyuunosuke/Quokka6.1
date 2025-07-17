"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../../supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Edit,
  Archive,
  Trash2,
  ExternalLink,
  Users,
  Calendar,
  DollarSign,
} from "lucide-react";
import { Tables } from "@/types/supabase";
import CompetitionForm from "./CompetitionForm";
import { archiveCompetition, deleteCompetition } from "../actions";
import { useToast } from "@/components/ui/use-toast";

type Competition = Tables<"competitions">;

interface CompetitionModuleProps {
  filters: {
    search: string;
    status: string;
    category: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
  };
}

export default function CompetitionModule({ filters }: CompetitionModuleProps) {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompetition, setSelectedCompetition] =
    useState<Competition | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    fetchCompetitions();
  }, [filters]);

  const fetchCompetitions = async () => {
    setLoading(true);
    try {
      let query = supabase.from("competitions").select("*");

      // Apply filters
      if (filters.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`,
        );
      }
      if (filters.status !== "all") {
        query = query.eq("status", filters.status);
      }
      if (filters.category !== "all") {
        query = query.eq("category", filters.category);
      }

      // Apply sorting
      query = query.order(filters.sortBy, {
        ascending: filters.sortOrder === "asc",
      });

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching competitions:", error);
        toast({
          title: "Error",
          description: "Failed to fetch competitions",
          variant: "destructive",
        });
      } else {
        setCompetitions(data || []);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: "secondary" as const, label: "Draft" },
      active: { variant: "default" as const, label: "Active" },
      submission_closed: { variant: "outline" as const, label: "Closed" },
      judging: { variant: "secondary" as const, label: "Judging" },
      completed: { variant: "outline" as const, label: "Completed" },
      cancelled: { variant: "destructive" as const, label: "Cancelled" },
    };
    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number | null, currency: string | null) => {
    if (!amount) return "Free";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  };

  const handleArchive = async (competitionId: string) => {
    try {
      await archiveCompetition(competitionId);
      fetchCompetitions();
      toast({
        title: "Success",
        description: "Competition archived successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to archive competition",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (competitionId: string) => {
    try {
      await deleteCompetition(competitionId);
      fetchCompetitions();
      toast({
        title: "Success",
        description: "Competition deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete competition",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading competitions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Competition Management</h2>
          <p className="text-muted-foreground">
            Manage all competitions - {competitions.length} total
          </p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Competition
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Competition</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new competition.
              </DialogDescription>
            </DialogHeader>
            <CompetitionForm
              onClose={() => setShowForm(false)}
              onSuccess={() => fetchCompetitions()}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Competitions
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{competitions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {competitions.filter((c) => c.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Participants
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {competitions.reduce(
                (sum, c) => sum + (c.current_participants || 0),
                0,
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Prize Pool
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {competitions
                .reduce((sum, c) => sum + (c.prize_amount || 0), 0)
                .toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Competitions Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Competitions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Prize</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {competitions.map((competition) => (
                  <TableRow key={competition.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{competition.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {competition.description?.substring(0, 60)}...
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{competition.category}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(competition.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div>Start: {formatDate(competition.start_date)}</div>
                        <div>End: {formatDate(competition.end_date)}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatCurrency(
                        competition.prize_amount,
                        competition.prize_currency,
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {competition.current_participants || 0}
                        {competition.max_participants &&
                          ` / ${competition.max_participants}`}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedCompetition(competition);
                            setShowEditForm(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        {competition.status !== "cancelled" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Archive className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Archive Competition
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will mark the competition as cancelled.
                                  This action can be undone by editing the
                                  competition.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleArchive(competition.id)}
                                >
                                  Archive
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Competition
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the competition and all
                                associated data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(competition.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        {competition.thumbnail_url && (
                          <Button variant="ghost" size="sm" asChild>
                            <a
                              href={competition.thumbnail_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Competition</DialogTitle>
            <DialogDescription>
              Update the competition details.
            </DialogDescription>
          </DialogHeader>
          {selectedCompetition && (
            <CompetitionForm
              competition={selectedCompetition}
              onClose={() => {
                setShowEditForm(false);
                setSelectedCompetition(null);
              }}
              onSuccess={() => fetchCompetitions()}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
