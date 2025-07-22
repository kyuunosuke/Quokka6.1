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
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Checkbox } from "./ui/checkbox";
import {
  FileText,
  Save,
  Send,
  Calendar,
  DollarSign,
  Users,
  Building2,
  AlertCircle,
  CheckCircle,
  Plus,
  Trash2,
  Trophy,
} from "lucide-react";
import { createClient } from "../../supabase/client";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "./ui/alert";

interface CompetitionSubmissionFormProps {
  user: any;
  submission?: any;
  onSuccess?: () => void;
}

export default function CompetitionSubmissionForm({
  user,
  submission,
  onSuccess,
}: CompetitionSubmissionFormProps) {
  const [loading, setLoading] = useState(false);
  const [requirementOptions, setRequirementOptions] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    // Basic Information
    title: submission?.title || "",
    description: submission?.description || "",
    detailed_description: submission?.detailed_description || "",
    category: submission?.category || "",
    subcategory: submission?.subcategory || "",

    // Dates
    start_date: submission?.start_date || "",
    end_date: submission?.end_date || "",
    submission_deadline: submission?.submission_deadline || "",
    judging_start_date: submission?.judging_start_date || "",
    judging_end_date: submission?.judging_end_date || "",
    winner_announcement_date: submission?.winner_announcement_date || "",

    // Prize Information - Enhanced for multiple winners
    prizes: submission?.prize_description
      ? [
          {
            position: "1st Place",
            amount: submission?.prize_amount || "",
            currency: submission?.prize_currency || "USD",
            description: submission?.prize_description || "",
          },
        ]
      : [
          {
            position: "1st Place",
            amount: "",
            currency: "USD",
            description: "",
          },
        ],

    // Competition Settings
    max_participants: submission?.max_participants || "",
    is_team_competition: submission?.is_team_competition || false,
    min_team_size: submission?.min_team_size || "",
    max_team_size: submission?.max_team_size || "",

    // Media
    thumbnail_url: submission?.thumbnail_url || "",
    banner_url: submission?.banner_url || "",

    // Rules and Requirements
    rules: submission?.rules || "",
    terms_conditions_url: submission?.terms_conditions_url || "",
    tags: submission?.tags?.join(", ") || "",
    selected_requirements: [],

    // Organizer Information
    organizer_name: submission?.organizer_name || "",
    organizer_email: submission?.organizer_email || user?.email || "",
    organizer_website: submission?.organizer_website || "",
    company_name: submission?.company_name || "",
    company_description: submission?.company_description || "",
  });

  const supabase = createClient();
  const router = useRouter();

  // Fetch requirement options on component mount
  useEffect(() => {
    const fetchRequirementOptions = async () => {
      try {
        const { data, error } = await supabase
          .from("requirement_options")
          .select("*")
          .eq("is_active", true)
          .order("name");

        if (error) {
          console.error("Error fetching requirement options:", error);
        } else {
          console.log("Fetched requirement options:", data); // Debug log
          setRequirementOptions(data || []);
        }
      } catch (error) {
        console.error("Error fetching requirement options:", error);
      }
    };

    fetchRequirementOptions();
  }, [supabase]);

  // Fetch selected requirements for existing submission
  useEffect(() => {
    const fetchSelectedRequirements = async () => {
      if (submission?.id) {
        try {
          const { data, error } = await supabase
            .from("competition_requirements_selected")
            .select("requirement_option_id")
            .eq("competition_id", submission.id);

          if (error) {
            console.error("Error fetching selected requirements:", error);
          } else {
            const selectedIds =
              data?.map((item) => item.requirement_option_id) || [];
            setFormData((prev) => ({
              ...prev,
              selected_requirements: selectedIds,
            }));
          }
        } catch (error) {
          console.error("Error fetching selected requirements:", error);
        }
      }
    };

    fetchSelectedRequirements();
  }, [submission?.id]);

  const categories = ["Game of Luck", "Game of Skill"];

  const currencies = [
    { value: "USD", label: "USD ($)" },
    { value: "EUR", label: "EUR (€)" },
    { value: "GBP", label: "GBP (£)" },
    { value: "AUD", label: "AUD (A$)" },
    { value: "CAD", label: "CAD (C$)" },
  ];

  const handleSaveDraft = async () => {
    await handleSubmit("draft");
  };

  const handleSubmitForReview = async () => {
    await handleSubmit("submitted");
  };

  const handleSubmit = async (status: "draft" | "submitted") => {
    setLoading(true);
    try {
      // Validate required fields for submission
      if (status === "submitted") {
        const requiredFields = [
          "title",
          "description",
          "category",
          "start_date",
          "end_date",
          "submission_deadline",
          "organizer_name",
          "organizer_email",
        ];

        const missingFields = requiredFields.filter(
          (field) => !formData[field as keyof typeof formData],
        );

        if (missingFields.length > 0) {
          alert(
            `Please fill in the following required fields: ${missingFields.join(", ")}`,
          );
          return;
        }

        // Validate dates
        const startDate = new Date(formData.start_date);
        const endDate = new Date(formData.end_date);
        const submissionDeadline = new Date(formData.submission_deadline);

        if (startDate >= endDate) {
          alert("End date must be after start date");
          return;
        }

        if (submissionDeadline > endDate) {
          alert("Submission deadline must be before or on the end date");
          return;
        }
      }

      // Prepare prize information for database storage
      const primaryPrize = formData.prizes[0] || {};
      const allPrizesDescription = formData.prizes
        .map((prize, index) => {
          const parts = [];
          if (prize.position) parts.push(`${prize.position}:`);
          if (prize.amount && prize.currency) {
            parts.push(
              `${prize.currency}${parseFloat(prize.amount).toLocaleString()}`,
            );
          }
          if (prize.description) parts.push(prize.description);
          return parts.join(" ");
        })
        .filter((desc) => desc.trim())
        .join(" | ");

      // Prepare submission data
      const submissionData = {
        client_id: user.id,
        title: formData.title,
        description: formData.description,
        detailed_description: formData.detailed_description || null,
        category: formData.category,
        subcategory: formData.subcategory || null,
        start_date: formData.start_date,
        end_date: formData.end_date,
        submission_deadline: formData.submission_deadline,
        judging_start_date: formData.judging_start_date || null,
        judging_end_date: formData.judging_end_date || null,
        winner_announcement_date: formData.winner_announcement_date || null,
        // Store primary prize info for compatibility
        prize_amount: primaryPrize.amount
          ? parseFloat(primaryPrize.amount)
          : null,
        prize_currency: primaryPrize.currency || "USD",
        prize_description: allPrizesDescription || null,
        max_participants: formData.max_participants
          ? parseInt(formData.max_participants)
          : null,
        is_team_competition: formData.is_team_competition,
        min_team_size: formData.min_team_size
          ? parseInt(formData.min_team_size)
          : null,
        max_team_size: formData.max_team_size
          ? parseInt(formData.max_team_size)
          : null,
        thumbnail_url: formData.thumbnail_url || null,
        banner_url: formData.banner_url || null,
        rules: formData.rules || null,
        terms_conditions_url: formData.terms_conditions_url || null,
        tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim())
          : null,
        organizer_name: formData.organizer_name,
        organizer_email: formData.organizer_email,
        organizer_website: formData.organizer_website || null,
        company_name: formData.company_name || null,
        company_description: formData.company_description || null,
        status,
        updated_at: new Date().toISOString(),
      };

      let result;
      if (submission?.id) {
        // Update existing submission - need to reference competitions table
        result = await supabase
          .from("competitions")
          .update(submissionData)
          .eq("id", submission.id)
          .select()
          .single();
      } else {
        // Create new submission - need to reference competitions table
        result = await supabase
          .from("competitions")
          .insert(submissionData)
          .select()
          .single();
      }

      if (result.error) {
        throw result.error;
      }

      // Save selected requirements - always handle this section
      if (result.data) {
        // First, delete existing requirements for this submission
        const { error: deleteError } = await supabase
          .from("competition_requirements_selected")
          .delete()
          .eq("competition_id", result.data.id);

        if (deleteError) {
          console.error("Error deleting existing requirements:", deleteError);
        }

        // Then insert new requirements if any are selected
        if (formData.selected_requirements.length > 0) {
          const requirementInserts = formData.selected_requirements.map(
            (reqId) => ({
              competition_id: result.data.id,
              requirement_option_id: reqId,
            }),
          );

          const { error: reqError } = await supabase
            .from("competition_requirements_selected")
            .insert(requirementInserts);

          if (reqError) {
            console.error("Error saving requirements:", reqError);
            // Don't fail the entire submission, but log the error
          }
        }
      }

      const actionText =
        status === "draft" ? "saved as draft" : "submitted for review";
      alert(`Competition ${actionText} successfully!`);

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/client");
      }
    } catch (error) {
      console.error("Error saving submission:", error);
      alert("Failed to save submission. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isEditing = !!submission?.id;
  const canEdit =
    !submission ||
    submission.status === "draft" ||
    submission.status === "rejected";

  // Prize management functions
  const addPrize = () => {
    setFormData({
      ...formData,
      prizes: [
        ...formData.prizes,
        {
          position: `${formData.prizes.length + 1}${getOrdinalSuffix(formData.prizes.length + 1)} Place`,
          amount: "",
          currency: "USD",
          description: "",
        },
      ],
    });
  };

  const removePrize = (index: number) => {
    if (formData.prizes.length > 1) {
      const newPrizes = formData.prizes.filter((_, i) => i !== index);
      setFormData({ ...formData, prizes: newPrizes });
    }
  };

  const updatePrize = (index: number, field: string, value: string) => {
    const newPrizes = [...formData.prizes];
    newPrizes[index] = { ...newPrizes[index], [field]: value };
    setFormData({ ...formData, prizes: newPrizes });
  };

  const getOrdinalSuffix = (num: number) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  };

  // Handle requirement selection
  const handleRequirementToggle = (requirementId: string) => {
    setFormData((prev) => {
      const currentSelected = prev.selected_requirements;
      const isSelected = currentSelected.includes(requirementId);

      if (isSelected) {
        return {
          ...prev,
          selected_requirements: currentSelected.filter(
            (id) => id !== requirementId,
          ),
        };
      } else {
        return {
          ...prev,
          selected_requirements: [...currentSelected, requirementId],
        };
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {isEditing
              ? "Edit Competition Submission"
              : "Submit New Competition"}
          </CardTitle>
          <CardDescription>
            {isEditing
              ? "Update your competition details"
              : "Fill out the form below to submit your competition for admin review"}
          </CardDescription>
          {submission && (
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  submission.status === "approved" ? "default" : "secondary"
                }
                className={
                  submission.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : submission.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : submission.status === "submitted"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                }
              >
                {submission.status.charAt(0).toUpperCase() +
                  submission.status.slice(1)}
              </Badge>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Status Alert */}
      {submission && !canEdit && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            This submission cannot be edited because it is currently{" "}
            <strong>{submission.status}</strong>. You can only edit draft or
            rejected submissions.
          </AlertDescription>
        </Alert>
      )}

      {/* Rejection Reason */}
      {submission?.status === "rejected" && submission.rejection_reason && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Rejection Reason:</strong> {submission.rejection_reason}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Essential details about your competition
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Competition Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter competition title"
                disabled={!canEdit}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description of your competition"
                rows={3}
                disabled={!canEdit}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="detailed_description">Detailed Description</Label>
              <Textarea
                id="detailed_description"
                value={formData.detailed_description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    detailed_description: e.target.value,
                  })
                }
                placeholder="Detailed description with requirements, goals, etc."
                rows={5}
                disabled={!canEdit}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                  disabled={!canEdit}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategory</Label>
                <Input
                  id="subcategory"
                  value={formData.subcategory}
                  onChange={(e) =>
                    setFormData({ ...formData, subcategory: e.target.value })
                  }
                  placeholder="Optional subcategory"
                  disabled={!canEdit}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                placeholder="Enter tags separated by commas"
                disabled={!canEdit}
              />
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Timeline
            </CardTitle>
            <CardDescription>
              Important dates for your competition
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date *</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
                disabled={!canEdit}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">End Date *</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
                disabled={!canEdit}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="submission_deadline">Submission Deadline *</Label>
              <Input
                id="submission_deadline"
                type="date"
                value={formData.submission_deadline}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    submission_deadline: e.target.value,
                  })
                }
                disabled={!canEdit}
                required
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="judging_start_date">Judging Start Date</Label>
              <Input
                id="judging_start_date"
                type="date"
                value={formData.judging_start_date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    judging_start_date: e.target.value,
                  })
                }
                disabled={!canEdit}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="judging_end_date">Judging End Date</Label>
              <Input
                id="judging_end_date"
                type="date"
                value={formData.judging_end_date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    judging_end_date: e.target.value,
                  })
                }
                disabled={!canEdit}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="winner_announcement_date">
                Winner Announcement Date
              </Label>
              <Input
                id="winner_announcement_date"
                type="date"
                value={formData.winner_announcement_date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    winner_announcement_date: e.target.value,
                  })
                }
                disabled={!canEdit}
              />
            </div>
          </CardContent>
        </Card>

        {/* Prize Information - Enhanced for Multiple Winners */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Prize Information
            </CardTitle>
            <CardDescription>
              Configure prizes for multiple winners and positions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.prizes.map((prize, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    Prize {index + 1}
                  </h4>
                  {formData.prizes.length > 1 && canEdit && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removePrize(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Position/Rank</Label>
                    <Input
                      value={prize.position}
                      onChange={(e) =>
                        updatePrize(index, "position", e.target.value)
                      }
                      placeholder="1st Place, Winner, etc."
                      disabled={!canEdit}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Prize Amount</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={prize.amount}
                      onChange={(e) =>
                        updatePrize(index, "amount", e.target.value)
                      }
                      placeholder="0.00"
                      disabled={!canEdit}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select
                      value={prize.currency}
                      onValueChange={(value) =>
                        updatePrize(index, "currency", value)
                      }
                      disabled={!canEdit}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem
                            key={currency.value}
                            value={currency.value}
                          >
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Prize Description</Label>
                  <Textarea
                    value={prize.description}
                    onChange={(e) =>
                      updatePrize(index, "description", e.target.value)
                    }
                    placeholder="Describe this specific prize, award, or recognition"
                    rows={2}
                    disabled={!canEdit}
                  />
                </div>
              </div>
            ))}

            {canEdit && (
              <Button
                type="button"
                variant="outline"
                onClick={addPrize}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Prize
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Competition Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Competition Settings
            </CardTitle>
            <CardDescription>Participation rules and settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="max_participants">Max Participants</Label>
              <Input
                id="max_participants"
                type="number"
                value={formData.max_participants}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    max_participants: e.target.value,
                  })
                }
                placeholder="Unlimited if empty"
                disabled={!canEdit}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_team_competition"
                checked={formData.is_team_competition}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_team_competition: checked })
                }
                disabled={!canEdit}
              />
              <Label htmlFor="is_team_competition">Team Competition</Label>
            </div>

            {formData.is_team_competition && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min_team_size">Min Team Size</Label>
                  <Input
                    id="min_team_size"
                    type="number"
                    value={formData.min_team_size}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        min_team_size: e.target.value,
                      })
                    }
                    placeholder="2"
                    disabled={!canEdit}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_team_size">Max Team Size</Label>
                  <Input
                    id="max_team_size"
                    type="number"
                    value={formData.max_team_size}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        max_team_size: e.target.value,
                      })
                    }
                    placeholder="5"
                    disabled={!canEdit}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Media */}
        <Card>
          <CardHeader>
            <CardTitle>Media & Assets</CardTitle>
            <CardDescription>
              Images and visual content for your competition
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="thumbnail_url">Thumbnail Image URL</Label>
              <Input
                id="thumbnail_url"
                value={formData.thumbnail_url}
                onChange={(e) =>
                  setFormData({ ...formData, thumbnail_url: e.target.value })
                }
                placeholder="https://example.com/thumbnail.jpg"
                disabled={!canEdit}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="banner_url">Banner Image URL</Label>
              <Input
                id="banner_url"
                value={formData.banner_url}
                onChange={(e) =>
                  setFormData({ ...formData, banner_url: e.target.value })
                }
                placeholder="https://example.com/banner.jpg"
                disabled={!canEdit}
              />
            </div>
          </CardContent>
        </Card>

        {/* Organizer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Organizer Information
            </CardTitle>
            <CardDescription>
              Details about the organizing company or individual
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organizer_name">Organizer Name *</Label>
                <Input
                  id="organizer_name"
                  value={formData.organizer_name}
                  onChange={(e) =>
                    setFormData({ ...formData, organizer_name: e.target.value })
                  }
                  placeholder="Your name or organization"
                  disabled={!canEdit}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizer_email">Contact Email *</Label>
                <Input
                  id="organizer_email"
                  type="email"
                  value={formData.organizer_email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      organizer_email: e.target.value,
                    })
                  }
                  placeholder="contact@company.com"
                  disabled={!canEdit}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) =>
                  setFormData({ ...formData, company_name: e.target.value })
                }
                placeholder="Your company name"
                disabled={!canEdit}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organizer_website">Website</Label>
              <Input
                id="organizer_website"
                value={formData.organizer_website}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    organizer_website: e.target.value,
                  })
                }
                placeholder="https://yourcompany.com"
                disabled={!canEdit}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_description">Company Description</Label>
              <Textarea
                id="company_description"
                value={formData.company_description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    company_description: e.target.value,
                  })
                }
                placeholder="Brief description of your company"
                rows={3}
                disabled={!canEdit}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requirements and Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Requirements and Rules</CardTitle>
          <CardDescription>
            Competition requirements, rules, terms, and conditions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Requirements Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Competition Requirements</Label>
              <p className="text-sm text-muted-foreground">
                Select the requirements that participants must meet to join this
                competition
              </p>
            </div>

            {requirementOptions.length > 0 ? (
              <div className="space-y-2">
                <div className="grid grid-cols-1 gap-3">
                  {requirementOptions.map((requirement) => (
                    <div
                      key={requirement.id}
                      className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <Checkbox
                        id={`requirement-${requirement.id}`}
                        checked={formData.selected_requirements.includes(
                          requirement.id,
                        )}
                        onCheckedChange={() =>
                          handleRequirementToggle(requirement.id)
                        }
                        disabled={!canEdit}
                        className="mt-0.5"
                      />
                      <div className="grid gap-1.5 leading-none flex-1">
                        <Label
                          htmlFor={`requirement-${requirement.id}`}
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          {requirement.name}
                        </Label>
                        {requirement.description && (
                          <p className="text-xs text-muted-foreground">
                            {requirement.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground p-4 border rounded-lg bg-gray-50">
                Loading requirements options...
              </div>
            )}
          </div>

          <Separator />

          {/* Rules Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rules">Competition Rules</Label>
              <Textarea
                id="rules"
                value={formData.rules}
                onChange={(e) =>
                  setFormData({ ...formData, rules: e.target.value })
                }
                placeholder="Detailed rules and guidelines for participants"
                rows={6}
                disabled={!canEdit}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="terms_conditions_url">
                Terms & Conditions URL
              </Label>
              <Input
                id="terms_conditions_url"
                value={formData.terms_conditions_url}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    terms_conditions_url: e.target.value,
                  })
                }
                placeholder="https://yourcompany.com/terms"
                disabled={!canEdit}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {canEdit && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4 justify-end">
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {loading ? "Saving..." : "Save as Draft"}
              </Button>
              <Button
                onClick={handleSubmitForReview}
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
                {loading ? "Submitting..." : "Submit for Review"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
