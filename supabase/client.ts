import { createBrowserClient } from "@supabase/ssr";

// Validate environment variables
const validateEnvVars = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    console.error(
      "[SUPABASE] Missing NEXT_PUBLIC_SUPABASE_URL environment variable",
    );
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
  }

  if (!supabaseAnonKey) {
    console.error(
      "[SUPABASE] Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable",
    );
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable",
    );
  }

  // Validate URL format
  try {
    new URL(supabaseUrl);
  } catch (error) {
    console.error(
      "[SUPABASE] Invalid NEXT_PUBLIC_SUPABASE_URL format:",
      supabaseUrl,
    );
    throw new Error(`Invalid NEXT_PUBLIC_SUPABASE_URL format: ${supabaseUrl}`);
  }

  // Validate that it's a Supabase URL
  if (
    !supabaseUrl.includes("supabase.co") &&
    !supabaseUrl.includes("localhost")
  ) {
    console.warn(
      "[SUPABASE] URL does not appear to be a valid Supabase URL:",
      supabaseUrl,
    );
  }

  return { supabaseUrl, supabaseAnonKey };
};

export const createClient = () => {
  try {
    const { supabaseUrl, supabaseAnonKey } = validateEnvVars();

    console.log(
      "[SUPABASE] Creating client with URL:",
      supabaseUrl.substring(0, 30) + "...",
    );

    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error("[SUPABASE] Failed to create client:", error);

    // Return a mock client that will fail gracefully
    return {
      auth: {
        getUser: () =>
          Promise.resolve({
            data: { user: null },
            error: new Error("Supabase client not configured"),
          }),
        signInWithPassword: () =>
          Promise.resolve({
            data: null,
            error: new Error("Supabase client not configured"),
          }),
        signUp: () =>
          Promise.resolve({
            data: null,
            error: new Error("Supabase client not configured"),
          }),
        signOut: () => Promise.resolve({ error: null }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () =>
              Promise.resolve({
                data: null,
                error: new Error("Supabase client not configured"),
              }),
            order: () =>
              Promise.resolve({
                data: [],
                error: new Error("Supabase client not configured"),
              }),
          }),
          order: () =>
            Promise.resolve({
              data: [],
              error: new Error("Supabase client not configured"),
            }),
        }),
        insert: () =>
          Promise.resolve({
            data: null,
            error: new Error("Supabase client not configured"),
          }),
        update: () =>
          Promise.resolve({
            data: null,
            error: new Error("Supabase client not configured"),
          }),
        delete: () =>
          Promise.resolve({
            data: null,
            error: new Error("Supabase client not configured"),
          }),
        upsert: () =>
          Promise.resolve({
            data: null,
            error: new Error("Supabase client not configured"),
          }),
      }),
    } as any;
  }
};
