const mongoose = require("mongoose");

const cinemaSchema = new mongoose.Schema({
    moziazon: { type: Number, required: true, unique: true },
    mozinev: { type: String, required: true },
    irszam: { type: Number, required: true },
    cim: { type: String, required: true },
    telefon: { type: String, default: "" }
});

module.exports = mongoose.model("Cinema", cinemaSchema);