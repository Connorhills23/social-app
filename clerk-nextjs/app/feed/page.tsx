"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import { Heart, MessageCircle } from "lucide-react";

export default function FeedPage() {
  const { user } = useUser();
  const [posts, setPosts] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [openComments, setOpenComments] = useState<string | null>(null);

  // --------------------
  // Load Posts
  // --------------------
  const loadPosts = async () => {
    const { data } = await supabase
      .from("posts")
      .select(
        `
        *,
        likes(count),
        comments(*)
      `,
      )
      .order("created_at", { ascending: false });

    setPosts(data || []);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // --------------------
  // Like / Unlike
  // --------------------
  const toggleLike = async (postId: string) => {
    if (!user) return;

    const { data } = await supabase
      .from("likes")
      .select("*")
      .eq("post_id", postId)
      .eq("user_id", user.id)
      .single();

    if (data) {
      await supabase
        .from("likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);
    } else {
      await supabase.from("likes").insert({
        post_id: postId,
        user_id: user.id,
      });
    }

    loadPosts();
  };

  // --------------------
  // Add Comment
  // --------------------
  const addComment = async (postId: string) => {
    if (!user || commentText.trim() === "") return;

    await supabase.from("comments").insert({
      post_id: postId,
      user_id: user.id,
      username: user.username,
      content: commentText,
    });

    setCommentText("");
    loadPosts();
  };

  // --------------------
  // UI
  // --------------------
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-10">Social Feed</h1>

        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl shadow-sm p-6 mb-6 transition hover:shadow-md"
          >
            {/* Header */}
            <div className="flex justify-between mb-3">
              <p className="font-semibold">{post.username || "User"}</p>
              <p className="text-xs text-gray-400">
                {new Date(post.created_at).toLocaleDateString()}
              </p>
            </div>

            {/* Content */}
            <p className="text-gray-700 text-lg mb-4">{post.content}</p>

            {/* Actions */}
            <div className="flex gap-6 text-gray-600">
              {/* Like */}
              <button
                onClick={() => toggleLike(post.id)}
                className="flex items-center gap-2 hover:text-red-500 transition"
              >
                <Heart size={18} />
                {post.likes?.[0]?.count || 0}
              </button>

              {/* Comments Toggle */}
              <button
                onClick={() =>
                  setOpenComments(openComments === post.id ? null : post.id)
                }
                className="flex items-center gap-2 hover:text-blue-500 transition"
              >
                <MessageCircle size={18} />
                {post.comments?.length || 0}
              </button>
            </div>

            {/* Comments Section */}
            {openComments === post.id && (
              <div className="mt-5 border-t pt-4">
                {/* Existing Comments */}
                {post.comments?.map((comment: any) => (
                  <div
                    key={comment.id}
                    className="bg-gray-50 rounded-lg p-3 mb-2"
                  >
                    <p className="text-sm font-semibold">
                      {comment.username || "User"}
                    </p>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                ))}

                {/* Add Comment */}
                <div className="flex gap-2 mt-3">
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 border rounded-lg px-3 py-2 text-sm"
                  />
                  <button
                    onClick={() => addComment(post.id)}
                    className="bg-black text-white px-4 rounded-lg text-sm hover:opacity-80"
                  >
                    Post
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
