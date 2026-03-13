"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const { user } = useUser();
  const [posts, setPosts] = useState<any[]>([]);

  const loadPosts = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("posts")
      .select(`*, likes(count)`)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setPosts(data || []);
  };

  useEffect(() => {
    loadPosts();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 text-center">
          <h1 className="text-2xl font-bold">{user?.username}</h1>
          <p className="text-gray-500 mt-2">Your Posts</p>
        </div>

        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl shadow-sm p-6 mb-6"
          >
            <p className="text-gray-700 text-lg">{post.content}</p>

            <p className="text-sm text-gray-400 mt-3">
              ❤️ {post.likes?.[0]?.count || 0}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
