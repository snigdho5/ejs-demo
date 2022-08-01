const mongoose = require("mongoose");

const model = mongoose.Schema({
  category_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  added_dtime: {
    type: String,
    required: true,
  },
});

module.exports = new mongoose.model("mt_programs", model);
