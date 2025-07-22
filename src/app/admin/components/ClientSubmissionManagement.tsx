"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Calendar,
  DollarSign,
  Users,
  Building2,
  Mail,
  Globe,
  Tag,
  AlertCircle,
  MessageSquare,
  Trash2,
  Edit,
  Send,
  RefreshCw,
} from "lucide-react";
import { createClient } from "../../../../supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ClientSubmission {
  id: string;
  title: string;
  description: string;
  detailed_description?: string;
  category: string;
  subcategory?: string;
  status: string;
  client_id: string;
  organizer_name: string;
  organizer_email: string;
  organizer_website?: string;
  company_name?: string;
  company_description?: string;
  start_date: string;
  end_date: string;
  submission_deadline: string;
  judging_start_date?: string;
  judging_end_date?: string;
  winner_announcement_date?: string;
  prize_amount?: number;
  prize_currency?: string;
  prize_description?: string;
  max_participants?: number;
  is_team_competition?: boolean;
  min_team_size?: number;
  max_team_size?: number;
  entry_fee?: number;
  difficulty_level?: string;
  thumbnail_url?: string;
  banner_url?: string;
  rules?: string;
  terms_conditions_url?: string;
  tags?: string[];
  admin_notes?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at?: string;
  submitted_at?: string;
  reviewed_at?: string;
  approved_at?: string;
  published_at?: string;
  profiles?: {
    full_name?: string;
    email?: string;
    company_name?: string;
  };
}

