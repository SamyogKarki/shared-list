"use client";

import { useEffect, useState } from "react";

export type RecentList = {
  room_code: string;
  name: string;
  visited_at: string;
};

const STORAGE_KEY = "shared-list:recent";
const MAX_RECENT = 10;

function load(): RecentList[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function useRecentLists() {
  const [recent, setRecent] = useState<RecentList[]>([]);

  useEffect(() => {
    setRecent(load());
  }, []);

  function addRecent(room_code: string, name: string) {
    const entry: RecentList = { room_code, name, visited_at: new Date().toISOString() };
    const filtered = load().filter((r) => r.room_code !== room_code);
    const updated = [entry, ...filtered].slice(0, MAX_RECENT);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setRecent(updated);
  }

  function updateName(room_code: string, name: string) {
    const updated = load().map((r) => (r.room_code === room_code ? { ...r, name } : r));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setRecent(updated);
  }

  return { recent, addRecent, updateName };
}
