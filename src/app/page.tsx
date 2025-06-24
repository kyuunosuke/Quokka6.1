import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
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
import { FlipCard } from "@/components/ui/flip-card";
import {
  ArrowUpRight,
  Trophy,
  Target,
  Users,
  Star,
  Calendar,
  DollarSign,
  Filter,
  Heart,
  Clock,
  MoreHorizontal,
} from "lucide-react";
import { createClient } from "../../supabase/server";
import Link from "next/link";

export default async function Home() {
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

      {/* Competition Directory Section */}
      <section
        id="competitions"
        className="py-16 bg-gradient-to-br from-purple-600 to-blue-600 text-white"
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Active Competitions
            </h2>
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
                  key={`category-${index}`}
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
      <section className="py-12 bg-neuro-light">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {competitions.map((competition) => (
              <FlipCard
                key={`competition-${competition.id}`}
                className="w-full h-[500px]"
                frontContent={
                  <Card className="bg-neuro-light shadow-neuro hover:shadow-neuro-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden w-full h-full">
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
                          <span className="font-semibold">
                            {competition.prize}
                          </span>
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
                    </CardContent>

                    <CardFooter className="flex gap-2">
                      <Button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                        Enter Competition
                      </Button>
                      <Button variant="outline" size="icon">
                        <Star className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="pointer-events-none"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                }
                backContent={
                  <Card className="bg-neuro-light shadow-neuro overflow-hidden w-full h-full">
                    <CardHeader className="text-center">
                      <CardTitle className="text-xl mb-2">
                        {competition.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Competition Details
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6 h-full flex flex-col justify-center">
                      <div>
                        <h4 className="font-semibold text-lg mb-3 text-purple-600 flex items-center gap-2">
                          <Target className="w-5 h-5" />
                          Requirements
                        </h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {competition.requirements}
                        </p>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-lg mb-3 text-blue-600 flex items-center gap-2">
                          <Trophy className="w-5 h-5" />
                          Rules
                        </h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {competition.rules}
                        </p>
                      </div>
                    </CardContent>

                    <CardFooter className="flex gap-2">
                      <Button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                        Enter Competition
                      </Button>
                      <Button variant="outline" size="icon">
                        <Star className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="pointer-events-none"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* Load More Section */}
      <section className="py-8 text-center bg-neuro-light">
        <Button
          variant="outline"
          size="lg"
          className="shadow-neuro hover:shadow-neuro-lg"
        >
          Load More Competitions
        </Button>
      </section>

      <Hero />

      {/* Features Section */}
      <section className="py-24 bg-neuro-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Why Compete With Us?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join the ultimate platform for creative competitions with fair
              judging, amazing prizes, and a supportive community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Trophy className="w-6 h-6" />,
                title: "Amazing Prizes",
                description: "Win cash, products, and exclusive opportunities",
              },
              {
                icon: <Target className="w-6 h-6" />,
                title: "Fair Judging",
                description: "Transparent evaluation by industry experts",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Global Community",
                description: "Connect with creators from around the world",
              },
              {
                icon: <Star className="w-6 h-6" />,
                title: "All Skill Levels",
                description: "Competitions for beginners to professionals",
              },
            ].map((feature, index) => (
              <div
                key={`feature-${index}`}
                className="p-6 bg-neuro-light rounded-xl shadow-neuro hover:shadow-neuro-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="text-purple-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Competition Categories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Popular Categories
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore competitions across various creative fields and find your
              perfect match.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Design & Art",
                count: "120+ competitions",
                color: "from-pink-500 to-rose-500",
              },
              {
                name: "Photography",
                count: "85+ competitions",
                color: "from-blue-500 to-cyan-500",
              },
              {
                name: "Writing",
                count: "95+ competitions",
                color: "from-green-500 to-emerald-500",
              },
              {
                name: "Video & Film",
                count: "60+ competitions",
                color: "from-purple-500 to-violet-500",
              },
              {
                name: "Music & Audio",
                count: "45+ competitions",
                color: "from-orange-500 to-red-500",
              },
              {
                name: "Innovation",
                count: "75+ competitions",
                color: "from-indigo-500 to-blue-500",
              },
            ].map((category, index) => (
              <div key={`cat-${index}`} className="group cursor-pointer">
                <div
                  className={`p-6 bg-gradient-to-br ${category.color} rounded-xl text-white shadow-neuro hover:shadow-neuro-lg transition-all duration-300 transform hover:-translate-y-1`}
                >
                  <h3 className="text-xl font-semibold mb-2">
                    {category.name}
                  </h3>
                  <p className="text-white/80">{category.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-neuro-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Getting started is simple. Follow these easy steps to join
              competitions and start winning.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Browse & Filter",
                description:
                  "Find competitions that match your skills and interests using our smart filters",
              },
              {
                step: "2",
                title: "Submit Your Entry",
                description:
                  "Upload your work following the competition guidelines and requirements",
              },
              {
                step: "3",
                title: "Win & Celebrate",
                description:
                  "Get judged by experts and win amazing prizes while building your portfolio",
              },
            ].map((item, index) => (
              <div key={`step-${index}`} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 shadow-neuro">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Competing?</h2>
          <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already showcasing their talents
            and winning amazing prizes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center px-8 py-4 text-purple-600 bg-white rounded-xl hover:bg-gray-100 transition-colors text-lg font-medium shadow-neuro"
            >
              Sign Up Free
              <ArrowUpRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-8 py-4 text-white border-2 border-white rounded-xl hover:bg-white hover:text-purple-600 transition-colors text-lg font-medium"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
