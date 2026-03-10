// ─── Cloudinary Image Upload Utility ─────────────────────────────────────────
// To configure:
// 1. Go to cloudinary.com → Dashboard
// 2. Note your Cloud Name
// 3. Go to Settings → Upload → Upload Presets → Add upload preset
//    Set Signing Mode to "Unsigned" and save the preset name below

const CLOUDINARY_CLOUD_NAME = "PASTE_YOUR_CLOUD_NAME_HERE"; // e.g. "dxyz123abc"
const CLOUDINARY_UPLOAD_PRESET = "PASTE_YOUR_UPLOAD_PRESET_HERE"; // e.g. "elysian_gifts_preset"

/**
 * Upload an image file to Cloudinary and return the secure URL.
 * @param {File} file - The image file selected by the admin.
 * @param {Function} onProgress - Optional callback (0-100) for upload progress.
 * @returns {Promise<string>} The secure Cloudinary image URL.
 */
export async function uploadImageToCloudinary(file, onProgress) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", "elysian-gifts/products");

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable && onProgress) {
                onProgress(Math.round((e.loaded / e.total) * 100));
            }
        });

        xhr.addEventListener("load", () => {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                resolve(data.secure_url);
            } else {
                reject(new Error("Cloudinary upload failed"));
            }
        });

        xhr.addEventListener("error", () => reject(new Error("Network error")));

        xhr.open(
            "POST",
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
        );
        xhr.send(formData);
    });
}
export const categoryStructure = {
    "Bags & Travel Accessories": ["Jute Bags", "Laptop Bags", "Ladies Slings", "Ladies Wallets", "Capsule Umbrella", "Umbrella", "Tiffin Pouch"],
    "Office & Desktop Accessories": ["Clock", "Wooden Pen Stand Clock", "Pen Stand", "Dock / Pen Stand Dock", "Paper Pad & Pen Stand", "Mobile Stand", "Scale", "Clip Board", "Desktop Articles"],
    "Writing & Stationery": ["Designer Notebook", "Memo Pad", "Diaries", "Metal Ball Pen", "Plastic Ball Pen", "Engraved Pen", "Card Holder"],
    "Tech & Electronic Accessories": ["Power Bank", "USB", "USB Pendrive", "Speaker", "Charging Stand"],
    "Drinkware & Kitchen Items": ["Bottle", "Mugs", "Ceramic Mug", "Lunch Box", "Hip Flask", "Bar Sets"],
    "Home Decor & Decorative Items": ["Photo Frame", "Show Pieces", "Aroma Candles", "Flower Vases", "Plastic Paper Weight", "Coaster"],
    "Lighting Products": ["Solar Lamp", "Torch & Lamp", "Rechargeable Touch Lamp", "Light & Touch Lamp"],
    "Keychains & Small Accessories": ["Key Ring", "Keychain", "Key Hanger"],
    "Gift Sets": ["Executive Gift Set", "Corporate Gift Box", "Premium Combo", "Festive Hampers"]
};
