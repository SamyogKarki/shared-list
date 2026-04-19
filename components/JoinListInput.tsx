"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export function JoinListInput() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleJoin() {
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length !== 6) { toast.error("Room code must be 6 characters"); return; }
    setLoading(true);
    const { data, error } = await supabase.from("lists").select("room_code").eq("room_code", trimmed).single();
    setLoading(false);
    if (error || !data) { toast.error("List not found. Check the code and try again."); return; }
    router.push(`/list/${trimmed}`);
  }

  return (
    <div className="flex gap-2">
      <Input
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
        onKeyDown={(e) => e.key === "Enter" && handleJoin()}
        placeholder="Enter room code…"
        className="h-11 text-base font-mono tracking-widest uppercase"
        maxLength={6}
      />
      <Button onClick={handleJoin} disabled={loading || code.length !== 6} className="h-11 px-5">
        {loading ? "…" : "Join"}
      </Button>
    </div>
  );
}
