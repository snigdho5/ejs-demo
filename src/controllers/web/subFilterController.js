var express = require("express");
var router = express.Router();
var moment = require("moment");
const mongoose = require("mongoose");
const db = mongoose.connection;
const http = require("http");
const path = require("path");
const fs = require("fs");
const mime = require("mime");
const SubCategory = require("../../models/api/subCategoryModel");
const Category = require("../../models/api/categoryModel");
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

//methods
exports.getData = async function (req, res, next) {
  // Validate request parameters, queries using express-validator

  var pageName = "Sub Filter";
  var pageTitle = req.app.locals.siteName + " - " + pageName + " List";

  SubCategory.aggregate([
    {
      $lookup: {
        from: "mt_categories",
        localField: "category_id",
        foreignField: "_id",
        as: "category_name"
      }
    },
    // {
    //   $unwind: "$category_name"
    // }
  ])
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });

  SubCategory.find().then((subcat) => {
    res.render("pages/sub-filter/list", {
      siteName: req.app.locals.siteName,
      pageName: pageName,
      pageTitle: pageTitle,
      userFullName: req.session.user.name,
      userImage: req.session.user.image_url,
      userEmail: req.session.user.email,
      year: moment().format("YYYY"),
      requrl: req.app.locals.requrl,
      status: 0,
      message: "found!",
      respdata: {
        list: subcat,
      },
    });
  });
};

exports.addData = async function (req, res, next) {
  // Validate request parameters, queries using express-validator

  var pageName = "Sub Filter";
  var pageTitle = req.app.locals.siteName + " - Add " + pageName;

  Category.find().then((category) => {
    res.render("pages/sub-filter/create", {
      siteName: req.app.locals.siteName,
      pageName: pageName,
      pageTitle: pageTitle,
      userFullName: req.session.user.name,
      userImage: req.session.user.image_url,
      userEmail: req.session.user.email,
      year: moment().format("YYYY"),
      requrl: req.app.locals.requrl,
      status: 1,
      message: "found!",
      respdata: {
        category: category,
      },
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

exports.getSubFilterByBodyFocus = async function (req, res, next) {
  // Validate request parameters, queries using express-validator

  SubCategory.find({ category_id: req.body.body_focus }).then(
    (subCategory) => {
      res.status(200).json({
        status: "0",
        message: "found!",
        respdata: {
          subcat: subCategory,
        },
      });
    }
  );
};


exports.editData = async function (req, res, next) {
  // Validate request parameters, queries using express-validator

  var pageName = "Sub Filter";
  var pageTitle = req.app.locals.siteName + " - Edit " + pageName;

  const user_id = mongoose.Types.ObjectId(req.params.id);

  SubCategory.findOne({ _id: user_id }).then((subCategory) => {
    res.render("pages/sub-filter/edit", {
      status: 1,
      siteName: req.app.locals.siteName,
      pageName: pageName,
      pageTitle: pageTitle,
      userFullName: req.session.user.name,
      userImage: req.session.user.image_url,
      userEmail: req.session.user.email,
      year: moment().format("YYYY"),
      requrl: req.app.locals.requrl,
      message: "",
      respdata: subCategory,
    });
  });
};

exports.updateData = async function (req, res, next) {
  var pageName = "Sub Filter";
  var pageTitle = req.app.locals.siteName + " - Edit " + pageName;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render("pages/sub-filter/edit", {
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

  const edit_id = mongoose.Types.ObjectId(req.body.edit_id);
  // console.log(edit_id);

  SubCategory.findOne({ name: req.body.focus_name }).then((subCategory) => {
    if (subCategory) {
      res.render("pages/sub-filter/edit", {
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

      var updData = {
        // name: req.body.focus_name,
        description: req.body.description,
        // image: image_url,
      };
      SubCategory.findOneAndUpdate(
        { _id: edit_id },
        { $set: updData },
        { upsert: true },
        function (err, doc) {
          if (err) {
            throw err;
          } else {
            res.redirect("/edit-sub-filter/" + req.body.edit_id);
            // SubCategory.findOne({ _id: edit_id }).then((subCategory) => {
            //
            // });
          }
        }
      );
    }
  });

};

exports.deleteData = async function (req, res, next) {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({
  //     status: "0",
  //     message: "Validation error!",
  //     respdata: errors.array(),
  //   });
  // }

  const del_id = mongoose.Types.ObjectId(req.params.id);
  // console.log(del_id);

  SubCategory.findOne({ _id: del_id }).then((subCategory) => {
    if (!subCategory) {
      res.status(404).json({
        status: "0",
        message: "Not found!",
        respdata: {},
      });
    } else {
      //delete

      SubCategory.deleteOne({ _id: del_id }, function (err, obj) {
        if (err) throw err;
        res.redirect("/sub-filters");
      });
    }
  });
};
