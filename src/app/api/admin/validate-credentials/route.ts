import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  console.log("🔍 Admin credential validation started");

  try {
    const { email, password } = await request.json();
    console.log("📧 Validating credentials for email:", email);

    // Get pre-configured admin credentials from environment
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminEmails =
      process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [];

    console.log("🔧 Environment variables:");
    console.log("  - ADMIN_EMAIL:", adminEmail ? "[SET]" : "[NOT SET]");
    console.log("  - ADMIN_PASSWORD:", adminPassword ? "[SET]" : "[NOT SET]");
    console.log("  - ADMIN_EMAILS:", adminEmails);

    if (!adminEmail || !adminPassword) {
      console.error("❌ Admin credentials not configured in environment");
      return NextResponse.json(
        { valid: false, error: "Admin credentials not configured" },
        { status: 400 },
      );
    }

    // Check if provided credentials match pre-configured ones
    const isValidEmail = email === adminEmail || adminEmails.includes(email);
    const isValidPassword = password === adminPassword;

    console.log("🔍 Credential validation:");
    console.log("  - Email match:", isValidEmail);
    console.log("  - Password match:", isValidPassword);

    if (!isValidEmail || !isValidPassword) {
      console.error("❌ Invalid credentials provided");
      return NextResponse.json(
        { valid: false, error: "Invalid credentials" },
        { status: 401 },
      );
    }

    console.log("🔍 Checking if admin user exists in database...");

    // Check if admin user exists in database, create if not
    const supabase = await createClient();

    // First check if admin user exists
    const { data: existingProfile, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, role")
      .eq("email", adminEmail)
      .eq("role", "admin")
      .single();

    console.log("👥 Existing profile check:", {
      existingProfile,
      profileError,
    });

    if (!existingProfile) {
      console.log("⚠️ Admin profile not found, attempting to create...");
      // Try to create admin user using service role
      try {
        // Create service role client for admin operations
        const { createClient: createServiceClient } = await import(
          "@supabase/supabase-js"
        );
        const serviceSupabase = createServiceClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_KEY!,
          {
            auth: {
              autoRefreshToken: false,
              persistSession: false,
            },
          },
        );

        console.log("🔍 Checking if user exists in auth.users...");

        // First check if user already exists in auth.users
        const { data: listData, error: getUserError } =
          await serviceSupabase.auth.admin.listUsers();

        let userId: string | undefined;

        const foundUser = listData?.users?.find((u) => u.email === adminEmail);
        if (foundUser && !getUserError) {
          userId = foundUser.id;
          console.log(
            "✅ Admin user already exists in auth, updating profile only",
          );
        } else {
          console.log("⚠️ Admin user not found in auth, creating new user...");

          // User doesn't exist, create new auth user
          const { data: authData, error: authError } =
            await serviceSupabase.auth.admin.createUser({
              email: adminEmail,
              password: adminPassword,
              email_confirm: true,
              user_metadata: {
                full_name: process.env.ADMIN_NAME || "System Administrator",
              },
            });

          if (authError) {
            console.error("❌ Error creating admin auth user:", authError);

            // If user already exists, try to get them again
            if (authError.message?.includes("already been registered")) {
              console.log("🔄 User already registered, attempting to find...");

              const { data: retryData, error: retryError } =
                await serviceSupabase.auth.admin.listUsers();

              const retryUser = retryData?.users?.find(
                (user) => user.email === adminEmail,
              );

              if (retryUser && !retryError) {
                userId = retryUser.id;
                console.log(
                  "✅ Found existing admin user after creation attempt",
                );
              } else {
                console.error(
                  "❌ Error finding existing admin user:",
                  retryError,
                );
                return NextResponse.json(
                  { valid: false, error: "Failed to locate admin user" },
                  { status: 500 },
                );
              }
            } else {
              console.error(
                "❌ Failed to create admin user:",
                authError.message,
              );
              return NextResponse.json(
                {
                  valid: false,
                  error: `Failed to create admin user: ${authError.message}`,
                },
                { status: 500 },
              );
            }
          } else if (authData?.user) {
            userId = authData.user.id;
            console.log("✅ Successfully created new admin user");
          } else {
            console.error("❌ No user data returned from creation");
            return NextResponse.json(
              {
                valid: false,
                error: "Failed to create admin user - no data returned",
              },
              { status: 500 },
            );
          }
        }

        if (!userId) {
          console.error("❌ No userId available for profile creation");
          return NextResponse.json(
            { valid: false, error: "Failed to determine user ID" },
            { status: 500 },
          );
        }

        console.log("👤 Creating/updating admin profile for user:", userId);

        // Update profile to admin role using service client to bypass RLS
        const { error: profileError } = await serviceSupabase
          .from("profiles")
          .upsert({
            id: userId,
            email: adminEmail,
            full_name: process.env.ADMIN_NAME || "System Administrator",
            role: "admin",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (profileError) {
          console.error("❌ Error creating admin profile:", profileError);
          return NextResponse.json(
            {
              valid: false,
              error: `Failed to create admin profile: ${profileError.message}`,
            },
            { status: 500 },
          );
        } else {
          console.log("✅ Admin profile created/updated successfully");
        }
      } catch (createError) {
        console.error("💥 Error in admin user creation:", createError);
        return NextResponse.json(
          {
            valid: false,
            error: `Admin user creation failed: ${createError instanceof Error ? createError.message : "Unknown error"}`,
          },
          { status: 500 },
        );
      }
    } else {
      console.log("✅ Admin profile already exists");
    }

    console.log("✅ Credential validation successful");
    return NextResponse.json({
      valid: true,
      adminEmail,
      message: "Credentials validated successfully",
    });
  } catch (error) {
    console.error("💥 Error validating admin credentials:", error);
    return NextResponse.json(
      {
        valid: false,
        error: `Internal server error: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    );
  }
}