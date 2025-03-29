const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    name: String,
    description: String,
    location: String,
    contact: String,
    dateLost: Date,
    status: { type: String, default: "Lost" },
    image: String
});

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
