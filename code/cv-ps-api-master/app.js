// DEPENDENCIES
var express = require("express");
var cors = require('cors');
var bodyParser = require('body-parser');
var router = require("./routes.js");

// CONSTANTS
const port = process.env.PORT || 8080;

// SETUP
var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(router);

app.listen(port, function() {
  console.log("server listening on port " + port);
});
