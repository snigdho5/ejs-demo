const mongoose = require("mongoose");

const model = mongoose.Schema({
  exercise_ids: {
    type: String,
    required: true,
  },
  exercise_my_time: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    // required: true,
  },
  image: {
    type: String,
    required: true,
  },
  added_dtime: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  exc_type: {
    type: String,
    required: true,
  },
});

module.exports = new mongoose.model("mt_programs", model);
