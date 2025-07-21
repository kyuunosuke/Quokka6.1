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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  User,
  DollarSign,
  Settings,
  HelpCircle,
  Search,
  MessageCircle,
  Shield,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default function FAQ() {
  const faqCategories = {
    general: {
      title: "General Questions",
      icon: <HelpCircle className="h-5 w-5" />,
      questions: [
        {
          question: "What is CompeteHub and how does it work?",
          answer:
            "CompeteHub is a comprehensive platform that connects creative individuals with exciting competitions. We aggregate competitions from various organizers, making it easy for you to discover, enter, and track your participation in one centralized location. Simply browse competitions, read the requirements, and submit your entries directly through our platform.",
        },
        {
          question: "Is CompeteHub free to use?",
          answer:
            "Yes, creating an account and browsing competitions on CompeteHub is completely free. Some competitions may have entry fees set by the organizers, which will be clearly displayed in the competition details. We never charge additional fees on top of the organizer's requirements.",
        },
        {
          question: "How do I get started on the platform?",
          answer:
            "Getting started is simple! Create your free account, complete your profile with relevant information, browse our active competitions using filters to find ones that match your interests and skills, and start entering competitions that excite you.",
        },
        {
          question: "What types of competitions are available?",
          answer:
            "We feature a wide variety of competitions including design contests, writing competitions, photography challenges, innovation contests, coding competitions, art contests, and many more. Our platform caters to creators across all disciplines and skill levels.",
        },
        {
          question: "How are competitions verified for legitimacy?",
          answer:
            "We have a thorough vetting process for all competitions on our platform. We verify organizer credentials, review prize structures, check terms and conditions, and monitor competition outcomes to ensure all competitions are legitimate and fair.",
        },
      ],
    },
    competitions: {
      title: "Competition Questions",
      icon: <Trophy className="h-5 w-5" />,
      questions: [
        {
          question: "How do I enter a competition?",
          answer:
            "To enter a competition, click on the competition card to view full details, read through the requirements and rules carefully, ensure you meet all eligibility criteria, click the 'Enter Competition' button, and follow the submission guidelines provided by the organizer.",
        },
        {
          question: "Can I edit my submission after submitting?",
          answer:
            "This depends on the specific competition rules set by the organizer. Some competitions allow edits before the deadline, while others have a strict no-edit policy. Check the competition details or contact the organizer directly for clarification.",
        },
        {
          question: "What happens if I miss the submission deadline?",
          answer:
            "Unfortunately, late submissions are typically not accepted as this would be unfair to other participants. Deadlines are strictly enforced by competition organizers. We recommend setting personal reminders and submitting well before the deadline to avoid any technical issues.",
        },
        {
          question: "How are winners selected and announced?",
          answer:
            "Winner selection varies by competition and is handled by the respective organizers. Most competitions use expert judges, community voting, or a combination of both. Winners are typically announced via email and on the competition page. You can track the status of your submissions in your member dashboard.",
        },
        {
          question:
            "Can I participate in multiple competitions simultaneously?",
          answer:
            "Absolutely! There's no limit to how many competitions you can enter. We encourage participants to explore various competitions that match their interests and skills. Use your member dashboard to track all your active submissions.",
        },
        {
          question: "What if I have questions about a specific competition?",
          answer:
            "For competition-specific questions, you can contact the organizer directly using the contact information provided in the competition details. For general platform questions, our support team is always ready to help.",
        },
      ],
    },
    account: {
      title: "Account & Profile",
      icon: <User className="h-5 w-5" />,
      questions: [
        {
          question: "How do I create and verify my account?",
          answer:
            "Creating an account is simple - just click 'Sign Up', provide your email and create a password. You'll receive a verification email to confirm your account. For enhanced security and to access certain competitions, you can also complete identity verification by uploading a government-issued ID.",
        },
        {
          question: "What information should I include in my profile?",
          answer:
            "A complete profile increases your chances of being selected for competitions. Include your full name, professional bio, portfolio links, skills and interests, contact information, and any relevant experience. Some competitions may require specific demographic information.",
        },
        {
          question: "How do I reset my password?",
          answer:
            "If you've forgotten your password, click 'Forgot Password' on the login page, enter your email address, check your email for a reset link, and follow the instructions to create a new password. If you don't receive the email, check your spam folder.",
        },
        {
          question: "Can I change my email address?",
          answer:
            "Currently, email addresses cannot be changed directly through the platform. Please contact our support team if you need to update your email address, and we'll assist you with the process.",
        },
        {
          question: "How do I delete my account?",
          answer:
            "If you wish to delete your account, please contact our support team. We'll help you understand the implications (such as losing access to competition history) and process your request if you decide to proceed.",
        },
        {
          question: "What are profile levels and how do they work?",
          answer:
            "Profile levels (Rank 1-4) are based on how complete your profile is. Higher levels unlock access to more exclusive competitions and features. Complete your basic info for Rank 1, add demographic details for Rank 2-3, and verify your identity for Rank 4.",
        },
      ],
    },
    prizes: {
      title: "Prizes & Payments",
      icon: <DollarSign className="h-5 w-5" />,
      questions: [
        {
          question: "How are prizes distributed to winners?",
          answer:
            "Prize distribution is handled by the competition organizers according to their specified terms. Common methods include direct bank transfer, PayPal, check, or physical prize shipment. Winners will receive detailed instructions from the organizer on how to claim their prizes.",
        },
        {
          question: "Are there any taxes on prize winnings?",
          answer:
            "Tax obligations vary by jurisdiction and prize value. Winners are responsible for understanding and fulfilling their tax obligations. For significant prizes, organizers may provide tax documentation. We recommend consulting with a tax professional for prizes of substantial value.",
        },
        {
          question: "What if I don't receive my prize?",
          answer:
            "If you haven't received your prize within the timeframe specified by the organizer, first contact the organizer directly. If you're unable to resolve the issue, contact our support team and we'll help mediate the situation.",
        },
        {
          question: "Can prizes be transferred to someone else?",
          answer:
            "Prize transferability depends on the specific competition terms set by the organizer. Most prizes are non-transferable and must be claimed by the original winner. Check the competition's terms and conditions for specific details.",
        },
        {
          question: "What happens if I can't accept a prize?",
          answer:
            "If you're unable to accept a prize (due to eligibility restrictions, location, etc.), the organizer will typically select an alternate winner. It's important to carefully read eligibility requirements before entering competitions.",
        },
      ],
    },
    technical: {
      title: "Technical Support",
      icon: <Settings className="h-5 w-5" />,
      questions: [
        {
          question: "I'm having trouble logging into my account",
          answer:
            "If you're experiencing login issues, try clearing your browser cache and cookies, ensure you're using the correct email and password, try resetting your password if needed, or try accessing the site from a different browser or device. If problems persist, contact our support team.",
        },
        {
          question: "Why can't I upload my files?",
          answer:
            "File upload issues can occur due to several reasons: file size exceeding the limit, unsupported file format, poor internet connection, or browser compatibility issues. Check the competition requirements for file specifications and try using a different browser if problems continue.",
        },
        {
          question: "The website is loading slowly or not at all",
          answer:
            "Slow loading can be caused by internet connectivity issues, browser cache problems, or temporary server issues. Try refreshing the page, clearing your browser cache, checking your internet connection, or accessing the site later if there are server issues.",
        },
        {
          question: "Which browsers are supported?",
          answer:
            "Our platform works best on modern browsers including Chrome (recommended), Firefox, Safari, and Edge. We recommend keeping your browser updated to the latest version for the best experience and security.",
        },
        {
          question: "Is there a mobile app available?",
          answer:
            "Currently, we don't have a dedicated mobile app, but our website is fully responsive and works well on mobile devices. You can access all features through your mobile browser. A mobile app is in our future development plans.",
        },
        {
          question: "How do I report a bug or technical issue?",
          answer:
            "If you encounter a bug or technical issue, please contact our support team with details about the problem, including what you were trying to do, what browser you're using, any error messages you received, and steps to reproduce the issue.",
        },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Find quick answers to the most common questions about our
            competition platform
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search FAQ..."
              className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600">50+</div>
              <div className="text-sm text-gray-600">FAQ Articles</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">5</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">24/7</div>
              <div className="text-sm text-gray-600">Support Available</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">&lt;2hrs</div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="general" className="space-y-8">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
                {Object.entries(faqCategories).map(([key, category]) => (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className="flex items-center gap-2 text-xs md:text-sm"
                  >
                    {category.icon}
                    <span className="hidden sm:inline">{category.title}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.entries(faqCategories).map(([key, category]) => (
                <TabsContent key={key} value={key} className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2">
                      {category.title}
                    </h2>
                    <p className="text-gray-600">
                      {category.questions.length} frequently asked questions
                    </p>
                  </div>

                  <Accordion type="single" collapsible className="space-y-4">
                    {category.questions.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`${key}-${index}`}
                        className="border rounded-lg px-4"
                      >
                        <AccordionTrigger className="text-left hover:no-underline">
                          <span className="font-medium">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </section>

      {/* Popular Questions */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Most Popular Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-purple-600" />
                    <CardTitle className="text-lg">
                      How do I enter my first competition?
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Browse competitions, read requirements, and click "Enter
                    Competition" to get started.
                  </p>
                  <Badge className="mt-2" variant="secondary">
                    Most Popular
                  </Badge>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-lg">
                      How are prizes distributed?
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Organizers handle prize distribution directly to winners via
                    various methods.
                  </p>
                  <Badge className="mt-2" variant="secondary">
                    Trending
                  </Badge>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">
                      What should I include in my profile?
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Complete profiles with bio, skills, and portfolio links
                    perform better.
                  </p>
                  <Badge className="mt-2" variant="secondary">
                    Essential
                  </Badge>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-orange-600" />
                    <CardTitle className="text-lg">
                      Are competitions legitimate?
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    We thoroughly vet all competitions to ensure they are
                    legitimate and fair.
                  </p>
                  <Badge className="mt-2" variant="secondary">
                    Trust & Safety
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-16 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our support team is ready
            to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-white text-purple-600 hover:bg-gray-100"
            >
              <Link href="/contact">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Support
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-purple-600"
            >
              <Link href="/help">
                <HelpCircle className="h-4 w-4 mr-2" />
                Visit Help Centre
              </Link>
            </Button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4 text-purple-100 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>24/7 Support Available</span>
            </div>
            <div className="hidden md:block">•</div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>Average Response: 2 hours</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
