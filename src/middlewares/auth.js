const jwt = require("jsonwebtoken");
const tokenSecret = "a2sd#Fs43d4G3524Kh";
const mongoose = require("mongoose");
const db = mongoose.connection;
const Users = require("../models/users");

module.exports.isAuthorized = (req, res, next) => {
  try {
    // console.log(req.headers);
    if (req.headers) {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, tokenSecret);
      const email = decodedToken.data.email;

      // console.log(req.body.user_id);

      Users.findOne({ email: email }).then((user) => {
        console.log(user._id);
        console.log(req.body.user_id);
        if (req.body.user_id && req.body.user_id !== user._id) {
          res.status(401).json({
            status: "0",
            message: "Invalid token / user_id!",
            respdata: {},
          });
          // throw "Invalid user ID";
        } else {
          console.log("userId: " + email);
          next();
        }
      });
    }
  } catch {
    console.log("hfghgf: ");
    res.status(401).json({
      status: "0",
      message: "Invalid token!",
      respdata: {},
    });
  }
};
