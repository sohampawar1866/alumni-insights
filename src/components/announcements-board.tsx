"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pin, Link2, ThumbsUp, Trash2, Filter } from "lucide-react";

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
  target_role: string | null;
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
  const [targetRole, setTargetRole] = useState("all");
  const [targetBranch, setTargetBranch] = useState("");
  const [targetBatch, setTargetBatch] = useState("");
  const [targetCity, setTargetCity] = useState("");

  const fetchAnnouncements = useCallback(async () => {
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

      // Role-based targeting filter
      if (currentUserRole !== "moderator") {
        filteredData = filteredData.filter((a) => {
          if (a.target_role && a.target_role !== "all" && a.target_role !== currentUserRole) {
            return false;
          }
          return true;
        });
      }

      if (currentUserRole === "alumni") {
        const { data: userProfile } = await supabase
          .from("profiles")
          .select("branch, graduation_year, city")
          .eq("id", currentUserId)
          .single();

        if (userProfile) {
          filteredData = filteredData.filter((a) => {
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
    let ignore = false;
    async function init() {
      if (!ignore) await fetchAnnouncements();
    }
    init();
    return () => {
      ignore = true;
    };
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
      target_role: targetRole || "all",
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
      setTargetRole("all");
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
      await supabase.from("announcement_likes").insert({
        announcement_id: id,
        user_id: currentUserId,
      });
    }
  };

  const togglePin = async (id: string, currentlyPinned: boolean) => {
    if (currentUserRole !== "moderator") return;
    await supabase.from("announcements").update({ is_pinned: !currentlyPinned }).eq("id", id);
    fetchAnnouncements();
  };

  const deleteAnnouncement = async (id: string) => {
    if (currentUserRole !== "moderator") return;
    if (confirm("Are you sure you want to delete this announcement?")) {
      await supabase.from("announcements").delete().eq("id", id);
      fetchAnnouncements();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Header Actions */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading">
            Official Announcements & Events
          </h2>
          <p className="text-xs text-slate-600">
            Committee updates, college events, reunions, and official notifications.
          </p>
        </div>

        {(currentUserRole === "moderator" || currentUserRole === "alumni") && (
          <Button
            onClick={() => setShowNewPost(!showNewPost)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm"
          >
            {showNewPost ? "Cancel" : "Post Announcement"}
          </Button>
        )}
      </div>

      {/* New Post Form */}
      {showNewPost && (
        <form onSubmit={handlePost} className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-md space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading">
            Create Announcement
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Title</label>
            <Input
              required
              placeholder="e.g. Annual Alumni Meet 2026 Registration Open"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Body Content</label>
            <textarea
              required
              rows={4}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="Share event details, registration links, or official updates..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Attachment / Event Link</label>
              <Input
                type="url"
                placeholder="https://..."
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Expiration Date (Optional)</label>
              <Input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>
          </div>

          {/* Targeting controls for Moderators */}
          {currentUserRole === "moderator" && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase">
                <Filter className="w-3.5 h-3.5 text-blue-600" />
                Target Audience Controls
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-600">Target Role</label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white text-slate-900"
                  >
                    <option value="all">All Members (Students + Alumni)</option>
                    <option value="alumni">Alumni Only</option>
                    <option value="student">Students Only</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-600">Target Branch</label>
                  <Input
                    placeholder="e.g. CSE"
                    value={targetBranch}
                    onChange={(e) => setTargetBranch(e.target.value)}
                    className="text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-600">Target Batch</label>
                  <Input
                    type="number"
                    placeholder="e.g. 2024"
                    value={targetBatch}
                    onChange={(e) => setTargetBatch(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pin"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded text-slate-900 focus:ring-slate-900"
                />
                <label htmlFor="pin" className="text-xs font-semibold text-slate-800">
                  Pin to top of board
                </label>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="submit"
              disabled={posting}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
            >
              {posting ? "Publishing..." : "Publish Announcement"}
            </Button>
          </div>
        </form>
      )}

      {/* Announcements Feed List */}
      <div className="space-y-4">
        {announcements.length > 0 ? (
          announcements.map((item) => (
            <div
              key={item.id}
              className={`p-6 bg-white border-2 rounded-2xl shadow-sm space-y-4 transition-all ${
                item.is_pinned
                  ? "border-amber-400 bg-amber-50/20"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.is_pinned && (
                      <span className="inline-flex items-center gap-1 bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                        <Pin className="w-3 h-3 fill-slate-950" /> Pinned
                      </span>
                    )}
                    {item.target_role && item.target_role !== "all" && (
                      <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase">
                        {item.target_role} Only
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-heading leading-snug">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">
                      {item.profiles?.full_name || "Committee Moderator"}
                    </span>
                    <span>•</span>
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {currentUserRole === "moderator" && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => togglePin(item.id, item.is_pinned)}
                      className={`p-1.5 rounded-lg border text-xs font-semibold ${
                        item.is_pinned
                          ? "bg-amber-100 border-amber-300 text-amber-900"
                          : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteAnnouncement(item.id)}
                      className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {item.body}
              </p>

              {item.attachment_url && (
                <a
                  href={item.attachment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200"
                >
                  <Link2 className="w-3.5 h-3.5" /> Open Attachment / Event Link
                </a>
              )}

              {/* Likes & Reactions Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <button
                  onClick={() => toggleLike(item.id, !!item.user_liked)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold border transition-all ${
                    item.user_liked
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{item.likes[0]?.count || 0} Reactions</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-xs text-slate-500 bg-white border border-slate-200 rounded-2xl">
            No announcements found for this section.
          </div>
        )}
      </div>
    </div>
  );
}
