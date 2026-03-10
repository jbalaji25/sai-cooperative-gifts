/**
 * One-time migration: imports products.json into MongoDB.
 * HOW TO USE:
 *   1. Set MONGODB_URI in backend/.env first
 *   2. Run: cd backend && node migrate-to-mongo.js
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const productSchema = new mongoose.Schema({
    name: String, mainCategory: String, category: String,
    price: Number, comparePrice: Number, ratings: Number,
    stock: { type: Number, default: 50 }, description: String,
    image: String, material: String, style: String,
    width: Number, height: Number, depth: Number,
    features: [String]
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

async function migrate() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const raw = fs.readFileSync(path.join(__dirname, 'products.json'), 'utf8');
    const products = JSON.parse(raw);

    console.log(`Migrating ${products.length} products...`);

    for (const p of products) {
        const { id: _oldId, ...rest } = p;
        const doc = await Product.create({ ...rest, stock: rest.stock ?? 50 });
        console.log(`  ✅ ${doc.name || '(unnamed)'} → ${doc._id}`);
    }

    console.log('\n🎉 Migration complete!');
    process.exit(0);
}

migrate().catch(err => {
    console.error('Migration failed:', err.message);
    process.exit(1);
});
