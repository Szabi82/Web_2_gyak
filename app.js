require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const app = express();

// ---  MONGOOSE CSATLAKOZÁS ---
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb+srv://bencze1szabolcs_db_user:YblEW3LkhL8BQX1L@cluster0.xlqnb5h.mongodb.net/mvc_auth?retryWrites=true&w=majority&appName=Cluster0&tls=true";
mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB sikeresen csatlakozva!"))
    .catch(err => console.error("MongoDB csatlakozási hiba:", err));




app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.SESSION_MONGO_URI || MONGO_URI
    })
}));
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.message = req.session.message || "";
    req.session.message = "";
    next();
});
app.use("/", require("./routes/mainRouter"));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {console.log(`Server fut a ${PORT} porton`);});