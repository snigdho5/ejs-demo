var express = require("express");
var router = express.Router();
var moment = require("moment");
const mongoose = require("mongoose");
const db = mongoose.connection;
const http = require("http");
const path = require("path");
const fs = require("fs");
const mime = require("mime");
const Exercise = require("../../models/api/exerciseModel");
// const helper = require("../helpers/helper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokenSecret = "a2sd#Fs43d4G3524Kh";
const rounds = 10;
const dateTime = moment().format("YYYY-MM-DD h:mm:ss");
const auth = require("../../middlewares/auth");
const { check, validationResult } = require("express-validator");
const url = require("url");

//methods
exports.getData = async function (req, res, next) {
  // Validate request parameters, queries using express-validator

  Exercise.find().then((exercise) => {
    if (!exercise) {
      res.status(404).json({
        status: "0",
        message: "Not found!",
        respdata: {},
      });
    } else {
      res.status(200).json({
        status: "1",
        message: "Found!",
        respdata: exercise,
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

  Exercise.findOne({ _id: req.body.exercise_id }).then((exercise) => {
    if (!exercise) {
      res.status(404).json({
        status: "0",
        message: "Not found!",
        respdata: {},
      });
    } else {
      res.status(200).json({
        status: "1",
        message: "Found!",
        respdata: exercise,
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

  Exercise.findOne({ name: req.body.exercise_name }).then((exercise) => {
    if (exercise) {
      res.status(404).json({
        status: "0",
        message: "Already exists!",
        respdata: {},
      });
    } else {
      const requrl = url.format({
        protocol: req.protocol,
        host: req.get("host"),
        // pathname: req.originalUrl,
      });
      var image_url = requrl + "/public/images/no-image.jpg";

      const newCat = Exercise({
        category_ids: req.body.category_ids, //json
        equipment_ids: req.body.equipment_ids, //json
        name: req.body.exercise_name,
        description: req.body.description,
        image: image_url,
        added_dtime: dateTime,
      });

      newCat
        .save()
        .then((exercise) => {
          res.status(200).json({
            status: "1",
            message: "Added!",
            respdata: exercise,
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

  Exercise.findOne({ _id: req.body.exercise_id }).then((exercise) => {
    if (!exercise) {
      res.status(404).json({
        status: "0",
        message: "Not found!",
        respdata: {},
      });
    } else {
      // Category.updateOne({ _id: category._id }, { $set: updData });

      const requrl = url.format({
        protocol: req.protocol,
        host: req.get("host"),
        // pathname: req.originalUrl,
      });
      var image_url = requrl + "/public/images/no-image.jpg";
      
      var updData = {
        category_ids: req.body.category_ids, //json
        equipment_ids: req.body.equipment_ids, //json
        name: req.body.exercise_name,
        description: req.body.description,
        image: image_url,
        // last_login: dateTime,
      };
      Exercise.findOneAndUpdate(
        { _id: req.body.exercise_id },
        { $set: updData },
        { upsert: true },
        function (err, doc) {
          if (err) {
            throw err;
          } else {
            Exercise.findOne({ _id: req.body.exercise_id }).then((exercise) => {
              res.status(200).json({
                status: "1",
                message: "Successfully updated!",
                respdata: exercise,
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

  Exercise.findOne({ _id: req.body.exercise_id }).then((exercise) => {
    if (!exercise) {
      res.status(404).json({
        status: "0",
        message: "Not found!",
        respdata: {},
      });
    } else {
      //delete
      // try {
      Exercise.deleteOne({ _id: req.body.exercise_id });

      Exercise.remove({ _id: req.body.exercise_id });

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
        respdata: exercise,
      });
    }
  });
};
