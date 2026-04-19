"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { generateRoomCode } from "@/lib/roomCode";
import { toast } from "sonner";

export function CreateListButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleCreate() {
    setLoading(true);
    let attempts = 0;
    while (attempts < 5) {
      const room_code = generateRoomCode();
      const { error } = await supabase.from("lists").insert({ room_code, name: "Untitled List" });
      if (!error) {
        router.push(`/list/${room_code}`);
        return;
      }
      attempts++;
    }
    toast.error("Failed to create list. Please try again.");
    setLoading(false);
  }

  return (
    <Button onClick={handleCreate} disabled={loading} size="lg" className="h-12 w-full text-base gap-2">
      <Plus size={20} />
      {loading ? "Creating…" : "New List"}
    </Button>
  );
}
