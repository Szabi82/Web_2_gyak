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

router.get("/database", controller.databaseIndex);

router.get('/diagram', async (req, res) => {
    try {
      
        
        const labels = ['Film 1', 'Film 2', 'Film 3'];
        const dataValues = [10, 25, 15];

        res.render('diagram', { 
            user: req.session.user,
            activePage: 'diagram',
            labels: labels,
            dataValues: dataValues
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba történt");
    }
});


const Message = require('../models/Message');

router.get('/contact', (req, res) => {
    res.render('contact', { error: null, success: null, formData: {} });
});

router.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.render('contact', { 
            error: 'Minden mezőt kötelező kitölteni!', 
            success: null, 
            formData: { name, email, message } 
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.render('contact', { 
            error: 'Kérlek adj meg egy érvényes e-mail címet!', 
            success: null, 
            formData: { name, email, message } 
        });
    }

    try {
        // Mentés az adatbázisba
        const newMessage = new Message({ name, email, message });
        await newMessage.save();

        // Sikeres üzenet
        res.render('contact', { 
            error: null, 
            success: 'Köszönjük az üzenetet! Sikeresen elküldve.', 
            formData: {} 
        });
    } catch (err) {
        console.error(err);
        res.render('contact', { 
            error: 'Hiba történt az adatbázis mentés során. Próbáld újra később!', 
            success: null, 
            formData: { name, email, message } 
        });
    }
});


module.exports = router;
