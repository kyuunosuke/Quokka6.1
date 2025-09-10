import { signInAction } from "@/app/actions";
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
import { User, Trophy, Users, Heart } from "lucide-react";

interface MemberLoginProps {
  searchParams: Promise<Message>;
}

// Custom sign-in action for member dashboard
const memberSignInAction = async (formData: FormData) => {
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
    return encodedRedirect("error", "/member/login", error.message);
  }

  return redirect("/member");
};

export default async function MemberLoginPage({
  searchParams,
}: MemberLoginProps) {
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
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Features */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">
                Welcome to Your
                <span className="text-primary block">Member Dashboard</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Track your competitions, manage your profile, and unlock
                achievements
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                      <Heart className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Liked Competitions</h3>
                      <p className="text-sm text-muted-foreground">
                        Save favorites
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Joined Events</h3>
                      <p className="text-sm text-muted-foreground">
                        Track progress
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                      <Trophy className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Achievements</h3>
                      <p className="text-sm text-muted-foreground">
                        Unlock rewards
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Profile</h3>
                      <p className="text-sm text-muted-foreground">
                        Manage account
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl font-semibold">
                Member Sign In
              </CardTitle>
              <CardDescription>Access your member dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
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
                  className="w-full"
                  pendingText="Signing in..."
                  formAction={memberSignInAction}
                >
                  Sign in to Dashboard
                </SubmitButton>

                <FormMessage message={message} />

                <div className="text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link
                    className="text-primary font-medium hover:underline transition-all"
                    href="/sign-up"
                  >
                    Sign up here
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