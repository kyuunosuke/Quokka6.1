"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Calendar, User, Loader2, FileText, Layers } from "lucide-react";
import DashboardNavbar from "@/components/dashboard-navbar";
import Link from "next/link";

interface Storyboard {
  id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  status: "draft" | "published" | "archived";
  author: string;
  category: string;
  thumbnail_url?: string;
}

export default function StoryboardsPage() {
  const [storyboards, setStoryboards] = useState<Storyboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("all");
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        // Mock storyboard data since we don't have a storyboards table yet
        const mockStoryboards: Storyboard[] = [
          {
            id: "1",
            title: "Member Dashboard Overview",
            description:
              "Complete overview of the member dashboard functionality including profile management, competition tracking, and gamification features.",
            created_at: "2024-01-15T10:00:00Z",
            updated_at: "2024-01-20T14:30:00Z",
            status: "published",
            author: "Admin Team",
            category: "Dashboard",
            thumbnail_url:
              "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
          },
          {
            id: "2",
            title: "Admin Portal Features",
            description:
              "Administrative dashboard showcasing competition management, user oversight, and system configuration tools.",
            created_at: "2024-01-18T09:15:00Z",
            updated_at: "2024-01-22T16:45:00Z",
            status: "published",
            author: "Development Team",
            category: "Admin",
            thumbnail_url:
              "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80",
          },
          {
            id: "3",
            title: "Competition Workflow",
            description:
              "End-to-end competition lifecycle from creation to completion, including submission handling and winner selection.",
            created_at: "2024-01-20T11:30:00Z",
            updated_at: "2024-01-25T13:20:00Z",
            status: "published",
            author: "Product Team",
            category: "Workflow",
            thumbnail_url:
              "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80",
          },
          {
            id: "4",
            title: "User Authentication Flow",
            description:
              "Complete authentication system including sign-up, sign-in, password reset, and profile verification processes.",
            created_at: "2024-01-22T08:45:00Z",
            updated_at: "2024-01-26T10:15:00Z",
            status: "draft",
            author: "Security Team",
            category: "Authentication",
            thumbnail_url:
              "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&q=80",
          },
          {
            id: "5",
            title: "Gamification System",
            description:
              "Reward system implementation with levels, badges, achievements, and progress tracking for enhanced user engagement.",
            created_at: "2024-01-25T15:20:00Z",
            updated_at: "2024-01-28T12:10:00Z",
            status: "published",
            author: "UX Team",
            category: "Gamification",
            thumbnail_url:
              "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80",
          },
          {
            id: "6",
            title: "Client Dashboard Preview",
            description:
              "Upcoming client dashboard featuring project management, team collaboration, and performance analytics.",
            created_at: "2024-01-28T14:00:00Z",
            updated_at: "2024-01-30T09:30:00Z",
            status: "draft",
            author: "Client Success Team",
            category: "Client",
            thumbnail_url:
              "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&q=80",
          },
        ];

        setStoryboards(mockStoryboards);
      } catch (error) {
        console.error("Error fetching storyboards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "dashboard":
        return <Layers className="h-4 w-4" />;
      case "admin":
        return <User className="h-4 w-4" />;
      case "workflow":
        return <FileText className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const filteredStoryboards = storyboards.filter((storyboard) => {
    if (activeTab === "all") return true;
    if (activeTab === "published") return storyboard.status === "published";
    if (activeTab === "draft") return storyboard.status === "draft";
    if (activeTab === "archived") return storyboard.status === "archived";
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Storyboards</h1>
          <p className="text-muted-foreground">
            Explore all storyboards across member, admin, and client dashboards
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{storyboards.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Published</p>
                  <p className="text-2xl font-bold">
                    {storyboards.filter((s) => s.status === "published").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Draft</p>
                  <p className="text-2xl font-bold">
                    {storyboards.filter((s) => s.status === "draft").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Categories</p>
                  <p className="text-2xl font-bold">
                    {new Set(storyboards.map((s) => s.category)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="all">All Storyboards</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {/* Storyboards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStoryboards.map((storyboard) => (
                <Card
                  key={storyboard.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(storyboard.category)}
                        <Badge variant="secondary" className="text-xs">
                          {storyboard.category}
                        </Badge>
                      </div>
                      <Badge
                        className={`text-xs ${getStatusColor(storyboard.status)}`}
                      >
                        {storyboard.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">
                      {storyboard.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {storyboard.thumbnail_url && (
                      <div className="mb-4 rounded-lg overflow-hidden">
                        <img
                          src={storyboard.thumbnail_url}
                          alt={storyboard.title}
                          className="w-full h-32 object-cover"
                        />
                      </div>
                    )}
                    <CardDescription className="mb-4 line-clamp-3">
                      {storyboard.description}
                    </CardDescription>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span>By {storyboard.author}</span>
                      <span>
                        {new Date(storyboard.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <Button className="w-full" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View Storyboard
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredStoryboards.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No storyboards found
                </h3>
                <p className="text-muted-foreground">
                  No storyboards match the current filter criteria.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
