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
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
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
} from "./ui/alert-dialog";
import {
  Bell,
  Shield,
  Mail,
  Smartphone,
  Globe,
  Trash2,
  Key,
  Eye,
  EyeOff,
} from "lucide-react";
import { createClient } from "../../supabase/client";
import { useRouter } from "next/navigation";

interface MemberSettingsProps {
  user: any;
  userData: any;
}

export default function MemberSettings({
  user,
  userData = {},
}: MemberSettingsProps) {
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    email: userData?.email_notifications ?? true,
    push: userData?.push_notifications ?? true,
    marketing: userData?.marketing_notifications ?? false,
    competitions: userData?.competition_notifications ?? true,
  });

  const [privacy, setPrivacy] = useState({
    profilePublic: userData?.profile_public ?? true,
    showEmail: userData?.show_email ?? false,
    showStats: userData?.show_stats ?? true,
  });

  const supabase = createClient();
  const router = useRouter();

  const handleNotificationUpdate = async (key: string, value: boolean) => {
    setLoading(true);
    try {
      const updatedNotifications = { ...notifications, [key]: value };
      setNotifications(updatedNotifications);

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        [`${key}_notifications`]: value,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error updating notifications:", error);
      // Revert on error
      setNotifications(notifications);
    } finally {
      setLoading(false);
    }
  };

  const handlePrivacyUpdate = async (key: string, value: boolean) => {
    setLoading(true);
    try {
      const updatedPrivacy = { ...privacy, [key]: value };
      setPrivacy(updatedPrivacy);

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        [key === "profilePublic"
          ? "profile_public"
          : key === "showEmail"
            ? "show_email"
            : "show_stats"]: value,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error updating privacy:", error);
      // Revert on error
      setPrivacy(privacy);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) throw error;

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      alert("Password updated successfully");
    } catch (error: any) {
      console.error("Error updating password:", error);
      alert(error.message || "Error updating password");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      // First delete user data
      await supabase.from("profiles").delete().eq("id", user.id);

      // Then sign out
      await supabase.auth.signOut();

      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Error deleting account. Please contact support.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Account Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account Security
          </CardTitle>
          <CardDescription>
            Manage your password and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Key className="h-4 w-4" />
              Change Password
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    placeholder="Enter new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <Button
              onClick={handlePasswordChange}
              disabled={
                loading ||
                !passwordData.newPassword ||
                !passwordData.confirmPassword
              }
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="font-medium">Account Status</h4>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-green-600 border-green-600"
              >
                Active
              </Badge>
              <span className="text-sm text-muted-foreground">
                Account created on{" "}
                {new Date(user?.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Choose what notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <Label>Email Notifications</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Receive important updates via email
                </p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) =>
                  handleNotificationUpdate("email", checked)
                }
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  <Label>Push Notifications</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Get notified about real-time updates
                </p>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked) =>
                  handleNotificationUpdate("push", checked)
                }
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <Label>Competition Updates</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Notifications about competitions you've joined
                </p>
              </div>
              <Switch
                checked={notifications.competitions}
                onCheckedChange={(checked) =>
                  handleNotificationUpdate("competitions", checked)
                }
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Marketing Communications</Label>
                <p className="text-sm text-muted-foreground">
                  Promotional emails and newsletters
                </p>
              </div>
              <Switch
                checked={notifications.marketing}
                onCheckedChange={(checked) =>
                  handleNotificationUpdate("marketing", checked)
                }
                disabled={loading}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Privacy Settings
          </CardTitle>
          <CardDescription>
            Control what information is visible to others
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Public Profile</Label>
                <p className="text-sm text-muted-foreground">
                  Make your profile visible to other users
                </p>
              </div>
              <Switch
                checked={privacy.profilePublic}
                onCheckedChange={(checked) =>
                  handlePrivacyUpdate("profilePublic", checked)
                }
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Email</Label>
                <p className="text-sm text-muted-foreground">
                  Display your email address on your profile
                </p>
              </div>
              <Switch
                checked={privacy.showEmail}
                onCheckedChange={(checked) =>
                  handlePrivacyUpdate("showEmail", checked)
                }
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Statistics</Label>
                <p className="text-sm text-muted-foreground">
                  Display your competition stats and achievements
                </p>
              </div>
              <Switch
                checked={privacy.showStats}
                onCheckedChange={(checked) =>
                  handlePrivacyUpdate("showStats", checked)
                }
                disabled={loading}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions that will affect your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full md:w-auto">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove all your data from our servers,
                  including:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Your profile information</li>
                    <li>Competition submissions</li>
                    <li>Saved competitions</li>
                    <li>Achievement progress</li>
                  </ul>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete Account"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
