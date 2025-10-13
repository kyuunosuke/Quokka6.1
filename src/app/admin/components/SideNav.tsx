"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, SortAsc, SortDesc } from "lucide-react";

interface SideNavProps {
  onFilterChange: (filters: {
    search: string;
    status: string;
    category: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
  }) => void;
  activeTab: string;
}

export default function SideNav({ onFilterChange, activeTab }: SideNavProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleFilterChange = () => {
    onFilterChange({
      search,
      status,
      category,
      sortBy,
      sortOrder,
    });
  };

  const resetFilters = () => {
    setSearch("");
    setStatus("all");
    setCategory("all");
    setSortBy("created_at");
    setSortOrder("desc");
    onFilterChange({
      search: "",
      status: "all",
      category: "all",
      sortBy: "created_at",
      sortOrder: "desc",
    });
  };

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 p-4 space-y-6">
      {activeTab === "competitions" ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search">Search Competitions</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by title, description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
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

            {/* Category Filter */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
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

            {/* Sort Options */}
            <div className="space-y-2">
              <Label>Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Created Date</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="start_date">Start Date</SelectItem>
                  <SelectItem value="end_date">End Date</SelectItem>
                  <SelectItem value="total_prize">Prize Amount</SelectItem>
                  <SelectItem value="current_participants">
                    Participants
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Order */}
            <div className="space-y-2">
              <Label>Sort Order</Label>
              <div className="flex gap-2">
                <Button
                  variant={sortOrder === "asc" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortOrder("asc")}
                  className="flex-1"
                >
                  <SortAsc className="h-4 w-4 mr-1" />
                  Ascending
                </Button>
                <Button
                  variant={sortOrder === "desc" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortOrder("desc")}
                  className="flex-1"
                >
                  <SortDesc className="h-4 w-4 mr-1" />
                  Descending
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button onClick={handleFilterChange} className="flex-1">
                Apply Filters
              </Button>
              <Button variant="outline" onClick={resetFilters}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5" />
              Game Directory
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8">
              <div className="text-muted-foreground mb-4">
                Game management tools and filters will be available here once
                game creation features are implemented.
              </div>
              <div className="text-sm text-muted-foreground">Coming Soon</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}