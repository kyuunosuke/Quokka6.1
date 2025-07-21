import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  HelpCircle,
  Shield,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

export default function ContactUs() {
  const contactMethods = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Support",
      description: "Get help via email",
      contact: "support@competehub.com",
      responseTime: "Within 24 hours",
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Live Chat",
      description: "Chat with our support team",
      contact: "Available 9 AM - 6 PM EST",
      responseTime: "Instant response",
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone Support",
      description: "Speak directly with support",
      contact: "+1 (555) 123-4567",
      responseTime: "Mon-Fri, 9 AM - 6 PM EST",
    },
  ];

  const supportCategories = [
    {
      icon: <Trophy className="h-5 w-5" />,
      title: "Competition Support",
      description:
        "Help with entering competitions, requirements, and submissions",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Account Issues",
      description: "Profile management, login problems, and account settings",
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Technical Problems",
      description: "Website issues, bugs, and technical difficulties",
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      title: "General Inquiries",
      description: "Questions about our platform, policies, and services",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            We're here to help! Get in touch with our support team for any
            questions or assistance.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Get In Touch</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="text-purple-600 flex justify-center mb-4">
                    {method.icon}
                  </div>
                  <CardTitle className="text-xl">{method.title}</CardTitle>
                  <CardDescription>{method.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-semibold text-gray-900">
                      {method.contact}
                    </p>
                    <p className="text-sm text-gray-600">
                      {method.responseTime}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Form */}
              <div>
                <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>
                <Card>
                  <CardContent className="p-6">
                    <form className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" placeholder="John" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" placeholder="Doe" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Support Category</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="competition">
                              Competition Support
                            </SelectItem>
                            <SelectItem value="account">
                              Account Issues
                            </SelectItem>
                            <SelectItem value="technical">
                              Technical Problems
                            </SelectItem>
                            <SelectItem value="general">
                              General Inquiries
                            </SelectItem>
                            <SelectItem value="billing">
                              Billing & Payments
                            </SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          placeholder="Brief description of your inquiry"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Please provide details about your question or issue..."
                          rows={6}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority Level</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">
                              Low - General question
                            </SelectItem>
                            <SelectItem value="medium">
                              Medium - Need assistance
                            </SelectItem>
                            <SelectItem value="high">
                              High - Urgent issue
                            </SelectItem>
                            <SelectItem value="critical">
                              Critical - System down
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Support Categories */}
              <div>
                <h3 className="text-2xl font-bold mb-6">How Can We Help?</h3>
                <div className="space-y-4 mb-8">
                  {supportCategories.map((category, index) => (
                    <Card
                      key={index}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="text-purple-600 mt-1">
                            {category.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {category.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {category.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Office Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Office Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-1">Headquarters</h4>
                      <p className="text-gray-600 text-sm">
                        123 Competition Street
                        <br />
                        Innovation District
                        <br />
                        Tech City, TC 12345
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Monday - Friday: 9:00 AM - 6:00 PM EST</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Zap className="h-4 w-4" />
                      <span>Average response time: 2-4 hours</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Link */}
      <section className="py-16 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Looking for Quick Answers?
          </h2>
          <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
            Check out our frequently asked questions for instant answers to
            common queries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-white text-purple-600 hover:bg-gray-100"
            >
              <a href="/faq">Browse FAQ</a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-purple-600"
            >
              <a href="/help">Visit Help Centre</a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
