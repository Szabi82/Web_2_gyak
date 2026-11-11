const User = require("../models/User");
const Movie = require("../models/Movie");
const Cinema = require("../models/Cinema");
const Screening = require("../models/Screening");
const bcrypt = require("bcrypt");

exports.homeIndex = async (req, res) => {
    try {
        const movieCount = await Movie.countDocuments();
        const cinemaCount = await Cinema.countDocuments();
        const screeningCount = await Screening.countDocuments();
        console.log("Screening:", Screening.collection.name, "| adatbázis:", Screening.db.name, "| db:", screeningCount);        

        // az összes film játékideje órában
        const sum = await Movie.aggregate([
            { $group: { _id: null, total: { $sum: "$hossz" } } }
        ]);
        const totalHours = sum.length ? Math.round(sum[0].total / 60) : 0;

        // 3 véletlenszerű film, minden betöltésnél más
        const featured = await Movie.aggregate([{ $sample: { size: 3 } }]);

        // pár mozi a listához
        const cinemas = await Cinema.find().limit(5);

        res.render("home", {
            user: req.session.user || null,
            movieCount,
            cinemaCount,
            screeningCount,
            totalHours,
            featured,
            cinemas
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba történt a főoldal betöltésekor!");
    }
};
exports.userIndex = (req, res) => { res.render("user"); };
exports.adminIndex = (req, res) => { res.render("admin"); };

exports.registerGet = (req, res) => { res.render("register"); };
exports.registerPost = async (req, res) => {
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
        req.session.message = "This user already exists!";
        return res.redirect("/register");
    }
    const hash = await bcrypt.hash(req.body.password, 10);
    await User.create({ username: req.body.username, password: hash, role: "user" });
    req.session.message = "Successful registration! You can log in.";
    res.redirect("/login");
};

exports.loginGet = (req, res) => { res.render("login"); };
exports.loginPost = async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
        req.session.message = "Login failed!";
        return res.redirect("/login");
    }
    const ok = await bcrypt.compare(req.body.password, user.password);
    if (!ok) {
        req.session.message = "Login failed!";
        return res.redirect("/login");
    }
    req.session.user = { id: user._id, username: user.username, role: user.role };
    if (user.role === "admin") {
        res.redirect("/admin");
    } else {
        res.redirect("/user");
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => { res.redirect("/"); });
};

// ÚJ: Adatbázis lekérdezés a 3 táblához (Filmek, Mozik, Helyek)
exports.databaseIndex = async (req, res) => {
    try {
        const movies = await Movie.find().limit(20); // Első 20 film
        const cinemas = await Cinema.find();         // Összes mozi
        const screenings = await Screening.find().limit(20); // Kapcsolatok

        res.render("database", { movies, cinemas, screenings });
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba történt az adatbázis lekérdezésekor!");
    }
};