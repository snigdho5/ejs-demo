var express = require("express");
var router = express.Router();
var moment = require('moment');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});

router.get("/", function (req, res) {
    res.send("Front end!");
});


module.exports = router;
