import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../../supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Get pre-configured admin credentials from environment
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminEmails =
      process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [];

    // ✅ TEMPORARY: Debug logs from chatgpt
    console.log("ENV ADMIN_EMAIL:", adminEmail);
    console.log("ENV ADMIN_PASSWORD:", adminPassword);
    console.log("ENV ADMIN_EMAILS:", adminEmails);

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { valid: false, error: "Admin credentials not configured" },
        { status: 400 },
      );
    }

    // Check if provided credentials match pre-configured ones
    const isValidEmail = email === adminEmail || adminEmails.includes(email);
    const isValidPassword = password === adminPassword;

    if (!isValidEmail || !isValidPassword) {
      return NextResponse.json(
        { valid: false, error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Check if admin user exists in database, create if not
    const supabase = await createClient();

    // First check if admin user exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id, email, role")
      .eq("email", adminEmail)
      .eq("role", "admin")
      .single();

    if (!existingProfile) {
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

        // First check if user already exists in auth.users
        //Changes made as advised by chatgpt
        const { data: listData, error: getUserError } =
          await serviceSupabase.auth.admin.listUsers();

        let userId: string;

        const foundUser = listData?.users?.find((u) => u.email === adminEmail);
        if (foundUser && !getUserError) {
          userId = foundUser.id;
          console.log(
            "Admin user already exists in auth, updating profile only",
          );
        }

        // if (existingUser && !getUserError) {
        // User exists in auth, use their ID
        //  userId = existingUser.id;
        //  console.log("Admin user already exists in auth, updating profile only",);

        // } else

        {
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
            // If user already exists, try to get them again
            if (authError.message?.includes("already been registered")) {
              //as by chatgpt replace retryUsers with retryData

              const { data: retryData, error: retryError } =
                await serviceSupabase.auth.admin.listUsers();

              const retryUser = retryData?.users?.find(
                (user) => user.email === adminEmail,
              );

              if (retryUser && !retryError) {
                userId = retryUser.id;
                console.log("Found existing admin user after creation attempt");
              } else {
                console.error("Error finding existing admin user:", retryError);
                return NextResponse.json(
                  { valid: false, error: "Failed to locate admin user" },
                  { status: 500 },
                );
              }
            } else {
              console.error("Error creating admin auth user:", authError);
              return NextResponse.json(
                { valid: false, error: "Failed to create admin user" },
                { status: 500 },
              );
            }
          } else {
            userId = authData.user.id;
          }
        }

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
        //added chatgpt
        console.log("ENV Email:", adminEmail);
        console.log("ENV Password:", adminPassword);

        if (profileError) {
          console.error("Error creating admin profile:", profileError);
        }
      } catch (createError) {
        console.error("Error in admin user creation:", createError);
        // Continue anyway - user might exist but profile wasn't found
      }
    }

    return NextResponse.json({
      valid: true,
      adminEmail,
      message: "Credentials validated successfully",
    });
  } catch (error) {
    console.error("Error validating admin credentials:", error);
    return NextResponse.json(
      { valid: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
