import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

// This endpoint helps set up the initial admin user
export async function POST(request: NextRequest) {
  try {
    // Verify this is being called with proper authorization
    const authHeader = request.headers.get("authorization");
    const setupKey = process.env.ADMIN_SETUP_KEY || "setup-admin-2024";

    if (authHeader !== `Bearer ${setupKey}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Create admin user
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: name || "System Administrator",
        },
      });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // Update profile to admin role
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: authData.user.id,
      email,
      full_name: name || "System Administrator",
      role: "admin",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      userId: authData.user.id,
    });
  } catch (error) {
    console.error("Error setting up admin:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}