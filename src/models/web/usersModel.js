const mongoose = require("mongoose");

const model = mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  created_dtime: {
    type: String,
    required: true,
  },
  last_login: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  last_logout: {
    type: String,
    required: true,
  },
});

module.exports = new mongoose.model("admin_users", model);
