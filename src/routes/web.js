var express = require("express");
var router = express.Router();
var moment = require("moment");
const mongoose = require("mongoose");
const db = mongoose.connection;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokenSecret = "a2sd#Fs43d4G3524Kh";
const { check, validationResult } = require("express-validator");
const rounds = 10;
//controllers, models, services, helpers
const auth = require("../middlewares/auth");
const UsersController = require("../controllers/web/usersController");
var session = require("express-session");
var { redisStore } = require("../middlewares/redis");

// middleware that is specific to this router
// router.use(function timeLog(req, res, next) {
//   console.log("Time: ", Date.now());
//   next();
// });

router.use(
  session({
    secret: "fd$e43W7ujyDFw(8@tF",
    store: redisStore,
    saveUninitialized: false,
    resave: false,
  })
);

router.get("/", function (req, res) {
  // res.send("Front end!");
  var pageTitle = req.app.locals.siteName + " - Login";

  res.render("pages/index", {
    status: 1,
    siteName: req.app.locals.siteName,
    pageTitle: pageTitle,
    moment: moment,
  });
});

router.get("/dashboard", function (req, res) {
  var pageTitle = req.app.locals.siteName + " - Dashboard";

  res.render("pages/dashboard", {
    siteName: req.app.locals.siteName,
    pageTitle: pageTitle,
    moment: moment,
  });
});

router.get("/about", function (req, res) {
  res.render("pages/about", {
    moment: moment,
  });
});

router.post(
  "/login",
  // [
  //   check("email", "Email length should be 10 to 30 characters")
  //     .isEmail()
  //     .isLength({ min: 10, max: 30 }),
  //   check("password", "Password length should be 8 to 10 characters").isLength({
  //     min: 8,
  //     max: 10,
  //   }),
  // ],
  UsersController.getLogin
);

router.post(
  "/signup",
  [
    check("email", "Email length should be 10 to 30 characters!")
      .isEmail()
      .isLength({ min: 10, max: 30 }),
    check("password", "Password length should be 8 to 10 characters!").isLength(
      {
        min: 8,
        max: 10,
      }
    ),
    check("name", "This is a required field!").not().isEmpty().trim().escape(),
  ],
  UsersController.signUp
);

module.exports = router;
