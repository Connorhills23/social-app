"use client";

import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

interface NavbarProps {
  openCreatePost: () => void;
}

export default function Navbar({ openCreatePost }: NavbarProps) {
  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 fixed top-0 left-0 z-50 flex justify-between items-center">
      <div className="text-2xl font-bold text-gray-800">SocialApp</div>
      <div className="flex items-center gap-4">
        <Link
          href="/feed"
          className="text-gray-700 hover:text-gray-900 font-medium transition"
        >
          Feed
        </Link>
        <Link
          href="/profile"
          className="text-gray-700 hover:text-gray-900 font-medium transition"
        >
          Profile
        </Link>
        <button
          onClick={openCreatePost}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition"
        >
          New Post
        </button>
        <SignOutButton redirectUrl="/sign-in">
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition">
            Log Out
          </button>
        </SignOutButton>
      </div>
    </nav>
  );
}
