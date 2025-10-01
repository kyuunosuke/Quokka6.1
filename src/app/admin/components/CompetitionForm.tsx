"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  createCompetition,
  updateCompetition,
  createRequirementOption,
  importCompetitionFromUrl,
} from "../actions";
import { Tables } from "@/types/supabase";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "../../../../supabase/client";
import { Plus, Download, AlertCircle } from "lucide-react";

type Competition = Tables<"competitions">;
type RequirementOption = Tables<"requirement_options">;

interface CompetitionFormProps {
  competition?: Competition;
  onClose: () => void;
  onSuccess?: () => void;
}

// Helper function to get current date with 12:00 AM time
const getCurrentDateWithMidnight = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.toISOString().slice(0, 16);
};

export default function CompetitionForm({
  competition,
  onClose,
  onSuccess,
}: CompetitionFormProps) {
  const [loading, setLoading] = useState(false);
  const [requirementOptions, setRequirementOptions] = useState<
    RequirementOption[]
  >([]);
  const [selectedRequirements, setSelectedRequirements] = useState<string[]>(
    [],
  );
  const [showAddRequirement, setShowAddRequirement] = useState(false);
  const [newRequirementName, setNewRequirementName] = useState("");
  const [newRequirementDescription, setNewRequirementDescription] =
    useState("");
  const [addingRequirement, setAddingRequirement] = useState(false);
  const [isFeatured, setIsFeatured] = useState(competition?.featured || false);
  const [tags, setTags] = useState<string[]>(competition?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [importUrl, setImportUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [importedData, setImportedData] = useState<any>(null);
  const [importIssues, setImportIssues] = useState<string[]>([]);
  const [showImportDialog, setShowImportDialog] = useState(false);

  // Initialize with a function to avoid calling getCurrentDateWithMidnight during render
  const [endDate, setEndDate] = useState(() => {
    if (competition?.end_date) {
      return new Date(competition.end_date).toISOString().slice(0, 16);
    }
    return getCurrentDateWithMidnight();
  });

  const [submissionDeadline, setSubmissionDeadline] = useState(() => {
    if (competition?.submission_deadline) {
      return new Date(competition.submission_deadline)
        .toISOString()
        .slice(0, 16);
    }
    if (competition?.end_date) {
      return new Date(competition.end_date).toISOString().slice(0, 16);
    }
    return getCurrentDateWithMidnight();
  });
  const [isSubmissionDeadlineModified, setIsSubmissionDeadlineModified] =
    useState(false);
  const isEditing = !!competition;
  const { toast } = useToast();
  const supabase = createClient();

  // Load requirement options and selected requirements
  useEffect(() => {
    const loadRequirements = async () => {
      // Load all requirement options
      const { data: options } = await supabase
        .from("requirement_options")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (options) {
        setRequirementOptions(options);
      }

      // Load selected requirements for existing competition
      if (competition?.id) {
        const { data: selected } = await supabase
          .from("competition_requirements_selected")
          .select("requirement_option_id")
          .eq("competition_id", competition.id);

        if (selected) {
          setSelectedRequirements(selected.map((s) => s.requirement_option_id));
        }
      }
    };

    loadRequirements();
  }, [competition?.id, supabase]);

  // Update submission deadline when end date changes (unless manually modified)
  useEffect(() => {
    if (endDate && !isSubmissionDeadlineModified) {
      setSubmissionDeadline(endDate);
    }
  }, [endDate, isSubmissionDeadlineModified]);

  const handleRequirementToggle = (requirementId: string, checked: boolean) => {
    if (checked) {
      setSelectedRequirements((prev) => [...prev, requirementId]);
    } else {
      setSelectedRequirements((prev) =>
        prev.filter((id) => id !== requirementId),
      );
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleImportUrl = async () => {
    if (!importUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    setImporting(true);
    try {
      const formData = new FormData();
      formData.append("url", importUrl.trim());

      const result = await importCompetitionFromUrl(formData);

      if (result.success && result.data) {
        setImportedData(result.data);
        setImportIssues(result.issues || []);
        setShowImportDialog(true);

        toast({
          title: "Success",
          description: "Competition data imported successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to import competition data",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error importing URL:", error);
      toast({
        title: "Error",
        description: "Failed to import competition data",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  const applyImportedData = () => {
    if (!importedData) return;

    // Apply imported data to form fields
    const form = document.querySelector("form") as HTMLFormElement;
    if (!form) return;

    Object.entries(importedData).forEach(([key, value]) => {
      const input = form.querySelector(`[name="${key}"]`) as
        | HTMLInputElement
        | HTMLTextAreaElement
        | HTMLSelectElement;
      if (input && value) {
        input.value = String(value);
        // Trigger change event for React to pick up the change
        const event = new Event("input", { bubbles: true });
        input.dispatchEvent(event);
      }
    });

    // Handle special cases
    if (importedData.featured !== undefined) {
      setIsFeatured(importedData.featured);
    }
    if (importedData.tags && Array.isArray(importedData.tags)) {
      setTags(importedData.tags);
    }
    if (importedData.end_date && !isSubmissionDeadlineModified) {
      setEndDate(importedData.end_date);
      setSubmissionDeadline(
        importedData.submission_deadline || importedData.end_date,
      );
    }

    setShowImportDialog(false);
    setImportUrl("");

    toast({
      title: "Applied",
      description: "Imported data has been applied to the form",
    });
  };

  const handleAddRequirement = async () => {
    if (!newRequirementName.trim()) {
      toast({
        title: "Error",
        description: "Requirement name is required",
        variant: "destructive",
      });
      return;
    }

    setAddingRequirement(true);
    try {
      const formData = new FormData();
      formData.append("name", newRequirementName.trim());
      formData.append("description", newRequirementDescription.trim());

      const result = await createRequirementOption(formData);

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });

        // Reload requirement options
        const { data: options } = await supabase
          .from("requirement_options")
          .select("*")
          .eq("is_active", true)
          .order("name");

        if (options) {
          setRequirementOptions(options);
        }

        setNewRequirementName("");
        setNewRequirementDescription("");
        setShowAddRequirement(false);
      } else {
        toast({
          title: "Error",
          description: result.error || result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding requirement:", error);
      toast({
        title: "Error",
        description: "Failed to add requirement option",
        variant: "destructive",
      });
    } finally {
      setAddingRequirement(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      // Add selected requirements to form data
      selectedRequirements.forEach((reqId) => {
        formData.append("requirements", reqId);
      });

      // Add tags to form data
      tags.forEach((tag) => {
        formData.append("tags", tag);
      });

      // Handle featured checkbox explicitly
      console.log("🔍 DEBUG FORM - isFeatured state:", isFeatured);
      console.log(
        "🔍 DEBUG FORM - Setting featured to:",
        isFeatured.toString(),
      );
      formData.set("featured", isFeatured.toString());

      // Verify the form data was set correctly
      console.log(
        "🔍 DEBUG FORM - FormData featured value:",
        formData.get("featured"),
      );

      let result;
      if (isEditing && competition) {
        console.log("🔍 DEBUG FORM - Updating competition:", competition.id);
        result = await updateCompetition(competition.id, formData);
      } else {
        console.log("🔍 DEBUG FORM - Creating new competition");
        result = await createCompetition(formData);
      }

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        onSuccess?.();
        onClose();
      } else {
        toast({
          title: "Error",
          description: result.error || result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-[52.5rem] mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edit Competition" : "Create New Competition"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Import URL Section */}
        {!isEditing && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">Import from URL</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Enter competition URL to import data..."
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleImportUrl}
                disabled={importing || !importUrl.trim()}
                variant="outline"
              >
                {importing ? (
                  "Importing..."
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Import
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Paste a competition URL to automatically populate form fields
            </p>
          </div>
        )}

        <form action={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>

              {isEditing && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="competition_id">Competition ID</Label>
                    <Input
                      id="competition_id"
                      name="competition_id"
                      value={competition?.id || ""}
                      disabled
                      className="bg-gray-100 text-gray-500 cursor-not-allowed"
                      placeholder="Auto-generated"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="created_date">Created Date</Label>
                    <Input
                      id="created_date"
                      name="created_date"
                      value={
                        competition?.created_at
                          ? new Date(competition.created_at).toLocaleString()
                          : ""
                      }
                      disabled
                      className="bg-gray-100 text-gray-500 cursor-not-allowed"
                      placeholder="Auto-generated"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={competition?.title || ""}
                  required
                  placeholder="Competition title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={competition?.description || ""}
                  placeholder="Brief description of the competition"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Entry Criteria</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="criteria_18_plus"
                      name="entry_criteria"
                      value="18+"
                      defaultChecked={
                        competition?.detailed_description?.includes("18+") ||
                        false
                      }
                    />
                    <Label htmlFor="criteria_18_plus">18+</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="criteria_au_residents"
                      name="entry_criteria"
                      value="AU Residents"
                      defaultChecked={
                        competition?.detailed_description?.includes(
                          "AU Residents",
                        ) || false
                      }
                    />
                    <Label htmlFor="criteria_au_residents">AU Residents</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="criteria_members_only"
                      name="entry_criteria"
                      value="Members only"
                      defaultChecked={
                        competition?.detailed_description?.includes(
                          "Members only",
                        ) || false
                      }
                    />
                    <Label htmlFor="criteria_members_only">Members only</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="participating_requirement">
                  Participating Requirement
                </Label>
                <Input
                  id="participating_requirement"
                  name="participating_requirement"
                  defaultValue={competition?.participating_requirement || ""}
                  placeholder="Enter participating requirements"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rules">
                  Competition Rules and Winning Methods
                </Label>
                <Textarea
                  id="rules"
                  name="rules"
                  defaultValue={competition?.rules || ""}
                  placeholder="Competition rules, guidelines, and winning methods"
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  name="category"
                  defaultValue={competition?.category || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open (free)">Open (free)</SelectItem>
                    <SelectItem value="Barrier (low)">Barrier (low)</SelectItem>
                    <SelectItem value="Barrier (Medium)">
                      Barrier (Medium)
                    </SelectItem>
                    <SelectItem value="Purchase Required">
                      Purchase Required
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategory</Label>
                <Input
                  id="subcategory"
                  name="subcategory"
                  defaultValue={competition?.subcategory || ""}
                  placeholder="Specific subcategory"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type_of_game">Type of Game *</Label>
                <Select
                  name="type_of_game"
                  defaultValue={competition?.type_of_game || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select game type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Game of Luck">Game of Luck</SelectItem>
                    <SelectItem value="Game of Skill">Game of Skill</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Competition Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Competition Details</h3>

              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date *</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="datetime-local"
                  className="w-full min-w-0 pr-12"
                  defaultValue={
                    competition?.start_date
                      ? new Date(competition.start_date)
                          .toISOString()
                          .slice(0, 16)
                      : getCurrentDateWithMidnight()
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">End Date *</Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="datetime-local"
                  className="w-full min-w-0 pr-12"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  defaultValue={
                    competition?.end_date
                      ? new Date(competition.end_date)
                          .toISOString()
                          .slice(0, 16)
                      : getCurrentDateWithMidnight()
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="submission_deadline">
                  Submission Deadline *
                </Label>
                <Input
                  id="submission_deadline"
                  name="submission_deadline"
                  type="datetime-local"
                  className="w-full min-w-0 pr-12"
                  value={submissionDeadline}
                  onChange={(e) => {
                    setSubmissionDeadline(e.target.value);
                    setIsSubmissionDeadlineModified(true);
                  }}
                  defaultValue={
                    competition?.submission_deadline
                      ? new Date(competition.submission_deadline)
                          .toISOString()
                          .slice(0, 16)
                      : competition?.end_date
                        ? new Date(competition.end_date)
                            .toISOString()
                            .slice(0, 16)
                        : getCurrentDateWithMidnight()
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prize_description">Prize Description</Label>
                <Textarea
                  id="prize_description"
                  name="prize_description"
                  defaultValue={competition?.prize_description || ""}
                  placeholder="Describe the prize details"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="total_prize">Total Prize</Label>
                <Textarea
                  id="total_prize"
                  name="total_prize"
                  defaultValue={competition?.total_prize || ""}
                  placeholder="Total prize details and description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="draw_date">Draw Date</Label>
                <Input
                  id="draw_date"
                  name="draw_date"
                  type="datetime-local"
                  className="w-full min-w-0 pr-12"
                  defaultValue={
                    competition?.draw_date
                      ? new Date(competition.draw_date)
                          .toISOString()
                          .slice(0, 16)
                      : ""
                  }
                  placeholder="Select draw date"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="permits">Permits</Label>
                <Input
                  id="permits"
                  name="permits"
                  defaultValue={competition?.permits || ""}
                  placeholder="Required permits or licenses"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Input
                  id="region"
                  name="region"
                  defaultValue={competition?.region || ""}
                  placeholder="Geographic region or location"
                />
              </div>
            </div>
          </div>

          {/* Organizer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Organizer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organizer_name">Organizer Name</Label>
                <Input
                  id="organizer_name"
                  name="organizer_name"
                  defaultValue={competition?.organizer_name || ""}
                  placeholder="Organization or person name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organizer_email">Organizer Email</Label>
                <Input
                  id="organizer_email"
                  name="organizer_email"
                  type="email"
                  defaultValue={competition?.organizer_email || ""}
                  placeholder="contact@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organizer_website">Organizer Website</Label>
                <Input
                  id="organizer_website"
                  name="organizer_website"
                  type="url"
                  defaultValue={competition?.organizer_website || ""}
                  placeholder="https://example.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="terms_conditions_url">Terms & Conditions</Label>
              <Input
                id="terms_conditions_url"
                name="terms_conditions_url"
                type="url"
                defaultValue={competition?.terms_conditions_url || ""}
                placeholder="https://example.com/terms"
              />
            </div>
          </div>

          {/* Media & Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Media & Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
                <Input
                  id="thumbnail_url"
                  name="thumbnail_url"
                  type="url"
                  defaultValue={competition?.thumbnail_url || ""}
                  placeholder="https://example.com/thumbnail.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="banner_url">Link URL</Label>
                <Input
                  id="banner_url"
                  name="banner_url"
                  type="url"
                  defaultValue={competition?.banner_url || ""}
                  placeholder="https://example.com/link"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  name="status"
                  defaultValue={competition?.status || "draft"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="submission_closed">
                      Submission Closed
                    </SelectItem>
                    <SelectItem value="judging">Judging</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <Checkbox
                  id="featured"
                  checked={isFeatured}
                  onCheckedChange={(checked) =>
                    setIsFeatured(checked as boolean)
                  }
                />
                <Label htmlFor="featured">Featured Competition</Label>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-6">
            <Button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : isEditing
                  ? "Update Competition"
                  : "Create Competition"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>

        {/* Import Data Dialog */}
        <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Import Competition Data</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 flex-1 overflow-y-auto">
              <div>
                <h4 className="font-semibold mb-2">Imported Data Preview:</h4>
                <div className="bg-gray-50 p-3 rounded max-h-60 overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere">
                    {importedData
                      ? JSON.stringify(importedData, null, 2)
                      : "No data"}
                  </pre>
                </div>
              </div>

              {importIssues.length > 0 && (
                <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-800">
                        Import Issues:
                      </h4>
                      <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                        {importIssues.map((issue, index) => (
                          <li key={index}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2 justify-end pt-4 border-t bg-white">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowImportDialog(false)}
              >
                Cancel
              </Button>
              <Button type="button" onClick={applyImportedData}>
                Apply to Form
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}