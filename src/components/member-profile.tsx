"use client";

import { useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Edit,
  Save,
  X,
  Camera,
  UserCheck,
  Users,
  Heart,
  Star,
  AlertTriangle,
  CheckCircle,
  Lock,
  Shield,
  Upload,
  FileText,
  Clock,
} from "lucide-react";
import { createClient } from "../../supabase/client";
import { useRouter } from "next/navigation";
import {
  calculateProfileLevel,
  getLevelBadgeColor,
  getProgressBarColor,
} from "@/utils/profile-levels";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";

interface MemberProfileProps {
  user: any;
  userData: any;
}

export default function MemberProfile({
  user,
  userData = {},
}: MemberProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Information
    nickname: userData?.nickname || "",
    email: userData?.email || user?.email || "",
    avatar_url: userData?.avatar_url || "",

    // General Profile
    first_name: userData?.first_name || "",
    last_name: userData?.last_name || "",
    gender: userData?.gender || "",
    date_of_birth: userData?.date_of_birth || "",
    postcode: userData?.postcode || "",

    // Demographic & Lifestyle
    interests: userData?.interests || [],
    hobbies: userData?.hobbies || [],
    occupation: userData?.occupation || "",
    marital_status: userData?.marital_status || "",
    income_range: userData?.income_range || "",
    education: userData?.education || "",
    ethnicity: userData?.ethnicity || "",
    languages_spoken: userData?.languages_spoken || [],
    home_ownership: userData?.home_ownership || "",
    vehicle_ownership: userData?.vehicle_ownership || "",
    pet_ownership: userData?.pet_ownership || "",

    // Legacy fields
    full_name: userData?.full_name || "",
    bio: userData?.bio || "",
    location: userData?.location || "",
    website: userData?.website || "",
    phone: userData?.phone || "",
  });

  const supabase = createClient();
  const router = useRouter();

  const handleSave = async () => {
    setLoading(true);
    try {
      // Prepare the data for upsert - ensure arrays are properly formatted
      const profileData = {
        id: user.id,
        nickname: formData.nickname || null,
        email: formData.email || null,
        avatar_url: formData.avatar_url || null,
        first_name: formData.first_name || null,
        last_name: formData.last_name || null,
        gender: formData.gender || null,
        date_of_birth: formData.date_of_birth || null,
        postcode: formData.postcode || null,
        interests: Array.isArray(formData.interests)
          ? formData.interests.filter((i) => i.trim() !== "")
          : [],
        hobbies: Array.isArray(formData.hobbies)
          ? formData.hobbies.filter((h) => h.trim() !== "")
          : [],
        occupation: formData.occupation || null,
        marital_status: formData.marital_status || null,
        income_range: formData.income_range || null,
        education: formData.education || null,
        ethnicity: formData.ethnicity || null,
        languages_spoken: Array.isArray(formData.languages_spoken)
          ? formData.languages_spoken.filter((l) => l.trim() !== "")
          : [],
        home_ownership: formData.home_ownership || null,
        vehicle_ownership: formData.vehicle_ownership || null,
        pet_ownership: formData.pet_ownership || null,
        full_name: formData.full_name || null,
        bio: formData.bio || null,
        location: formData.location || null,
        website: formData.website || null,
        phone: formData.phone || null,
        role: userData?.role || "member",
        updated_at: new Date().toISOString(),
      };

      console.log("Saving profile data:", profileData);

      const { data, error } = await supabase
        .from("profiles")
        .upsert(profileData, {
          onConflict: "id",
          ignoreDuplicates: false,
        })
        .select();

      if (error) {
        console.error("Supabase error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        throw new Error(`Database error: ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error("No data returned from save operation");
      }

      console.log("Profile saved successfully:", data);
      setIsEditing(false);

      // Show success message
      alert("Profile updated successfully!");

      // Force a page refresh to get updated data
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      alert(`Failed to save profile: ${errorMessage}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      // Basic Information
      nickname: userData?.nickname || "",
      email: userData?.email || user?.email || "",
      avatar_url: userData?.avatar_url || "",

      // General Profile
      first_name: userData?.first_name || "",
      last_name: userData?.last_name || "",
      gender: userData?.gender || "",
      date_of_birth: userData?.date_of_birth || "",
      postcode: userData?.postcode || "",

      // Demographic & Lifestyle
      interests: userData?.interests || [],
      hobbies: userData?.hobbies || [],
      occupation: userData?.occupation || "",
      marital_status: userData?.marital_status || "",
      income_range: userData?.income_range || "",
      education: userData?.education || "",
      ethnicity: userData?.ethnicity || "",
      languages_spoken: userData?.languages_spoken || [],
      home_ownership: userData?.home_ownership || "",
      vehicle_ownership: userData?.vehicle_ownership || "",
      pet_ownership: userData?.pet_ownership || "",

      // Legacy fields
      full_name: userData?.full_name || "",
      bio: userData?.bio || "",
      location: userData?.location || "",
      website: userData?.website || "",
      phone: userData?.phone || "",
    });
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Calculate profile level and progress
  const profileLevel = calculateProfileLevel(userData);
  const canEditDemographic =
    profileLevel.canAdvanceToLevel3 || profileLevel.level >= 3;
  const canEditVerification =
    profileLevel.canAdvanceToLevel4 || profileLevel.level === 4;

  // Handle document upload
  const handleDocumentUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a valid document (JPEG, PNG, or PDF)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setUploadingDocument(true);
    try {
      // Upload to Supabase Storage
      const fileName = `${user.id}-${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("verification-documents")
        .upload(fileName, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        alert("Failed to upload document. Please try again.");
        return;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage
        .from("verification-documents")
        .getPublicUrl(fileName);

      // Update profile with document info
      const documentInfo = {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadedAt: new Date().toISOString(),
        storageUrl: publicUrl,
      };

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          verification_documents: documentInfo,
          verification_status: "pending",
          verification_submitted_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) {
        console.error("Profile update error:", updateError);
        alert("Failed to update verification status. Please try again.");
        return;
      }

      alert(
        "Document uploaded successfully! Your verification is now pending admin approval.",
      );
      window.location.reload();
    } catch (error) {
      console.error("Document upload error:", error);
      alert("An error occurred while uploading. Please try again.");
    } finally {
      setUploadingDocument(false);
    }
  };

  // Get verification status display
  const getVerificationStatusDisplay = () => {
    const status = userData?.verification_status || "not_submitted";
    switch (status) {
      case "pending":
        return {
          text: "Pending Approval",
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
          borderColor: "border-yellow-200",
          icon: <Clock className="h-4 w-4" />,
        };
      case "approved":
        return {
          text: "Verified",
          color: "text-green-600",
          bgColor: "bg-green-100",
          borderColor: "border-green-200",
          icon: <CheckCircle className="h-4 w-4" />,
        };
      case "rejected":
        return {
          text: "Rejected",
          color: "text-red-600",
          bgColor: "bg-red-100",
          borderColor: "border-red-200",
          icon: <AlertTriangle className="h-4 w-4" />,
        };
      default:
        return {
          text: "Not Submitted",
          color: "text-gray-600",
          bgColor: "bg-gray-100",
          borderColor: "border-gray-200",
          icon: <FileText className="h-4 w-4" />,
        };
    }
  };

  const verificationStatus = getVerificationStatusDisplay();

  // Available avatar options
  const avatarOptions = [
    { id: "avatar1", url: "/avatars/avatar1.png", name: "Quokka with Avocado" },
    {
      id: "avatar2",
      url: "/avatars/avatar2.png",
      name: "Quokka Hugging Avocado",
    },
    {
      id: "avatar3",
      url: "/avatars/avatar3.png",
      name: "Quokka with Avocado Hat",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="cursor-pointer hover:opacity-80 transition-opacity">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={formData.avatar_url} />
                        <AvatarFallback className="text-lg">
                          {getInitials(formData.full_name || formData.email)}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <Camera className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                  </PopoverTrigger>
                  {isEditing && (
                    <PopoverContent className="w-80">
                      <div className="space-y-4">
                        <div className="text-center">
                          <h4 className="font-medium text-base">
                            Choose Your Avatar
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Select one of the available avatar options
                          </p>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          {avatarOptions.map((avatar) => (
                            <div key={avatar.id} className="text-center">
                              <div
                                className={`relative cursor-pointer rounded-lg p-2 border-2 transition-all ${
                                  formData.avatar_url === avatar.url
                                    ? "border-blue-500 bg-blue-100"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                                onClick={() =>
                                  setFormData({
                                    ...formData,
                                    avatar_url: avatar.url,
                                  })
                                }
                              >
                                <Avatar className="h-16 w-16 mx-auto">
                                  <AvatarImage
                                    src={avatar.url}
                                    alt={avatar.name}
                                  />
                                  <AvatarFallback>?</AvatarFallback>
                                </Avatar>
                                {formData.avatar_url === avatar.url && (
                                  <div className="absolute -top-1 -right-1 h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center">
                                    <CheckCircle className="h-3 w-3 text-white" />
                                  </div>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {avatar.name}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  )}
                </Popover>
              </div>
              <div>
                <CardTitle className="text-2xl">
                  {formData.nickname ||
                    formData.first_name ||
                    formData.full_name ||
                    "Member"}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {formData.email}
                </CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">
                    {userData?.role
                      ? userData.role.charAt(0).toUpperCase() +
                        userData.role.slice(1)
                      : "Member"}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`${getLevelBadgeColor(profileLevel.level)} flex items-center gap-1`}
                  >
                    <Star className="h-3 w-3" />
                    Rank {profileLevel.level}
                  </Badge>
                </div>

                {/* Profile Progress */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Profile Completion
                    </span>
                    <span className="font-medium">
                      {profileLevel.progress}%
                    </span>
                  </div>
                  <Progress value={profileLevel.progress} className="h-2" />
                  {profileLevel.nextLevelRequirements.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {profileLevel.nextLevelRequirements[0]}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Saving..." : "Save"}
                  </Button>
                  <Button onClick={handleCancel} variant="outline">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Level Progress Overview */}
      {profileLevel.nextLevelRequirements.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-blue-900">Rank Progress</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm text-blue-800">
                {profileLevel.nextLevelRequirements.map((req, index) => (
                  <div
                    key={index}
                    className={index === 0 ? "font-medium mb-2" : "ml-2"}
                  >
                    {req}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Warning for Level 3 access */}
      {profileLevel.warningMessage && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            {profileLevel.warningMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Basic Information Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-blue-600" />
              <CardTitle>Basic Information</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            <Badge
              variant="outline"
              className="bg-green-100 text-green-800 border-green-200"
            >
              Rank 1 Complete
            </Badge>
          </div>
          <CardDescription>
            Your essential profile details (Required for Rank 1)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nickname">Nickname</Label>
              {isEditing ? (
                <Input
                  id="nickname"
                  value={formData.nickname}
                  onChange={(e) =>
                    setFormData({ ...formData, nickname: e.target.value })
                  }
                  placeholder="Enter your nickname"
                />
              ) : (
                <div className="p-2 bg-muted rounded-md">
                  {formData.nickname || "Not provided"}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="p-2 bg-muted rounded-md text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {formData.email}
              </div>
              <p className="text-xs text-muted-foreground">
                Email cannot be changed here. Contact support if needed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* General Profile Card */}
      <Card
        className={
          profileLevel.level >= 2 ? "border-green-200" : "border-orange-200"
        }
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              <CardTitle>General Profile</CardTitle>
              {profileLevel.level >= 2 ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              )}
            </div>
            <Badge
              variant="outline"
              className={
                profileLevel.level >= 2
                  ? "bg-green-100 text-green-800 border-green-200"
                  : "bg-orange-100 text-orange-800 border-orange-200"
              }
            >
              {profileLevel.level >= 2
                ? "Rank 2 Complete"
                : "Required for Rank 2"}
            </Badge>
          </div>
          <CardDescription>
            Your personal information and demographics (Required for Rank 2)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              {isEditing ? (
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  placeholder="Enter your first name"
                />
              ) : (
                <div className="p-2 bg-muted rounded-md">
                  {formData.first_name || "Not provided"}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              {isEditing ? (
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                  placeholder="Enter your last name"
                />
              ) : (
                <div className="p-2 bg-muted rounded-md">
                  {formData.last_name || "Not provided"}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              {isEditing ? (
                <Select
                  value={formData.gender}
                  onValueChange={(value) =>
                    setFormData({ ...formData, gender: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="prefer-not-to-say">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-2 bg-muted rounded-md">
                  {formData.gender || "Not provided"}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              {isEditing ? (
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) =>
                    setFormData({ ...formData, date_of_birth: e.target.value })
                  }
                />
              ) : (
                <div className="p-2 bg-muted rounded-md flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formData.date_of_birth
                    ? new Date(formData.date_of_birth).toLocaleDateString()
                    : "Not provided"}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="postcode">Postcode</Label>
              {isEditing ? (
                <Input
                  id="postcode"
                  value={formData.postcode}
                  onChange={(e) =>
                    setFormData({ ...formData, postcode: e.target.value })
                  }
                  placeholder="Enter your postcode"
                />
              ) : (
                <div className="p-2 bg-muted rounded-md flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {formData.postcode || "Not provided"}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demographic & Lifestyle Card */}
      <Card
        className={
          profileLevel.level === 3
            ? "border-green-200"
            : canEditDemographic
              ? "border-purple-200"
              : "border-gray-200 opacity-75"
        }
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-purple-600" />
              <CardTitle className={!canEditDemographic ? "text-gray-500" : ""}>
                Demographic & Lifestyle
              </CardTitle>
              {profileLevel.level === 3 ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : canEditDemographic ? (
                <AlertTriangle className="h-4 w-4 text-purple-500" />
              ) : (
                <Lock className="h-4 w-4 text-gray-400" />
              )}
            </div>
            <Badge
              variant="outline"
              className={
                profileLevel.level === 3
                  ? "bg-green-100 text-green-800 border-green-200"
                  : canEditDemographic
                    ? "bg-purple-100 text-purple-800 border-purple-200"
                    : "bg-gray-100 text-gray-600 border-gray-200"
              }
            >
              {profileLevel.level === 3
                ? "Rank 3 Complete"
                : canEditDemographic
                  ? "Required for Rank 3"
                  : "Locked - Complete Rank 2 First"}
            </Badge>
          </div>
          <CardDescription
            className={!canEditDemographic ? "text-gray-500" : ""}
          >
            Your interests, lifestyle, and background information (Required for
            Rank 3)
            {!canEditDemographic && (
              <div className="mt-2 text-amber-600 text-sm font-medium">
                ⚠️ Complete General Profile section first to unlock this section
              </div>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent
          className={`space-y-4 ${!canEditDemographic ? "opacity-50" : ""}`}
        >
          {!canEditDemographic && (
            <Alert className="border-amber-200 bg-amber-50 mb-4">
              <Lock className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                Complete all General Profile fields to unlock this section and
                advance to Rank 3.
              </AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="interests">Interests</Label>
              {isEditing && canEditDemographic ? (
                <Textarea
                  id="interests"
                  value={
                    Array.isArray(formData.interests)
                      ? formData.interests.join(", ")
                      : formData.interests
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      interests: e.target.value.split(",").map((s) => s.trim()),
                    })
                  }
                  placeholder="Enter your interests (comma separated)"
                  rows={2}
                />
              ) : (
                <div className="p-2 bg-muted rounded-md">
                  {Array.isArray(formData.interests) &&
                  formData.interests.length > 0
                    ? formData.interests.join(", ")
                    : "Not provided"}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hobbies">Hobbies</Label>
              {isEditing && canEditDemographic ? (
                <Textarea
                  id="hobbies"
                  value={
                    Array.isArray(formData.hobbies)
                      ? formData.hobbies.join(", ")
                      : formData.hobbies
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hobbies: e.target.value.split(",").map((s) => s.trim()),
                    })
                  }
                  placeholder="Enter your hobbies (comma separated)"
                  rows={2}
                />
              ) : (
                <div className="p-2 bg-muted rounded-md">
                  {Array.isArray(formData.hobbies) &&
                  formData.hobbies.length > 0
                    ? formData.hobbies.join(", ")
                    : "Not provided"}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              {isEditing && canEditDemographic ? (
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) =>
                    setFormData({ ...formData, occupation: e.target.value })
                  }
                  placeholder="Enter your occupation"
                />
              ) : (
                <div className="p-2 bg-muted rounded-md">
                  {formData.occupation || "Not provided"}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="marital_status">Marital Status</Label>
              {isEditing && canEditDemographic ? (
                <Select
                  value={formData.marital_status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, marital_status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select marital status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                    <SelectItem value="separated">Separated</SelectItem>
                    <SelectItem value="prefer-not-to-say">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-2 bg-muted rounded-md">
                  {formData.marital_status || "Not provided"}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="income_range">Income Range</Label>
              {isEditing && canEditDemographic ? (
                <Select
                  value={formData.income_range}
                  onValueChange={(value) =>
                    setFormData({ ...formData, income_range: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select income range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-25k">Under $25,000</SelectItem>
                    <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                    <SelectItem value="50k-75k">$50,000 - $75,000</SelectItem>
                    <SelectItem value="75k-100k">$75,000 - $100,000</SelectItem>
                    <SelectItem value="100k-150k">
                      $100,000 - $150,000
                    </SelectItem>
                    <SelectItem value="over-150k">Over $150,000</SelectItem>
                    <SelectItem value="prefer-not-to-say">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-2 bg-muted rounded-md">
                  {formData.income_range || "Not provided"}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="education">Education</Label>
              {isEditing && canEditDemographic ? (
                <Select
                  value={formData.education}
                  onValueChange={(value) =>
                    setFormData({ ...formData, education: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-school">High School</SelectItem>
                    <SelectItem value="some-college">Some College</SelectItem>
                    <SelectItem value="associates">
                      Associate's Degree
                    </SelectItem>
                    <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                    <SelectItem value="masters">Master's Degree</SelectItem>
                    <SelectItem value="doctorate">Doctorate</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-2 bg-muted rounded-md">
                  {formData.education || "Not provided"}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ethnicity">Ethnicity</Label>
              {isEditing && canEditDemographic ? (
                <Input
                  id="ethnicity"
                  value={formData.ethnicity}
                  onChange={(e) =>
                    setFormData({ ...formData, ethnicity: e.target.value })
                  }
                  placeholder="Enter your ethnicity"
                />
              ) : (
                <div className="p-2 bg-muted rounded-md">
                  {formData.ethnicity || "Not provided"}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="languages_spoken">Languages Spoken</Label>
              {isEditing && canEditDemographic ? (
                <Textarea
                  id="languages_spoken"
                  value={
                    Array.isArray(formData.languages_spoken)
                      ? formData.languages_spoken.join(", ")
                      : formData.languages_spoken
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      languages_spoken: e.target.value
                        .split(",")
                        .map((s) => s.trim()),
                    })
                  }
                  placeholder="Enter languages (comma separated)"
                  rows={2}
                />
              ) : (
                <div className="p-2 bg-muted rounded-md">
                  {Array.isArray(formData.languages_spoken) &&
                  formData.languages_spoken.length > 0
                    ? formData.languages_spoken.join(", ")
                    : "Not provided"}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="home_ownership">Home Ownership</Label>
              {isEditing && canEditDemographic ? (
                <Select
                  value={formData.home_ownership}
                  onValueChange={(value) =>
                    setFormData({ ...formData, home_ownership: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select home ownership" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="own">Own</SelectItem>
                    <SelectItem value="rent">Rent</SelectItem>
                    <SelectItem value="live-with-family">
                      Live with family
                    </SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-2 bg-muted rounded-md">
                  {formData.home_ownership || "Not provided"}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicle_ownership">Vehicle Ownership</Label>
              {isEditing && canEditDemographic ? (
                <Select
                  value={formData.vehicle_ownership}
                  onValueChange={(value) =>
                    setFormData({ ...formData, vehicle_ownership: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle ownership" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="own-car">Own a car</SelectItem>
                    <SelectItem value="own-multiple">
                      Own multiple vehicles
                    </SelectItem>
                    <SelectItem value="no-vehicle">No vehicle</SelectItem>
                    <SelectItem value="use-public-transport">
                      Use public transport
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-2 bg-muted rounded-md">
                  {formData.vehicle_ownership || "Not provided"}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pet_ownership">Pet Ownership</Label>
              {isEditing && canEditDemographic ? (
                <Select
                  value={formData.pet_ownership}
                  onValueChange={(value) =>
                    setFormData({ ...formData, pet_ownership: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select pet ownership" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dog">Dog</SelectItem>
                    <SelectItem value="cat">Cat</SelectItem>
                    <SelectItem value="both">Both dog and cat</SelectItem>
                    <SelectItem value="other-pets">Other pets</SelectItem>
                    <SelectItem value="no-pets">No pets</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-2 bg-muted rounded-md">
                  {formData.pet_ownership || "Not provided"}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Card */}
      <Card
        className={
          profileLevel.level === 4
            ? "border-purple-200"
            : canEditVerification
              ? "border-indigo-200"
              : "border-gray-200 opacity-75"
        }
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-indigo-600" />
              <CardTitle
                className={!canEditVerification ? "text-gray-500" : ""}
              >
                Identity Verification
              </CardTitle>
              {profileLevel.level === 4 ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : canEditVerification ? (
                verificationStatus.icon
              ) : (
                <Lock className="h-4 w-4 text-gray-400" />
              )}
            </div>
            <Badge
              variant="outline"
              className={
                profileLevel.level === 4
                  ? "bg-purple-100 text-purple-800 border-purple-200"
                  : canEditVerification
                    ? `${verificationStatus.bgColor} ${verificationStatus.color} ${verificationStatus.borderColor}`
                    : "bg-gray-100 text-gray-600 border-gray-200"
              }
            >
              {profileLevel.level === 4
                ? "Rank 4 Complete"
                : canEditVerification
                  ? verificationStatus.text
                  : "Locked - Complete Rank 3 First"}
            </Badge>
          </div>
          <CardDescription
            className={!canEditVerification ? "text-gray-500" : ""}
          >
            Identity verification is optional and only required when prizes need
            to be distributed to ensure proper recipient identification.
            {!canEditVerification && (
              <div className="mt-2 text-amber-600 text-sm font-medium">
                ⚠️ Complete Demographic & Lifestyle section first to unlock
                verification
              </div>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent
          className={`space-y-4 ${!canEditVerification ? "opacity-50" : ""}`}
        >
          {!canEditVerification && (
            <Alert className="border-amber-200 bg-amber-50 mb-4">
              <Lock className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                Complete all Demographic & Lifestyle fields to unlock identity
                verification and advance to Rank 4.
              </AlertDescription>
            </Alert>
          )}

          {canEditVerification && (
            <div className="space-y-4">
              {/* Current Status */}
              <div className="p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  {verificationStatus.icon}
                  <span className="font-medium">Verification Status:</span>
                  <span className={verificationStatus.color}>
                    {verificationStatus.text}
                  </span>
                </div>

                {userData?.verification_status === "pending" && (
                  <p className="text-sm text-muted-foreground">
                    Your document has been submitted and is awaiting admin
                    review. You will be notified once the verification is
                    complete.
                  </p>
                )}

                {userData?.verification_status === "approved" &&
                  userData?.verification_approved_at && (
                    <p className="text-sm text-muted-foreground">
                      Verified on{" "}
                      {new Date(
                        userData.verification_approved_at,
                      ).toLocaleDateString()}
                    </p>
                  )}

                {userData?.verification_status === "rejected" && (
                  <div className="mt-2">
                    <p className="text-sm text-red-600 font-medium">
                      Rejection Reason:
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {userData?.verification_rejection_reason ||
                        "No reason provided"}
                    </p>
                  </div>
                )}
              </div>

              {/* Document Upload */}
              {(userData?.verification_status === "not_submitted" ||
                userData?.verification_status === "rejected") && (
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">
                      Upload Identification Document
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Please upload a clear photo of your Passport or Driver's
                      License (JPEG, PNG, or PDF, max 5MB)
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      id="verification-document"
                      accept="image/jpeg,image/png,image/jpg,application/pdf"
                      onChange={handleDocumentUpload}
                      disabled={uploadingDocument}
                      className="hidden"
                    />
                    <Button
                      onClick={() =>
                        document
                          .getElementById("verification-document")
                          ?.click()
                      }
                      disabled={uploadingDocument}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      {uploadingDocument ? "Uploading..." : "Choose Document"}
                    </Button>
                  </div>

                  <Alert className="border-blue-200 bg-blue-50">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      Your document will be securely stored and only used for
                      identity verification purposes. It will be reviewed by our
                      admin team within 1-2 business days.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Document Info */}
              {userData?.verification_documents && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Uploaded Document:
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {userData.verification_documents.fileName}
                  </p>
                  {userData.verification_submitted_at && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Submitted on{" "}
                      {new Date(
                        userData.verification_submitted_at,
                      ).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Member Info Footer */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Joined:</span>
              <span>
                {new Date(
                  userData?.created_at || user?.created_at,
                ).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Member ID:</span>
              <span className="font-mono text-xs">
                {user?.id?.slice(0, 8)}...
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
