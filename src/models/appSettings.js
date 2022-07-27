const mongoose = require("mongoose");

const model = mongoose.Schema({
  app_ver: {
    type: String,
    required: true,
  },
  app_name: {
    type: String,
    required: true,
  },
  app_tnc: {
    type: String,
    required: true,
  },
  app_privacy: {
    type: String,
    required: true,
  },
  app_about: {
    type: String,
    required: true,
  },
});

module.exports = new mongoose.model("app_settings", model);
