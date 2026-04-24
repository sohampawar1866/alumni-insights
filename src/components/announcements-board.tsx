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

  const fetchAnnouncements = async () => {
    setLoading(true);
    // Fetch announcements that are not expired
    const now = new Date().toISOString();
    
    // In a real app we'd also want to fetch the likes and whether the current user liked it
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
      <div className="flex items-center justify-center py-20 font-sans">
        <div className="h-12 w-12 animate-spin border-4 border-foreground border-t-primary shadow-[4px_4px_0px_var(--color-foreground)]" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8 font-sans">
      <div className="flex items-end justify-between border-b-scratch border-foreground border-b-8 pb-4">
        <div className="border-l-8 border-primary pl-4">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground mb-2">Announcements</h1>
          <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Updates and notices from IIIT Nagpur and its alumni.
          </p>
        </div>
        {currentUserRole !== "student" && (
          <Button 
            onClick={() => setShowNewPost(!showNewPost)}
            className="h-12 px-6 bg-secondary text-foreground border-4 border-foreground shadow-[4px_4px_0px_var(--color-foreground)] font-black uppercase tracking-wider hover:-translate-y-1 hover:translate-x-1 hover:shadow-[6px_6px_0px_var(--color-foreground)] transition-all rounded-none"
          >
            {showNewPost ? "CANCEL" : "NEW POST"}
          </Button>
        )}
      </div>

      {showNewPost && (
        <form
          onSubmit={handlePost}
          className="bg-white border-4 border-foreground p-8 shadow-[8px_8px_0px_var(--color-foreground)] space-y-6"
        >
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-foreground">Title</label>
            <Input
              required
              maxLength={100}
              placeholder="POST TITLE"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-4 border-foreground shadow-[4px_4px_0px_var(--color-foreground)] rounded-none focus-visible:ring-0 focus-visible:border-primary text-base font-bold h-12 uppercase"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-foreground">Message</label>
            <textarea
              required
              maxLength={1000}
              rows={4}
              placeholder="What do you want to share?"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="flex w-full border-4 border-foreground p-4 text-base font-bold shadow-[4px_4px_0px_var(--color-foreground)] focus-visible:outline-none focus:bg-secondary transition-colors resize-y min-h-[120px]"
            />
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-right border-t-4 border-foreground pt-2 mt-2 -rotate-1 w-max ml-auto">
              {body.length}/1000
            </p>
          </div>

          {currentUserRole === "moderator" && (
            <div className="bg-muted border-4 border-foreground p-6 shadow-[4px_4px_0px_var(--color-foreground)] space-y-4">
              <p className="text-sm font-black tracking-widest uppercase text-foreground border-b-4 border-foreground pb-2">Target Audience (Optional)</p>
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-foreground">Branch</label>
                  <select
                    className="flex h-12 w-full border-4 border-foreground bg-white px-3 py-2 text-base font-bold shadow-[4px_4px_0px_var(--color-foreground)] focus-visible:outline-none focus:bg-secondary transition-colors uppercase cursor-pointer appearance-none"
                    value={targetBranch}
                    onChange={(e) => setTargetBranch(e.target.value)}
                  >
                    <option value="">ALL BRANCHES</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-foreground">Batch (Grad Year)</label>
                  <Input
                    type="number"
                    placeholder="e.g. 2020"
                    value={targetBatch}
                    onChange={(e) => setTargetBatch(e.target.value)}
                    className="border-4 border-foreground shadow-[4px_4px_0px_var(--color-foreground)] rounded-none focus-visible:ring-0 focus-visible:border-primary text-base font-bold h-12 uppercase"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-foreground">City</label>
                  <Input
                    type="text"
                    placeholder="e.g. Bangalore"
                    value={targetCity}
                    onChange={(e) => setTargetCity(e.target.value)}
                    className="border-4 border-foreground shadow-[4px_4px_0px_var(--color-foreground)] rounded-none focus-visible:ring-0 focus-visible:border-primary text-base font-bold h-12 uppercase"
                  />
                </div>
              </div>
              <p className="text-xs font-black tracking-wider uppercase text-muted-foreground pt-2">Leave fields empty to broadcast to everyone.</p>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-6 pt-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-foreground">Attachment / Link URL</label>
              <Input
                type="url"
                placeholder="https://..."
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
                className="border-4 border-foreground shadow-[4px_4px_0px_var(--color-foreground)] rounded-none focus-visible:ring-0 focus-visible:border-primary text-base font-bold h-12"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-foreground">Expiry Date (Optional)</label>
              <Input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="border-4 border-foreground shadow-[4px_4px_0px_var(--color-foreground)] rounded-none focus-visible:ring-0 focus-visible:border-primary text-base font-bold h-12"
              />
            </div>
          </div>
          
          {currentUserRole === "moderator" && (
            <label className="flex items-center gap-3 cursor-pointer pt-4 w-max border-4 border-foreground bg-muted p-4 shadow-[4px_4px_0px_var(--color-foreground)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_var(--color-foreground)] transition-all">
              <input
                type="checkbox"
                className="h-6 w-6 appearance-none border-4 border-foreground bg-white checked:bg-primary checked:border-foreground relative checked:after:content-[''] checked:after:absolute checked:after:inset-0 checked:after:m-auto checked:after:block checked:after:w-2 checked:after:h-2 checked:after:bg-foreground"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
              />
              <span className="text-sm text-foreground font-black uppercase tracking-widest pt-1">PIN TO TOP</span>
            </label>
          )}

          <div className="pt-4">
            <Button 
              type="submit" 
              disabled={posting || !title || !body}
              className="h-14 px-10 bg-primary text-background border-4 border-foreground shadow-[8px_8px_0px_var(--color-foreground)] text-lg font-black uppercase tracking-widest hover:-translate-y-1 hover:translate-x-1 hover:shadow-[12px_12px_0px_var(--color-foreground)] transition-all rounded-none w-full sm:w-auto"
            >
              {posting ? "POSTING..." : "PUBLISH POST"}
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {announcements.length === 0 ? (
          <div className="bg-white border-4 border-foreground p-10 text-center shadow-[8px_8px_0px_var(--color-foreground)]">
            <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">NO ANNOUNCEMENTS YET.</p>
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
                className={`bg-white border-4 border-foreground p-6 shadow-[8px_8px_0px_var(--color-foreground)] transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0px_var(--color-foreground)] ${
                  post.is_pinned ? "border-l-8 border-l-secondary" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4 border-b-4 border-foreground pb-4 mb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      {post.is_pinned && (
                        <span className="inline-flex items-center border-2 border-foreground bg-secondary px-3 py-1 text-xs font-black uppercase tracking-widest text-foreground shadow-[2px_2px_0px_var(--color-foreground)]">
                          📌 PINNED
                        </span>
                      )}
                      {post.profiles.roles?.includes("moderator") ? (
                        <span className="inline-flex items-center border-2 border-foreground bg-primary/20 px-3 py-1 text-xs font-black uppercase tracking-widest text-foreground shadow-[2px_2px_0px_var(--color-foreground)]">
                          🏫 OFFICIAL — {post.profiles.full_name} · PLACEMENT CELL
                        </span>
                      ) : (
                        <span className="inline-flex items-center border-2 border-foreground bg-muted px-3 py-1 text-xs font-black uppercase tracking-widest text-foreground shadow-[2px_2px_0px_var(--color-foreground)]">
                          👤 ALUMNI — {post.profiles.full_name}, {post.profiles.role_title} AT {post.profiles.company}
                        </span>
                      )}
                      
                      {currentUserRole === "moderator" && (
                        <span className="inline-flex items-center border-2 border-foreground bg-destructive/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-foreground shadow-[2px_2px_0px_var(--color-foreground)]">
                          🎯 TARGET: {targetString}
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tight text-foreground">{post.title}</h3>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-1">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {canDelete && (
                      <button
                         onClick={() => handleDelete(post.id)}
                        className="text-xs font-black uppercase tracking-widest text-background bg-destructive border-2 border-foreground px-3 py-1.5 shadow-[2px_2px_0px_var(--color-foreground)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_var(--color-foreground)] transition-all"
                      >
                        DELETE
                      </button>
                    )}
                    {currentUserRole === "student" && !isAuthor && (
                      <button
                        onClick={() => handleFlag(post.id)}
                        className="text-xs font-black uppercase tracking-widest text-foreground bg-muted border-2 border-foreground px-3 py-1.5 shadow-[2px_2px_0px_var(--color-foreground)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_var(--color-foreground)] transition-all"
                      >
                        FLAG
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-base font-bold text-foreground whitespace-pre-wrap">
                  {post.body}
                </div>

                {post.attachment_url && (
                  <div className="mt-4">
                    <a
                      href={post.attachment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-black uppercase tracking-widest text-background bg-foreground px-4 py-2 border-2 border-foreground shadow-[4px_4px_0px_var(--color-primary)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_var(--color-primary)] transition-all rounded-none"
                    >
                      🔗 VIEW ATTACHMENT / LINK
                    </a>
                  </div>
                )}

                <div className="border-t-4 border-foreground border-dashed mt-6 pt-4 flex items-center justify-between">
                  <button
                    onClick={() => toggleLike(post.id, !!post.user_liked)}
                    className={`inline-flex items-center gap-2 border-4 border-foreground px-4 py-2 text-sm font-black uppercase tracking-widest transition-all shadow-[4px_4px_0px_var(--color-foreground)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_var(--color-foreground)] ${
                      post.user_liked
                        ? "bg-primary text-background border-primary shadow-[4px_4px_0px_var(--color-foreground)]"
                        : "bg-white text-foreground hover:bg-muted"
                    }`}
                  >
                    <span>{post.user_liked ? "👍 LIKED" : "👍 LIKE"}</span>
                    {likesCount > 0 && <span className="ml-2 px-2 py-0.5 bg-foreground text-background text-xs">{likesCount}</span>}
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
