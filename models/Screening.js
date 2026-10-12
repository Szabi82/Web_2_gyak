const mongoose = require("mongoose");

const screeningSchema = new mongoose.Schema({
    fkod: { type: Number, required: true },
    moziazon: { type: Number, required: true }
});

module.exports = mongoose.model("Screening", screeningSchema);