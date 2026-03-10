/**
 * Run this script one time to migrate your existing products.json data
 * to Firestore.
 *
 * HOW TO RUN:
 * 1. Install dependencies: npm install firebase
 * 2. Run: node migrate.js
 */

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import fs from "fs";

const firebaseConfig = {
    apiKey: "AIzaSyBWAq8DIpsE-pkZR5LIjQDqRKwv8BtxHnI",
    authDomain: "elysian-gifts.firebaseapp.com",
    projectId: "elysian-gifts",
    storageBucket: "elysian-gifts.firebasestorage.app",
    messagingSenderId: "303666228087",
    appId: "1:303666228087:web:618c13225703713048cf72"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const products = JSON.parse(fs.readFileSync("./backend/products.json", "utf-8"));

async function migrate() {
    console.log(`Migrating ${products.length} products to Firestore...`);
    for (const product of products) {
        const { id: _oldId, ...rest } = product; // drop old numeric ID, Firestore generates its own
        const docRef = await addDoc(collection(db, "products"), {
            ...rest,
            createdAt: Date.now()
        });
        console.log(`✅ Added: ${rest.name || "(unnamed)"} → ${docRef.id}`);
    }
    console.log("\n🎉 Migration complete! All products are now in Firestore.");
    process.exit(0);
}

migrate().catch(err => {
    console.error("Migration failed:", err);
    process.exit(1);
});
