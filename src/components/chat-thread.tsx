"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Send, MessageSquare } from "lucide-react";

import type { RealtimePostgresInsertPayload } from "@supabase/supabase-js";

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
        async (payload: RealtimePostgresInsertPayload<{ id: string; content: string; created_at: string; sender_id: string }>) => {
          if (!payload.new) return;
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
    setNewMessage("");

    const { error } = await supabase.from("messages").insert({
      connection_request_id: requestId,
      sender_id: currentUserId,
      content,
    });

    if (error) {
      alert("Failed to send message: " + error.message);
      setNewMessage(content);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center font-sans">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-slate-900 rounded-2xl shadow-[5px_5px_0px_#0f172a] flex h-[600px] flex-col overflow-hidden font-sans">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b-2 border-slate-900 bg-amber-400 p-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-[2px_2px_0px_#0f172a]">
            {otherUserName.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-heading">Chat with {otherUserName}</h2>
            <p className="text-xs font-semibold text-slate-900/80">Active Mentorship Thread</p>
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-6">
        {messages.length === 0 ? (
          <div className="text-center mt-12 border-2 border-slate-900 border-dashed rounded-xl p-8 bg-white shadow-[3px_3px_0px_#0f172a] max-w-md mx-auto space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-400 mx-auto" strokeWidth={2} />
            <p className="text-base font-bold text-slate-900 font-heading">No Messages Yet</p>
            <p className="text-xs font-medium text-slate-600">Send a greeting message to initiate your 1:1 conversation.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUserId;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <span className="text-[11px] font-bold text-slate-500 mb-1 px-1">{msg.profiles.full_name}</span>
                <div
                  className={`max-w-[80%] border-2 border-slate-900 px-4 py-3 text-sm font-semibold shadow-[3px_3px_0px_#0f172a] rounded-2xl ${
                    isMe
                      ? "bg-slate-900 text-white rounded-br-none"
                      : "bg-white text-slate-900 rounded-bl-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
                <span className="text-[10px] font-bold text-slate-400 mt-1 px-1">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Form */}
      <form onSubmit={handleSend} className="p-4 border-t-2 border-slate-900 bg-white flex items-center gap-3">
        <textarea
          required
          rows={1}
          placeholder="Write your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend(e);
            }
          }}
          className="flex-1 min-h-[48px] max-h-[120px] resize-none border-2 border-slate-900 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-[2px_2px_0px_#0f172a] focus:shadow-[4px_4px_0px_#0f172a] focus:outline-none rounded-xl"
        />
        <Button 
          type="submit" 
          disabled={!newMessage.trim()} 
          className="h-[48px] px-6 gap-2 shrink-0"
        >
          <Send className="w-4 h-4" /> Send
        </Button>
      </form>
    </div>
  );
}
