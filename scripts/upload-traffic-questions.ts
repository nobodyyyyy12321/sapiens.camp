#!/usr/bin/env node
/**
 * scripts/upload-traffic-questions.ts
 *
 * Usage:
 *   # default: scripts/traffic-questions.json
 *   ts-node ./scripts/upload-traffic-questions.ts [path/to/file.json]
 *
 * The JSON file should be an array of question objects. Each question may include a
 * `number` field which will be used to find & update existing documents. If no
 * matching document is found the script will add a new document.
 *
 * Collection used: `trafficQuestions`
 */

import fs from "fs";
import path from "path";
import { getFirestoreDB } from "../lib/firebase-admin";

type AnyObj = Record<string, any>;

async function main() {
  const input = process.argv[2] || path.join(__dirname, "traffic-questions.json");

  if (!fs.existsSync(input)) {
    console.error(`File not found: ${input}`);
    process.exit(1);
  }

  let raw: string;
  try {
    raw = fs.readFileSync(input, "utf8");
  } catch (err: any) {
    console.error("Failed to read file:", err.message || err);
    process.exit(1);
  }

  let items: AnyObj[];
  try {
    items = JSON.parse(raw);
    if (!Array.isArray(items)) throw new Error("JSON root must be an array");
  } catch (err: any) {
    console.error("Invalid JSON:", err.message || err);
    process.exit(1);
  }

  const db = getFirestoreDB();
  const col = db.collection("trafficQuestions");

  let added = 0;
  let updated = 0;
  let skipped = 0;
  const results: string[] = [];

  for (const item of items) {
    try {
      if (item.number !== undefined && item.number !== null) {
        const snapshot = await col.where("number", "==", item.number).limit(1).get();
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          const existing = doc.data();
          const updates: AnyObj = {};
          for (const [k, v] of Object.entries(item)) {
            if (JSON.stringify(existing[k]) !== JSON.stringify(v)) updates[k] = v;
          }
          if (Object.keys(updates).length > 0) {
            await doc.ref.update(updates);
            updated++;
            results.push(`🔄 Updated number=${item.number}`);
          } else {
            skipped++;
            results.push(`⏭️ Skipped number=${item.number} (no changes)`);
          }
          continue;
        }
      }

      // If no `number` matched or number not provided, add new doc
      await col.add(item);
      added++;
      results.push(`✅ Added ${item.number ?? item.title ?? "(new)"}`);
    } catch (err: any) {
      results.push(`❌ Failed ${item.number ?? item.title ?? "(item)"}: ${err.message || err}`);
    }
  }

  console.log({ success: true, added, updated, skipped });
  console.log(results.join("\n"));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
