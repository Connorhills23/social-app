"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import * as Dialog from "@radix-ui/react-dialog";

export default function CreatePost() {
  const { user } = useUser();
  const [content, setContent] = useState("");

  const createPost = async () => {
    if (!user || content.trim() === "") return;
    await supabase.from("posts").insert({
      user_id: user.id,
      content,
    });
    setContent("");
    alert("Post created!");
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create a Post</h1>

      <Dialog.Root>
        <Dialog.Trigger className="bg-blue-500 text-white px-4 py-2 rounded">
          Open Post Form
        </Dialog.Trigger>

        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-md w-96">
          <h2 className="text-xl font-semibold mb-2">New Post</h2>

          <textarea
            className="w-full border p-2 rounded mb-4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write something..."
          />

          <div className="flex justify-end gap-2">
            <Dialog.Close className="px-4 py-2 border rounded">
              Cancel
            </Dialog.Close>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={createPost}
            >
              Post
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}
