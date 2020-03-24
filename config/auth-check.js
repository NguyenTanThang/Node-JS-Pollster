const authChecker = (req, res, next) => {
    const user = req.user;
    if (user){
        next()
    } else {
        return res.redirect("/login");
    }
}

module.exports = authChecker;