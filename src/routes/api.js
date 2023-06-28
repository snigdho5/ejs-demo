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
const UserController = require("../controllers/api/userController");
const OthersController = require("../controllers/api/othersController");
const CategoryController = require("../controllers/api/categoryController");
const SubCategoryController = require("../controllers/api/subCategoryController");
const ProgramController = require("../controllers/api/programController");
const EquipmentController = require("../controllers/api/equipmentController");
const ExerciseController = require("../controllers/api/exerciseController");
const TravisController = require("../controllers/api/travisController");
const SearchController = require("../controllers/api/searchController");

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
    // check("password", "Password length should be 8 to 10 characters!").isLength(
    //   {
    //     min: 8,
    //     max: 10,
    //   }
    // ),
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
    // check("trial_end_date", "This is a required field!").not().isEmpty().trim().escape(),
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
    check("img_base64", "This is a required field!").not().isEmpty(),
  ],
  UserController.uploadImage
);

router.get("/settings", OthersController.getSetting);

router.post(
  "/logout",
  auth.isAuthorized,
  [
    check("user_id", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
  ],
  UserController.getLogout
);

router.post(
  "/forgot-password",
  [check("email", "This is a required field!").not().isEmpty().isEmail()],
  UserController.forgotPassword
);

router.post(
  "/reset-password",
  [
    check("user_id", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("otp", "This is a required field!").not().isEmpty(),
    check(
      "new_password",
      "Password length should be 8 to 10 characters!"
    ).isLength({
      min: 8,
      max: 10,
    }),
    check(
      "repeat_password",
      "Password length should be 8 to 10 characters!"
    ).isLength({
      min: 8,
      max: 10,
    }),
  ],
  UserController.resetPassword
);

router.post(
  "/change-password",
  auth.isAuthorized,
  [
    check("user_id", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check(
      "old_password",
      "Password length should be 8 to 10 characters!"
    ).isLength({
      min: 8,
      max: 10,
    }),
    check(
      "new_password",
      "Password length should be 8 to 10 characters!"
    ).isLength({
      min: 8,
      max: 10,
    }),
  ],
  UserController.changePassword
);

//category

router.get("/categories", auth.isAuthorized, CategoryController.getData);

router.post(
  "/view-category",
  auth.isAuthorized,
  [
    check("category_id", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
  ],
  CategoryController.viewData
);

router.post(
  "/add-category",
  auth.isAuthorized,
  [
    check("category_name", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("description", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    // check("image", "This is a required field!").not().isEmpty().trim().escape(),
  ],
  CategoryController.addData
);

router.post(
  "/edit-category",
  auth.isAuthorized,
  [
    check("category_id", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("category_name", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("description", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    // check("image", "This is a required field!").not().isEmpty().trim().escape(),
  ],
  CategoryController.editData
);

router.post(
  "/delete-category",
  auth.isAuthorized,
  [
    check("category_id", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
  ],
  CategoryController.deleteData
);

//sub category

router.get("/sub-categories", auth.isAuthorized, SubCategoryController.getData);

router.post(
  "/view-sub-category",
  auth.isAuthorized,
  [
    check("sub_category_id", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
  ],
  SubCategoryController.viewData
);

router.post(
  "/get-sub-category",
  auth.isAuthorized,
  [
    check("category_id", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
  ],
  SubCategoryController.getSubCatData
);

router.post(
  "/add-sub-category",
  auth.isAuthorized,
  [
    check("category_id", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("sub_category_name", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("description", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    // check("image", "This is a required field!").not().isEmpty().trim().escape(),
  ],
  SubCategoryController.addData
);

router.post(
  "/edit-sub-category",
  auth.isAuthorized,
  [
    check("sub_category_id", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("category_id", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("sub_category_name", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("description", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    // check("image", "This is a required field!").not().isEmpty().trim().escape(),
  ],
  SubCategoryController.editData
);

router.post(
  "/delete-sub-category",
  auth.isAuthorized,
  [
    check("sub_category_id", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
  ],
  CategoryController.deleteData
);

//Equipment

router.get("/equipments", auth.isAuthorized, EquipmentController.getData);

router.post(
  "/view-equipment",
  auth.isAuthorized,
  [
    check("equipment_id", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
  ],
  EquipmentController.viewData
);

router.post(
  "/add-equipment",
  auth.isAuthorized,
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
    // check("image", "This is a required field!").not().isEmpty().trim().escape(),
  ],
  EquipmentController.addData
);

router.post(
  "/edit-equipment",
  auth.isAuthorized,
  [
    check("equipment_id", "This is a required field!")
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
    // check("image", "This is a required field!").not().isEmpty().trim().escape(),
  ],
  EquipmentController.editData
);

router.post(
  "/delete-equipment",
  auth.isAuthorized,
  [
    check("equipment_id", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
  ],
  EquipmentController.deleteData
);

//Exercise

router.get("/exercises", auth.isAuthorized, ExerciseController.getData);

router.post(
  "/view-exercise",
  auth.isAuthorized,
  [
    check("exercise_id", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
  ],
  ExerciseController.viewData
);

router.post(
  "/get-exercises",
  auth.isAuthorized,
  [
    check("subcategory_id", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
  ],
  ExerciseController.getExerciseData
);

router.post(
  "/add-exercise",
  auth.isAuthorized,
  [
    check("exercise_name", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("description", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("category_id", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("sub_category_ids", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("equipment_ids", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("default_time", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("video_url", "This is a required field!").not().isEmpty(),
    check("weight", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("weight_unit", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("reps", "This is a required field!").not().isEmpty().trim().escape(),
    check("sets", "This is a required field!").not().isEmpty().trim().escape(),
    check("break", "This is a required field!").not().isEmpty().trim().escape(),
    // check("image", "This is a required field!").not().isEmpty().trim().escape(),
  ],
  ExerciseController.addData
);

router.post(
  "/edit-exercise",
  auth.isAuthorized,
  [
    check("exercise_id", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("exercise_name", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("description", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("category_id", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("sub_category_ids", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("equipment_ids", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("default_time", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("video_url", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("weight", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("weight_unit", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("reps", "This is a required field!").not().isEmpty().trim().escape(),
    check("sets", "This is a required field!").not().isEmpty().trim().escape(),
    check("break", "This is a required field!").not().isEmpty().trim().escape(),
    // check("image", "This is a required field!").not().isEmpty().trim().escape(),
  ],
  ExerciseController.editData
);

router.post(
  "/add-exercise-personal-best",
  auth.isAuthorized,
  [
    check("user_id", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("exercise_id", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("weight", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape()
      .isLength({ min: 2, max: 3 }),
  ],
  ExerciseController.addExPersonalBest
);

router.post(
  "/delete-exercise",
  auth.isAuthorized,
  [
    check("exercise_id", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
  ],
  ExerciseController.deleteData
);

//Programme

// router.get("/programmes", auth.isAuthorized, ProgramController.getData);

router.post(
  "/programmes",
  auth.isAuthorized,
  [
    check("exc_type", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape()
      .isIn(["admin", "user"])
      .withMessage("Type mismatch!"),
  ],
  ProgramController.getData
);

router.post(
  "/user-programmes",
  auth.isAuthorized,
  [
    check("user_id", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
  ],
  ProgramController.getUserData
);

router.post(
  "/view-programme",
  auth.isAuthorized,
  [
    check("programme_id", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
  ],
  ProgramController.viewData
);

router.post(
  "/add-programme",
  auth.isAuthorized,
  [
    check("user_id", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("exercise_ids", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("exercise_my_time", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("programme_name", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    // check("description", "This is a required field!")
    //   .not()
    //   .isEmpty()
    //   .trim()
    //   .escape(),
    // check("image", "This is a required field!").not().isEmpty().trim().escape(),
  ],
  ProgramController.addData
);

router.post(
  "/edit-programme",
  auth.isAuthorized,
  [
    check("exercise_ids", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("exercise_my_time", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("programme_id", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("programme_name", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    // check("description", "This is a required field!")
    //   .not()
    //   .isEmpty()
    //   .trim()
    //   .escape(),
    // check("image", "This is a required field!").not().isEmpty().trim().escape(),
  ],
  ProgramController.editData
);

router.post(
  "/delete-programme",
  auth.isAuthorized,
  [
    check("programme_id", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
  ],
  ProgramController.deleteData
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

router.post("/add-setting", (req, res) => {
  // console.log(req.body);

  var data = req.body;
  db.collection("app_settings").insertOne(data, function (err, result) {
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

router.post(
  "/add-travis-contact",
  auth.isAuthorized,
  [
    check("user_id", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("name", "This is a required field!").not().isEmpty().trim().escape(),
    check("phone", "This is a required field!").not().isEmpty().trim().escape(),
    check("email", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape()
      .isEmail(),
    check("message", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
  ],
  TravisController.addData
);

router.get("/travis-contacts", auth.isAuthorized, TravisController.getData);

router.post(
  "/global-search",
  auth.isAuthorized,
  [
    check("search", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("type", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape()
      .isIn(["category", "subcategory", "equipment", "exercise", "program"])
      .withMessage("Type mismatch!"),
  ],
  SearchController.searchData
);


router.post(
  "/progress",
  auth.isAuthorized,
  [
    check("user_id", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
  ],
  ExerciseController.getProgressData
);



router.post(
  "/delete-user",
  auth.isAuthorized,
  [
    check("user_id", "This is a required field!")
      .not()
      .isEmpty()
      .trim()
      .escape(),
  ],
  UserController.deleteData
);

module.exports = router;
