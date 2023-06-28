const mongoose = require("mongoose");

const model = mongoose.Schema({
  category_id: {
    type: String,
    required: true,
  },
  sub_category_ids: {
    type: String,
    required: true,
  },
  equipment_ids: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  added_dtime: {
    type: String,
    required: true,
  },
  default_time: {
    type: String,
    required: true,
  },
  video_url: {
    type: String,
    required: true,
  },
  weight: {
    type: String,
    required: true,
  },
  weight_unit: {
    type: String,
    required: true,
  },
  reps: {
    type: String,
    required: true,
  },
  sets: {
    type: String,
    required: true,
  },
  break: {
    type: String,
    required: true,
  },
});

module.exports = new mongoose.model("mt_exercises", model);
