"use client";

import { useEffect, useRef, useState } from "react";
import { supabase, type Item, type List } from "@/lib/supabase";
import { toast } from "sonner";

export function useList(roomCode: string) {
  const [list, setList] = useState<List | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchList() {
      setLoading(true);
      const { data, error } = await supabase
        .from("lists")
        .select("*")
        .eq("room_code", roomCode)
        .single();
      if (cancelled) return;
      if (error || !data) { setLoading(false); return; }
      setList(data);
      await fetchItems(data.id);
      setLoading(false);
    }

    async function fetchItems(listId: string) {
      const { data } = await supabase
        .from("items")
        .select("*")
        .eq("list_id", listId)
        .order("position");
      if (!cancelled && data) setItems(data);
    }

    fetchList();

    return () => { cancelled = true; };
  }, [roomCode]);

  useEffect(() => {
    if (!list) return;

    const channel = supabase
      .channel(`list:${list.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "items", filter: `list_id=eq.${list.id}` },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setItems((prev) => {
              if (prev.find((i) => i.id === (payload.new as Item).id)) return prev;
              return [...prev, payload.new as Item].sort((a, b) => a.position - b.position);
            });
          } else if (payload.eventType === "UPDATE") {
            setItems((prev) =>
              prev.map((i) => i.id === (payload.new as Item).id ? payload.new as Item : i)
                .sort((a, b) => a.position - b.position)
            );
          } else if (payload.eventType === "DELETE") {
            setItems((prev) => prev.filter((i) => i.id !== (payload.old as Item).id));
          }
        }
      )
      .subscribe();

    channelRef.current = channel;
    return () => { supabase.removeChannel(channel); };
  }, [list]);

  async function addItem(text: string) {
    if (!list) return;
    const position = items.length > 0 ? Math.max(...items.map((i) => i.position)) + 1 : 0;
    const { error } = await supabase.from("items").insert({ list_id: list.id, text, position });
    if (error) toast.error("Failed to add item");
  }

  async function toggleItem(id: string, checked: boolean) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, checked } : i)));
    const { error } = await supabase.from("items").update({ checked }).eq("id", id);
    if (error) {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, checked: !checked } : i)));
      toast.error("Failed to update item");
    }
  }

  async function editItem(id: string, text: string) {
    const { error } = await supabase.from("items").update({ text }).eq("id", id);
    if (error) toast.error("Failed to edit item");
  }

  async function deleteItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
    const { error } = await supabase.from("items").delete().eq("id", id);
    if (error) toast.error("Failed to delete item");
  }

  async function reorderItems(orderedIds: string[]) {
    const updated = orderedIds.map((id, idx) => ({ ...items.find((i) => i.id === id)!, position: idx }));
    setItems(updated);
    const updates = updated.map(({ id, position }) =>
      supabase.from("items").update({ position }).eq("id", id)
    );
    const results = await Promise.all(updates);
    if (results.some((r) => r.error)) toast.error("Failed to reorder items");
  }

  async function renameList(name: string) {
    if (!list) return;
    setList((prev) => prev ? { ...prev, name } : prev);
    const { error } = await supabase.from("lists").update({ name, updated_at: new Date().toISOString() }).eq("id", list.id);
    if (error) toast.error("Failed to rename list");
  }

  return { list, items, loading, addItem, toggleItem, editItem, deleteItem, reorderItems, renameList };
}
