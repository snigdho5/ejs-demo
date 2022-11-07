var express = require("express");
var router = express.Router();
var moment = require("moment");
const mongoose = require("mongoose");
const db = mongoose.connection;
const http = require("http");
const path = require("path");
const fs = require("fs");
const mime = require("mime");
const Program = require("../../models/api/programModel");
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

  Program.find().then((program) => {
    if (!program) {
      res.status(404).json({
        status: "0",
        message: "Not found!",
        respdata: {},
      });
    } else {
      res.status(200).json({
        status: "1",
        message: "Found!",
        respdata: program,
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

  Program.findOne({ _id: req.body.programme_id }).then((program) => {
    if (!program) {
      res.status(404).json({
        status: "0",
        message: "Not found!",
        respdata: {},
      });
    } else {
      res.status(200).json({
        status: "1",
        message: "Found!",
        respdata: program,
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

  Program.findOne({ name: req.body.programme_name }).then((program) => {
    if (program) {
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

      const newPro = Program({
        exercise_ids: req.body.exercise_ids,
        exercise_my_time: req.body.exercise_my_time,
        name: req.body.programme_name,
        description: req.body.description ? req.body.description : "na",
        image: image_url,
        added_dtime: dateTime,
      });

      newPro
        .save()
        .then((program) => {
          res.status(200).json({
            status: "1",
            message: "Added!",
            respdata: program,
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

  Program.findOne({ _id: req.body.programme_id }).then((program) => {
    if (!program) {
      res.status(404).json({
        status: "0",
        message: "Not found!",
        respdata: {},
      });
    } else {
      // Program.updateOne({ _id: category._id }, { $set: updData });

      const requrl = url.format({
        protocol: req.protocol,
        host: req.get("host"),
        // pathname: req.originalUrl,
      });
      var image_url = requrl + "/public/images/no-image.jpg";
      var updData = {
        exercise_ids: req.body.exercise_ids,
        exercise_my_time: req.body.exercise_my_time,
        name: req.body.programme_name,
        description: req.body.description ? req.body.description : '',
        image: image_url,
        // last_login: dateTime,
      };
      Program.findOneAndUpdate(
        { _id: req.body.programme_id },
        { $set: updData },
        { upsert: true },
        function (err, doc) {
          if (err) {
            throw err;
          } else {
            Program.findOne({ _id: req.body.programme_id }).then((program) => {
              res.status(200).json({
                status: "1",
                message: "Successfully updated!",
                respdata: program,
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

  Program.findOne({ _id: req.body.programme_id }).then((program) => {
    if (!program) {
      res.status(404).json({
        status: "0",
        message: "Not found!",
        respdata: {},
      });
    } else {
      //delete
      // try {
      Program.deleteOne({ _id: req.body.programme_id });

      Program.remove({ _id: req.body.programme_id });

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
        respdata: program,
      });
    }
  });
};
