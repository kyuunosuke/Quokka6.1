"use client";

import { useState } from "react";
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
import { createCompetition, updateCompetition } from "../actions";
import { Tables } from "@/types/supabase";

type Competition = Tables<"competitions">;

interface CompetitionFormProps {
  competition?: Competition;
  onClose: () => void;
}

export default function CompetitionForm({
  competition,
  onClose,
}: CompetitionFormProps) {
  const [loading, setLoading] = useState(false);
  const isEditing = !!competition;

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      if (isEditing && competition) {
        await updateCompetition(competition.id, formData);
      } else {
        await createCompetition(formData);
      }
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
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
                <Label htmlFor="detailed_description">
                  Detailed Description
                </Label>
                <Textarea
                  id="detailed_description"
                  name="detailed_description"
                  defaultValue={competition?.detailed_description || ""}
                  placeholder="Detailed description with rules and requirements"
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
                    <SelectItem value="Design & Art">Design & Art</SelectItem>
                    <SelectItem value="Photography">Photography</SelectItem>
                    <SelectItem value="Writing">Writing</SelectItem>
                    <SelectItem value="Video & Film">Video & Film</SelectItem>
                    <SelectItem value="Music & Audio">Music & Audio</SelectItem>
                    <SelectItem value="Innovation">Innovation</SelectItem>
                    <SelectItem value="Gaming">Gaming</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
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
                <Label htmlFor="difficulty_level">Difficulty Level *</Label>
                <Select
                  name="difficulty_level"
                  defaultValue={competition?.difficulty_level || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="All Levels">All Levels</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Competition Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Competition Details</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date *</Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="datetime-local"
                    defaultValue={
                      competition?.start_date
                        ? new Date(competition.start_date)
                            .toISOString()
                            .slice(0, 16)
                        : ""
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
                    defaultValue={
                      competition?.end_date
                        ? new Date(competition.end_date)
                            .toISOString()
                            .slice(0, 16)
                        : ""
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="submission_deadline">
                  Submission Deadline *
                </Label>
                <Input
                  id="submission_deadline"
                  name="submission_deadline"
                  type="datetime-local"
                  defaultValue={
                    competition?.submission_deadline
                      ? new Date(competition.submission_deadline)
                          .toISOString()
                          .slice(0, 16)
                      : ""
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
                    defaultValue={competition?.prize_currency || "USD"}
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

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_team_competition"
                    name="is_team_competition"
                    defaultChecked={competition?.is_team_competition || false}
                  />
                  <Label htmlFor="is_team_competition">Team Competition</Label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min_team_size">Min Team Size</Label>
                    <Input
                      id="min_team_size"
                      name="min_team_size"
                      type="number"
                      defaultValue={competition?.min_team_size || "1"}
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max_team_size">Max Team Size</Label>
                    <Input
                      id="max_team_size"
                      name="max_team_size"
                      type="number"
                      defaultValue={competition?.max_team_size || ""}
                      placeholder="Unlimited if empty"
                    />
                  </div>
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
