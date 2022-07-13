var express = require("express");
var router = express.Router();
var moment = require("moment");
const mongoose = require("mongoose");
const db = mongoose.connection;
const Users = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokenSecret = "a2sd#Fs43d4G3524Kh";
const rounds = 10;

// middleware that is specific to this router
// router.use(function timeLog(req, res, next) {
//   console.log("Time: ", Date.now());
//   next();
// });

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

//actual apis

router.get("/", function (req, res) {
  res.status(401).json({
    status: "0",
    message: "401 - Unauthorised!",
    respdata: {},
  });
});

router.get("/users", (req, res) => {
  db.collection("users")
    .find()
    .toArray(function (err, results) {
      res.status(200).json({
        status: "1",
        message: "Found!",
        respdata: results,
      });
    });
});

router.get("/countries", (req, res) => {
  db.collection("mt_country")
    .find()
    .toArray(function (err, results) {
      res.status(200).json({
        status: "1",
        message: "Found!",
        respdata: results,
      });
    });
});

router.post("/signup", (req, res) => {
  bcrypt.hash(req.body.password, rounds, (error, hash) => {
    if (error) {
      res.status(400).json({
        status: "0",
        message: "Error!",
        respdata: error,
      });
    } else {
      // const token = generateToken(req.body);
      const newUser = Users({
        email: req.body.email,
        password: hash,
        token: "na",
        title: req.body.title,
        name: req.body.name,
        age: req.body.age,
        weight: req.body.weight,
        height: req.body.height,
        country: req.body.country,
        country_code: req.body.country_code,
        country: req.body.country,
        goal: req.body.goal,
        hear_from: req.body.hear_from,
      });
      newUser
        .save()
        .then((user) => {
          res.status(200).json({
            status: "1",
            message: "Added!",
            respdata: user,
          });
        })
        .catch((error) => {
          res.status(400).json({
            status: "0",
            message: "Error!",
            respdata: error,
          });
        });
    }
  });
});

router.post("/login", (req, res) => {
  Users.findOne({ email: req.body.email }).then((user) => {
    if (!user)
      res.status(404).json({
        status: "0",
        message: "User not found!",
        respdata: {},
      });
    else {
      bcrypt.compare(req.body.password, user.password, (error, match) => {
        if (error) {
          res.status(400).json({
            status: "0",
            message: "Error!",
            respdata: error,
          });
        } else if (match) {
          Users.updateOne({ _id: user._id }, { $set: { token: "na" } });

          Users.findOneAndUpdate(
            { _id: user._id },
            { $set: { token: generateToken(user) } },
            { upsert: true },
            function (err, doc) {
              if (err) {
                throw err;
              } else {
                Users.findOne({ _id: user._id }).then((user) => {
                  res.status(200).json({
                    status: "1",
                    message: "Successful!",
                    respdata: user,
                  });
                });
              }
            }
          );
        } else {
          res.status(400).json({
            status: "0",
            message: "Password does not match!",
            respdata: {},
          });
        }
      });
    }
  });
});

//functions
function generateToken(user) {
  return jwt.sign({ data: user }, tokenSecret, { expiresIn: "24h" });
}

module.exports = router;
