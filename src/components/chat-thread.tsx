"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";

type Message = {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  profiles: {
    full_name: string;
  };
};

type Props = {
  requestId: string;
  currentUserId: string;
  otherUserName: string;
};

export function ChatThread({ requestId, currentUserId, otherUserName }: Props) {
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select(`
          id, content, created_at, sender_id,
          profiles!messages_sender_id_fkey(full_name)
        `)
        .eq("connection_request_id", requestId)
        .order("created_at", { ascending: true });

      if (data) setMessages(data as unknown as Message[]);
      setLoading(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat_${requestId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `connection_request_id=eq.${requestId}` },
        async (payload) => {
          // Fetch the profile for the new message
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", payload.new.sender_id)
            .single();

          const newMsg: Message = {
            id: payload.new.id,
            content: payload.new.content,
            created_at: payload.new.created_at,
            sender_id: payload.new.sender_id,
            profiles: profile || { full_name: "Unknown" },
          };

          setMessages((prev) => [...prev, newMsg]);
          setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [requestId, supabase]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const content = newMessage.trim();
    setNewMessage(""); // optimistic clear

    const { error } = await supabase.from("messages").insert({
      connection_request_id: requestId,
      sender_id: currentUserId,
      content,
    });

    if (error) {
      alert("Failed to send message: " + error.message);
      setNewMessage(content); // restore on error
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-100/80 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="ai-card flex h-[600px] flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-blue-100/70 bg-blue-50/60 p-4">
        <div>
          <h2 className="font-semibold text-slate-900">Chat with {otherUserName}</h2>
          <p className="text-xs text-slate-500">Messages are auto-archived after 30 days of inactivity.</p>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-blue-50/35 p-6">
        {messages.length === 0 ? (
          <div className="text-center text-slate-500 mt-10">
            <p>No messages yet.</p>
            <p className="text-sm">Send a message to start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUserId;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <span className="text-[10px] text-slate-400 mb-1 px-1">{msg.profiles.full_name}</span>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                    isMe
                      ? "bg-blue-600 text-white rounded-tr-sm"
                      : "bg-white border border-blue-100/80 text-slate-800 rounded-tl-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-blue-100/70 bg-white flex gap-2">
        <textarea
          required
          rows={1}
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend(e);
            }
          }}
          className="flex-1 min-h-[44px] max-h-[120px] resize-none rounded-xl border border-blue-100/80 bg-white/95 p-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
        />
        <Button type="submit" disabled={!newMessage.trim()} className="self-end px-6">
          Send
        </Button>
      </form>
    </div>
  );
}
