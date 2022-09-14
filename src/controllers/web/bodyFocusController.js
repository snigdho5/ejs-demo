var express = require("express");
var router = express.Router();
var moment = require("moment");
const mongoose = require("mongoose");
const db = mongoose.connection;
const http = require("http");
const path = require("path");
const fs = require("fs");
const mime = require("mime");
const Users = require("../../models/web/usersModel");
// const helper = require("../helpers/helper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokenSecret = "a2sd#Fs43d4G3524Kh";
const rounds = 10;
const dateTime = moment().format("YYYY-MM-DD h:mm:ss");
const auth = require("../../middlewares/auth");
// var { getAllActiveSessions } = require("../../middlewares/redis");
const { check, validationResult } = require("express-validator");
// var uuid = require("uuid");
var crypto = require("crypto");
var randId = crypto.randomBytes(20).toString("hex");
const multer = require("multer");

//functions
function generateToken(user) {
  return jwt.sign({ data: user }, tokenSecret, { expiresIn: "24h" });
}

//methods
exports.getBodyFocus = async function (req, res, next) {
  // Validate request parameters, queries using express-validator

  var pageTitle = req.app.locals.siteName + " - Body Focus List";

//   Users.find().then((users) => {
    res.render("pages/body-focus/list", {
        siteName: req.app.locals.siteName,
        pageTitle: pageTitle,
        userFullName: req.session.user.name,
        userImage: req.session.user.image_url,
        userEmail: req.session.user.email,
        year: moment().format("YYYY"),
        requrl: req.app.locals.requrl,
        status: 0,
        message: "found!",
        respdata: {},
      });
//   });
};

exports.addBodyFocus = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
  
    var pageTitle = req.app.locals.siteName + " - Add Body Focus";

  //   Users.find().then((users) => {
      res.render("pages/body-focus/create", {
          siteName: req.app.locals.siteName,
          pageTitle: pageTitle,
          userFullName: req.session.user.name,
          userImage: req.session.user.image_url,
          userEmail: req.session.user.email,
          year: moment().format("YYYY"),
          requrl: req.app.locals.requrl,
          status: 0,
          message: "found!",
          respdata: {},
        });
  //   });
  };

