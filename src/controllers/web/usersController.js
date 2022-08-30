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
var { getAllActiveSessions } = require("../../middlewares/redis");
const { check, validationResult } = require("express-validator");
const url = require("url");
// var uuid = require("uuid");
var crypto = require("crypto");
var randId = crypto.randomBytes(20).toString("hex");
const multer = require("multer");

//functions
function generateToken(user) {
  return jwt.sign({ data: user }, tokenSecret, { expiresIn: "24h" });
}

//methods
exports.getUsers = async function (req, res, next) {
  // Validate request parameters, queries using express-validator

  Users.find().then((users) => {
    res.status(200).json({
      status: "1",
      message: "Found!",
      respdata: users,
    });
  });
};

exports.signUp = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "0",
      message: "Validation error!",
      respdata: errors.array(),
    });
  }

  bcrypt.hash(req.body.password, rounds, (error, hash) => {
    if (error) {
      res.status(400).json({
        status: "0",
        message: "Error!",
        respdata: error,
      });
    } else {
      // const token = generateToken(req.body);

      Users.findOne({ email: req.body.email }).then((user) => {
        if (!user) {
          const newUser = Users({
            email: req.body.email,
            password: hash,
            token: "na",
            name: req.body.name,
            last_login: "na",
            created_dtime: dateTime,
            image: "na",
          });

          newUser
            .save()
            .then((user) => {
              res.status(200).json({
                status: "1",
                message: "Added!",
                respdata: user,
              });
            })
            .catch((error) => {
              res.status(400).json({
                status: "0",
                message: "Error!",
                respdata: error,
              });
            });
        } else {
          res.status(400).json({
            status: "0",
            message: "User already exists!",
            respdata: {},
          });
        }
      });
    }
  });
};

exports.getLogin = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var pageTitle = req.app.locals.siteName + " - Login";
    res.render("pages/login", {
      status: 0,
      siteName: req.app.locals.siteName,
      pageTitle: pageTitle,
      moment: moment,
      message: "Validation error!",
      respdata: errors.array(),
    });
  }

  var pageTitle = req.app.locals.siteName + " - Dashboard";

  Users.findOne({ email: req.body.email }).then((user) => {
    if (!user)
      res.render("pages", {
        status: 0,
        siteName: req.app.locals.siteName,
        pageTitle: pageTitle,
        moment: moment,
        message: "User not found!",
        respdata: {},
      });
    else {
      bcrypt.compare(req.body.password, user.password, (error, match) => {
        if (error) {
          res.render("pages", {
            status: 0,
            siteName: req.app.locals.siteName,
            pageTitle: pageTitle,
            moment: moment,
            message: "Error!",
            respdata: error,
          });
        } else if (match) {
          // delete user.token;
          // Users.updateOne({ _id: user._id }, { $set: { token: "na" } });

          const userToken = {
            userId: user._id,
            email: user.email,
            password: user.password,
          };

          Users.findOneAndUpdate(
            { _id: user._id },
            { $set: { token: generateToken(userToken), last_login: dateTime } },
            { upsert: true },
            function (err, doc) {
              if (err) {
                throw err;
              } else {
                Users.findOne({ _id: user._id }).then((user) => {
                  req.session.user = { email: user.email, name: user.name };

                  const sessions = getAllActiveSessions();
                  // let users = sessions.map(session => {
                  //     return session.user
                  // });
                  // res.locals.users = sessions.user;
                  console.log(sessions);

                  res.redirect('/dashboard');
                });
              }
            }
          );
        } else {
          res.render("pages", {
            status: 0,
            siteName: req.app.locals.siteName,
            pageTitle: pageTitle,
            moment: moment,
            message: "Password does not match!",
            respdata: {},
          });
        }
      });
    }
  });
};

exports.getProfile = async function (req, res, next) {
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
      // console.log('%s %s %s', req.method, req.url, req.path);
      user.image = req.baseUrl + "/images/" + "test.jpg";
      res.status(400).json({
        status: "1",
        message: "Detalis Found!",
        respdata: user,
      });
    }
  });
};

exports.editProfile = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "0",
      message: "Validation error!",
      respdata: errors.array(),
    });
  }

  Users.findOne({ _id: req.body.user_id }).then((user) => {
    if (!user)
      res.status(404).json({
        status: "0",
        message: "User not found!",
        respdata: {},
      });
    else {
      // Users.updateOne({ _id: user._id }, { $set: updData });

      // bcrypt.hash(req.body.password, rounds, (error, hash) => {
      var updData = {
        // email: req.body.email,
        // password: hash,
        title: req.body.title,
        name: req.body.name,
        age: req.body.age,
        weight: req.body.weight,
        height: req.body.height,
        country: req.body.country,
        country_code: req.body.country_code,
        country: req.body.country,
        goal: req.body.goal,
        hear_from: req.body.hear_from,
        // last_login: dateTime,
      };
      Users.findOneAndUpdate(
        { _id: req.body.user_id },
        { $set: updData },
        { upsert: true },
        function (err, doc) {
          if (err) {
            throw err;
          } else {
            Users.findOne({ _id: req.body.user_id }).then((user) => {
              res.status(200).json({
                status: "1",
                message: "Successfully updated!",
                respdata: user,
              });
            });
          }
        }
      );
      // });
    }
  });
};

