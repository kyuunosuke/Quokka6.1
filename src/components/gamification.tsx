"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Trophy,
  Star,
  Target,
  Zap,
  Crown,
  Medal,
  Award,
  TrendingUp,
  Users,
  Calendar,
  Gift,
  Flame,
  Shield,
  Gem,
  Rocket,
  Heart,
  Brain,
  Lightbulb,
} from "lucide-react";
import { useState, useEffect } from "react";

interface GamificationProps {
  user: any;
  userData: any;
  submissions: any[];
  savedCompetitions: any[];
}

// Octalysis Framework Core Drives
const CORE_DRIVES = {
  MEANING: {
    name: "Epic Meaning & Calling",
    icon: Crown,
    color: "text-purple-600",
  },
  DEVELOPMENT: {
    name: "Development & Accomplishment",
    icon: Trophy,
    color: "text-yellow-600",
  },
  CREATIVITY: {
    name: "Empowerment & Creativity",
    icon: Lightbulb,
    color: "text-blue-600",
  },
  OWNERSHIP: {
    name: "Ownership & Possession",
    icon: Gem,
    color: "text-green-600",
  },
  SOCIAL: {
    name: "Social Influence & Relatedness",
    icon: Users,
    color: "text-pink-600",
  },
  SCARCITY: {
    name: "Scarcity & Impatience",
    icon: Flame,
    color: "text-red-600",
  },
  UNPREDICTABILITY: {
    name: "Unpredictability & Curiosity",
    icon: Star,
    color: "text-indigo-600",
  },
  AVOIDANCE: { name: "Loss & Avoidance", icon: Shield, color: "text-gray-600" },
};

