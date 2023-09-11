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
const path = require("path");
const { check, validationResult } = require("express-validator");
const rounds = 10;
//controllers, models, services, helpers
const auth = require("../middlewares/auth");
const UsersController = require("../controllers/web/usersController");
const BodyFocusController = require("../controllers/web/bodyFocusController");
const SubFilterController = require("../controllers/web/subFilterController");
const ExerciseController = require("../controllers/web/exerciseController");
const EquipmentController = require("../controllers/web/equipmentController");
const CmsController = require("../controllers/web/cmcController");
const ContactController = require("../controllers/web/contactController");
var session = require("express-session");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./public/images/exercises/",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, 'image-' + uniqueSuffix + fileExtension);
  },
});

const upload = multer({ storage: storage });

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
router.get("/body-focus", cors(), BodyFocusController.getData);
router.get("/add-body-focus", cors(), BodyFocusController.addData);

router.post(
  "/create-body-focus",
  cors(),
  [
    check("focus_name", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("description", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
  ],
  BodyFocusController.createData
);

router.get("/edit-body-focus/:id", cors(), BodyFocusController.editData);

router.post(
  "/update-body-focus",
  cors(),
  [
    check("cat_id", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("focus_name", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("description", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
  ],
  BodyFocusController.updateData
);

router.get(
  "/delete-body-focus/:id",
  [
    // check("category_id", "This is a required field!")
    //   .not()
    //   .isEmpty()
    //   .trim()
    //   .escape(),
  ],
  BodyFocusController.deleteData
);

//sub filters
router.get("/sub-filters", cors(), SubFilterController.getData);
router.get("/add-sub-filter", cors(), SubFilterController.addData);

router.post(
  "/create-sub-filter",
  cors(),
  [
    check("body_focus", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("sub_filter", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("description", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
  ],
  SubFilterController.createData
);

router.post(
  "/get-sub-filter-by-body-focus",
  cors(),
  [
    check("body_focus", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
  ],
  SubFilterController.getSubFilterByBodyFocus
);
router.get("/edit-sub-filter/:id", cors(), SubFilterController.editData);

router.post(
  "/update-sub-filter",
  cors(),
  [
    check("edit_id", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("focus_name", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("description", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
  ],
  SubFilterController.updateData
);

router.get(
  "/delete-sub-filter/:id",
  [
    // check("equipment_id", "This is a required field!")
    //   .not()
    //   .isEmpty()
    //   .trim()
    //   .escape(),
  ],
  SubFilterController.deleteData
);

//EquipmentController
router.get("/equipments", cors(), EquipmentController.getData);
router.get("/add-equipment", cors(), EquipmentController.addData);
router.post(
  "/create-equipment",
  cors(),
  [
    check("equipment_name", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("description", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
  ],
  EquipmentController.createData
);

router.get("/edit-equipment/:id", cors(), EquipmentController.editData);

router.post(
  "/update-equipment",
  cors(),
  [
    check("edit_id", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("equipment_name", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("description", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
  ],
  EquipmentController.updateData
);

router.get(
  "/delete-equipment/:id",
  [
    // check("equipment_id", "This is a required field!")
    //   .not()
    //   .isEmpty()
    //   .trim()
    //   .escape(),
  ],
  EquipmentController.deleteData
);

//Exercises
router.get("/exercises", cors(), ExerciseController.getData);
router.get("/add-exercise", cors(), ExerciseController.addData);
router.post(
  "/create-exercise",
  // [
  //   check("body_focus", "This is a required field!")
  //     .not()
  //     .isEmpty()
  //     .trim()
  //     .escape(),
  //   check("sub_filter", "This is a required field!")
  //     .not()
  //     .isEmpty()
  //     .trim()
  //     .escape(),
  //   check("equipments", "This is a required field!")
  //     .not()
  //     .isEmpty()
  //     .trim()
  //     .escape(),
  //   check("description", "This is a required field!")
  //     .not()
  //     .isEmpty()
  //     .trim()
  //     .escape(),
  //   check("exercise_name", "This is a required field!")
  //     .not()
  //     .isEmpty()
  //     .trim()
  //     .escape(),
  //   check("video_url", "This is a required field!")
  //     .not()
  //     .isEmpty()
  //     .trim(),
  //   check("default_time", "This is a required field!")
  //     .not()
  //     .isEmpty()
  //     .trim()
  //     .escape(),
  //   check("weight", "This is a required field!")
  //     .not()
  //     .isEmpty()
  //     .trim()
  //     .escape(),
  //   check("weight_unit", "This is a required field!")
  //     .not()
  //     .isEmpty()
  //     .trim()
  //     .escape(),
  //   check("reps", "This is a required field!")
  //     .not()
  //     .isEmpty()
  //     .trim()
  //     .escape(),
  //   check("sets", "This is a required field!")
  //     .not()
  //     .isEmpty()
  //     .trim()
  //     .escape(),
  //   check("break", "This is a required field!")
  //     .not()
  //     .isEmpty()
  //     .trim()
  //     .escape(),
  //     // check("file", "This is a required field!")
  //     //   .not()
  //     //   .isEmpty()
  //     //   .trim()
  //     //   .escape(),
  // ],
  upload.single('image'), // Handle single image upload
  ExerciseController.createData
);

router.get(
  "/delete-exercise/:id",
  [
    // check("equipment_id", "This is a required field!")
    //   .not()
    //   .isEmpty()
    //   .trim()
    //   .escape(),
  ],
  ExerciseController.deleteData
);

//Cms
router.get("/cms", cors(), CmsController.getData);
router.get("/add-cms", cors(), CmsController.addData);

//Contact
router.get("/contact-requests", cors(), ContactController.getData);

module.exports = router;
