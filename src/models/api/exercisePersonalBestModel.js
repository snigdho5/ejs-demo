const mongoose = require("mongoose");

const model = mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  exercise_id: {
    type: String,
    required: true,
  },
  weight: {
    type: String,
    required: true,
  },
  added_dtime: {
    type: String,
    required: true,
  },
});

module.exports = new mongoose.model("exercise_personal_best", model);
