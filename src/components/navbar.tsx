"use client";

import Link from "next/link";
import Image from "next/image";
import { createClient } from "../../supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import { User, UserCircle } from "lucide-react";
import UserProfile from "./user-profile";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
  }, []);

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" prefetch className="flex items-center">
          <Image
            src="/images/Q logo.jpg"
            alt="Logo"
            width={80}
            height={80}
            className="object-contain"
          />
        </Link>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-2xl font-bold text-gray-900">Quokkamole.com</h1>
        </div>

        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link
                href="/member"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <Button>Member Portal</Button>
              </Link>
              <UserProfile />
            </>
          ) : (
            <>
              <Link
                href="/member/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}