exports.uploadImage = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "0",
      message: "Validation error!",
      respdata: errors.array(),
    });
  }

  Users.findOne({ _id: req.body.user_id }).then((user) => {
    if (!user)
      res.status(404).json({
        status: "0",
        message: "User not found!",
        respdata: {},
      });
    else {
      const imgData = req.body.img_base64;
      const folderPath = "./public/images/";
      // const decodedImg = decodeBase64Image(imgData);
      // console.log("new3::::::");
      // console.log(decodedImg);
      // if (decodedImg) {
      //   const imageBuffer = decodedImg.data;
      //   const type = decodedImg.type;
      //   const extension = mime.extension(type);

      //   const path = "user-image-" + randId + "." + extension;
      //   // const path = "user-image-" + uuid.v4() + extension;

      //   try {
      //     fs.writeFileSync(folderPath + path, imageBuffer, "utf8");
      //     // fs.readFileSync(img_base64, {encoding: 'base64'});
      //   } catch (err) {
      //     console.error(err);
      //   }
      // }
      const path = Date.now() + ".png";
      // const base64Data = imgData.replace(/^data:([A-Za-z-+/]+);base64,/, "");

      // fs.writeFileSync(path, base64Data, { encoding: "base64" });

      fs.writeFileSync(folderPath + path, imgData, "base64", function (err) {
        console.log(err);
      });

      const requrl = url.format({
        protocol: req.protocol,
        host: req.get("host"),
        // pathname: req.originalUrl,
      });

      var image_url = requrl + "/public/images/" + path;

      var updData = {
        // email: req.body.email,
        image: image_url,
      };
      Users.findOneAndUpdate(
        { _id: req.body.user_id },
        { $set: updData },
        { upsert: true },
        function (err, doc) {
          if (err) {
            throw err;
          } else {
            Users.findOne({ _id: req.body.user_id }).then((user) => {
              res.status(200).json({
                status: "1",
                message: "Successful!",
                respdata: user,
              });
            });
          }
        }
      );
    }
  });
};

exports.getLogout = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "0",
      message: "Validation error!",
      respdata: errors.array(),
    });
  }

  Users.findOne({ _id: req.body.user_id }).then((user) => {
    if (!user)
      res.status(404).json({
        status: "0",
        message: "User not found!",
        respdata: {},
      });
    else {
      // Users.updateOne({ _id: user._id }, { $set: updData });

      var updData = {
        token: "na",
        last_logout: dateTime,
      };
      Users.findOneAndUpdate(
        { _id: req.body.user_id },
        { $set: updData },
        { upsert: true },
        function (err, doc) {
          if (err) {
            throw err;
          } else {
            Users.findOne({ _id: req.body.user_id }).then((user) => {
              res.status(200).json({
                status: "1",
                message: "Successfully logged out!",
                respdata: user,
              });
            });
          }
        }
      );
    }
  });
};

exports.changePassword = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "0",
      message: "Validation error!",
      respdata: errors.array(),
    });
  }

  Users.findOne({ _id: req.body.user_id }).then((user) => {
    if (!user)
      res.status(404).json({
        status: "0",
        message: "User not found!",
        respdata: {},
      });
    else {
      // Users.updateOne({ _id: user._id }, { $set: updData });

      bcrypt.compare(req.body.old_password, user.password, (error, match) => {
        if (error) {
          res.status(400).json({
            status: "0",
            message: "Error!",
            respdata: error,
          });
        } else if (match) {
          bcrypt.compare(
            req.body.new_password,
            user.password,
            (error, match) => {
              if (error) {
                res.status(400).json({
                  status: "0",
                  message: "Error!",
                  respdata: error,
                });
              } else if (!match) {
                bcrypt.hash(req.body.new_password, rounds, (error, hash) => {
                  var updData = {
                    password: hash,
                    // last_login: dateTime,
                  };
                  Users.findOneAndUpdate(
                    { _id: req.body.user_id },
                    { $set: updData },
                    { upsert: true },
                    function (err, doc) {
                      if (err) {
                        throw err;
                      } else {
                        Users.findOne({ _id: req.body.user_id }).then(
                          (user) => {
                            res.status(200).json({
                              status: "1",
                              message: "Successfully updated!",
                              respdata: user,
                            });
                          }
                        );
                      }
                    }
                  );
                });
              } else {
                res.status(400).json({
                  status: "0",
                  message: "New password cannot be same as your Old password!",
                  respdata: {},
                });
              }
            }
          );
        } else {
          res.status(400).json({
            status: "0",
            message: "Old password does not match!",
            respdata: {},
          });
        }
      });
    }
  });
};
