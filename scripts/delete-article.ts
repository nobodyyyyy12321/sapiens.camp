import fs from 'fs';
import path from 'path';
import { getFirestoreDB } from '../lib/firebase-admin';

// Load .env.local into process.env if present
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const raw = fs.readFileSync(envPath, 'utf8');
  raw.split(/\r?\n/).forEach((line) => {
    const m = line.match(/^\s*([^#][^=\s]*)\s*=\s*(.*)\s*$/);
    if (m) {
      const key = m[1];
      let val = m[2] || '';
      // remove surrounding quotes if any
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      // keep literal \n sequences
      process.env[key] = val;
    }
  });
}

async function deleteBySlug(slug: string) {
  const db = getFirestoreDB();
  const snapshot = await db.collection('articles').where('slug', '==', slug).get();
  if (snapshot.empty) {
    console.log(`No articles found with slug=${slug}`);
    return;
  }
  for (const doc of snapshot.docs) {
    console.log(`Deleting ${doc.id} (${doc.data().title || 'no title'})`);
    await db.collection('articles').doc(doc.id).delete();
  }
  console.log('Done.');
}

async function deleteByTitle(title: string) {
  const db = getFirestoreDB();
  const snapshot = await db.collection('articles').where('title', '==', title).get();
  if (snapshot.empty) {
    console.log(`No articles found with title=${title}`);
    return;
  }
  for (const doc of snapshot.docs) {
    console.log(`Deleting ${doc.id} (${doc.data().title || 'no title'})`);
    await db.collection('articles').doc(doc.id).delete();
  }
  console.log('Done.');
}

async function main() {
  const args = process.argv.slice(2);
  let slug: string | undefined;
  let title: string | undefined;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--slug') slug = args[i+1];
    if (args[i] === '--title') title = args[i+1];
  }
  if (!slug && !title) {
    console.error('Usage: npx tsx scripts/delete-article.ts --slug <slug> | --title <title>');
    process.exit(1);
  }
  try {
    if (slug) await deleteBySlug(slug);
    if (title) await deleteByTitle(title);
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  }
}

main();
