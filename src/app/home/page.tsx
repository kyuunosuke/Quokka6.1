import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  DollarSign,
  Filter,
  Heart,
  Trophy,
  Users,
  Clock,
  Star,
} from "lucide-react";
import { createClient } from "../../../supabase/server";
import Link from "next/link";

export default async function CompetitionsHome() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Mock competition data - in real app this would come from Supabase
  const competitions = [
    {
      id: 1,
      title: "Digital Art Showcase 2024",
      description:
        "Create stunning digital artwork using any medium. Show us your creativity!",
      thumbnail:
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&q=80",
      prize: "$5,000",
      deadline: "Dec 31, 2024",
      category: "Design & Art",
      difficulty: "All Levels",
      participants: 234,
      requirements:
        "Original digital artwork, minimum 1920x1080 resolution, submitted in PNG or JPG format.",
      rules:
        "No AI-generated content, must be original work, one submission per participant.",
    },
    {
      id: 2,
      title: "Photography Challenge: Urban Life",
      description: "Capture the essence of urban living through your lens.",
      thumbnail:
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&q=80",
      prize: "$3,000",
      deadline: "Jan 15, 2025",
      category: "Photography",
      difficulty: "Intermediate",
      participants: 156,
      requirements:
        "High-resolution photos (min 3000px), EXIF data intact, urban theme required.",
      rules:
        "Maximum 3 submissions, no heavy editing, must be taken within last 6 months.",
    },
    {
      id: 3,
      title: "Short Story Contest",
      description: "Write a compelling short story in 1000 words or less.",
      thumbnail:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=80",
      prize: "$2,500",
      deadline: "Feb 28, 2025",
      category: "Writing",
      difficulty: "All Levels",
      participants: 89,
      requirements:
        "500-1000 words, original fiction, submitted in PDF format.",
      rules: "English only, no plagiarism, previously unpublished work only.",
    },
    {
      id: 4,
      title: "Innovation Challenge: Sustainability",
      description: "Propose innovative solutions for environmental challenges.",
      thumbnail:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80",
      prize: "$10,000",
      deadline: "Mar 30, 2025",
      category: "Innovation",
      difficulty: "Advanced",
      participants: 67,
      requirements:
        "Detailed proposal, prototype or proof of concept, sustainability focus.",
      rules:
        "Team submissions allowed (max 4 members), must address environmental impact.",
    },
    {
      id: 5,
      title: "Music Production Contest",
      description: "Create an original electronic music track.",
      thumbnail:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80",
      prize: "$4,000",
      deadline: "Jan 20, 2025",
      category: "Music & Audio",
      difficulty: "Intermediate",
      participants: 123,
      requirements: "3-5 minute track, WAV format, original composition only.",
      rules:
        "No copyrighted samples, electronic genre preferred, mastered audio required.",
    },
    {
      id: 6,
      title: "Video Documentary: Local Heroes",
      description:
        "Create a short documentary about unsung heroes in your community.",
      thumbnail:
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80",
      prize: "$6,000",
      deadline: "Apr 15, 2025",
      category: "Video & Film",
      difficulty: "Advanced",
      participants: 45,
      requirements:
        "5-15 minutes, 1080p minimum, documentary style, community focus.",
      rules:
        "Must feature real people, proper permissions required, English subtitles if needed.",
    },
  ];

  const categories = [
    { name: "All Categories", count: competitions.length },
    { name: "Design & Art", count: 1 },
    { name: "Photography", count: 1 },
    { name: "Writing", count: 1 },
    { name: "Innovation", count: 1 },
    { name: "Music & Audio", count: 1 },
    { name: "Video & Film", count: 1 },
  ];

  return (
    <div className="min-h-screen bg-neuro-light">
      <Navbar />

      {/* Header Section */}
      <section className="py-16 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Competition Directory
            </h1>
            <p className="text-xl text-purple-100 mb-8">
              Discover amazing competitions, showcase your talents, and win
              incredible prizes
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">{competitions.length}</div>
                <div className="text-sm text-purple-100">
                  Active Competitions
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">$30K+</div>
                <div className="text-sm text-purple-100">Total Prizes</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">714</div>
                <div className="text-sm text-purple-100">Participants</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">6</div>
                <div className="text-sm text-purple-100">Categories</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Filter by:</span>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <Badge
                  key={index}
                  variant={index === 0 ? "default" : "outline"}
                  className="cursor-pointer hover:bg-purple-100 transition-colors"
                >
                  {category.name} ({category.count})
                </Badge>
              ))}
            </div>

            {/* Additional Filters */}
            <div className="flex flex-wrap gap-2 ml-auto">
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-purple-100"
              >
                Prize: High to Low
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-purple-100"
              >
                Deadline: Soon
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-purple-100"
              >
                All Levels
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Competitions Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {competitions.map((competition) => (
              <Card
                key={competition.id}
                className="bg-neuro-light shadow-neuro hover:shadow-neuro-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={competition.thumbnail}
                    alt={competition.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-gray-900 hover:bg-white">
                      {competition.category}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="bg-white/90 hover:bg-white"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-xl mb-2">
                    {competition.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {competition.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-green-600">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold">{competition.prize}</span>
                    </div>
                    <div className="flex items-center gap-1 text-orange-600">
                      <Calendar className="w-4 h-4" />
                      <span>{competition.deadline}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{competition.participants} participants</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {competition.difficulty}
                    </Badge>
                  </div>

                  {/* Expandable Details - Initially Hidden */}
                  <div className="hidden group-hover:block space-y-3 pt-4 border-t">
                    <div>
                      <h4 className="font-semibold text-sm mb-1">
                        Requirements:
                      </h4>
                      <p className="text-xs text-gray-600">
                        {competition.requirements}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Rules:</h4>
                      <p className="text-xs text-gray-600">
                        {competition.rules}
                      </p>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex gap-2">
                  <Button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    Enter Competition
                  </Button>
                  <Button variant="outline" size="icon">
                    <Star className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Load More Section */}
      <section className="py-8 text-center">
        <Button
          variant="outline"
          size="lg"
          className="shadow-neuro hover:shadow-neuro-lg"
        >
          Load More Competitions
        </Button>
      </section>

      <Footer />
    </div>
  );
}
