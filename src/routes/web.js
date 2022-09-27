var express = require("express");
var router = express.Router();
var moment = require("moment");
const cors = require("cors");
const mongoose = require("mongoose");
const db = mongoose.connection;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokenSecret = "a2sd#Fs43d4G3524Kh";
const url = require("url");
const { check, validationResult } = require("express-validator");
const rounds = 10;
//controllers, models, services, helpers
const auth = require("../middlewares/auth");
const UsersController = require("../controllers/web/usersController");
const BodyFocusController = require("../controllers/web/bodyFocusController");
const TrainingController = require("../controllers/web/trainingController");
var session = require("express-session");

// var { redisStore } = require("../middlewares/redis");

// middleware that is specific to this router
// router.use(function timeLog(req, res, next) {
//   console.log("Time: ", Date.now());
//   next();
// });

router.use(
  session({
    secret: "fd$e43W7ujyDFw(8@tF",
    // store: redisStore,
    saveUninitialized: true,
    resave: true,
  })
);

router.get("/", cors(), function (req, res) {
  // res.send("Front end!");
  const requrl = url.format({
    protocol: req.protocol,
    host: req.get("host"),
    // pathname: req.originalUrl,
  });
  req.app.locals.requrl = requrl;

  if (!req.session.user) {
    var pageTitle = req.app.locals.siteName + " - Login";

    res.render("pages/index", {
      status: 1,
      siteName: req.app.locals.siteName,
      pageTitle: pageTitle,
      year: moment().format("YYYY"),
    });
  } else {
    res.redirect("/dashboard");
  }
});

router.get("/dashboard", cors(), function (req, res) {
  if (req.session.user) {
    var pageTitle = req.app.locals.siteName + " - Dashboard";

    res.render("pages/dashboard", {
      siteName: req.app.locals.siteName,
      pageTitle: pageTitle,
      userFullName: req.session.user.name,
      userImage: req.session.user.image_url,
      userEmail: req.session.user.email,
      year: moment().format("YYYY"),
      requrl: req.app.locals.requrl,
    });
  } else {
    res.redirect("/");
  }
});

router.get("/profile", cors(), UsersController.getProfile);

router.post(
  "/edit-profile",
  [
    check("fullName", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    // check(
    //   "newPassword",
    //   "Password length should be 8 to 10 characters"
    // ).isLength({
    //   min: 8,
    //   max: 10,
    // }),
  ],
  UsersController.editProfile
);

router.post(
  "/login",
  cors(),
  [
    check("email", "Email length should be 10 to 30 characters")
      .isEmail()
      .isLength({ min: 10, max: 30 }),
    check("password", "Password length should be 8 to 10 characters").isLength({
      min: 8,
      max: 10,
    }),
  ],
  UsersController.getLogin
);

router.post(
  "/signup",
  cors(),
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

router.get(
  "/logout",
  cors(),
  // auth.isAuthorized,
  // [
  //   check("user_id", "This is a required field!")
  //     .not()
  //     .isEmpty()
  //     .trim()
  //     .escape(),
  // ],
  UsersController.getLogout
);

//body focus
router.get("/body-focus", cors(), BodyFocusController.getBodyFocus);
router.get("/add-body-focus", cors(), BodyFocusController.addBodyFocus);

// router.post(
//   "/create-body-focus",
//   cors(),
//   [
//     check("name", "This is a required field!")
//     .not()
//     .isEmpty()
//     .trim()
//     .escape(),
//   ],
//   BodyFocusController.createBodyFocus
// );

router.get("/training", cors(), TrainingController.getTraining);
router.get("/add-training", cors(), TrainingController.addTraining);

router.get("/exercise", cors(), TrainingController.getExercise);
router.get("/add-exercise", cors(), TrainingController.addExercise);



module.exports = router;
