"use client";

import { Button } from "@/components/ui/button";
import { Share2, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Props = { roomCode: string };

export function ShareButton({ roomCode }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = `${window.location.origin}/list/${roomCode}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Join my list", text: `Room code: ${roomCode}`, url });
        return;
      } catch {
        // user cancelled or not supported — fall through to copy
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button variant="outline" size="sm" onClick={handleShare} className="gap-2 h-9">
      {copied ? <Check size={15} /> : <Share2 size={15} />}
      {copied ? "Copied!" : "Share"}
    </Button>
  );
}
