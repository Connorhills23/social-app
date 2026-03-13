"use client";

import "./globals.css";
import { ClerkProvider, useUser } from "@clerk/nextjs";
import Navbar from "@/app/components/navbar";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { supabase } from "@/lib/supabase";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [newPost, setNewPost] = useState("");

  return (
    <html lang="en">
      <ClerkProvider>
        <body className="bg-gray-50">
          <Navbar openCreatePost={() => setIsOpen(true)} />

          <main className="pt-24">{children}</main>

          <NewPostModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            newPost={newPost}
            setNewPost={setNewPost}
          />
        </body>
      </ClerkProvider>
    </html>
  );
}

function NewPostModal({
  isOpen,
  setIsOpen,
  newPost,
  setNewPost,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  newPost: string;
  setNewPost: (val: string) => void;
}) {
  const { user } = useUser();

  const createPost = async () => {
    if (!user || newPost.trim() === "") return;

    await supabase.from("users").upsert({
      clerk_id: user.id,
      username: user.username,
      bio: "",
    });

    const { error } = await supabase.from("posts").insert({
      user_id: user.id,
      content: newPost,
      username: user.username,
      bio: "",
    });

    if (error) console.error("Error creating post:", error);

    setNewPost("");
    setIsOpen(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-xl w-96">
        <Dialog.Title className="text-xl font-semibold mb-3 text-gray-800">
          New Post
        </Dialog.Title>

        <textarea
          className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          placeholder="Share something..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <Dialog.Close className="px-4 py-2 border rounded-md hover:bg-gray-100 transition">
            Cancel
          </Dialog.Close>
          <button
            onClick={createPost}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition"
          >
            Post
          </button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