export default function Gamification({
  user,
  userData = {},
  submissions = [],
  savedCompetitions = [],
}: GamificationProps) {
  const [userLevel, setUserLevel] = useState(1);
  const [userXP, setUserXP] = useState(0);
  const [nextLevelXP, setNextLevelXP] = useState(100);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [streaks, setStreaks] = useState({ current: 0, longest: 0 });
  const [leaderboardPosition, setLeaderboardPosition] = useState(0);

  useEffect(() => {
    calculateUserStats();
    generateAchievements();
  }, [submissions, savedCompetitions]);

  const calculateUserStats = () => {
    // Calculate XP based on activities
    let totalXP = 0;

    // XP from submissions
    totalXP += submissions.length * 50; // 50 XP per submission
    totalXP += submissions.filter((s) => s.status === "submitted").length * 100; // Bonus for completed

    // XP from saved competitions
    totalXP += savedCompetitions.length * 10; // 10 XP per saved competition

    // Calculate level (every 100 XP = 1 level)
    const level = Math.floor(totalXP / 100) + 1;
    const currentLevelXP = totalXP % 100;
    const nextLevel = level * 100;

    setUserLevel(level);
    setUserXP(currentLevelXP);
    setNextLevelXP(100);

    // Mock leaderboard position (in real app, this would come from backend)
    setLeaderboardPosition(Math.floor(Math.random() * 1000) + 1);
  };

  const generateAchievements = () => {
    const achievementsList = [];

    // First Steps (Epic Meaning)
    if (submissions.length >= 1) {
      achievementsList.push({
        id: "first_submission",
        title: "First Steps",
        description: "Made your first competition submission",
        icon: Rocket,
        drive: "MEANING",
        unlocked: true,
        rarity: "common",
      });
    }

    // Competitor (Development & Accomplishment)
    if (submissions.length >= 5) {
      achievementsList.push({
        id: "competitor",
        title: "Competitor",
        description: "Participated in 5 competitions",
        icon: Medal,
        drive: "DEVELOPMENT",
        unlocked: true,
        rarity: "uncommon",
      });
    }

    // Creative Mind (Empowerment & Creativity)
    if (
      submissions.filter((s) => s.submission_description?.length > 100)
        .length >= 3
    ) {
      achievementsList.push({
        id: "creative_mind",
        title: "Creative Mind",
        description: "Submitted 3 detailed creative entries",
        icon: Brain,
        drive: "CREATIVITY",
        unlocked: true,
        rarity: "rare",
      });
    }

    // Collector (Ownership & Possession)
    if (savedCompetitions.length >= 10) {
      achievementsList.push({
        id: "collector",
        title: "Collector",
        description: "Saved 10 competitions to your favorites",
        icon: Heart,
        drive: "OWNERSHIP",
        unlocked: true,
        rarity: "uncommon",
      });
    }

    // Early Bird (Scarcity & Impatience)
    achievementsList.push({
      id: "early_bird",
      title: "Early Bird",
      description: "Join competitions within 24 hours of launch",
      icon: Flame,
      drive: "SCARCITY",
      unlocked: false,
      rarity: "rare",
    });

    // Explorer (Unpredictability & Curiosity)
    const uniqueCategories = new Set(
      submissions.map((s) => s.competitions?.category).filter(Boolean),
    );
    if (uniqueCategories.size >= 3) {
      achievementsList.push({
        id: "explorer",
        title: "Explorer",
        description: "Participated in 3 different competition categories",
        icon: Star,
        drive: "UNPREDICTABILITY",
        unlocked: true,
        rarity: "rare",
      });
    }

    setAchievements(achievementsList);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "border-gray-300 bg-gray-50";
      case "uncommon":
        return "border-green-300 bg-green-50";
      case "rare":
        return "border-blue-300 bg-blue-50";
      case "epic":
        return "border-purple-300 bg-purple-50";
      case "legendary":
        return "border-yellow-300 bg-yellow-50";
      default:
        return "border-gray-300 bg-gray-50";
    }
  };

  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const lockedAchievements = achievements.filter((a) => !a.unlocked);

  return (
    <div className="space-y-6">
      {/* Player Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Crown className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Level</p>
                <p className="text-2xl font-bold">{userLevel}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">XP</p>
                <p className="text-2xl font-bold">
                  {userXP}/{nextLevelXP}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Achievements</p>
                <p className="text-2xl font-bold">
                  {unlockedAchievements.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rank</p>
                <p className="text-2xl font-bold">#{leaderboardPosition}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Level Progress
          </CardTitle>
          <CardDescription>
            Keep participating to level up and unlock new achievements!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Level {userLevel}</span>
              <span className="text-sm text-muted-foreground">
                {userXP}/{nextLevelXP} XP
              </span>
            </div>
            <Progress value={(userXP / nextLevelXP) * 100} className="h-3" />
            <div className="text-sm text-muted-foreground">
              {nextLevelXP - userXP} XP needed for Level {userLevel + 1}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Octalysis Framework Tabs */}
      <Tabs defaultValue="achievements" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-6">
          {/* Unlocked Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Unlocked Achievements ({unlockedAchievements.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unlockedAchievements.map((achievement) => {
                  const IconComponent = achievement.icon;
                  const drive =
                    CORE_DRIVES[achievement.drive as keyof typeof CORE_DRIVES];

                  return (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border-2 ${getRarityColor(achievement.rarity)}`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`h-10 w-10 rounded-full bg-white flex items-center justify-center ${drive.color}`}
                        >
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">
                              {achievement.title}
                            </h4>
                            <Badge
                              variant="outline"
                              className="text-xs capitalize"
                            >
                              {achievement.rarity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {achievement.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {drive.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Locked Achievements */}
          {lockedAchievements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Locked Achievements ({lockedAchievements.length})
                </CardTitle>
                <CardDescription>
                  Complete these challenges to unlock new achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lockedAchievements.map((achievement) => {
                    const IconComponent = achievement.icon;
                    const drive =
                      CORE_DRIVES[
                        achievement.drive as keyof typeof CORE_DRIVES
                      ];

                    return (
                      <div
                        key={achievement.id}
                        className="p-4 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 opacity-75"
                      >
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-600">
                                {achievement.title}
                              </h4>
                              <Badge
                                variant="outline"
                                className="text-xs capitalize"
                              >
                                {achievement.rarity}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {achievement.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {drive.name}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Global Leaderboard
              </CardTitle>
              <CardDescription>
                See how you rank against other members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                      <span className="text-sm font-bold text-yellow-600">
                        #{leaderboardPosition}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">Your Rank</p>
                      <p className="text-sm text-muted-foreground">
                        Level {userLevel} • {unlockedAchievements.length}{" "}
                        achievements
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">You</Badge>
                </div>

                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Full leaderboard coming soon!</p>
                  <p className="text-sm">
                    Keep participating to climb the ranks
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Rewards & Benefits
              </CardTitle>
              <CardDescription>
                Exciting rewards and perks are on the way!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Rocket className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Coming Soon!</h3>
                <p className="text-muted-foreground max-w-md">
                  We're working on an exciting rewards system with exclusive
                  perks, badges, and benefits for our most active members. Stay
                  tuned!
                </p>
                <Badge variant="outline" className="mt-4">
                  Feature in Development
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
