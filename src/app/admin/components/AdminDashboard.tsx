"use client";

import { useState } from "react";
import SideNav from "./SideNav";
import CompetitionModule from "./CompetitionModule";
import { Toaster } from "@/components/ui/toaster";

export default function AdminDashboard() {
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    category: "all",
    sortBy: "created_at",
    sortOrder: "desc" as "asc" | "desc",
  });

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="flex h-[calc(100vh-73px)]">
      <SideNav onFilterChange={handleFilterChange} />
      <main className="flex-1 p-6 overflow-y-auto">
        <CompetitionModule filters={filters} />
      </main>
      <Toaster />
    </div>
  );
}
