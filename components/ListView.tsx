"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { AnimatePresence, motion } from "framer-motion";
import { ListItem } from "@/components/ListItem";
import { Input } from "@/components/ui/input";
import { CheckSquare } from "lucide-react";
import type { Item } from "@/lib/supabase";

type Props = {
  items: Item[];
  onAdd: (text: string) => void;
  onToggle: (id: string, checked: boolean) => void;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onReorder: (orderedIds: string[]) => void;
};

export function ListView({ items, onAdd, onToggle, onEdit, onDelete, onReorder }: Props) {
  const [newText, setNewText] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = items.findIndex((i) => i.id === active.id);
    const newIdx = items.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(items, oldIdx, newIdx);
    onReorder(reordered.map((i) => i.id));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && newText.trim()) {
      onAdd(newText.trim());
      setNewText("");
    }
  }

  const unchecked = items.filter((i) => !i.checked);
  const checked = items.filter((i) => i.checked);

  return (
    <div className="flex flex-col gap-3">
      <Input
        value={newText}
        onChange={(e) => setNewText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add an item and press Enter…"
        className="h-11 text-base"
      />

      {items.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3 py-16 text-muted-foreground"
        >
          <CheckSquare size={48} strokeWidth={1.5} />
          <p className="text-sm text-center">Your list is empty. Add your first item above.</p>
        </motion.div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={unchecked.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2 group">
            <AnimatePresence initial={false}>
              {unchecked.map((item) => (
                <ListItem key={item.id} item={item} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
              ))}
            </AnimatePresence>
          </div>
        </SortableContext>
      </DndContext>

      {checked.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Checked ({checked.length})</p>
          <div className="flex flex-col gap-2 group">
            <AnimatePresence initial={false}>
              {checked.map((item) => (
                <ListItem key={item.id} item={item} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
