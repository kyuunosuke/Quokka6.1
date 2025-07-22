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
import {
  Shield,
  Eye,
  Lock,
  Database,
  Cookie,
  Mail,
  UserCheck,
  AlertTriangle,
} from "lucide-react";

export default function PrivacyPolicy() {
  const lastUpdated = "January 1, 2024";

  const privacySections = [
    {
      icon: <Database className="h-5 w-5" />,
      title: "Information We Collect",
      content: [
        "Personal information you provide when creating an account",
        "Competition entries and submissions",
        "Usage data and analytics",
        "Communication preferences and history",
      ],
    },
    {
      icon: <Eye className="h-5 w-5" />,
      title: "How We Use Your Information",
      content: [
        "To provide and improve our competition platform services",
        "To communicate with you about competitions and updates",
        "To ensure fair competition and prevent fraud",
        "To analyze platform usage and optimize user experience",
      ],
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Information Sharing",
      content: [
        "We do not sell your personal information to third parties",
        "Competition organizers may receive necessary participant information",
        "Legal compliance and safety requirements",
        "Service providers who assist in platform operations",
      ],
    },
    {
      icon: <Lock className="h-5 w-5" />,
      title: "Data Security",
      content: [
        "Industry-standard encryption for data transmission",
        "Secure data storage and access controls",
        "Regular security audits and updates",
        "Incident response and breach notification procedures",
      ],
    },
    {
      icon: <UserCheck className="h-5 w-5" />,
      title: "Your Rights",
      content: [
        "Access and review your personal information",
        "Request corrections to inaccurate data",
        "Delete your account and associated data",
        "Opt-out of marketing communications",
      ],
    },
    {
      icon: <Cookie className="h-5 w-5" />,
      title: "Cookies and Tracking",
      content: [
        "Essential cookies for platform functionality",
        "Analytics cookies to improve user experience",
        "Preference cookies to remember your settings",
        "Third-party cookies from integrated services",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and
            protect your personal information.
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge className="bg-white/20 text-white">
              Last Updated: {lastUpdated}
            </Badge>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 bg-yellow-50 border-b border-yellow-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-3 p-4 bg-yellow-100 rounded-lg border border-yellow-300">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-1">
                  Placeholder Content Notice
                </h3>
                <p className="text-yellow-700 text-sm">
                  This is a mock privacy policy page with placeholder content.
                  Please replace this content with your actual privacy policy
                  before going live. Consult with legal professionals to ensure
                  compliance with applicable privacy laws.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6">
                Our Commitment to Privacy
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  At CompeteHub, we are committed to protecting your privacy and
                  ensuring the security of your personal information. This
                  Privacy Policy explains how we collect, use, disclose, and
                  safeguard your information when you use our competition
                  platform.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  By using our services, you agree to the collection and use of
                  information in accordance with this policy. We encourage you
                  to read this policy carefully and contact us if you have any
                  questions.
                </p>
              </div>
            </div>

            {/* Privacy Sections */}
            <div className="grid gap-8">
              {privacySections.map((section, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="text-purple-600">{section.icon}</div>
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Data Retention */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-purple-600" />
                  Data Retention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We retain your personal information only for as long as
                  necessary to fulfill the purposes outlined in this Privacy
                  Policy, unless a longer retention period is required or
                  permitted by law.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>
                    • Account information: Retained while your account is active
                  </li>
                  <li>
                    • Competition data: Retained for legal and operational
                    purposes
                  </li>
                  <li>
                    • Communication records: Retained for customer service
                    purposes
                  </li>
                  <li>
                    • Analytics data: Aggregated and anonymized for platform
                    improvement
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* International Transfers */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>International Data Transfers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Your information may be transferred to and processed in
                  countries other than your own. We ensure that such transfers
                  are conducted in accordance with applicable data protection
                  laws and that appropriate safeguards are in place to protect
                  your information.
                </p>
              </CardContent>
            </Card>

            {/* Children's Privacy */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Children's Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Our services are not intended for children under the age of
                  13. We do not knowingly collect personal information from
                  children under 13. If you are a parent or guardian and believe
                  your child has provided us with personal information, please
                  contact us immediately.
                </p>
              </CardContent>
            </Card>

            {/* Changes to Policy */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Changes to This Privacy Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will
                  notify you of any changes by posting the new Privacy Policy on
                  this page and updating the "Last Updated" date. You are
                  advised to review this Privacy Policy periodically for any
                  changes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Questions About Privacy?</h2>
          <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
            If you have any questions about this Privacy Policy or our data
            practices, please don't hesitate to contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:privacy@competehub.com"
              className="inline-flex items-center px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Mail className="h-4 w-4 mr-2" />
              privacy@competehub.com
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
