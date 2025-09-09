"use client";

import { useState } from "react";
import SideNav from "./SideNav";
import CompetitionModule from "./CompetitionModule";
import GameManagement from "./GameManagement";
import CompetitionStatusManager from "./CompetitionStatusManager";
import { Toaster } from "@/components/ui/toaster";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboard() {
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    category: "all",
    sortBy: "created_at",
    sortOrder: "desc" as "asc" | "desc",
  });
  const [activeTab, setActiveTab] = useState("competitions");

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="flex h-[calc(100vh-73px)]">
      <SideNav onFilterChange={handleFilterChange} activeTab={activeTab} />
      <main className="flex-1 p-6 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="competitions">
              Competition Management
            </TabsTrigger>
            <TabsTrigger value="status">
              Status Management
            </TabsTrigger>
            <TabsTrigger value="games">Game Management</TabsTrigger>
          </TabsList>
          <TabsContent value="competitions" className="mt-0">
            <CompetitionModule filters={filters} />
          </TabsContent>
          <TabsContent value="status" className="mt-0">
            <CompetitionStatusManager />
          </TabsContent>
          <TabsContent value="games" className="mt-0">
            <GameManagement />
          </TabsContent>
        </Tabs>
      </main>
      <Toaster />
    </div>
  );
}