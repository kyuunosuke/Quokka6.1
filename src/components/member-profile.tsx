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
  User,
  Mail,
  Calendar,
  MapPin,
  Edit,
  Save,
  X,
  Camera,
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
    full_name: userData?.full_name || "",
    email: userData?.email || user?.email || "",
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
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        ...formData,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: userData?.full_name || "",
      email: userData?.email || user?.email || "",
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
                  {formData.full_name || "Member"}
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

      {/* Profile Details */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Manage your personal information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              {isEditing ? (
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="p-2 bg-muted rounded-md">
                  {formData.full_name || "Not provided"}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="p-2 bg-muted rounded-md text-muted-foreground">
                {formData.email}
              </div>
              <p className="text-xs text-muted-foreground">
                Email cannot be changed here. Contact support if needed.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              {isEditing ? (
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="City, Country"
                />
              ) : (
                <div className="p-2 bg-muted rounded-md flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {formData.location || "Not provided"}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              {isEditing ? (
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  placeholder="https://yourwebsite.com"
                />
              ) : (
                <div className="p-2 bg-muted rounded-md">
                  {formData.website ? (
                    <a
                      href={formData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {formData.website}
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+1 (555) 123-4567"
                />
              ) : (
                <div className="p-2 bg-muted rounded-md">
                  {formData.phone || "Not provided"}
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            {isEditing ? (
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Tell us about yourself..."
                rows={4}
              />
            ) : (
              <div className="p-3 bg-muted rounded-md min-h-[100px]">
                {formData.bio || "No bio provided"}
              </div>
            )}
          </div>

          <Separator />

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
