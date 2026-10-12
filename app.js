require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const app = express();

// ---  MONGOOSE CSATLAKOZÁS ---
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/web2_mozi";
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
        mongoUrl: process.env.SESSION_MONGO_URI
    })
}));
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    res.locals.message = req.session.message || "";
    req.session.message = "";
    next();
});
app.use("/", require("./routes/mainRouter"));
const port = 3000;
app.listen(port, () => {console.log(`Server: http://localhost:${port}`);});