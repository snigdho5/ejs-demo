var express = require("express");
var router = express.Router();
var moment = require("moment");
const mongoose = require("mongoose");
const db = mongoose.connection;
const http = require("http");
const path = require("path");
const fs = require("fs");
const mime = require("mime");
const Equipment = require("../../models/api/equipmentModel");
// const helper = require("../helpers/helper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokenSecret = "a2sd#Fs43d4G3524Kh";
const rounds = 10;
const dateTime = moment().format("YYYY-MM-DD h:mm:ss");
const auth = require("../../middlewares/auth");
const { check, validationResult } = require("express-validator");
const url = require("url");
var ObjectId = require("mongodb").ObjectId;

//methods
exports.getData = async function (req, res, next) {
  // Validate request parameters, queries using express-validator

  Equipment.find().then((equipment) => {
    if (!equipment) {
      res.status(404).json({
        status: "0",
        message: "Not found!",
        respdata: {},
      });
    } else {
      res.status(200).json({
        status: "1",
        message: "Found!",
        respdata: equipment,
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

  Equipment.findOne({ _id: req.body.equipment_id }).then((equipment) => {
    if (!equipment) {
      res.status(404).json({
        status: "0",
        message: "Not found!",
        respdata: {},
      });
    } else {
      res.status(200).json({
        status: "1",
        message: "Found!",
        respdata: equipment,
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

  Equipment.findOne({ name: req.body.equipment_name }).then((equipment) => {
    if (equipment) {
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

      const newCat = Equipment({
        name: req.body.equipment_name,
        description: req.body.description,
        image: image_url,
        added_dtime: dateTime,
      });

      newCat
        .save()
        .then((equipment) => {
          res.status(200).json({
            status: "1",
            message: "Added!",
            respdata: equipment,
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

  Equipment.findOne({ _id: req.body.equipment_id }).then((equipment) => {
    if (!equipment) {
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
        name: req.body.equipment_name,
        description: req.body.description,
        image: image_url,
        // last_login: dateTime,
      };
      Equipment.findOneAndUpdate(
        { _id: req.body.equipment_id },
        { $set: updData },
        { upsert: true },
        function (err, doc) {
          if (err) {
            throw err;
          } else {
            Equipment.findOne({ _id: req.body.equipment_id }).then(
              (equipment) => {
                res.status(200).json({
                  status: "1",
                  message: "Successfully updated!",
                  respdata: equipment,
                });
              }
            );
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

  Equipment.findByIdAndDelete({ _id: ObjectId(req.body.equipment_id) }).then(
    (equipment) => {
      if (!equipment) {
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
          respdata: equipment,
        });
      }
    }
  );
};
