import { FormMessage, Message } from "@/components/form-message";
import Navbar from "@/components/navbar";
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
import { Building2, FileText, CheckCircle, Users, Trophy } from "lucide-react";

interface ClientLoginProps {
  searchParams: Promise<Message>;
}

// Custom sign-in action for client dashboard
const clientSignInAction = async (formData: FormData) => {
  "use server";

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const { createClient } = await import("../../../../supabase/server");
  const { encodedRedirect } = await import("@/utils/utils");
  const { redirect } = await import("next/navigation");

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/client/login", error.message);
  }

  // Check if user has client role, if not, set it
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    // If no profile exists or role is not client, update/create profile with client role
    if (!profile || profile.role !== "client") {
      await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email,
        role: "client",
        updated_at: new Date().toISOString(),
      });
    }
  }

  return redirect("/client");
};

export default async function ClientLoginPage({
  searchParams,
}: ClientLoginProps) {
  const message = await searchParams;

  if ("message" in message) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <FormMessage message={message} />
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
                Welcome to Your
                <span className="text-blue-600 block">Business Portal</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Submit competitions, manage your listings, and grow your
                business through our platform
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

          {/* Right Side - Login Form */}
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl font-semibold">
                Business Sign In
              </CardTitle>
              <CardDescription>Access your client dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
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
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <Link
                      className="text-xs text-muted-foreground hover:text-foreground hover:underline transition-all"
                      href="/forgot-password"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Your password"
                    required
                    className="w-full"
                  />
                </div>

                <SubmitButton
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  pendingText="Signing in..."
                  formAction={clientSignInAction}
                >
                  Sign in to Portal
                </SubmitButton>

                <FormMessage message={message} />

                <div className="text-center text-sm text-muted-foreground">
                  Don't have a business account?{" "}
                  <Link
                    className="text-blue-600 font-medium hover:underline transition-all"
                    href="/client/signup"
                  >
                    Create business account
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
