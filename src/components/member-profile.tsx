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
} from "lucide-react";
import { createClient } from "../../supabase/client";
import { useRouter } from "next/navigation";

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
  const [formData, setFormData] = useState({
    // Basic Information
    nickname: userData?.nickname || "",
    email: userData?.email || user?.email || "",

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

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={userData?.avatar_url} />
                  <AvatarFallback className="text-lg">
                    {getInitials(formData.full_name || formData.email)}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
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
                  <Badge variant="outline">Level 1</Badge>
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

      {/* Basic Information Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-blue-600" />
            <CardTitle>Basic Information</CardTitle>
          </div>
          <CardDescription>Your essential profile details</CardDescription>
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
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            <CardTitle>General Profile</CardTitle>
          </div>
          <CardDescription>
            Your personal information and demographics
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
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-purple-600" />
            <CardTitle>Demographic & Lifestyle</CardTitle>
          </div>
          <CardDescription>
            Your interests, lifestyle, and background information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="interests">Interests</Label>
              {isEditing ? (
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
              {isEditing ? (
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
              {isEditing ? (
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
              {isEditing ? (
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
              {isEditing ? (
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
              {isEditing ? (
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
              {isEditing ? (
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
              {isEditing ? (
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
              {isEditing ? (
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
              {isEditing ? (
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
              {isEditing ? (
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
