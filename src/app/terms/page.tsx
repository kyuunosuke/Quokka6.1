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
  FileText,
  Shield,
  Users,
  Trophy,
  AlertTriangle,
  Scale,
  Ban,
  Mail,
  Gavel,
} from "lucide-react";

export default function TermsOfService() {
  const lastUpdated = "January 1, 2024";

  const termsSections = [
    {
      icon: <Users className="h-5 w-5" />,
      title: "User Accounts and Registration",
      content: [
        "You must provide accurate and complete information when creating an account",
        "You are responsible for maintaining the security of your account credentials",
        "One person may not maintain multiple accounts",
        "You must be at least 13 years old to use our services",
      ],
    },
    {
      icon: <Trophy className="h-5 w-5" />,
      title: "Competition Participation",
      content: [
        "All competition entries must be original work created by the participant",
        "Participants must meet all eligibility requirements for each competition",
        "Submission deadlines are strictly enforced",
        "False or misleading information may result in disqualification",
      ],
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Intellectual Property",
      content: [
        "You retain ownership of your original competition submissions",
        "By submitting, you grant us license to display and promote your work",
        "You must not infringe on others' intellectual property rights",
        "We respect intellectual property and respond to valid DMCA notices",
      ],
    },
    {
      icon: <Ban className="h-5 w-5" />,
      title: "Prohibited Conduct",
      content: [
        "No harassment, abuse, or discriminatory behavior toward other users",
        "No spam, fraudulent activities, or attempts to manipulate competitions",
        "No uploading of malicious software or harmful content",
        "No violation of applicable laws or regulations",
      ],
    },
    {
      icon: <Scale className="h-5 w-5" />,
      title: "Limitation of Liability",
      content: [
        "Our services are provided 'as is' without warranties of any kind",
        "We are not liable for indirect, incidental, or consequential damages",
        "Our total liability is limited to the amount you paid for our services",
        "Some jurisdictions may not allow certain liability limitations",
      ],
    },
    {
      icon: <Gavel className="h-5 w-5" />,
      title: "Dispute Resolution",
      content: [
        "Most disputes can be resolved through our customer support team",
        "Binding arbitration may be required for certain types of disputes",
        "Class action lawsuits are generally not permitted",
        "Applicable law and jurisdiction are specified in the full terms",
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
            Terms of Service
          </h1>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Please read these terms carefully before using our competition
            platform. By using our services, you agree to these terms.
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
                  This is a mock terms of service page with placeholder content.
                  Please replace this content with your actual terms of service
                  before going live. Consult with legal professionals to ensure
                  proper legal protection and compliance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Agreement to Terms</h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  These Terms of Service ("Terms") govern your use of the
                  CompeteHub platform and services. By accessing or using our
                  services, you agree to be bound by these Terms and our Privacy
                  Policy.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  If you do not agree to these Terms, please do not use our
                  services. We reserve the right to modify these Terms at any
                  time, and your continued use of our services constitutes
                  acceptance of any changes.
                </p>
              </div>
            </div>

            {/* Terms Sections */}
            <div className="grid gap-8">
              {termsSections.map((section, index) => (
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

            {/* Service Availability */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-purple-600" />
                  Service Availability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We strive to provide reliable and continuous service, but we
                  cannot guarantee uninterrupted access to our platform. We may
                  temporarily suspend or restrict access for maintenance,
                  updates, or other operational reasons.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>
                    • Scheduled maintenance will be announced in advance when
                    possible
                  </li>
                  <li>
                    • Emergency maintenance may occur without prior notice
                  </li>
                  <li>
                    • We are not liable for losses due to service interruptions
                  </li>
                  <li>
                    • Alternative access methods may be provided during outages
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Payment Terms */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Payment and Refund Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Some competitions may require entry fees as determined by the
                  competition organizers. Payment terms and refund policies vary
                  by competition and will be clearly stated before payment.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>
                    • Entry fees are typically non-refundable once a competition
                    begins
                  </li>
                  <li>
                    • Refunds may be available if a competition is cancelled
                  </li>
                  <li>• Payment disputes should be reported within 30 days</li>
                  <li>
                    • We use secure payment processing for all transactions
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Account Termination */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Account Termination</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed mb-4">
                  You may terminate your account at any time through your
                  account settings. We may suspend or terminate accounts that
                  violate these Terms or engage in prohibited conduct.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Account deletion is permanent and cannot be undone</li>
                  <li>
                    • Active competition entries may remain after account
                    deletion
                  </li>
                  <li>
                    • We may retain certain information as required by law
                  </li>
                  <li>
                    • Terminated users may not create new accounts without
                    permission
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Governing Law */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Governing Law</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  These Terms are governed by and construed in accordance with
                  the laws of [Jurisdiction]. Any disputes arising from these
                  Terms or your use of our services will be subject to the
                  exclusive jurisdiction of the courts in [Jurisdiction].
                </p>
              </CardContent>
            </Card>

            {/* Changes to Terms */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Changes to These Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  We reserve the right to modify these Terms at any time. We
                  will notify users of significant changes via email or platform
                  notification. Your continued use of our services after changes
                  take effect constitutes acceptance of the new Terms.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Questions About These Terms?
          </h2>
          <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
            If you have any questions about these Terms of Service or need
            clarification on any provisions, please contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:legal@competehub.com"
              className="inline-flex items-center px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Mail className="h-4 w-4 mr-2" />
              legal@competehub.com
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
