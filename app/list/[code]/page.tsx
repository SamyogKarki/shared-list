"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useList } from "@/hooks/useList";
import { useRecentLists } from "@/hooks/useRecentLists";
import { ListView } from "@/components/ListView";
import { ShareButton } from "@/components/ShareButton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Check } from "lucide-react";
import Link from "next/link";

type Props = { params: Promise<{ code: string }> };

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className}`} />;
}

export default function ListPage({ params }: Props) {
  const { code } = use(params);
  const router = useRouter();
  const { list, items, loading, addItem, toggleItem, editItem, deleteItem, reorderItems, renameList } = useList(code);
  const { addRecent, updateName } = useRecentLists();
  const [editingName, setEditingName] = useState(false);
  const [nameText, setNameText] = useState("");

  useEffect(() => {
    if (list) {
      setNameText(list.name);
      addRecent(list.room_code, list.name);
    }
  }, [list?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!loading && !list) router.replace("/");
  }, [loading, list, router]);

  async function commitName() {
    const trimmed = nameText.trim();
    if (trimmed && list && trimmed !== list.name) {
      await renameList(trimmed);
      updateName(code, trimmed);
    } else {
      setNameText(list?.name ?? "");
    }
    setEditingName(false);
  }

  if (loading) {
    return (
      <main className="flex flex-col max-w-lg mx-auto w-full px-4 pt-6 pb-8 gap-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-7 w-40" />
          <div className="ml-auto">
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
        <Skeleton className="h-11 w-full" />
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
      </main>
    );
  }

  if (!list) return null;

  return (
    <main className="flex flex-col max-w-lg mx-auto w-full px-4 pt-6 pb-8 gap-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild className="h-9 w-9 shrink-0">
          <Link href="/"><ArrowLeft size={18} /></Link>
        </Button>

        {editingName ? (
          <input
            autoFocus
            className="flex-1 text-lg font-semibold bg-transparent border-b-2 border-primary outline-none"
            value={nameText}
            onChange={(e) => setNameText(e.target.value)}
            onBlur={commitName}
            onKeyDown={(e) => { if (e.key === "Enter") commitName(); if (e.key === "Escape") { setNameText(list.name); setEditingName(false); } }}
          />
        ) : (
          <h1
            className="flex-1 text-lg font-semibold truncate cursor-pointer"
            onDoubleClick={() => setEditingName(true)}
          >
            {list.name}
          </h1>
        )}

        {editingName ? (
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={commitName}>
            <Check size={16} />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={() => setEditingName(true)}>
            <Pencil size={14} />
          </Button>
        )}

        <ShareButton roomCode={code} />
      </div>

      <div className="flex items-center gap-2 px-1">
        <span className="text-xs text-muted-foreground">Code:</span>
        <span className="text-xs font-mono font-bold tracking-widest">{code}</span>
      </div>

      <ListView
        items={items}
        onAdd={addItem}
        onToggle={toggleItem}
        onEdit={editItem}
        onDelete={deleteItem}
        onReorder={reorderItems}
      />
    </main>
  );
}
