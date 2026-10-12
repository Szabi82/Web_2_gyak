const router = require("express").Router();
const controller = require("../controllers/mainController");

isLoggedIn=(req,res,next)=>{
    if(req.session.user){return next();}
    res.redirect("/login");
}
isAdmin=(req,res,next)=>{
    if(req.session.user && req.session.user.role==="admin"){return next();}
    res.redirect("/");
}

router.get("/", controller.homeIndex);
router.get("/register", controller.registerGet);
router.post("/register", controller.registerPost);
router.get("/login", controller.loginGet);
router.post("/login", controller.loginPost);
router.get("/logout", controller.logout);
router.get("/user", isLoggedIn, controller.userIndex);
router.get("/admin", isAdmin, controller.adminIndex);

// ÚJ: Adatbázis / Filmes oldal útvonal
router.get("/database", controller.databaseIndex);

router.get('/diagram', async (req, res) => {
    try {
      
        
        // Példa adatok, amiket átküldünk a sablonnak:
        const labels = ['Film 1', 'Film 2', 'Film 3'];
        const dataValues = [10, 25, 15];

        res.render('diagram', { 
            user: req.session.user,
            activePage: 'diagram',
            labels: labels,       // <--- Átadjuk a címkéket
            dataValues: dataValues // <--- Átadjuk az értékeket
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba történt");
    }
});





module.exports = router;