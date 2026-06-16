/* ──────────────────────────────────────────────
 *  Layout CRUD service — proxies to the XFoodi-BE API,
 *  which persists layouts in the same Postgres DB as the rest of the platform.
 * ────────────────────────────────────────────── */

import type { RestaurantLayout } from "@/lib/types/layout";

const API_URL = process.env.XFOODI_API_URL || "http://localhost:5000/api";

interface BackendLayout extends Omit<RestaurantLayout, "_id"> {
  id: string;
}

function normalize(layout: BackendLayout): RestaurantLayout {
  const { id, ...rest } = layout;
  return { _id: id, ...rest } as RestaurantLayout;
}

export async function getLayoutsByTenant(tenantId: string): Promise<RestaurantLayout[]> {
  const res = await fetch(`${API_URL}/layouts?tenantId=${encodeURIComponent(tenantId)}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch layouts (${res.status})`);
  const layouts = await res.json();
  return Array.isArray(layouts) ? layouts.map(normalize) : [];
}

export async function getLayoutById(id: string): Promise<RestaurantLayout | null> {
  const res = await fetch(`${API_URL}/layouts/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch layout (${res.status})`);
  return normalize(await res.json());
}

export async function createLayout(layout: Omit<RestaurantLayout, "_id">): Promise<string> {
  const res = await fetch(`${API_URL}/layouts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(layout),
  });
  if (!res.ok) throw new Error(`Failed to create layout (${res.status})`);
  const data = await res.json();
  return data.id;
}

export async function updateLayout(id: string, updates: Partial<RestaurantLayout>): Promise<boolean> {
  const res = await fetch(`${API_URL}/layouts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (res.status === 404) return false;
  if (!res.ok) throw new Error(`Failed to update layout (${res.status})`);
  return true;
}

export async function publishLayout(id: string): Promise<boolean> {
  const res = await fetch(`${API_URL}/layouts/${id}/publish`, { method: "POST" });
  if (res.status === 404) return false;
  if (!res.ok) throw new Error(`Failed to publish layout (${res.status})`);
  return true;
}

export async function deleteLayout(id: string): Promise<boolean> {
  const res = await fetch(`${API_URL}/layouts/${id}`, { method: "DELETE" });
  if (res.status === 404) return false;
  if (!res.ok) throw new Error(`Failed to delete layout (${res.status})`);
  return true;
}
