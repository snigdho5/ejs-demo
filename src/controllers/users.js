var express = require("express");
var router = express.Router();
var moment = require("moment");
const mongoose = require("mongoose");
const db = mongoose.connection;
const Users = require("../models/users");
// const helper = require("../helpers/helper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokenSecret = "a2sd#Fs43d4G3524Kh";
const rounds = 10;
const dateTime = moment().format("YYYY-MM-DD h:mm:ss");
const auth = require('../middlewares/auth');

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