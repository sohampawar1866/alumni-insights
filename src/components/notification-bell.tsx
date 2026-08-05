"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";

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
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        ref.current && !ref.current.contains(e.target as Node) &&
        (!dropdownRef.current || !dropdownRef.current.contains(e.target as Node))
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = useCallback(async () => {
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (data) setNotifications(data);
  }, [supabase]);

  useEffect(() => {
    fetchNotifications();

    const channel = supabase
      .channel("notif_realtime_" + Math.random().toString(36).slice(2, 8))
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload: any) => {
          setNotifications((prev) => [payload.new as Notification, ...prev]);
        }
      )
      .subscribe();

    const pollInterval = setInterval(fetchNotifications, 30000);

    return () => {
      clearInterval(pollInterval);
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchNotifications]);

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
        className="relative p-2.5 rounded-xl border-2 border-slate-900 bg-white text-slate-900 shadow-[2px_2px_0px_#0f172a] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#0f172a] transition-all focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4 text-slate-900" strokeWidth={2.5} />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full border-2 border-slate-900 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-[1px_1px_0px_#0f172a]">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && typeof document !== "undefined" && createPortal(
        <div 
          ref={dropdownRef}
          className="fixed z-[9999] max-h-96 w-[calc(100vw-2rem)] max-w-sm sm:w-80 bg-white border-2 border-slate-900 rounded-2xl shadow-[8px_8px_0px_#0f172a] flex flex-col overflow-hidden font-sans"
          style={(() => {
            if (!ref.current) return { top: 0, left: 16 };
            const rect = ref.current.getBoundingClientRect();
            const isLeftHalf = rect.left < window.innerWidth / 2;
            return {
              top: rect.bottom + 8,
              ...(isLeftHalf
                ? { left: Math.max(8, rect.left) }
                : { right: Math.max(8, window.innerWidth - rect.right) }),
            };
          })()}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b-2 border-slate-900 bg-amber-400 shrink-0">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-heading">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] font-bold text-slate-900 hover:underline flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs font-semibold text-slate-500">
              No new notifications.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 bg-white overflow-y-auto flex-1">
              {notifications.map((n) => {
                const inner = (
                  <div
                    className={`px-4 py-3 flex gap-3 transition-colors hover:bg-slate-50 cursor-pointer ${
                      !n.is_read ? "bg-amber-50/60" : ""
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {n.title}
                      </p>
                      {n.body && (
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                          {n.body}
                        </p>
                      )}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 shrink-0 whitespace-nowrap">
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
        </div>,
        document.body
      )}
    </div>
  );
}
