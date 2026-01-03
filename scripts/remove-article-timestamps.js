/*
Deletes `createdAt` and `updatedAt` fields from all documents in the `articles` collection.
Requires environment variables: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
Run:
  node scripts/remove-article-timestamps.js
*/

const admin = require('firebase-admin');

function getPrivateKey() {
  const pk = process.env.FIREBASE_PRIVATE_KEY;
  if (!pk) return undefined;
  return pk.includes('-----BEGIN') ? pk : pk.replace(/\\n/g, '\n');
}

if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
  console.error('Missing FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY environment variables.');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: getPrivateKey(),
  }),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

async function run() {
  console.log('Starting removal of createdAt/updatedAt from articles...');
  const colRef = db.collection('articles');
  const snapshot = await colRef.get();
  console.log(`Found ${snapshot.size} documents.`);

  let batch = db.batch();
  let ops = 0;
  let batches = 0;

  for (const doc of snapshot.docs) {
    batch.update(doc.ref, { createdAt: FieldValue.delete(), updatedAt: FieldValue.delete() });
    ops++;
    if (ops === 500) {
      await batch.commit();
      batches++;
      console.log(`Committed batch ${batches} (500 updates)`);
      batch = db.batch();
      ops = 0;
    }
  }

  if (ops > 0) {
    await batch.commit();
    batches++;
    console.log(`Committed final batch ${batches} (${ops} updates)`);
  }

  console.log('Done.');
  process.exit(0);
}

run().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
