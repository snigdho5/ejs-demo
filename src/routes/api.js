var express = require("express");
var router = express.Router();
var moment = require("moment");

// middleware that is specific to this router
// router.use(function timeLog(req, res, next) {
//   console.log("Time: ", Date.now());
//   next();
// });

router.get("/", function (req, res) {
  res.status(401).json({
    status: "0",
    message: "401 - Unauthorised!",
    respdata: {},
  });
});


router.get("/list", function (req, res) {
  var mascots = [
    { name: "John", organization: "Java", birth_year: 2016 },
    { name: "Smith", organization: "Linux", birth_year: 1995 },
    { name: "Coby", organization: "Docker", birth_year: 2014 },
  ];
  var tagline = "Hello World!";

  res.status(200).json({
    status: "1",
    message: "Details found!",
    respdata: {
      mascots: mascots,
      tagline: tagline,
    },
  });
});



router.get("/books-list", function (req, res) {
    var mascots = [
      { name: "John", organization: "Java", birth_year: 2016 },
      { name: "Smith", organization: "Linux", birth_year: 1995 },
      { name: "Coby", organization: "Docker", birth_year: 2014 },
    ];
    var tagline = "Hello World!";
  
    res.status(200).json({
      status: "1",
      message: "Details found!",
      respdata: {
        mascots: mascots,
        tagline: tagline,
      },
    });
  });

//actual apis

module.exports = router;
