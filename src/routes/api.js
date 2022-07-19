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
const Users = require("../models/userModel");
const UserController = require("../controllers/userController");
const OthersController = require("../controllers/othersController");
// const helper = require("../helpers/helper");
//others
const dateTime = moment().format("YYYY-MM-DD h:mm:ss");

//apis

router.get("/", function (req, res) {
  res.status(401).json({
    status: "0",
    message: "401 - Unauthorised!",
    respdata: {},
  });
});

router.get("/countries", OthersController.getCountries);

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
    check("title", "This is a required field!").not().isEmpty().trim().escape(),
    check("name", "This is a required field!").not().isEmpty().trim().escape(),
    check("age", "This is a required field!")
      .not()
      .isEmpty()
      .isNumeric()
      .trim()
      .escape(),
    check("weight", "This is a required field!")
      .not()
      .isEmpty()
      .isNumeric()
      .trim()
      .escape(),
    check("height", "This is a required field!")
      .not()
      .isEmpty()
      .isNumeric()
      .trim()
      .escape(),
    check("country", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("country_code", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("goal", "This is a required field!").not().isEmpty().trim().escape(),
    check("hear_from", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
  ],
  UserController.signUp
);

router.post(
  "/login",
  [
    check("email", "Email length should be 10 to 30 characters")
      .isEmail()
      .isLength({ min: 10, max: 30 }),
    check("password", "Password length should be 8 to 10 characters").isLength({
      min: 8,
      max: 10,
    }),
  ],
  UserController.getLogin
);

//  auth routes
router.get("/users", auth.isAuthorized, UserController.getUsers);

router.post(
  "/profile",
  auth.isAuthorized,
  [
    check("user_id", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
  ],
  UserController.getProfile
);

router.post(
  "/edit-profile",
  auth.isAuthorized,
  [
    check("user_id", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    // check("email", "Email length should be 10 to 30 characters!").isEmail().isLength({ min: 10, max: 30 }),
    check("password", "Password length should be 8 to 10 characters!").isLength(
      {
        min: 8,
        max: 10,
      }
    ),
    check("title", "This is a required field!").not().isEmpty().trim().escape(),
    check("name", "This is a required field!").not().isEmpty().trim().escape(),
    check("age", "This is a required field!")
      .not()
      .isEmpty()
      .isNumeric()
      .trim()
      .escape(),
    check("weight", "This is a required field!")
      .not()
      .isEmpty()
      .isNumeric()
      .trim()
      .escape(),
    check("height", "This is a required field!")
      .not()
      .isEmpty()
      .isNumeric()
      .trim()
      .escape(),
    check("country", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("country_code", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("goal", "This is a required field!").not().isEmpty().trim().escape(),
    check("hear_from", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
  ],
  UserController.editProfile
);

router.post(
  "/upload-image",
  auth.isAuthorized,
  [
    check("user_id", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("img_base64", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
  ],
  UserController.uploadImage
);
//test
router.post("/add-users", (req, res) => {
  // console.log(req.body);

  var data = req.body;
  db.collection("users").insertMany(data, function (err, result) {
    if (err) {
      res.status(400).json({
        status: "1",
        message: "Not added!",
        respdata: err,
      });
    } else {
      res.status(200).json({
        status: "1",
        message: "Added!",
        respdata: result,
      });
    }
  });
});

module.exports = router;
