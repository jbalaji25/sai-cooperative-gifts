import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBWAq8DIpsE-pkZR5LIjQDqRKwv8BtxHnI",
    authDomain: "elysian-gifts.firebaseapp.com",
    projectId: "elysian-gifts",
    storageBucket: "elysian-gifts.firebasestorage.app",
    messagingSenderId: "303666228087",
    appId: "1:303666228087:web:618c13225703713048cf72",
    measurementId: "G-3FJ882CJC1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// ─── Firestore Helper Functions ───────────────────────────────────────────────

/**
 * Fetch all products from Firestore, sorted by creation order.
 */
export async function fetchProducts() {
    try {
        const q = query(collection(db, "products"), orderBy("createdAt", "asc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
        // Fallback without ordering if index not set up yet
        const snapshot = await getDocs(collection(db, "products"));
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    }
}

/**
 * Add a new product to Firestore.
 */
export async function addProduct(productData) {
    const data = { ...productData, createdAt: Date.now() };
    const docRef = await addDoc(collection(db, "products"), data);
    return { id: docRef.id, ...data };
}

/**
 * Update an existing product in Firestore.
 */
export async function updateProduct(id, productData) {
    const ref = doc(db, "products", id);
    // Remove the id field from the update payload
    const { id: _ignore, ...rest } = productData;
    await updateDoc(ref, rest);
}

/**
 * Delete a product from Firestore.
 */
export async function deleteProduct(id) {
    await deleteDoc(doc(db, "products", id));
}
