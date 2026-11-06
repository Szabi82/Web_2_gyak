// Ellenőrzi, hogy a felhasználó be van-e jelentkezve
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next(); // Ha igen, engedjük tovább
    }
    req.session.message = "Kérlek jelentkezz be az oldal eléréséhez!";
    return res.redirect("/login");
}

// Ellenőrzi, hogy a felhasználó admin-e
function isAdmin(req, res, next) {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        return next(); // Ha admin, mehet tovább
    }
    req.session.message = "Nincs jogosultságod az oldal megtekintéséhez!";
    return res.redirect("/"); // Vagy visszaküldjük a főoldalra
}

module.exports = {
    isAuthenticated,
    isAdmin
};