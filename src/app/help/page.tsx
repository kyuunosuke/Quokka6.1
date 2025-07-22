import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Trophy,
  User,
  Settings,
  HelpCircle,
  FileText,
  Shield,
  Search,
  MessageCircle,
  BookOpen,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function HelpCentre() {
  const helpCategories = [
    {
      icon: <Trophy className="h-6 w-6" />,
      title: "Getting Started",
      description: "Learn the basics of using our competition platform",
      articles: [
        "How to create your account",
        "Setting up your profile",
        "Finding competitions that match your interests",
        "Understanding competition categories",
      ],
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Entering Competitions",
      description: "Everything you need to know about participating",
      articles: [
        "How to enter a competition",
        "Understanding entry requirements",
        "Submitting your work",
        "Competition deadlines and timelines",
        "What happens after you submit",
      ],
    },
    {
      icon: <User className="h-6 w-6" />,
      title: "Account Management",
      description: "Manage your profile and account settings",
      articles: [
        "Updating your profile information",
        "Managing your saved competitions",
        "Viewing your competition history",
        "Account verification process",
        "Privacy and data settings",
      ],
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Rules & Guidelines",
      description: "Important policies and competition rules",
      articles: [
        "General competition rules",
        "Community guidelines",
        "Intellectual property policies",
        "Fair play and ethics",
        "Dispute resolution process",
      ],
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: "Technical Support",
      description: "Troubleshooting and technical assistance",
      articles: [
        "Common login issues",
        "File upload problems",
        "Browser compatibility",
        "Mobile app troubleshooting",
        "Performance optimization tips",
      ],
    },
    {
      icon: <HelpCircle className="h-6 w-6" />,
      title: "Prizes & Payments",
      description: "Information about prizes and payment processes",
      articles: [
        "How prizes are distributed",
        "Tax implications of winning",
        "Prize claim process",
        "Payment methods accepted",
        "Refund and cancellation policies",
      ],
    },
  ];

  const popularArticles = [
    "How to enter your first competition",
    "Understanding competition requirements",
    "Setting up your profile for success",
    "What to do if you win a competition",
    "Troubleshooting common issues",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Help Centre</h1>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Find answers to your questions and get the most out of our
            competition platform
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for help articles..."
              className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Contact Support
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Browse FAQ
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Quick Start Guide
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">
            Popular Articles
          </h2>
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {popularArticles.map((article, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    >
                      <span className="text-gray-700">{article}</span>
                      <Badge variant="secondary">Popular</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Browse by Category
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {helpCategories.map((category, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow cursor-pointer"
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-purple-600">{category.icon}</div>
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category.articles
                      .slice(0, 3)
                      .map((article, articleIndex) => (
                        <div
                          key={articleIndex}
                          className="text-sm text-gray-600 hover:text-purple-600 cursor-pointer transition-colors"
                        >
                          • {article}
                        </div>
                      ))}
                    {category.articles.length > 3 && (
                      <div className="text-sm text-purple-600 font-medium cursor-pointer">
                        + {category.articles.length - 3} more articles
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Help */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Quick Help</h2>
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">
                  How do I enter my first competition?
                </AccordionTrigger>
                <AccordionContent>
                  To enter your first competition, browse our active
                  competitions, read the requirements carefully, and click the
                  "Enter Competition" button. Make sure your profile is complete
                  and you meet all the eligibility criteria before submitting
                  your entry.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">
                  What happens after I submit my entry?
                </AccordionTrigger>
                <AccordionContent>
                  After submission, you'll receive a confirmation email. Your
                  entry will be reviewed by our judges according to the
                  competition timeline. You can track the status of your
                  submissions in your member dashboard.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">
                  How are winners selected and notified?
                </AccordionTrigger>
                <AccordionContent>
                  Winners are selected by our expert judges based on the
                  competition criteria. All participants are notified via email
                  when results are announced. Winners will receive detailed
                  instructions on how to claim their prizes.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">
                  Can I edit my submission after submitting?
                </AccordionTrigger>
                <AccordionContent>
                  This depends on the specific competition rules. Some
                  competitions allow edits before the deadline, while others
                  don't. Check the competition details or contact support for
                  specific guidance.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help
            you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-white text-purple-600 hover:bg-gray-100"
            >
              <Link href="/contact">Contact Support</Link>
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-purple-600"
            >
              <Link href="/faq">Browse FAQ</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
