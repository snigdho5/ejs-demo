var express = require("express");
var router = express.Router();
var moment = require("moment");
const mongoose = require("mongoose");
const db = mongoose.connection;
const http = require("http");
const path = require("path");
const fs = require("fs");
const mime = require("mime");
const Category = require("../models/categoryModel");
// const helper = require("../helpers/helper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokenSecret = "a2sd#Fs43d4G3524Kh";
const rounds = 10;
const dateTime = moment().format("YYYY-MM-DD h:mm:ss");
const auth = require("../middlewares/auth");
const { check, validationResult } = require("express-validator");

//methods
exports.getData = async function (req, res, next) {
  // Validate request parameters, queries using express-validator

  Category.find().then((category) => {
    if (!category) {
      res.status(404).json({
        status: "0",
        message: "Not found!",
        respdata: {},
      });
    } else {
      res.status(200).json({
        status: "1",
        message: "Found!",
        respdata: category,
      });
    }
  });
};

exports.viewData = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "0",
      message: "Validation error!",
      respdata: errors.array(),
    });
  }

  Category.findOne({ _id: req.body.category_id }).then((category) => {
    if (!category) {
      res.status(404).json({
        status: "0",
        message: "Not found!",
        respdata: {},
      });
    } else {
      res.status(200).json({
        status: "1",
        message: "Found!",
        respdata: category,
      });
    }
  });
};

exports.addData = async function (req, res, next) {
  // Validate request parameters, queries using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "0",
      message: "Validation error!",
      respdata: errors.array(),
    });
  }

  Category.findOne({ name: req.body.category_name }).then((category) => {
    if (category) {
      res.status(404).json({
        status: "0",
        message: "Already exists!",
        respdata: {},
      });
    } else {
      const newCat = Category({
        name: req.body.category_name,
        added_dtime: dateTime,
      });

      newCat
        .save()
        .then((category) => {
          res.status(200).json({
            status: "1",
            message: "Added!",
            respdata: category,
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
};

exports.editData = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "0",
      message: "Validation error!",
      respdata: errors.array(),
    });
  }

  Category.findOne({ _id: req.body.category_id }).then((category) => {
    if (!category) {
      res.status(404).json({
        status: "0",
        message: "Not found!",
        respdata: {},
      });
    } else {
      // Category.updateOne({ _id: category._id }, { $set: updData });

      var updData = {
        name: req.body.category_name,
        // last_login: dateTime,
      };
      Category.findOneAndUpdate(
        { _id: req.body.category_id },
        { $set: updData },
        { upsert: true },
        function (err, doc) {
          if (err) {
            throw err;
          } else {
            Category.findOne({ _id: req.body.category_id }).then((category) => {
              res.status(200).json({
                status: "1",
                message: "Successfully updated!",
                respdata: category,
              });
            });
          }
        }
      );
    }
  });
};

exports.deleteData = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "0",
      message: "Validation error!",
      respdata: errors.array(),
    });
  }

  Category.findOne({ _id: req.body.category_id }).then((category) => {
    if (!category) {
      res.status(404).json({
        status: "0",
        message: "Not found!",
        respdata: {},
      });
    } else {
      //delete
      // try {
      Category.deleteOne({ _id: req.body.category_id });

      Category.remove({ _id: req.body.category_id });

      // } catch (e) {
      //   return res.status(404).json({
      //     status: "0",
      //     message: "Error!",
      //     respdata: e,
      //   });
      // }
      res.status(200).json({
        status: "1",
        message: "Deleted!",
        respdata: category,
      });
    }
  });
};
