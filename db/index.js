//Import express for db requests
const express = require("express");
const app = express();
const cors = require("cors");

//Prevent cors issues from inter-container communication
app.use(cors());
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

//Set up port
const port = 5000;

// Import models folder
const db = require("./models");

//Set Relationships
db.User.hasMany(db.Message, {
  foreignKey: "User_ID",
}); //Set one to many relationship
db.Message.belongsTo(db.User, {
  foreignKey: "User_ID",
});

db.Session.hasMany(db.Message); //Set one to many relationship
db.Message.belongsTo(db.Session);

db.Poll.hasMany(db.Poll_Question);
db.Poll_Question.belongsTo(db.Poll);

db.Poll_Question.hasMany(db.Poll_Option);
db.Poll_Option.belongsTo(db.Poll_Question);

db.Poll.hasMany(db.Poll_Response);
db.Poll_Response.belongsTo(db.Poll);

//is this right relationship?
// db.Poll_Response.hasOne(db.Poll_Option);

db.Session.hasMany(db.Message);

db.Session.hasMany(db.Enrollment);
db.Enrollment.belongsTo(db.Session);

db.Session.hasMany(db.UnderstandingMeter);
db.UnderstandingMeter.belongsTo(db.Session);

db.Multiple_Choice_Option.belongsTo(db.QuizQuestion);
db.FillInTheBlankOption.belongsTo(db.QuizQuestion);

db.User.hasMany(db.Enrollment);
db.Enrollment.belongsTo(db.User);

db.User.hasMany(db.Session);
db.Session.belongsTo(db.User);

//Sync database tables
db.sequelize.sync({ force: false });

app.get("/word", (req, res) => {
  res.send("Response from the database!");
});

//Start listening for connections
app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});

/**************GET ENDPOINTS**********************/

// Requiring our endpoints
require("./endpoints/session-api.js")(app, db);
require("./endpoints/uMeter-api.js")(app, db);
require("./endpoints/authentication-api.js")(app, db);
require("./endpoints/CreateExitTicket-api.js")(app, db);
require("./endpoints/StudentExitTicket-api.js")(app, db);
require("./endpoints/quiz-api.js")(app, db);
require("./endpoints/messages-api.js")(app, db);
require("./endpoints/poll-api")(app, db);
