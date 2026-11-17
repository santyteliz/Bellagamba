"use client";
import { useEffect } from "react";
import { pushRecent } from "@/lib/store";
import { track } from "@/lib/analytics";

export function ViewTracker({ id, titulo, precio }: { id: number; titulo: string; precio: number | null }) {
  useEffect(() => {
    pushRecent(id);
    track("view_item", { item_id: id, item_name: titulo, value: precio ?? undefined, currency: "USD" });
  }, [id, titulo, precio]);
  return null;
}
