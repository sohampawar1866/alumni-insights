"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pin, School, User, Crosshair, Link2, ThumbsUp, Trash2, Flag } from "lucide-react";

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
    roles: string[];
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

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    const now = new Date().toISOString();
    
    const { data } = await supabase
      .from("announcements")
      .select(`
        *,
        profiles!author_id (full_name, roles, role_title, company),
        likes:announcement_likes (count)
      `)
      .or(`expires_at.is.null,expires_at.gt.${now}`)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });

    if (data) {
      const { data: userLikes } = await supabase
        .from("announcement_likes")
        .select("announcement_id")
        .eq("user_id", currentUserId);

      const likedIds = new Set(userLikes?.map((l: { announcement_id: string }) => l.announcement_id) || []);

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
  }, [supabase, currentUserId, currentUserRole]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) return;
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
      <div className="flex items-center justify-center py-20 font-sans">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-heading">
            Community Announcements
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Official placement notices, event updates, and alumni announcements.
          </p>
        </div>
        {currentUserRole !== "student" && (
          <Button 
            onClick={() => setShowNewPost(!showNewPost)}
            className="shrink-0"
          >
            {showNewPost ? "Cancel" : "New Post"}
          </Button>
        )}
      </div>

      {/* New Post Form */}
      {showNewPost && (
        <form
          onSubmit={handlePost}
          className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Title</label>
            <Input
              required
              maxLength={100}
              placeholder="Announcement title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Message</label>
            <textarea
              required
              maxLength={1000}
              rows={4}
              placeholder="Write announcement details..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-colors"
            />
            <p className="text-xs text-slate-400 text-right">
              {body.length}/1000
            </p>
          </div>

          {currentUserRole === "moderator" && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700">Target Audience (Optional)</p>
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Branch</label>
                  <select
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none"
                    value={targetBranch}
                    onChange={(e) => setTargetBranch(e.target.value)}
                  >
                    <option value="">All Branches</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Batch (Grad Year)</label>
                  <Input
                    type="number"
                    placeholder="e.g. 2026"
                    value={targetBatch}
                    onChange={(e) => setTargetBatch(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">City</label>
                  <Input
                    type="text"
                    placeholder="e.g. Bangalore"
                    value={targetCity}
                    onChange={(e) => setTargetCity(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Attachment / Link URL</label>
              <Input
                type="url"
                placeholder="https://..."
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Expiry Date (Optional)</label>
              <Input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>
          </div>
          
          {currentUserRole === "moderator" && (
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
              />
              <span>Pin this announcement to top</span>
            </label>
          )}

          <div className="pt-2">
            <Button 
              type="submit" 
              disabled={posting || !title || !body}
            >
              {posting ? "Publishing..." : "Publish Announcement"}
            </Button>
          </div>
        </form>
      )}

      {/* Feed */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center shadow-sm">
            <p className="text-sm font-medium text-slate-500">No active announcements found.</p>
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
            const targetString = targets.length > 0 ? targets.join(", ") : null;

            return (
              <div
                key={post.id}
                className={`bg-white border rounded-xl p-6 shadow-sm transition-all ${
                  post.is_pinned ? "border-amber-300 bg-amber-50/20" : "border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {post.is_pinned && (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 rounded font-semibold text-[11px]">
                          <Pin className="w-3 h-3 text-amber-700" /> Pinned Notice
                        </span>
                      )}
                      {post.profiles.roles?.includes("moderator") ? (
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-900 border border-blue-200 px-2.5 py-0.5 rounded-full font-semibold text-[11px]">
                          <School className="w-3.5 h-3.5 text-blue-600" /> Official: Placement Cell ({post.profiles.full_name})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-medium text-[11px]">
                          <User className="w-3.5 h-3.5 text-slate-500" /> Alumni: {post.profiles.full_name} ({post.profiles.role_title || "Graduate"} {post.profiles.company ? `@ ${post.profiles.company}` : ""})
                        </span>
                      )}
                      {targetString && (
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px]">
                          <Crosshair className="w-3 h-3 text-slate-400" /> Target: {targetString}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 font-heading">{post.title}</h3>
                    <p className="text-xs font-normal text-slate-400">
                      Posted on {new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    {currentUserRole === "student" && !isAuthor && (
                      <button
                        onClick={() => handleFlag(post.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        title="Flag Post"
                      >
                        <Flag className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="py-4 text-sm font-normal text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {post.body}
                </div>

                {post.attachment_url && (
                  <div className="pt-2">
                    <a
                      href={post.attachment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Link2 className="w-3.5 h-3.5" /> View Attachment / Document
                    </a>
                  </div>
                )}

                <div className="border-t border-slate-100 mt-4 pt-3 flex items-center justify-between">
                  <button
                    onClick={() => toggleLike(post.id, !!post.user_liked)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      post.user_liked
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${post.user_liked ? "fill-blue-600 text-blue-600" : ""}`} />
                    <span>{post.user_liked ? "Liked" : "Like"}</span>
                    {likesCount > 0 && <span className="ml-1 text-slate-400 text-[11px]">({likesCount})</span>}
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
