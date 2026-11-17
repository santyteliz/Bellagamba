"use client";
/**
 * Estado del visitante persistido en localStorage: favoritos, comparador, vistas recientes,
 * búsquedas guardadas/alertas y consentimiento de cookies.
 * Implementado con useSyncExternalStore (sin dependencias) y sincronizado entre pestañas.
 */
import { useSyncExternalStore } from "react";

type Listener = () => void;

function createStore<T>(key: string, initial: T) {
  let state: T = initial;
  let hydrated = false;
  const listeners = new Set<Listener>();

  const read = () => {
    if (hydrated || typeof window === "undefined") return;
    hydrated = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) state = JSON.parse(raw) as T;
    } catch {
      /* storage bloqueado: seguimos en memoria */
    }
  };

  const emit = () => listeners.forEach((l) => l());

  const store = {
    get: () => {
      read();
      return state;
    },
    set: (next: T | ((prev: T) => T)) => {
      read();
      state = typeof next === "function" ? (next as (p: T) => T)(state) : next;
      try {
        window.localStorage.setItem(key, JSON.stringify(state));
      } catch {
        /* noop */
      }
      emit();
    },
    subscribe: (l: Listener) => {
      listeners.add(l);
      const onStorage = (e: StorageEvent) => {
        if (e.key === key) {
          hydrated = false;
          read();
          emit();
        }
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(l);
        window.removeEventListener("storage", onStorage);
      };
    },
    use: function useStore(): T {
      return useSyncExternalStore(store.subscribe, store.get, () => initial);
    },
  };
  return store;
}

/* ---------- Favoritos ---------- */
export const favoritesStore = createStore<number[]>("bg:favoritos", []);
export function toggleFavorite(id: number) {
  let added = false;
  favoritesStore.set((prev) => {
    added = !prev.includes(id);
    return added ? [id, ...prev] : prev.filter((x) => x !== id);
  });
  return added;
}

/* ---------- Comparador (máx 3) ---------- */
export const COMPARE_MAX = 3;
export const compareStore = createStore<number[]>("bg:comparar", []);
export function toggleCompare(id: number): "added" | "removed" | "full" {
  const prev = compareStore.get();
  if (prev.includes(id)) {
    compareStore.set(prev.filter((x) => x !== id));
    return "removed";
  }
  if (prev.length >= COMPARE_MAX) return "full";
  compareStore.set([...prev, id]);
  return "added";
}

/* ---------- Vistas recientes ---------- */
export const recentStore = createStore<number[]>("bg:recientes", []);
export function pushRecent(id: number) {
  recentStore.set((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 8));
}

/* ---------- Búsquedas guardadas / alertas ---------- */
export interface SavedSearch {
  id: string;
  label: string;
  query: string; // querystring del listado
  path: string;
  alerta: boolean;
  email?: string;
  createdAt: string;
}
export const searchesStore = createStore<SavedSearch[]>("bg:busquedas", []);

/* ---------- Consentimiento de cookies ---------- */
export type Consent = { status: "all" | "necessary"; date: string } | null;
export const consentStore = createStore<Consent>("bg:consent", null);

/* ---------- Toasts efímeros (no persistidos) ---------- */
type Toast = { id: number; text: string; action?: { label: string; href: string } };
let toasts: Toast[] = [];
const EMPTY_TOASTS: Toast[] = [];
const getEmptyToasts = () => EMPTY_TOASTS;
const toastListeners = new Set<Listener>();
export const toastStore = {
  subscribe: (l: Listener) => {
    toastListeners.add(l);
    return () => toastListeners.delete(l);
  },
  get: () => toasts,
};
export function toast(text: string, action?: Toast["action"]) {
  const t = { id: Date.now() + Math.random(), text, action };
  toasts = [...toasts.slice(-2), t];
  toastListeners.forEach((l) => l());
  setTimeout(() => {
    toasts = toasts.filter((x) => x.id !== t.id);
    toastListeners.forEach((l) => l());
  }, 3800);
}
export function useToasts() {
  return useSyncExternalStore(toastStore.subscribe, toastStore.get, getEmptyToasts);
}
