"use client";

import { useRouter } from "next/navigation";
import { createClient } from "../../../supabase/client";
import MemberProfile from "@/components/member-profile";
import MemberSettings from "@/components/member-settings";
import LikedCompetitions from "@/components/liked-competitions";
import JoinedCompetitions from "@/components/joined-competitions";
import Gamification from "@/components/gamification";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  User,
  Settings,
  Heart,
  Users,
  Gamepad2,
  Loader2,
  Star,
} from "lucide-react";
import DashboardNavbar from "@/components/dashboard-navbar";
import {
  calculateProfileLevel,
  getLevelBadgeColor,
} from "@/utils/profile-levels";

export default function MemberDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [savedCompetitions, setSavedCompetitions] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/member/login");
          return;
        }

        setUser(user);

        // Fetch user profile data from the profiles table
        const { data: userData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        setUserData(userData);

        // Fetch user's competition data
        const { data: savedCompetitions } = await supabase
          .from("saved_competitions")
          .select(
            `
            *,
            competitions (
              id,
              title,
              description,
              category,
              status,
              start_date,
              end_date,
              prize_amount,
              prize_currency,
              thumbnail_url
            )
          `,
          )
          .eq("user_id", user.id);

        setSavedCompetitions(savedCompetitions || []);

        const { data: submissions } = await supabase
          .from("competition_submissions")
          .select(
            `
            *,
            competitions (
              id,
              title,
              description,
              category,
              status,
              start_date,
              end_date,
              prize_amount,
              prize_currency,
              thumbnail_url
            )
          `,
          )
          .eq("user_id", user.id);

        setSubmissions(submissions || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Calculate profile level
  const profileLevel = calculateProfileLevel(userData);

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Member Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {userData?.full_name || user.email}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Liked</p>
                    <p className="text-2xl font-bold">
                      {savedCompetitions.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Joined</p>
                    <p className="text-2xl font-bold">{submissions.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">
                      {
                        submissions.filter((s) => s.status === "submitted")
                          .length
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card
              className={`${getLevelBadgeColor(profileLevel.level)} border-2`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-current" />
                  <div>
                    <p className="text-sm text-current opacity-80">Rank</p>
                    <p className="text-2xl font-bold text-current">
                      {profileLevel.level}
                    </p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-current opacity-70">
                  {profileLevel.progress}% Complete
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Tabs */}
        <MemberTabs
          savedCompetitions={savedCompetitions}
          submissions={submissions}
          user={user}
          userData={userData}
          profileLevel={profileLevel}
        />
      </main>
    </div>
  );
}

function MemberTabs({
  savedCompetitions,
  submissions,
  user,
  userData,
  profileLevel,
}: {
  savedCompetitions: any[];
  submissions: any[];
  user: any;
  userData: any;
  profileLevel: any;
}) {
  const [activeTab, setActiveTab] = useState("liked");

  return (
    <>
      {/* Coming Soon Banner - Only show on Joined tab */}
      {activeTab === "joined" && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <p className="text-yellow-800 font-medium">
              This feature is coming soon
            </p>
          </div>
        </div>
      )}

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex gap-6"
      >
        <TabsList className="flex flex-col h-fit w-48 p-2">
          <TabsTrigger
            value="liked"
            className="flex items-center gap-2 w-full justify-start"
          >
            <Heart className="h-4 w-4" />
            Liked
          </TabsTrigger>
          <TabsTrigger
            value="joined"
            className="flex items-center gap-2 w-full justify-start"
          >
            <Users className="h-4 w-4" />
            Joined
          </TabsTrigger>
          <TabsTrigger
            value="past"
            className="flex items-center gap-2 w-full justify-start"
          >
            <Trophy className="h-4 w-4" />
            Past
          </TabsTrigger>
          <TabsTrigger
            value="gamification"
            className="flex items-center gap-2 w-full justify-start"
          >
            <Gamepad2 className="h-4 w-4" />
            Rewards
          </TabsTrigger>
          <div className="flex-1" />
          <TabsTrigger
            value="profile"
            className="flex items-center gap-2 w-full justify-start mt-4"
          >
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="flex items-center gap-2 w-full justify-start"
          >
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <div className="flex-1">
          <TabsContent value="profile" className="space-y-6">
            <MemberProfile user={user} userData={userData} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <MemberSettings user={user} userData={userData} />
          </TabsContent>

          <TabsContent value="liked" className="space-y-6">
            <LikedCompetitions competitions={savedCompetitions} />
          </TabsContent>

          <TabsContent value="joined" className="space-y-6">
            <JoinedCompetitions
              submissions={submissions.filter(
                (s) => s.competitions?.status === "active",
              )}
              title="Active Competitions"
            />
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            <JoinedCompetitions
              submissions={submissions.filter(
                (s) => s.competitions?.status === "completed",
              )}
              title="Past Competitions"
            />
          </TabsContent>

          <TabsContent value="gamification" className="space-y-6">
            <Gamification
              user={user}
              userData={userData}
              submissions={submissions}
              savedCompetitions={savedCompetitions}
            />
          </TabsContent>
        </div>
      </Tabs>
    </>
  );
}
