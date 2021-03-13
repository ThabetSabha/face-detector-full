const express = require("express");
const cors = require("cors");
const knex = require("knex");
const bcrypt = require("bcryptjs");
const morgan = require("morgan");
const helmet = require("helmet");

const path = require("path");
const compression = require("compression");
const enforce = require("express-sslify");

const register = require("./Controllers/register");
const authenticationAndSessions = require("./Controllers/authenticationAndSessions");
const profile = require("./Controllers/profile");
const image = require("./Controllers/image");
const authorization = require("./middleware/authorization");

const db = knex({
  //from their website http://knexjs.org/ .
  client: "pg",
  connection: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const app = express();
const port = process.env.PORT || 5000;

app.use(morgan("tiny"));

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

const corsOptions =
  process.env.NODE_ENV === "production"
    ? {
        origin: "https://demo-face-detector.herokuapp.com/",
        optionsSuccessStatus: 200,
      }
    : {
        origin: "*",
        optionsSuccessStatus: 200,
      };

app.use(cors(corsOptions));

app.use(express.json());

//Register
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
}); //<== this is called dependencies injection!

//sign in
app.post("/signin", (req, res) => {
  authenticationAndSessions.handleSignInAuthentiaction(req, res, db, bcrypt);
});

app.post("/signout", authorization.requireAuth, (req, res) =>
  authenticationAndSessions.handleSignOut(req, res)
);

//Profile
app.get("/profile/:id", authorization.requireAuth, (req, res) => {
  profile.handleProfileGet(req, res, db);
});

app.put("/profile/:id", authorization.requireAuth, (req, res) => {
  profile.handleProfileUpdate(req, res, db);
});

//Image (to return entries)
app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

//ImageURL (to return facebox)
app.post("/imageurl", (req, res) => {
  image.handleApiCall(req, res);
});

if (process.env.NODE_ENV === "production") {
  app.use(compression());
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

app.listen(port, (error) => {
  if (error) throw error;
  console.log("Server running on port" + port);
});
