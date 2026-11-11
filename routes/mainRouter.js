// routes/mainRouter.js
const router = require("express").Router();
const controller = require("../controllers/mainController");
const Message = require("../models/Message");
const Movie = require("../models/Movie");

// ---------- Middleware-ek ----------
const isLoggedIn = (req, res, next) => {
    if (req.session.user) { return next(); }
    res.redirect("/login");
};

const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === "admin") { return next(); }
    res.redirect("/");
};

// ---------- Autentikáció és alap oldalak ----------
router.get("/", controller.homeIndex);
router.get("/register", controller.registerGet);
router.post("/register", controller.registerPost);
router.get("/login", controller.loginGet);
router.post("/login", controller.loginPost);
router.get("/logout", controller.logout);
router.get("/user", isLoggedIn, controller.userIndex);
router.get("/admin", isAdmin, controller.adminIndex);

router.get("/database", controller.databaseIndex);

// ---------- Diagram (csak bejelentkezve, adatok az adatbázisból) ----------
router.get("/diagram", isLoggedIn, async (req, res) => {
    try {
        // Filmek száma műfaj szerint
        const stats = await Movie.aggregate([
            { $group: { _id: "$mufaj", db: { $sum: 1 } } },
            { $sort: { db: -1 } }
        ]);

        const labels = stats.map(s => s._id || "Ismeretlen");
        const dataValues = stats.map(s => s.db);

        res.render("diagram", {
            user: req.session.user,
            activePage: "diagram",
            labels: labels,
            dataValues: dataValues
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba történt a diagram betöltésekor.");
    }
});

// ---------- Kapcsolat ----------
router.get("/contact", (req, res) => {
    res.render("contact", { error: null, success: null, formData: {} });
});

router.post("/contact", async (req, res) => {
    const name = (req.body.name || "").trim();
    const email = (req.body.email || "").trim();
    const message = (req.body.message || "").trim();
    const formData = { name, email, message };

    if (!name || !email || !message) {
        return res.render("contact", {
            error: "Minden mezőt kötelező kitölteni!",
            success: null,
            formData
        });
    }

    if (name.length < 3) {
        return res.render("contact", {
            error: "A név legalább 3 karakter legyen!",
            success: null,
            formData
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.render("contact", {
            error: "Kérlek adj meg egy érvényes e-mail címet!",
            success: null,
            formData
        });
    }

    if (message.length < 10) {
        return res.render("contact", {
            error: "Az üzenet legalább 10 karakter legyen!",
            success: null,
            formData
        });
    }

    try {
        const newMessage = new Message({ name, email, message });
        await newMessage.save();

        res.render("contact", {
            error: null,
            success: "Köszönjük az üzenetet! Sikeresen elküldve.",
            formData: {}
        });
    } catch (err) {
        console.error(err);
        res.render("contact", {
            error: "Hiba történt az adatbázis mentés során. Próbáld újra később!",
            success: null,
            formData
        });
    }
});

// ---------- Üzenetek (csak bejelentkezve, legfrissebb elöl) ----------
router.get("/messages", isLoggedIn, async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.render("messages", { messages });
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba történt az üzenetek lekérése során.");
    }
});

// ---------- CRUD: filmek (csak admin) ----------
router.get("/movies", isAdmin, async (req, res) => {
    try {
        const movies = await Movie.find().sort({ fkod: 1 });
        res.render("movies/index", { movies });
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba a filmek betöltésekor.");
    }
});

router.get("/movies/new", isAdmin, (req, res) => {
    res.render("movies/new", { error: null });
});

router.post("/movies", isAdmin, async (req, res) => {
    const { fkod, filmcim, szines, szinkron, szarmazas, mufaj, hossz } = req.body;

    try {
        const newMovie = new Movie({
            fkod: Number(fkod),
            filmcim,
            szines: Number(szines),
            szinkron,
            szarmazas,
            mufaj,
            hossz: Number(hossz)
        });
        await newMovie.save();
        res.redirect("/movies");
    } catch (err) {
        console.error(err);
        res.render("movies/new", { error: "Hiba történt a film mentése során (lehet, hogy az fkod már létezik)." });
    }
});

router.get("/movies/:id/edit", isAdmin, async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).send("A film nem található.");
        res.render("movies/edit", { movie, error: null });
    } catch (err) {
        console.error(err);
        res.status(500).send("Szerver hiba.");
    }
});

router.post("/movies/:id/edit", isAdmin, async (req, res) => {
    const { fkod, filmcim, szines, szinkron, szarmazas, mufaj, hossz } = req.body;
    try {
        await Movie.findByIdAndUpdate(req.params.id, {
            fkod: Number(fkod),
            filmcim,
            szines: Number(szines),
            szinkron,
            szarmazas,
            mufaj,
            hossz: Number(hossz)
        });
        res.redirect("/movies");
    } catch (err) {
        console.error(err);
        const movie = await Movie.findById(req.params.id);
        res.render("movies/edit", { movie, error: "Hiba a frissítés során." });
    }
});

router.post("/movies/:id/delete", isAdmin, async (req, res) => {
    try {
        await Movie.findByIdAndDelete(req.params.id);
        res.redirect("/movies");
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba a törlés során.");
    }
});

module.exports = router;