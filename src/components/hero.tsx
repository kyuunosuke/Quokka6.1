"use client";
import Link from "next/link";
import { ArrowUpRight, Trophy, Calendar, DollarSign } from "lucide-react";

export default function Hero() {
  const handleScrollToCompetitions = (
    e: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      const element = document.querySelector("#competitions");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="relative overflow-hidden bg-neuro-light">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-neuro-light via-white to-gray-100 opacity-90" />

      <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
              Discover Amazing{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                Competitions
              </span>{" "}
              & Win Big
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of creators, innovators, and dreamers competing for
              incredible prizes. Find your perfect competition and showcase your
              talents.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                href="#competitions"
                className="inline-flex items-center px-8 py-4 text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-neuro hover:shadow-neuro-lg transition-all duration-300 text-lg font-medium transform hover:-translate-y-1"
                onClick={handleScrollToCompetitions}
              >
                View Competitions Below
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </Link>

              <Link
                href="/sign-up"
                className="inline-flex items-center px-8 py-4 text-gray-700 bg-neuro-light rounded-xl shadow-neuro hover:shadow-neuro-lg transition-all duration-300 text-lg font-medium transform hover:-translate-y-1"
              >
                Join Free Today
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-neuro-light rounded-xl p-6 shadow-neuro">
                <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Active Competitions</div>
              </div>
              <div className="bg-neuro-light rounded-xl p-6 shadow-neuro">
                <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">$2M+</div>
                <div className="text-sm text-gray-600">Total Prize Pool</div>
              </div>
              <div className="bg-neuro-light rounded-xl p-6 shadow-neuro">
                <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">50+</div>
                <div className="text-sm text-gray-600">New This Week</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
