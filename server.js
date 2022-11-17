const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const nodemailer = require('nodemailer');
var path = require("path");
app.use("/public", express.static(path.join(__dirname, "public")));

app.locals.siteName = "UK Fitness Hub";



//database
const mongoose = require("mongoose");
const dbURI =
  "mongodb+srv://snigdhoU1:MdzrUIxkbf0CGPhW@cluster0.vwhnn.mongodb.net/ukfitness";
// const dbURI = "mongodb://61.16.131.204:27017/ukfitness";

app.use(express.json());

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
mongoose.Promise = global.Promise;

db.on("error", (err) => {
  console.error(err);
});
db.once("open", () => {
  // console.log(db);
  console.log(" DB started successfully");
});

// set the view engine to ejs
// app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");

// adding Helmet to enhance your API's security
app.use(helmet());
// using bodyParser to parse JSON bodies into JS objects
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
// enabling CORS for all requests

// var corsOptions = {
//   origin: "http://dev.solutionsfinder.co.uk/"
// };
// app.use(cors(corsOptions));

// app.options('*', cors());
app.use(cors());
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, PATCH, OPTIONS"
//   );
//   res.setHeader("Cross-origin-Embedder-Policy", "require-corp");
//   res.setHeader("Cross-origin-Opener-Policy", "same-origin");

//   if (req.method === "OPTIONS") {
//     res.sendStatus(200);
//   } else {
//     next();
//   }
// });

// adding morgan to log HTTP requests
app.use(morgan("combined"));

//routes

var routes = require("./src/routes/routes.js");
var web = require("./src/routes/web.js");
var api = require("./src/routes/api.js");

app.use("/", web);
app.use("/api", api);
app.use("/routes", routes); //test

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   var err = new Error("Not Found");
//   err.status = 404;
//   next(err);
// });


//Snigdho Upadhyay
app.listen(port, () => console.log(`App listening on port ${port}!`));
