// *********************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
// *********************************************************************************

// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var db = require("./models/index.js");
var requirejs = require('requirejs');



// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));
// parse application/json
app.use(bodyParser.json());

// Static directory
app.use(express.static("public"));

// setting up to use handlebars
var exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Routes
// =============================================================
// require("./routes/api-routes.js")(app);
app.use(require("./routes/html-routes"));
app.use(require("./controllers/triggers_controllers"));

// Starts the server to begin listening
// =============================================================

// Only uncomment Force True if you want to trash the DB
db.sequelize.sync().then(function () {
  app.listen(PORT, function () {
    console.log("app listening on PORT " + PORT);
  });
});