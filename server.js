// ✅ Import required modules
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// ✅ Load environment variables
require('dotenv').config();
require('dotenv').config({ path: '"C:\Users\Admin\OneDrive\Desktop\LostAndFound1\server\.env"' });

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middleware
app.use(express.json());
app.use(cors());

// ✅ MongoDB Atlas Connection
const mongoURI = process.env.MONGODB_URI || "mongodb+srv://jeevitharani2004:jeevitha2004@lostandfound.dhyqhze.mongodb.net/?retryWrites=true&w=majority&appName=LostAndFound";

if (!mongoURI) {
    console.error("❌ Missing MongoDB URI in .env file");
    process.exit(1);
}

mongoose.connect(mongoURI, {}
)
    .then(() => console.log("🔥 Connected to MongoDB Atlas"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Schema and Model
const itemSchema = new mongoose.Schema({
    name: String,
    description: String,
    location: String,
    contact: String,
    dateLost: Date,
    status: { type: String, default: "Lost" },
    image: String,
});

const Item = mongoose.model("Item", itemSchema);

const adminSchema = new mongoose.Schema({
    username: String,
    password: String
});

const Admin = mongoose.model("Admin", adminSchema);

// ✅ Routes

// ➡️ 1. Add New Lost Item
app.post("/api/add", async (req, res) => {
    try {
        const { name, description, location, contact, dateLost, image } = req.body;
        const newItem = new Item({
            name,
            description,
            location,
            contact,
            dateLost,
            image
        });

        await newItem.save();
        res.status(201).send("✅ Item reported successfully!");
    } catch (error) {
        res.status(500).send("❌ Error reporting item: " + error.message);
    }
});

// ➡️ 2. Retrieve All Items
app.get("/api/items", async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).send("❌ Error retrieving items: " + error.message);
    }
});

// ➡️ 3. Retrieve Single Item by ID
app.get("/api/items/:id", async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).send("❌ Item not found");
        }
        res.status(200).json(item);
    } catch (error) {
        res.status(500).send("❌ Error retrieving item: " + error.message);
    }
});

// ➡️ 4. Update or Retrieve Item
app.put("/api/items/:id", async (req, res) => {
    try {
        const { status, name, description, location, contact } = req.body;

        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            { status, name, description, location, contact },
            { new: true }
        );

        if (!updatedItem) {
            return res.status(404).send("❌ Item not found");
        }

        res.status(200).send("✅ Item updated successfully!");
    } catch (error) {
        res.status(500).send("❌ Error updating item: " + error.message);
    }
});

// ➡️ 5. Delete an Item
app.delete("/api/items/:id", async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).send("❌ Item not found");
        }
        res.status(200).send("✅ Item deleted successfully!");
    } catch (error) {
        res.status(500).send("❌ Error deleting item: " + error.message);
    }
});

// ➡️ 6. Admin Authentication Route
app.post("/api/admin/login", async (req, res) => {
    const { username, password } = req.body;

    // Use environment variables for credentials
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (username === adminUsername && password === adminPassword) {
        res.status(200).send("✅ Admin logged in successfully!");
    } else {
        res.status(401).send("❌ Invalid admin credentials");
    }
});

// ✅ Start the server
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));




