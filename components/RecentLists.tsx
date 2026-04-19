"use client";

import Link from "next/link";
import { useRecentLists } from "@/hooks/useRecentLists";
import { Clock } from "lucide-react";

export function RecentLists() {
  const { recent } = useRecentLists();
  if (recent.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide flex items-center gap-1.5">
        <Clock size={12} /> Your recent lists
      </p>
      <div className="flex flex-col gap-1">
        {recent.map((r) => (
          <Link
            key={r.room_code}
            href={`/list/${r.room_code}`}
            className="flex items-center justify-between rounded-lg border bg-card px-3 py-2.5 text-sm hover:bg-accent transition-colors min-h-[44px]"
          >
            <span className="font-medium">{r.name}</span>
            <span className="text-xs text-muted-foreground font-mono">{r.room_code}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
