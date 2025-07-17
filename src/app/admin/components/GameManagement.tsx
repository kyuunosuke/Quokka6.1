"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Gamepad2,
  Dice1,
  Trophy,
  Plus,
  ArrowRight,
  Star,
  Users,
} from "lucide-react";

export default function GameManagement() {
  return (
    <div className="space-y-6 bg-white">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Game Management</h2>
          <p className="text-muted-foreground">
            Manage games of luck and skill - Directory and creation tools
          </p>
        </div>
        <Button disabled>
          <Plus className="h-4 w-4 mr-2" />
          Add Game (Coming Soon)
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Games of Luck</CardTitle>
            <Dice1 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Coming Soon</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Games of Skill
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Coming Soon</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Games</CardTitle>
            <Gamepad2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Coming Soon</p>
          </CardContent>
        </Card>
      </div>

      {/* Game Directory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Games of Luck Directory */}
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Dice1 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Games of Luck</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Chance-based gaming experiences
                  </p>
                </div>
              </div>
              <Badge variant="secondary">Coming Soon</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Lottery Systems</span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Dice1 className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Random Draws</span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Gamepad2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Spin Wheels</span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            <Button variant="outline" className="w-full" disabled>
              Explore Games of Luck
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Games of Skill Directory */}
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Trophy className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Games of Skill</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Skill-based competitive games
                  </p>
                </div>
              </div>
              <Badge variant="secondary">Coming Soon</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Trophy className="h-4 w-4 text-gold-500" />
                  <span className="text-sm font-medium">Trivia Games</span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Strategy Games</span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Gamepad2 className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm font-medium">Puzzle Games</span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            <Button variant="outline" className="w-full" disabled>
              Explore Games of Skill
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Feature Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5" />
            Upcoming Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Game Creation Tools</h4>
              <p className="text-sm text-muted-foreground">
                Build custom games with our intuitive game builder interface.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Player Analytics</h4>
              <p className="text-sm text-muted-foreground">
                Track player engagement, performance, and game statistics.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Reward Systems</h4>
              <p className="text-sm text-muted-foreground">
                Configure prizes, achievements, and player progression systems.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
