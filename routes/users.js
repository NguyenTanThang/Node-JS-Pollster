var express = require('express');
var router = express.Router();
const passport = require("passport");
const {
  signUp,
  getAllUsers,
  getUserByID
} = require("../controller/userControllers")
const authChecker = require('../config/auth-check');

router.get('/auth/facebook',
  passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/login',
    successRedirect: "/"
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

router.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile']
  }));

router.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect: "/"
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: "/"
  }),
  function (req, res) {
    res.redirect('/');
  });

router.get("/logout", authChecker, (req, res) => {
  req.logout()
  return res.redirect("/login");
})

router.get("/", getAllUsers)

router.get("/:id", getUserByID)

router.post("/signup", signUp)

module.exports = router;