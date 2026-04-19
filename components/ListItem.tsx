"use client";

import { useState, useRef, useCallback } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import { GripVertical, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Item } from "@/lib/supabase";

type Props = {
  item: Item;
  onToggle: (id: string, checked: boolean) => void;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
};

export function ListItem({ item, onToggle, onEdit, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);
  const [swipedLeft, setSwipedLeft] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef(0);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const commitEdit = useCallback(() => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== item.text) onEdit(item.id, trimmed);
    else setEditText(item.text);
    setEditing(false);
  }, [editText, item.id, item.text, onEdit]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    longPressTimer.current = setTimeout(() => setEditing(true), 600);
  }

  function handleTouchMove(e: React.TouchEvent) {
    const dx = touchStartX.current - e.touches[0].clientX;
    if (dx > 60) setSwipedLeft(true);
    if (dx < 10) { clearTimeout(longPressTimer.current!); }
  }

  function handleTouchEnd() {
    clearTimeout(longPressTimer.current!);
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.18 }}
      className={cn("relative flex items-center gap-2 rounded-lg border bg-card px-3 py-2 min-h-[44px] overflow-hidden", isDragging && "opacity-50 shadow-lg")}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <button {...attributes} {...listeners} className="touch-none text-muted-foreground cursor-grab active:cursor-grabbing p-1 min-w-[32px] flex items-center justify-center">
        <GripVertical size={16} />
      </button>

      <button onClick={() => onToggle(item.id, !item.checked)} className="flex items-center justify-center w-5 h-5 min-w-[20px] rounded border-2 border-primary transition-colors" style={{ background: item.checked ? "hsl(var(--primary))" : "transparent" }}>
        {item.checked && <Check size={12} strokeWidth={3} className="text-primary-foreground" />}
      </button>

      {editing ? (
        <input
          autoFocus
          className="flex-1 bg-transparent outline-none text-sm"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") { setEditText(item.text); setEditing(false); } }}
        />
      ) : (
        <span
          onDoubleClick={() => setEditing(true)}
          className={cn("flex-1 text-sm select-none", item.checked && "line-through text-muted-foreground")}
        >
          {item.text}
        </span>
      )}

      <AnimatePresence>
        {(swipedLeft) && (
          <motion.button
            initial={{ x: 40 }} animate={{ x: 0 }} exit={{ x: 40 }}
            onClick={() => { onDelete(item.id); setSwipedLeft(false); }}
            className="absolute right-0 top-0 bottom-0 bg-destructive text-destructive-foreground px-4 flex items-center"
          >
            <X size={16} />
          </motion.button>
        )}
      </AnimatePresence>

      <button
        onClick={() => onDelete(item.id)}
        className="hidden sm:flex items-center justify-center w-7 h-7 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Delete item"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}
