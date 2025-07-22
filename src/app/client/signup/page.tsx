import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { UrlProvider } from "@/components/url-provider";
import { Building2, FileText, CheckCircle, Users, Trophy } from "lucide-react";

// Custom sign-up action for client registration
const clientSignUpAction = async (formData: FormData) => {
  "use server";

  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const companyName = formData.get("companyName")?.toString() || "";
  const contactName = formData.get("contactName")?.toString() || "";
  const { createClient } = await import("../../../../supabase/server");
  const { encodedRedirect } = await import("@/utils/utils");
  const { headers } = await import("next/headers");

  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password || !companyName || !contactName) {
    return encodedRedirect(
      "error",
      "/client/signup",
      "All fields are required",
    );
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?redirect_to=/client`,
      data: {
        company_name: companyName,
        contact_name: contactName,
        email: email,
        role: "client",
      },
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/client/signup", error.message);
  }

  // Profile creation is handled automatically by the database trigger
  // The trigger will set the role to 'client' based on the user metadata

  return encodedRedirect(
    "success",
    "/client/signup",
    "Thanks for signing up! Please check your email for a verification link. Once verified, you can access your business portal.",
  );
};

export default async function ClientSignup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-purple-50 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Features */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">
                Join Our
                <span className="text-blue-600 block">Business Network</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Create your business account to start hosting competitions and
                reaching new audiences through our platform
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Submit Competitions</h3>
                      <p className="text-sm text-muted-foreground">
                        Easy submission
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Admin Approval</h3>
                      <p className="text-sm text-muted-foreground">
                        Quality control
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Reach Audience</h3>
                      <p className="text-sm text-muted-foreground">
                        Wide exposure
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                      <Trophy className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Manage Events</h3>
                      <p className="text-sm text-muted-foreground">
                        Full control
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">
                    For Businesses Only
                  </h4>
                  <p className="text-sm text-blue-700">
                    This portal is designed for businesses and organizations
                    looking to host competitions on our platform. All
                    submissions are reviewed by our admin team before going
                    live.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl font-semibold">
                Create Business Account
              </CardTitle>
              <CardDescription>
                Join our platform to start hosting competitions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UrlProvider>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="companyName"
                      className="text-sm font-medium"
                    >
                      Company Name
                    </Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      type="text"
                      placeholder="Your Company Ltd."
                      required
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="contactName"
                      className="text-sm font-medium"
                    >
                      Contact Name
                    </Label>
                    <Input
                      id="contactName"
                      name="contactName"
                      type="text"
                      placeholder="John Smith"
                      required
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Business Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="business@company.com"
                      required
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      placeholder="Your password"
                      minLength={6}
                      required
                      className="w-full"
                    />
                  </div>

                  <SubmitButton
                    formAction={clientSignUpAction}
                    pendingText="Creating account..."
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Create Business Account
                  </SubmitButton>

                  <FormMessage message={searchParams} />

                  <div className="text-center text-sm text-muted-foreground">
                    Already have a business account?{" "}
                    <Link
                      className="text-blue-600 font-medium hover:underline transition-all"
                      href="/client/login"
                    >
                      Sign in here
                    </Link>
                  </div>
                </form>
              </UrlProvider>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
