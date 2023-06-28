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
const SubCategory = require("../../models/api/subCategoryModel");
const Equipment = require("../../models/api/equipmentModel");
const Exercise = require("../../models/api/exerciseModel");
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
var ObjectId = require("mongodb").ObjectId;

//methods

exports.searchData = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "0",
      message: "Validation error!",
      respdata: errors.array(),
    });
  }

  var respDataFinal;

  if (req.body.type == "category") {
    Category.find({ name: new RegExp(req.body.search, "i") }).then(
      (category) => {
        if (!category) {
          respDataFinal = {
            status: "0",
            message: "Not found!",
            type: "category",
            data: {},
          };
        } else {
          respDataFinal = {
            status: "1",
            message: "Found!",
            type: "category",
            data: category,
          };
        }

        res.status(200).json({
          respdata: respDataFinal,
        });
      }
    );
  } else if (req.body.type == "subcategory") {
    SubCategory.find({ name: new RegExp(req.body.search, "i") }).then(
      (subcategory) => {
        if (!subcategory) {
          respDataFinal = {
            status: "0",
            message: "Not found!",
            type: "subcategory",
            data: {},
          };
        } else {
          respDataFinal = {
            status: "1",
            message: "Found!",
            type: "subcategory",
            data: subcategory,
          };
        }
        res.status(200).json({
          respdata: respDataFinal,
        });
      }
    );
  } else if (req.body.type == "equipment") {
    Equipment.find({ name: new RegExp(req.body.search, "i") }).then(
      (equipment) => {
        if (!equipment) {
          respDataFinal = {
            status: "0",
            message: "Not found!",
            type: "equipment",
            data: {},
          };
        } else {
          respDataFinal = {
            status: "1",
            message: "Found!",
            type: "equipment",
            data: equipment,
          };
        }
        res.status(200).json({
          respdata: respDataFinal,
        });
      }
    );
  } else if (req.body.type == "exercise") {
    Exercise.find({ name: new RegExp(req.body.search, "i") }).then(
      (exercise) => {
        if (!exercise) {
          respDataFinal = {
            status: "0",
            message: "Not found!",
            type: "exercise",
            data: {},
          };
        } else {
          respDataFinal = {
            status: "1",
            message: "Found!",
            type: "exercise",
            data: exercise,
          };
        }
        res.status(200).json({
          respdata: respDataFinal,
        });
      }
    );
  } else if (req.body.type == "program") {
    Program.find({ name: new RegExp(req.body.search, "i") }).then((program) => {
      if (!program) {
        respDataFinal = {
          status: "0",
          message: "Not found!",
          type: "program",
          data: {},
        };
      } else {
        respDataFinal = {
          status: "1",
          message: "Found!",
          type: "program",
          data: program,
        };
      }
      res.status(200).json({
        respdata: respDataFinal,
      });
    });
  }
};
