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
  title: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  country_code: {
    type: String,
    required: true,
  },
  goal: {
    type: String,
    required: true,
  },
  hear_from: {
    type: String,
    required: true,
  },
  created_dtime: {
    type: String,
    required: true,
  },
  trial_end_date: {
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

module.exports = new mongoose.model("users", model);
