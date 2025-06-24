import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";
import MemberProfile from "@/components/member-profile";
import MemberSettings from "@/components/member-settings";
import LikedCompetitions from "@/components/liked-competitions";
import JoinedCompetitions from "@/components/joined-competitions";
import Gamification from "@/components/gamification";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, User, Settings, Heart, Users, Gamepad2 } from "lucide-react";
import DashboardNavbar from "@/components/dashboard-navbar";

export default async function MemberDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/member/login");
  }

  // Fetch user profile data from the profiles table
  const { data: userData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

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
                      {savedCompetitions?.length || 0}
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
                    <p className="text-2xl font-bold">
                      {submissions?.length || 0}
                    </p>
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
                      {submissions?.filter((s) => s.status === "submitted")
                        .length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Level</p>
                    <p className="text-2xl font-bold">1</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="liked" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Liked
            </TabsTrigger>
            <TabsTrigger value="joined" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Joined
            </TabsTrigger>
            <TabsTrigger value="past" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Past
            </TabsTrigger>
            <TabsTrigger
              value="gamification"
              className="flex items-center gap-2"
            >
              <Gamepad2 className="h-4 w-4" />
              Rewards
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <MemberProfile user={user} userData={userData} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <MemberSettings user={user} userData={userData} />
          </TabsContent>

          <TabsContent value="liked" className="space-y-6">
            <LikedCompetitions competitions={savedCompetitions || []} />
          </TabsContent>

          <TabsContent value="joined" className="space-y-6">
            <JoinedCompetitions
              submissions={
                submissions?.filter(
                  (s) => s.competitions?.status === "active",
                ) || []
              }
              title="Active Competitions"
            />
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            <JoinedCompetitions
              submissions={
                submissions?.filter(
                  (s) => s.competitions?.status === "completed",
                ) || []
              }
              title="Past Competitions"
            />
          </TabsContent>

          <TabsContent value="gamification" className="space-y-6">
            <Gamification
              user={user}
              userData={userData}
              submissions={submissions || []}
              savedCompetitions={savedCompetitions || []}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
