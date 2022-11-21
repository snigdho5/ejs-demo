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
const ExPersonalBest = require("../../models/api/exercisePersonalBestModel");
// const helper = require("../helpers/helper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokenSecret = "a2sd#Fs43d4G3524Kh";
const rounds = 10;
const dateTime = moment().format("YYYY-MM-DD h:mm:ss");
const auth = require("../../middlewares/auth");
const { check, validationResult } = require("express-validator");
var ObjectId = require("mongodb").ObjectId;
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
        category_id: req.body.category_id,
        equipment_ids: req.body.equipment_ids,
        sub_category_ids: req.body.sub_category_ids,
        name: req.body.exercise_name,
        description: req.body.description,
        default_time: req.body.default_time,
        video_url: req.body.video_url,
        image: image_url,
        added_dtime: dateTime,
        weight: req.body.weight,
        weight_unit: req.body.weight_unit,
        reps: req.body.reps,
        sets: req.body.sets,
        break: req.body.break,
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

exports.getExerciseData = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "0",
      message: "Validation error!",
      respdata: errors.array(),
    });
  }

  Exercise.find({
    subcategory_id: { $regex: "/," + req.body.category_id + ",/" },
  }).then(
    // Exercise.find({ category_ids: new RegExp("/," + req.body.category_id + ",/") }).then(
    (exercise) => {
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
    }
  );
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
        category_id: req.body.category_id,
        equipment_ids: req.body.equipment_ids,
        sub_category_ids: req.body.sub_category_ids,
        name: req.body.exercise_name,
        description: req.body.description,
        default_time: req.body.default_time,
        video_url: req.body.video_url,
        image: image_url,
        weight: req.body.weight,
        weight_unit: req.body.weight_unit,
        reps: req.body.reps,
        sets: req.body.sets,
        break: req.body.break,
        // edited_dtime: dateTime,
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

  Exercise.findByIdAndDelete({ _id: ObjectId(req.body.exercise_id) }).then(
    (exercise) => {
      if (!exercise) {
        res.status(404).json({
          status: "0",
          message: "Not found!",
          respdata: {},
        });
      } else {
        //delete
        res.status(200).json({
          status: "1",
          message: "Deleted!",
          respdata: exercise,
        });
      }
    }
  );
};

exports.addExPersonalBest = async function (req, res, next) {
  // Validate request parameters, queries using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "0",
      message: "Validation error!",
      respdata: errors.array(),
    });
  }

  ExPersonalBest.findOne({
    user_id: req.body.user_id,
    exercise_id: req.body.exercise_id,
  })
    .sort({ weight: -1 })
    .then((exdata) => {
      // if (exdata) {
      //   res.status(404).json({
      //     status: "0",
      //     message: "Already exists!",
      //     respdata: {},
      //   });
      // } else {
      const newData = ExPersonalBest({
        user_id: req.body.user_id,
        exercise_id: req.body.exercise_id,
        weight: req.body.weight,
        added_dtime: dateTime,
      });

      newData
        .save()
        .then((data) => {
          //get data for personal best
          // ExPersonalBest.findOne({
          //   user_id: req.body.user_id,
          //   exercise_id: req.body.exercise_id,
          // })
          //   .sort({ weight: -1 })
          //   .then((exdata) => {
          // console.log("exdata.weight: " + exdata.weight);
          // console.log("req.body.weight: " + req.body.weight);
          if (!exdata) {
            res.status(404).json({
              status: "0",
              message: "Added!",
              respdata: {
                message: "First time!",
                new_record: false,
                respdata: data,
              },
            });
          } else {
            if (req.body.weight > exdata.weight) {
              res.status(200).json({
                status: "1",
                message: "Added!",
                respdata: {
                  message: "New Record!",
                  new_record: true,
                  respdata: data,
                },
              });
            } else {
              res.status(200).json({
                status: "1",
                message: "Added!",
                respdata: {
                  message: "No new Record!",
                  new_record: false,
                  respdata: data,
                },
              });
            }
          }
          // });
        })
        .catch((error) => {
          res.status(400).json({
            status: "0",
            message: "Error!",
            respdata: error,
          });
        });
      // }
    });
};
