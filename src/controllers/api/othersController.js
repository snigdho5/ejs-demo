var express = require("express");
var router = express.Router();
var moment = require("moment");
const mongoose = require("mongoose");
const db = mongoose.connection;
const Users = require("../../models/api/userModel");
const AppSettings = require("../../models/api/appSettings");
// const helper = require("../helpers/helper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokenSecret = "a2sd#Fs43d4G3524Kh";
const rounds = 10;
const dateTime = moment().format("YYYY-MM-DD h:mm:ss");
const auth = require("../../middlewares/auth");
const { check, validationResult } = require("express-validator");

exports.getCountries = async function (req, res, next) {
  // Validate request parameters, queries using express-validator

  db.collection("mt_country")
    .find()
    .toArray(function (err, results) {
      return res.status(200).json({
        status: "1",
        message: "Found!",
        respdata: results,
      });
    });
};


exports.getSetting = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "0",
      message: "Validation error!",
      respdata: errors.array(),
    });
  }

  Users.findOne({ _id: req.body.user_id }).then((user) => {
    if (!user) {
      res.status(400).json({
        status: "0",
        message: "User does not exist!",
        respdata: {},
      });
    } else {
      AppSettings.find({})
        .sort({ _id: 1 })
        .then((sett) => {
          if (!sett) {
            res.status(400).json({
              status: "0",
              message: "Settings not found!",
              respdata: {},
            });
          } else {
            res.status(400).json({
              status: "1",
              message: "Detalis Found!",
              respdata: sett,
            });
          }
        });
    }
  });
};

