"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

type Notification = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  is_read: boolean;
  created_at: string;
};

export function NotificationBell() {
  const supabase = createClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.is_read).length;



  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (data) setNotifications(data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications();

    // Real-time subscription
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const markAllRead = async () => {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (unreadIds.length === 0) return;

    await supabase
      .from("notifications")
      .update({ is_read: true })
      .in("id", unreadIds);

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const formatTime = (dateStr: string) => {
    // eslint-disable-next-line react-hooks/purity
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "now";
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    const days = Math.floor(hrs / 24);
    return `${days}d`;
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 border-2 border-foreground bg-background shadow-[2px_2px_0px_var(--color-foreground)] transition-transform hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_var(--color-foreground)] focus:outline-none"
        aria-label="Notifications"
      >
        <svg
          className="w-5 h-5 text-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 h-5 w-5 border-2 border-foreground bg-[#ff3366] text-background text-[10px] font-black flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-4 max-h-96 w-80 bg-background border-4 border-foreground shadow-[8px_8px_0px_var(--color-foreground)] overflow-auto">
          <div className="flex items-center justify-between px-4 py-3 border-b-4 border-foreground bg-[#fdc800]">
            <h3 className="text-sm font-black uppercase tracking-wider text-foreground">UPDATES</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs font-bold uppercase text-foreground hover:bg-foreground hover:text-background px-2 py-1 transition-colors border-2 border-transparent hover:border-foreground"
              >
                CLEAR ALERTS
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="p-6 text-center text-sm font-bold uppercase text-muted-foreground bg-background">
              SILENCE. GO BUILD SOMETHING.
            </div>
          ) : (
            <div className="divide-y-2 divide-foreground bg-background">
              {notifications.map((n) => {
                const inner = (
                  <div
                    className={`px-4 py-3 flex gap-3 transition-colors hover:bg-secondary cursor-pointer ${
                      !n.is_read ? "bg-[#ff3366]/10" : ""
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-foreground uppercase tracking-wide truncate">
                        {n.title}
                      </p>
                      {n.body && (
                        <p className="text-xs font-semibold text-muted-foreground mt-1 line-clamp-2">
                          {n.body}
                        </p>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-foreground bg-secondary border-2 border-foreground px-1.5 h-fit shrink-0 py-0.5 whitespace-nowrap">
                      {formatTime(n.created_at)}
                    </span>
                  </div>
                );

                return n.link ? (
                  <Link key={n.id} href={n.link} onClick={() => setOpen(false)}>
                    {inner}
                  </Link>
                ) : (
                  <div key={n.id}>{inner}</div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
