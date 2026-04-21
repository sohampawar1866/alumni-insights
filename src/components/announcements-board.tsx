"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Announcement = {
  id: string;
  title: string;
  body: string;
  attachment_url: string | null;
  is_pinned: boolean;
  expires_at: string | null;
  created_at: string;
  is_flagged: boolean;
  author_id: string;
  target_branch: string | null;
  target_batch: number | null;
  target_city: string | null;
  profiles: {
    full_name: string;
    role: string;
    role_title: string;
    company: string;
  };
  likes: { count: number }[];
  user_liked?: boolean;
};

type Props = {
  currentUserRole: "student" | "alumni" | "moderator";
  currentUserId: string;
};

export function AnnouncementsBoard({ currentUserRole, currentUserId }: Props) {
  const supabase = createClient();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewPost, setShowNewPost] = useState(false);

  // New Post State
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [posting, setPosting] = useState(false);
  
  // Targeting State (Moderator Only)
  const [targetBranch, setTargetBranch] = useState("");
  const [targetBatch, setTargetBatch] = useState("");
  const [targetCity, setTargetCity] = useState("");

  const fetchAnnouncements = async () => {
    setLoading(true);
    // Fetch announcements that are not expired
    const now = new Date().toISOString();
    
    // In a real app we'd also want to fetch the likes and whether the current user liked it
    const { data } = await supabase
      .from("announcements")
      .select(`
        *,
        profiles!author_id (full_name, role, role_title, company),
        likes:announcement_likes (count)
      `)
      .or(`expires_at.is.null,expires_at.gt.${now}`)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });

    if (data) {
      // Fetch user's likes
      const { data: userLikes } = await supabase
        .from("announcement_likes")
        .select("announcement_id")
        .eq("user_id", currentUserId);

      const likedIds = new Set(userLikes?.map((l) => l.announcement_id) || []);

      let filteredData = data as Announcement[];

      if (currentUserRole === "alumni") {
        const { data: userProfile } = await supabase
          .from("profiles")
          .select("branch, graduation_year, city")
          .eq("id", currentUserId)
          .single();

        if (userProfile) {
          filteredData = filteredData.filter(a => {
            if (a.target_branch && a.target_branch.toLowerCase() !== userProfile.branch?.toLowerCase()) return false;
            if (a.target_batch && a.target_batch !== userProfile.graduation_year) return false;
            if (a.target_city && a.target_city.toLowerCase() !== userProfile.city?.toLowerCase()) return false;
            return true;
          });
        }
      }

      const formatted = filteredData.map((d: Announcement) => ({
        ...d,
        user_liked: likedIds.has(d.id),
      }));

      setAnnouncements(formatted);
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAnnouncements();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);
    const { error } = await supabase.from("announcements").insert({
      author_id: currentUserId,
      title,
      body,
      attachment_url: attachmentUrl || null,
      is_pinned: currentUserRole === "moderator" ? isPinned : false,
      expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
      target_branch: targetBranch || null,
      target_batch: targetBatch ? parseInt(targetBatch) : null,
      target_city: targetCity || null,
    });

    if (!error) {
      setShowNewPost(false);
      setTitle("");
      setBody("");
      setAttachmentUrl("");
      setIsPinned(false);
      setExpiresAt("");
      setTargetBranch("");
      setTargetBatch("");
      setTargetCity("");
      fetchAnnouncements();
    }
    setPosting(false);
  };

  const toggleLike = async (id: string, currentlyLiked: boolean) => {
    // Optimistic UI update
    setAnnouncements((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return {
            ...a,
            user_liked: !currentlyLiked,
            likes: [{ count: (a.likes[0]?.count || 0) + (currentlyLiked ? -1 : 1) }],
          };
        }
        return a;
      })
    );

    if (currentlyLiked) {
      await supabase
        .from("announcement_likes")
        .delete()
        .eq("announcement_id", id)
        .eq("user_id", currentUserId);
    } else {
      await supabase
        .from("announcement_likes")
        .insert({ announcement_id: id, user_id: currentUserId });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    await supabase.from("announcements").delete().eq("id", id);
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const handleFlag = async (id: string) => {
    await supabase.rpc("flag_announcement", { announcement_id: id });
    alert("Post flagged for moderator review.");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Announcements</h1>
          <p className="text-sm text-slate-500 mt-1">
            Updates and notices from IIIT Nagpur and its alumni.
          </p>
        </div>
        {currentUserRole !== "student" && (
          <Button onClick={() => setShowNewPost(!showNewPost)}>
            {showNewPost ? "Cancel" : "New Post"}
          </Button>
        )}
      </div>

      {showNewPost && (
        <form
          onSubmit={handlePost}
          className="rounded-2xl border border-blue-200 bg-blue-50/30 p-6 shadow-sm space-y-4"
        >
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Title</label>
            <Input
              required
              maxLength={100}
              placeholder="Post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Message</label>
            <textarea
              required
              maxLength={1000}
              rows={4}
              placeholder="What do you want to share?"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="flex w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            />
            <p className="text-xs text-slate-400 text-right">{body.length}/1000</p>
          </div>

          {currentUserRole === "moderator" && (
            <div className="p-4 bg-white rounded-xl border border-blue-100 space-y-3">
              <p className="text-xs font-bold tracking-wide uppercase text-blue-800">Target Audience (Optional)</p>
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500">Branch</label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={targetBranch}
                    onChange={(e) => setTargetBranch(e.target.value)}
                  >
                    <option value="">All Branches</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500">Batch (Grad Year)</label>
                  <Input
                    type="number"
                    placeholder="e.g. 2020"
                    value={targetBatch}
                    onChange={(e) => setTargetBatch(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500">City</label>
                  <Input
                    type="text"
                    placeholder="e.g. Bangalore"
                    value={targetCity}
                    onChange={(e) => setTargetCity(e.target.value)}
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-400">Leave fields empty to broadcast to everyone.</p>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">Attachment / Link URL</label>
              <Input
                type="url"
                placeholder="https://..."
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">Expiry Date (Optional)</label>
              <Input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>
          </div>
          
          {currentUserRole === "moderator" && (
            <label className="flex items-center gap-2 cursor-pointer pt-2">
              <input
                type="checkbox"
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
              />
              <span className="text-sm text-slate-600 font-medium">Pin to top</span>
            </label>
          )}

          <div className="pt-2">
            <Button type="submit" disabled={posting || !title || !body}>
              {posting ? "Posting..." : "Publish Post"}
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-slate-500">No announcements yet.</p>
          </div>
        ) : (
          announcements.map((post) => {
            const isAuthor = post.author_id === currentUserId;
            const canDelete = isAuthor || currentUserRole === "moderator";
            const likesCount = post.likes[0]?.count || 0;

            const targets = [];
            if (post.target_branch) targets.push(post.target_branch);
            if (post.target_batch) targets.push(`Batch '${post.target_batch}`);
            if (post.target_city) targets.push(post.target_city);
            const targetString = targets.length > 0 ? targets.join(", ") : "Everyone";

            return (
              <div
                key={post.id}
                className={`rounded-2xl border bg-white p-5 shadow-sm space-y-4 ${
                  post.is_pinned ? "border-amber-200 bg-amber-50/30" : "border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {post.is_pinned && (
                        <span className="inline-flex items-center rounded-md bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                          📌 Pinned
                        </span>
                      )}
                      {post.profiles.role === "moderator" ? (
                        <span className="inline-flex items-center text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-md">
                          🏫 Official — {post.profiles.full_name} · IIIT Nagpur Placement Cell
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
                          👤 Alumni — {post.profiles.full_name}, {post.profiles.role_title} at {post.profiles.company}
                        </span>
                      )}
                      
                      {currentUserRole === "moderator" && (
                        <span className="inline-flex items-center text-xs font-medium text-purple-700 bg-purple-50 px-2 py-1 rounded-md border border-purple-100">
                          🎯 Target: {targetString}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{post.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {canDelete && (
                      <button
                         onClick={() => handleDelete(post.id)}
                        className="text-xs text-red-600 hover:underline p-1"
                      >
                        Delete
                      </button>
                    )}
                    {currentUserRole === "student" && !isAuthor && (
                      <button
                        onClick={() => handleFlag(post.id)}
                        className="text-xs text-slate-400 hover:text-slate-600 p-1"
                      >
                        Flag
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-sm text-slate-700 whitespace-pre-wrap">
                  {post.body}
                </div>

                {post.attachment_url && (
                  <div>
                    <a
                      href={post.attachment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline"
                    >
                      🔗 View Attachment / Link
                    </a>
                  </div>
                )}

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <button
                    onClick={() => toggleLike(post.id, !!post.user_liked)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      post.user_liked
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>{post.user_liked ? "👍 Liked" : "👍 Like"}</span>
                    {likesCount > 0 && <span className="ml-1 opacity-70">{likesCount}</span>}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
