/* ──────────────────────────────────────────────
 *  Layout CRUD service (MongoDB with Local JSON Fallback)
 * ────────────────────────────────────────────── */

import { connectToDatabase } from "@/lib/db/mongodb";
import type { RestaurantLayout } from "@/lib/types/layout";
import { ObjectId } from "mongodb";
import fs from "fs";
import path from "path";

const COLLECTION = "layouts";
const FALLBACK_FILE_PATH = path.join(process.cwd(), "lib", "db", "fallback-layouts.json");

// Helper to read fallback file
function readFallbackLayouts(): RestaurantLayout[] {
  try {
    if (!fs.existsSync(FALLBACK_FILE_PATH)) {
      return [];
    }
    const data = fs.readFileSync(FALLBACK_FILE_PATH, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Failed to read local fallback layouts:", err);
    return [];
  }
}

// Helper to write fallback file
function writeFallbackLayouts(layouts: RestaurantLayout[]) {
  try {
    const dir = path.dirname(FALLBACK_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(FALLBACK_FILE_PATH, JSON.stringify(layouts, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write local fallback layouts:", err);
  }
}

export async function getLayoutsByTenant(tenantId: string): Promise<RestaurantLayout[]> {
  try {
    const { db } = await connectToDatabase();
    const docs = await db
      .collection(COLLECTION)
      .find({ tenantId })
      .sort({ updatedAt: -1 })
      .toArray();
    const results = docs.map((d) => ({ ...d, _id: d._id.toString() })) as unknown as RestaurantLayout[];

    // Sync to local fallback on success
    if (results.length > 0) {
      const allFallback = readFallbackLayouts();
      const filtered = allFallback.filter((f) => f.tenantId !== tenantId);
      writeFallbackLayouts([...filtered, ...results]);
    }

    return results;
  } catch (dbErr) {
    console.warn("MongoDB connection failed, reading from local fallback JSON:", dbErr);
    const allFallback = readFallbackLayouts();
    return allFallback
      .filter((l) => l.tenantId === tenantId)
      .sort((a, b) => new Date(b.updatedAt || "").getTime() - new Date(a.updatedAt || "").getTime());
  }
}

export async function getLayoutById(id: string): Promise<RestaurantLayout | null> {
  try {
    const { db } = await connectToDatabase();
    const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
    if (!doc) return null;
    return { ...doc, _id: doc._id.toString() } as unknown as RestaurantLayout;
  } catch (dbErr) {
    console.warn("MongoDB lookup failed, reading from local fallback JSON:", dbErr);
    const allFallback = readFallbackLayouts();
    return allFallback.find((l) => l._id === id) || null;
  }
}

export async function getPublishedLayout(tenantHostname: string): Promise<RestaurantLayout | null> {
  try {
    const { db } = await connectToDatabase();
    const doc = await db
      .collection(COLLECTION)
      .findOne({ tenantHostname, status: "published" });
    if (!doc) return null;
    return { ...doc, _id: doc._id.toString() } as unknown as RestaurantLayout;
  } catch (dbErr) {
    console.warn("MongoDB lookup failed, reading from local fallback JSON:", dbErr);
    const allFallback = readFallbackLayouts();
    return allFallback.find((l) => l.tenantHostname === tenantHostname && l.status === "published") || null;
  }
}

export async function createLayout(layout: Omit<RestaurantLayout, "_id">): Promise<string> {
  const newId = `layout_${Date.now()}`;
  const now = new Date().toISOString();
  const fullLayout: RestaurantLayout = {
    ...layout,
    _id: newId,
    createdAt: now,
    updatedAt: now,
  };

  // Always write to fallback file so we have it persistent locally
  const allFallback = readFallbackLayouts();
  writeFallbackLayouts([...allFallback, fullLayout]);

  try {
    const { db } = await connectToDatabase();
    const result = await db.collection(COLLECTION).insertOne({
      ...layout,
      createdAt: now,
      updatedAt: now,
    });
    return result.insertedId.toString();
  } catch (dbErr) {
    console.warn("MongoDB insert failed, saved to local fallback JSON only:", dbErr);
    return newId;
  }
}

export async function updateLayout(
  id: string,
  updates: Partial<RestaurantLayout>,
): Promise<boolean> {
  const now = new Date().toISOString();

  // Always update in local fallback JSON
  const allFallback = readFallbackLayouts();
  const idx = allFallback.findIndex((l) => l._id === id);
  if (idx !== -1) {
    allFallback[idx] = {
      ...allFallback[idx],
      ...updates,
      updatedAt: now,
    };
    writeFallbackLayouts(allFallback);
  }

  try {
    const { db } = await connectToDatabase();
    const result = await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updates,
          updatedAt: now,
        },
      },
    );
    return result.modifiedCount > 0;
  } catch (dbErr) {
    console.warn("MongoDB update failed, updated in local fallback JSON only:", dbErr);
    return idx !== -1;
  }
}

export async function publishLayout(id: string): Promise<boolean> {
  const now = new Date().toISOString();

  // Always update in local fallback JSON
  const allFallback = readFallbackLayouts();
  const target = allFallback.find((l) => l._id === id);
  if (target) {
    // Unpublish other layouts for this tenant in local JSON
    allFallback.forEach((l) => {
      if (l.tenantId === target.tenantId && l.status === "published") {
        l.status = "draft" as const;
        l.publishedAt = null;
      }
    });
    target.status = "published" as const;
    target.publishedAt = now;
    target.updatedAt = now;
    writeFallbackLayouts(allFallback);
  }

  try {
    const { db } = await connectToDatabase();

    // Get the layout to find its tenant
    const layout = await getLayoutById(id);
    if (!layout) return false;

    // Unpublish any existing published layout for this tenant
    await db.collection(COLLECTION).updateMany(
      { tenantId: layout.tenantId, status: "published" },
      { $set: { status: "draft" as const, publishedAt: null } },
    );

    // Publish the target layout
    const result = await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "published" as const,
          publishedAt: now,
          updatedAt: now,
        },
      },
    );

    return result.modifiedCount > 0;
  } catch (dbErr) {
    console.warn("MongoDB publish failed, published in local fallback JSON only:", dbErr);
    return !!target;
  }
}

export async function deleteLayout(id: string): Promise<boolean> {
  try {
    // Delete from fallback
    const allFallback = readFallbackLayouts();
    const filtered = allFallback.filter((l) => l._id !== id);
    writeFallbackLayouts(filtered);

    const { db } = await connectToDatabase();
    const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  } catch (dbErr) {
    console.warn("MongoDB delete failed, deleted from local fallback JSON only:", dbErr);
    return true;
  }
}
