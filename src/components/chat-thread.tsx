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
        async (payload: any) => {
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
      <div className="flex h-[400px] items-center justify-center font-sans">
        <div className="h-12 w-12 animate-spin border-4 border-foreground border-t-primary shadow-[4px_4px_0px_var(--color-foreground)]" />
      </div>
    );
  }

  return (
    <div className="bg-white border-4 border-foreground shadow-[8px_8px_0px_var(--color-foreground)] flex h-[600px] flex-col overflow-hidden font-sans">
      <div className="flex items-center justify-between border-b-4 border-foreground bg-secondary p-6">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight text-foreground">Chat with {otherUserName}</h2>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-1">Messages are auto-archived after 30 days of inactivity.</p>
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto bg-muted/30 p-6">
        {messages.length === 0 ? (
          <div className="text-center mt-10 border-4 border-foreground border-dashed p-8 bg-white shadow-[4px_4px_0px_var(--color-foreground)]">
            <p className="text-lg font-black uppercase tracking-tight text-foreground">No messages yet.</p>
            <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mt-2">Send a message to start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUserId;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 px-1">{msg.profiles.full_name}</span>
                <div
                  className={`max-w-[80%] border-4 border-foreground px-4 py-3 text-base font-bold shadow-[4px_4px_0px_var(--color-foreground)] transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_var(--color-foreground)] ${
                    isMe
                      ? "bg-primary text-background rounded-none"
                      : "bg-white text-foreground rounded-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-2 px-1">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t-4 border-foreground bg-white flex flex-col sm:flex-row gap-4">
        <textarea
          required
          rows={1}
          placeholder="TYPE A MESSAGE..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend(e);
            }
          }}
          className="flex-1 min-h-[56px] max-h-[120px] resize-none border-4 border-foreground bg-white p-4 text-base font-bold shadow-[4px_4px_0px_var(--color-foreground)] focus-visible:outline-none focus:bg-secondary transition-colors rounded-none"
        />
        <Button 
          type="submit" 
          disabled={!newMessage.trim()} 
          className="self-end sm:self-auto w-full sm:w-auto px-8 h-[56px] bg-foreground text-background border-4 border-transparent shadow-[4px_4px_0px_var(--color-primary)] text-lg font-black uppercase tracking-widest hover:-translate-y-1 hover:translate-x-1 hover:shadow-[6px_6px_0px_var(--color-primary)] transition-all rounded-none"
        >
          SEND
        </Button>
      </form>
    </div>
  );
}