export default function ClientSubmissionManagement() {
  const [submissions, setSubmissions] = useState<ClientSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] =
    useState<ClientSubmission | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    category: "all",
    sortBy: "created_at",
    sortOrder: "desc" as "asc" | "desc",
  });

  const supabase = createClient();
  const { toast } = useToast();

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "draft", label: "Draft" },
    { value: "submitted", label: "Submitted" },
    { value: "under_review", label: "Under Review" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "published", label: "Published" },
  ];

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "Technology", label: "Technology" },
    { value: "Design", label: "Design" },
    { value: "Business", label: "Business" },
    { value: "Marketing", label: "Marketing" },
    { value: "Education", label: "Education" },
    { value: "Health", label: "Health" },
    { value: "Environment", label: "Environment" },
    { value: "Arts", label: "Arts" },
    { value: "Sports", label: "Sports" },
    { value: "Gaming", label: "Gaming" },
    { value: "Other", label: "Other" },
  ];

  const sortOptions = [
    { value: "created_at", label: "Created Date" },
    { value: "updated_at", label: "Updated Date" },
    { value: "submitted_at", label: "Submitted Date" },
    { value: "title", label: "Title" },
    { value: "status", label: "Status" },
    { value: "category", label: "Category" },
  ];

  useEffect(() => {
    fetchSubmissions();
  }, [filters]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      let query = supabase.from("client_submissions").select(`
          *,
          profiles:client_id (
            full_name,
            email,
            company_name
          )
        `);

      // Apply filters
      if (filters.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,organizer_name.ilike.%${filters.search}%,company_name.ilike.%${filters.search}%`,
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

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast({
        title: "Error",
        description: "Failed to fetch client submissions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    submissionId: string,
    newStatus: string,
    notes?: string,
    rejectionReason?: string,
  ) => {
    try {
      setActionLoading(true);
      const updateData: any = {
        status: newStatus,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (notes) {
        updateData.admin_notes = notes;
      }

      if (rejectionReason) {
        updateData.rejection_reason = rejectionReason;
      }

      if (newStatus === "approved") {
        updateData.approved_at = new Date().toISOString();
      }

      if (newStatus === "published") {
        updateData.published_at = new Date().toISOString();
        // Also create the competition in the competitions table
        const submission = submissions.find((s) => s.id === submissionId);
        if (submission) {
          const competitionData = {
            title: submission.title,
            description: submission.description,
            detailed_description: submission.detailed_description,
            category: submission.category,
            subcategory: submission.subcategory,
            start_date: submission.start_date,
            end_date: submission.end_date,
            submission_deadline: submission.submission_deadline,
            judging_start_date: submission.judging_start_date,
            judging_end_date: submission.judging_end_date,
            winner_announcement_date: submission.winner_announcement_date,
            prize_amount: submission.prize_amount,
            prize_currency: submission.prize_currency,
            prize_description: submission.prize_description,
            max_participants: submission.max_participants,
            is_team_competition: submission.is_team_competition,
            min_team_size: submission.min_team_size,
            max_team_size: submission.max_team_size,
            entry_fee: submission.entry_fee,
            difficulty_level: submission.difficulty_level || "beginner",
            thumbnail_url: submission.thumbnail_url,
            banner_url: submission.banner_url,
            rules: submission.rules,
            terms_conditions_url: submission.terms_conditions_url,
            tags: submission.tags,
            organizer_name: submission.organizer_name,
            organizer_email: submission.organizer_email,
            organizer_website: submission.organizer_website,
            status: "active",
            current_participants: 0,
          };

          const { error: competitionError } = await supabase
            .from("competitions")
            .insert(competitionData);

          if (competitionError) {
            console.error("Error creating competition:", competitionError);
            throw competitionError;
          }
        }
      }

      const { error } = await supabase
        .from("client_submissions")
        .update(updateData)
        .eq("id", submissionId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Submission ${newStatus} successfully`,
      });

      fetchSubmissions();
      setReviewDialogOpen(false);
      setSelectedSubmission(null);
      setAdminNotes("");
      setRejectionReason("");
    } catch (error) {
      console.error("Error updating submission:", error);
      toast({
        title: "Error",
        description: "Failed to update submission status",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSubmission = async (submissionId: string) => {
    try {
      setActionLoading(true);
      const { error } = await supabase
        .from("client_submissions")
        .delete()
        .eq("id", submissionId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Submission deleted successfully",
      });

      fetchSubmissions();
      setDeleteDialogOpen(false);
      setSelectedSubmission(null);
    } catch (error) {
      console.error("Error deleting submission:", error);
      toast({
        title: "Error",
        description: "Failed to delete submission",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "submitted":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "under_review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "published":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <FileText className="h-4 w-4" />;
      case "submitted":
      case "under_review":
        return <Clock className="h-4 w-4" />;
      case "approved":
      case "published":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrize = (amount?: number, currency?: string) => {
    if (!amount) return "No prize specified";
    return `${currency || "$"}${amount.toLocaleString()}`;
  };

  const stats = {
    total: submissions.length,
    draft: submissions.filter((s) => s.status === "draft").length,
    submitted: submissions.filter((s) => s.status === "submitted").length,
    under_review: submissions.filter((s) => s.status === "under_review").length,
    approved: submissions.filter((s) => s.status === "approved").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
    published: submissions.filter((s) => s.status === "published").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Client Submission Management</h1>
          <p className="text-muted-foreground">
            Review and manage competition submissions from clients
          </p>
        </div>
        <Button onClick={fetchSubmissions} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
              <p className="text-sm text-muted-foreground">Draft</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {stats.submitted}
              </p>
              <p className="text-sm text-muted-foreground">Submitted</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {stats.under_review}
              </p>
              <p className="text-sm text-muted-foreground">Under Review</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {stats.approved}
              </p>
              <p className="text-sm text-muted-foreground">Approved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {stats.rejected}
              </p>
              <p className="text-sm text-muted-foreground">Rejected</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {stats.published}
              </p>
              <p className="text-sm text-muted-foreground">Published</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search submissions..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters({ ...filters, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={filters.category}
                onValueChange={(value) =>
                  setFilters({ ...filters, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sortBy">Sort By</Label>
              <Select
                value={filters.sortBy}
                onValueChange={(value) =>
                  setFilters({ ...filters, sortBy: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sortOrder">Order</Label>
              <Select
                value={filters.sortOrder}
                onValueChange={(value: "asc" | "desc") =>
                  setFilters({ ...filters, sortOrder: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Newest First</SelectItem>
                  <SelectItem value="asc">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      <Card>
        <CardHeader>
          <CardTitle>Submissions ({submissions.length})</CardTitle>
          <CardDescription>All client competition submissions</CardDescription>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No submissions found
              </h3>
              <p className="text-muted-foreground">
                No client submissions match your current filters
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <Card
                  key={submission.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        {/* Header */}
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant="outline"
                                className={getStatusColor(submission.status)}
                              >
                                {getStatusIcon(submission.status)}
                                <span className="ml-1">
                                  {submission.status.charAt(0).toUpperCase() +
                                    submission.status
                                      .slice(1)
                                      .replace("_", " ")}
                                </span>
                              </Badge>
                              <Badge variant="secondary">
                                {submission.category}
                              </Badge>
                              {submission.subcategory && (
                                <Badge variant="outline">
                                  {submission.subcategory}
                                </Badge>
                              )}
                            </div>
                            <h3 className="text-lg font-semibold line-clamp-1">
                              {submission.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {submission.description}
                            </p>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">
                                {submission.organizer_name}
                              </p>
                              <p className="text-muted-foreground">
                                {submission.company_name || "No company"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Contact</p>
                              <p className="text-muted-foreground">
                                {submission.organizer_email}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Timeline</p>
                              <p className="text-muted-foreground">
                                {new Date(
                                  submission.start_date,
                                ).toLocaleDateString()}{" "}
                                -{" "}
                                {new Date(
                                  submission.end_date,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Prize</p>
                              <p className="text-muted-foreground">
                                {formatPrize(
                                  submission.prize_amount,
                                  submission.prize_currency,
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Admin Notes & Rejection Reason */}
                        {submission.admin_notes && (
                          <Alert className="border-blue-200 bg-blue-50">
                            <MessageSquare className="h-4 w-4 text-blue-600" />
                            <AlertDescription className="text-blue-800">
                              <strong>Admin Notes:</strong>{" "}
                              {submission.admin_notes}
                            </AlertDescription>
                          </Alert>
                        )}

                        {submission.rejection_reason && (
                          <Alert className="border-red-200 bg-red-50">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-800">
                              <strong>Rejection Reason:</strong>{" "}
                              {submission.rejection_reason}
                            </AlertDescription>
                          </Alert>
                        )}

                        {/* Timestamps */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>
                            Created: {formatDate(submission.created_at)}
                          </span>
                          {submission.submitted_at && (
                            <span>
                              Submitted: {formatDate(submission.submitted_at)}
                            </span>
                          )}
                          {submission.reviewed_at && (
                            <span>
                              Reviewed: {formatDate(submission.reviewed_at)}
                            </span>
                          )}
                          {submission.approved_at && (
                            <span>
                              Approved: {formatDate(submission.approved_at)}
                            </span>
                          )}
                          {submission.published_at && (
                            <span>
                              Published: {formatDate(submission.published_at)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 ml-4">
                        <Dialog
                          open={
                            viewDialogOpen &&
                            selectedSubmission?.id === submission.id
                          }
                          onOpenChange={(open) => {
                            setViewDialogOpen(open);
                            if (!open) setSelectedSubmission(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedSubmission(submission)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>{submission.title}</DialogTitle>
                              <DialogDescription>
                                Detailed view of the competition submission
                              </DialogDescription>
                            </DialogHeader>
                            {selectedSubmission && (
                              <Tabs defaultValue="details" className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                  <TabsTrigger value="details">
                                    Details
                                  </TabsTrigger>
                                  <TabsTrigger value="timeline">
                                    Timeline
                                  </TabsTrigger>
                                  <TabsTrigger value="organizer">
                                    Organizer
                                  </TabsTrigger>
                                  <TabsTrigger value="settings">
                                    Settings
                                  </TabsTrigger>
                                </TabsList>
                                <TabsContent
                                  value="details"
                                  className="space-y-4"
                                >
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Title</Label>
                                      <p className="text-sm">
                                        {selectedSubmission.title}
                                      </p>
                                    </div>
                                    <div>
                                      <Label>Category</Label>
                                      <p className="text-sm">
                                        {selectedSubmission.category}
                                        {selectedSubmission.subcategory && (
                                          <span>
                                            {" "}
                                            / {selectedSubmission.subcategory}
                                          </span>
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Description</Label>
                                    <p className="text-sm">
                                      {selectedSubmission.description}
                                    </p>
                                  </div>
                                  {selectedSubmission.detailed_description && (
                                    <div>
                                      <Label>Detailed Description</Label>
                                      <p className="text-sm whitespace-pre-wrap">
                                        {
                                          selectedSubmission.detailed_description
                                        }
                                      </p>
                                    </div>
                                  )}
                                  {selectedSubmission.rules && (
                                    <div>
                                      <Label>Rules</Label>
                                      <p className="text-sm whitespace-pre-wrap">
                                        {selectedSubmission.rules}
                                      </p>
                                    </div>
                                  )}
                                  {selectedSubmission.tags &&
                                    selectedSubmission.tags.length > 0 && (
                                      <div>
                                        <Label>Tags</Label>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                          {selectedSubmission.tags.map(
                                            (tag, index) => (
                                              <Badge
                                                key={index}
                                                variant="outline"
                                              >
                                                <Tag className="h-3 w-3 mr-1" />
                                                {tag}
                                              </Badge>
                                            ),
                                          )}
                                        </div>
                                      </div>
                                    )}
                                </TabsContent>
                                <TabsContent
                                  value="timeline"
                                  className="space-y-4"
                                >
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Start Date</Label>
                                      <p className="text-sm">
                                        {new Date(
                                          selectedSubmission.start_date,
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <div>
                                      <Label>End Date</Label>
                                      <p className="text-sm">
                                        {new Date(
                                          selectedSubmission.end_date,
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <div>
                                      <Label>Submission Deadline</Label>
                                      <p className="text-sm">
                                        {new Date(
                                          selectedSubmission.submission_deadline,
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>
                                    {selectedSubmission.judging_start_date && (
                                      <div>
                                        <Label>Judging Start</Label>
                                        <p className="text-sm">
                                          {new Date(
                                            selectedSubmission.judging_start_date,
                                          ).toLocaleDateString()}
                                        </p>
                                      </div>
                                    )}
                                    {selectedSubmission.judging_end_date && (
                                      <div>
                                        <Label>Judging End</Label>
                                        <p className="text-sm">
                                          {new Date(
                                            selectedSubmission.judging_end_date,
                                          ).toLocaleDateString()}
                                        </p>
                                      </div>
                                    )}
                                    {selectedSubmission.winner_announcement_date && (
                                      <div>
                                        <Label>Winner Announcement</Label>
                                        <p className="text-sm">
                                          {new Date(
                                            selectedSubmission.winner_announcement_date,
                                          ).toLocaleDateString()}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </TabsContent>
                                <TabsContent
                                  value="organizer"
                                  className="space-y-4"
                                >
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Organizer Name</Label>
                                      <p className="text-sm">
                                        {selectedSubmission.organizer_name}
                                      </p>
                                    </div>
                                    <div>
                                      <Label>Email</Label>
                                      <p className="text-sm">
                                        {selectedSubmission.organizer_email}
                                      </p>
                                    </div>
                                    {selectedSubmission.company_name && (
                                      <div>
                                        <Label>Company</Label>
                                        <p className="text-sm">
                                          {selectedSubmission.company_name}
                                        </p>
                                      </div>
                                    )}
                                    {selectedSubmission.organizer_website && (
                                      <div>
                                        <Label>Website</Label>
                                        <p className="text-sm">
                                          <a
                                            href={
                                              selectedSubmission.organizer_website
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                          >
                                            {
                                              selectedSubmission.organizer_website
                                            }
                                          </a>
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                  {selectedSubmission.company_description && (
                                    <div>
                                      <Label>Company Description</Label>
                                      <p className="text-sm">
                                        {selectedSubmission.company_description}
                                      </p>
                                    </div>
                                  )}
                                </TabsContent>
                                <TabsContent
                                  value="settings"
                                  className="space-y-4"
                                >
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Prize Amount</Label>
                                      <p className="text-sm">
                                        {formatPrize(
                                          selectedSubmission.prize_amount,
                                          selectedSubmission.prize_currency,
                                        )}
                                      </p>
                                    </div>
                                    <div>
                                      <Label>Entry Fee</Label>
                                      <p className="text-sm">
                                        {selectedSubmission.entry_fee
                                          ? `$${selectedSubmission.entry_fee}`
                                          : "Free"}
                                      </p>
                                    </div>
                                    <div>
                                      <Label>Max Participants</Label>
                                      <p className="text-sm">
                                        {selectedSubmission.max_participants ||
                                          "Unlimited"}
                                      </p>
                                    </div>
                                    <div>
                                      <Label>Difficulty</Label>
                                      <p className="text-sm capitalize">
                                        {selectedSubmission.difficulty_level ||
                                          "Beginner"}
                                      </p>
                                    </div>
                                    <div>
                                      <Label>Team Competition</Label>
                                      <p className="text-sm">
                                        {selectedSubmission.is_team_competition
                                          ? "Yes"
                                          : "No"}
                                      </p>
                                    </div>
                                    {selectedSubmission.is_team_competition && (
                                      <div>
                                        <Label>Team Size</Label>
                                        <p className="text-sm">
                                          {selectedSubmission.min_team_size ||
                                            1}{" "}
                                          -{" "}
                                          {selectedSubmission.max_team_size ||
                                            "Unlimited"}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                  {selectedSubmission.prize_description && (
                                    <div>
                                      <Label>Prize Description</Label>
                                      <p className="text-sm">
                                        {selectedSubmission.prize_description}
                                      </p>
                                    </div>
                                  )}
                                </TabsContent>
                              </Tabs>
                            )}
                          </DialogContent>
                        </Dialog>

                        {(submission.status === "submitted" ||
                          submission.status === "under_review") && (
                          <Dialog
                            open={
                              reviewDialogOpen &&
                              selectedSubmission?.id === submission.id
                            }
                            onOpenChange={(open) => {
                              setReviewDialogOpen(open);
                              if (!open) {
                                setSelectedSubmission(null);
                                setAdminNotes("");
                                setRejectionReason("");
                              }
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => {
                                  setSelectedSubmission(submission);
                                  setAdminNotes(submission.admin_notes || "");
                                  setRejectionReason(
                                    submission.rejection_reason || "",
                                  );
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Review Submission</DialogTitle>
                                <DialogDescription>
                                  Review and take action on this competition
                                  submission
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="admin-notes">
                                    Admin Notes (Optional)
                                  </Label>
                                  <Textarea
                                    id="admin-notes"
                                    value={adminNotes}
                                    onChange={(e) =>
                                      setAdminNotes(e.target.value)
                                    }
                                    placeholder="Add notes for the client..."
                                    rows={3}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="rejection-reason">
                                    Rejection Reason (If Rejecting)
                                  </Label>
                                  <Textarea
                                    id="rejection-reason"
                                    value={rejectionReason}
                                    onChange={(e) =>
                                      setRejectionReason(e.target.value)
                                    }
                                    placeholder="Explain why this submission is being rejected..."
                                    rows={3}
                                  />
                                </div>
                              </div>
                              <DialogFooter className="gap-2">
                                <Button
                                  variant="destructive"
                                  onClick={() =>
                                    handleStatusUpdate(
                                      submission.id,
                                      "rejected",
                                      adminNotes,
                                      rejectionReason,
                                    )
                                  }
                                  disabled={actionLoading}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    handleStatusUpdate(
                                      submission.id,
                                      "under_review",
                                      adminNotes,
                                    )
                                  }
                                  disabled={actionLoading}
                                >
                                  <Clock className="h-4 w-4 mr-2" />
                                  Mark Under Review
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleStatusUpdate(
                                      submission.id,
                                      "approved",
                                      adminNotes,
                                    )
                                  }
                                  disabled={actionLoading}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}

                        {submission.status === "approved" && (
                          <Button
                            size="sm"
                            onClick={() =>
                              handleStatusUpdate(submission.id, "published")
                            }
                            disabled={actionLoading}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Publish
                          </Button>
                        )}

                        <AlertDialog
                          open={
                            deleteDialogOpen &&
                            selectedSubmission?.id === submission.id
                          }
                          onOpenChange={(open) => {
                            setDeleteDialogOpen(open);
                            if (!open) setSelectedSubmission(null);
                          }}
                        >
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedSubmission(submission)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Submission
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this submission?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteSubmission(submission.id)
                                }
                                disabled={actionLoading}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
