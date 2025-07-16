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
} from "../actions";
import { Tables } from "@/types/supabase";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "../../../../supabase/client";
import { Plus } from "lucide-react";

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

      let result;
      if (isEditing && competition) {
        result = await updateCompetition(competition.id, formData);
      } else {
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
        <form action={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>

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
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={competition?.description || ""}
                  placeholder="Brief description of the competition"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="detailed_description">Entry Criteria</Label>
                <Textarea
                  id="detailed_description"
                  name="detailed_description"
                  defaultValue={competition?.detailed_description || ""}
                  placeholder="Additional entry criteria and information"
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Requirements</Label>
                  <Dialog
                    open={showAddRequirement}
                    onOpenChange={setShowAddRequirement}
                  >
                    <DialogTrigger asChild>
                      <Button type="button" variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Requirement Option</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="new-req-name">
                            Requirement Name *
                          </Label>
                          <Input
                            id="new-req-name"
                            value={newRequirementName}
                            onChange={(e) =>
                              setNewRequirementName(e.target.value)
                            }
                            placeholder="Enter requirement name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-req-desc">Description</Label>
                          <Textarea
                            id="new-req-desc"
                            value={newRequirementDescription}
                            onChange={(e) =>
                              setNewRequirementDescription(e.target.value)
                            }
                            placeholder="Optional description"
                            rows={3}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            onClick={handleAddRequirement}
                            disabled={addingRequirement}
                          >
                            {addingRequirement
                              ? "Adding..."
                              : "Add Requirement"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setShowAddRequirement(false);
                              setNewRequirementName("");
                              setNewRequirementDescription("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto border rounded-md p-4">
                  {requirementOptions.map((option) => (
                    <div key={option.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={`req-${option.id}`}
                        checked={selectedRequirements.includes(option.id)}
                        onCheckedChange={(checked) =>
                          handleRequirementToggle(option.id, checked as boolean)
                        }
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor={`req-${option.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {option.name}
                        </Label>
                        {option.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {option.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  {requirementOptions.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No requirement options available. Add some using the
                      &quot;Add New&quot; button.
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rules">Rules</Label>
                <Textarea
                  id="rules"
                  name="rules"
                  defaultValue={competition?.rules || ""}
                  placeholder="Competition rules and guidelines"
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
                    <SelectItem value="Exclusive">Exclusive</SelectItem>
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
                <Label htmlFor="difficulty_level">Type of Game *</Label>
                <Select
                  name="difficulty_level"
                  defaultValue={competition?.difficulty_level || ""}
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prize_amount">Prize Amount</Label>
                  <Input
                    id="prize_amount"
                    name="prize_amount"
                    type="number"
                    step="0.01"
                    defaultValue={competition?.prize_amount || ""}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prize_currency">Currency</Label>
                  <Select
                    name="prize_currency"
                    defaultValue={competition?.prize_currency || "AUD"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="CAD">CAD</SelectItem>
                      <SelectItem value="AUD">AUD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prize_description">Prize Description</Label>
                <Textarea
                  id="prize_description"
                  name="prize_description"
                  defaultValue={competition?.prize_description || ""}
                  placeholder="Description of prizes and rewards"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="max_participants">Max Participants</Label>
                  <Input
                    id="max_participants"
                    name="max_participants"
                    type="number"
                    defaultValue={competition?.max_participants || ""}
                    placeholder="Unlimited if empty"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entry_fee">Entry Fee</Label>
                  <Input
                    id="entry_fee"
                    name="entry_fee"
                    type="number"
                    step="0.01"
                    defaultValue={competition?.entry_fee || "0"}
                    placeholder="0.00"
                  />
                </div>
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
                <Label htmlFor="banner_url">Banner URL</Label>
                <Input
                  id="banner_url"
                  name="banner_url"
                  type="url"
                  defaultValue={competition?.banner_url || ""}
                  placeholder="https://example.com/banner.jpg"
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
                  name="featured"
                  defaultChecked={competition?.featured || false}
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
      </CardContent>
    </Card>
  );
}
