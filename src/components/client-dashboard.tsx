"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import {
  Plus,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Calendar,
  DollarSign,
  Users,
  Building2,
  BarChart3,
  TrendingUp,
  Filter,
} from "lucide-react";
import { createClient } from "../../supabase/client";
import { useRouter } from "next/navigation";
import CompetitionSubmissionForm from "./competition-submission-form";

interface ClientDashboardProps {
  user: any;
  userData: any;
}

export default function ClientDashboard({
  user,
  userData,
}: ClientDashboardProps) {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from("client_submissions")
        .select("*")
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
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
    });
  };

  const formatPrize = (amount: number, currency: string) => {
    if (!amount) return "No prize specified";
    return `${currency || "$"}${amount.toLocaleString()}`;
  };

  // Calculate statistics
  const stats = {
    total: submissions.length,
    draft: submissions.filter((s) => s.status === "draft").length,
    submitted: submissions.filter((s) => s.status === "submitted").length,
    approved: submissions.filter((s) => s.status === "approved").length,
    published: submissions.filter((s) => s.status === "published").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
  };

  // Filter submissions based on selected filter
  const getFilteredSubmissions = () => {
    const now = new Date();

    switch (selectedFilter) {
      case "draft":
        return submissions.filter((s) => s.status === "draft");
      case "pending":
        return submissions.filter(
          (s) => s.status === "submitted" || s.status === "under_review",
        );
      case "current":
        return submissions.filter((s) => {
          const startDate = new Date(s.start_date);
          const endDate = new Date(s.end_date);
          return (
            (s.status === "approved" || s.status === "published") &&
            startDate <= now &&
            endDate >= now
          );
        });
      case "past":
        return submissions.filter((s) => {
          const endDate = new Date(s.end_date);
          return endDate < now;
        });
      default:
        return submissions;
    }
  };

  const filteredSubmissions = getFilteredSubmissions();

  // Calculate filter counts
  const filterCounts = {
    all: submissions.length,
    draft: submissions.filter((s) => s.status === "draft").length,
    pending: submissions.filter(
      (s) => s.status === "submitted" || s.status === "under_review",
    ).length,
    current: submissions.filter((s) => {
      const now = new Date();
      const startDate = new Date(s.start_date);
      const endDate = new Date(s.end_date);
      return (
        (s.status === "approved" || s.status === "published") &&
        startDate <= now &&
        endDate >= now
      );
    }).length,
    past: submissions.filter((s) => {
      const now = new Date();
      const endDate = new Date(s.end_date);
      return endDate < now;
    }).length,
  };

  const handleNewSubmission = () => {
    setSelectedSubmission(null);
    setShowForm(true);
    setActiveTab("form");
  };

  const handleEditSubmission = (submission: any) => {
    setSelectedSubmission(submission);
    setShowForm(true);
    setActiveTab("form");
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedSubmission(null);
    setActiveTab("overview");
    fetchSubmissions();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Side Navigation */}
      <div className="w-64 bg-card border-r border-border p-6 flex flex-col">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Competitions</h2>
          <p className="text-sm text-muted-foreground">Filter by status</p>
        </div>

        <nav className="space-y-2 flex-1">
          <button
            onClick={() => setSelectedFilter("all")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
              selectedFilter === "all"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>All Competitions</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {filterCounts.all}
            </Badge>
          </button>

          <button
            onClick={() => setSelectedFilter("draft")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
              selectedFilter === "draft"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Draft</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {filterCounts.draft}
            </Badge>
          </button>

          <button
            onClick={() => setSelectedFilter("pending")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
              selectedFilter === "pending"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Pending</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {filterCounts.pending}
            </Badge>
          </button>

          <button
            onClick={() => setSelectedFilter("current")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
              selectedFilter === "current"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Current</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {filterCounts.current}
            </Badge>
          </button>

          <button
            onClick={() => setSelectedFilter("past")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
              selectedFilter === "past"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              <span>Past</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {filterCounts.past}
            </Badge>
          </button>
        </nav>

        <Separator className="my-4" />

        <Button
          onClick={handleNewSubmission}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Competition
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Client Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back,{" "}
                {userData?.company_name || userData?.full_name || user.email}
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold">{filterCounts.pending}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Current</p>
                    <p className="text-2xl font-bold">{filterCounts.current}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Past</p>
                    <p className="text-2xl font-bold">{filterCounts.past}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtered Submissions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  {selectedFilter === "all"
                    ? "All Competitions"
                    : selectedFilter === "draft"
                      ? "Draft Competitions"
                      : selectedFilter === "pending"
                        ? "Pending Competitions"
                        : selectedFilter === "current"
                          ? "Current Competitions"
                          : "Past Competitions"}
                </span>
                <Badge variant="outline">{filteredSubmissions.length}</Badge>
              </CardTitle>
              <CardDescription>
                {selectedFilter === "all"
                  ? "All your competition submissions"
                  : selectedFilter === "draft"
                    ? "Competitions saved as drafts"
                    : selectedFilter === "pending"
                      ? "Competitions under review"
                      : selectedFilter === "current"
                        ? "Currently active competitions"
                        : "Completed competitions"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredSubmissions.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No {selectedFilter === "all" ? "" : selectedFilter}{" "}
                    competitions found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {selectedFilter === "draft"
                      ? "You don't have any draft competitions"
                      : selectedFilter === "pending"
                        ? "No competitions are currently pending review"
                        : selectedFilter === "current"
                          ? "No competitions are currently active"
                          : selectedFilter === "past"
                            ? "No past competitions found"
                            : "Start by creating your first competition submission"}
                  </p>
                  {selectedFilter === "all" || selectedFilter === "draft" ? (
                    <Button onClick={handleNewSubmission}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Competition
                    </Button>
                  ) : null}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredSubmissions.map((submission) => (
                    <Card
                      key={submission.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant="outline"
                                className={getStatusColor(submission.status)}
                              >
                                {getStatusIcon(submission.status)}
                                <span className="ml-1">
                                  {submission.status.charAt(0).toUpperCase() +
                                    submission.status.slice(1)}
                                </span>
                              </Badge>
                              <Badge variant="secondary">
                                {submission.category}
                              </Badge>
                            </div>
                            <CardTitle className="text-lg line-clamp-2">
                              {submission.title}
                            </CardTitle>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <CardDescription className="line-clamp-2">
                          {submission.description || "No description provided"}
                        </CardDescription>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {formatDate(submission.start_date)} -{" "}
                              {formatDate(submission.end_date)}
                            </span>
                          </div>

                          {submission.prize_amount && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <DollarSign className="h-4 w-4" />
                              <span>
                                {formatPrize(
                                  submission.prize_amount,
                                  submission.prize_currency,
                                )}
                              </span>
                            </div>
                          )}

                          {submission.max_participants && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>
                                Max {submission.max_participants} participants
                              </span>
                            </div>
                          )}
                        </div>

                        {submission.admin_notes && (
                          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm font-medium text-blue-900 mb-1">
                              Admin Notes:
                            </p>
                            <p className="text-sm text-blue-800">
                              {submission.admin_notes}
                            </p>
                          </div>
                        )}

                        {submission.rejection_reason && (
                          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                            <p className="text-sm font-medium text-red-900 mb-1">
                              Rejection Reason:
                            </p>
                            <p className="text-sm text-red-800">
                              {submission.rejection_reason}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2">
                          <div className="text-xs text-muted-foreground">
                            Created {formatDate(submission.created_at)}
                            {submission.submitted_at && (
                              <span>
                                {" • "}
                                Submitted {formatDate(submission.submitted_at)}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {(submission.status === "draft" ||
                              submission.status === "rejected") && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditSubmission(submission)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Form Modal/Tab */}
          {showForm && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedSubmission ? "Edit" : "New"} Competition Submission
                </CardTitle>
                <CardDescription>
                  {selectedSubmission
                    ? "Update your competition details"
                    : "Create a new competition submission"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CompetitionSubmissionForm
                  user={user}
                  submission={selectedSubmission}
                  onSuccess={handleFormSuccess}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
