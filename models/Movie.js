const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    fkod: { type: Number, required: true, unique: true },
    filmcim: { type: String, required: true },
    szines: { type: Number, required: true },
    szinkron: { type: String, default: "" }, // <-- Itt engedélyezzük, hogy üres legyen
    szarmazas: { type: String, required: true },
    mufaj: { type: String, required: true },
    hossz: { type: Number, required: true }
});

module.exports = mongoose.model("Movie", movieSchema);