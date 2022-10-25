var express = require("express");
var router = express.Router();
var moment = require("moment");
const mongoose = require("mongoose");
const db = mongoose.connection;
const http = require("http");
const path = require("path");
const fs = require("fs");
const mime = require("mime");
const Category = require("../../models/api/categoryModel");
const Equipment = require("../../models/api/equipmentModel");
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
const request = require('request')

//methods

exports.getData = async function (req, res, next) {
  // Validate request parameters, queries using express-validator

  var pageTitle = req.app.locals.siteName + " - Exercise List";

  Category.find().then((category) => {
    res.render("pages/exercise/list", {
      siteName: req.app.locals.siteName,
      pageTitle: pageTitle,
      userFullName: req.session.user.name,
      userImage: req.session.user.image_url,
      userEmail: req.session.user.email,
      year: moment().format("YYYY"),
      requrl: req.app.locals.requrl,
      status: 0,
      message: "found!",
      respdata: {
        list: category,
      },
    });
  });
};

exports.addData = async function (req, res, next) {
  var pageTitle = req.app.locals.siteName + " - Add Exercise";

  Category.find().then((category) => {
    Equipment.find().then((equipment) => {
      res.render("pages/exercise/create", {
        siteName: req.app.locals.siteName,
        pageTitle: pageTitle,
        userFullName: req.session.user.name,
        userImage: req.session.user.image_url,
        userEmail: req.session.user.email,
        year: moment().format("YYYY"),
        requrl: req.app.locals.requrl,
        status: 0,
        message: "found!",
        respdata: {
          category: category,
          equipment: equipment,
        },
      });
    });
  });

};



exports.createData = async function (req, res, next) {
  var pageName = "Sub Filter";
  var pageTitle = req.app.locals.siteName + " - Add " + pageName;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render("pages/sub-filter/create", {
      status: 0,
      siteName: req.app.locals.siteName,
      userFullName: req.session.user.name,
      userImage: req.session.user.image_url,
      userEmail: req.session.user.email,
      pageName: pageName,
      pageTitle: pageTitle,
      year: moment().format("YYYY"),
      message: "Validation error!",
      requrl: req.app.locals.requrl,
      respdata: errors.array(),
    });
  }

  SubCategory.findOne({ name: req.body.sub_filter }).then((subCategory) => {
    if (subCategory) {
      res.render("pages/sub-filter/create", {
        status: 0,
        siteName: req.app.locals.siteName,
        userFullName: req.session.user.name,
        userImage: req.session.user.image_url,
        userEmail: req.session.user.email,
        pageName: pageName,
        pageTitle: pageTitle,
        year: moment().format("YYYY"),
        message: "Already exists!",
        requrl: req.app.locals.requrl,
        respdata: {},
      });
    } else {
      var image_url = req.app.locals.requrl + "/public/images/no-image.jpg";
      // console.log(image_url);

      const newCat = SubCategory({
        category_id: req.body.body_focus,
        name: req.body.sub_filter,
        description: req.body.description,
        image: image_url,
        added_dtime: dateTime,
      });

      newCat
        .save()
        .then((subCategory) => {
          res.render("pages/sub-filter/create", {
            status: 0,
            siteName: req.app.locals.siteName,
            pageName: pageName,
            pageTitle: pageTitle,
            userFullName: req.session.user.name,
            userImage: req.session.user.image_url,
            userEmail: req.session.user.email,
            year: moment().format("YYYY"),
            message: "Added!",
            requrl: req.app.locals.requrl,
            respdata: subCategory,
          });
        })
        .catch((error) => {
          res.render("pages/sub-filter/create", {
            status: 0,
            pageName: pageName,
            siteName: req.app.locals.siteName,
            userFullName: req.session.user.name,
            userImage: req.session.user.image_url,
            userEmail: req.session.user.email,
            pageTitle: pageTitle,
            year: moment().format("YYYY"),
            requrl: req.app.locals.requrl,
            message: "Error!",
            respdata: error,
          });
        });
    }
  });
};
