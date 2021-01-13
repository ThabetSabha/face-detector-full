const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcryptjs');


const path = require("path");
const compression = require('compression');
const enforce = require('express-sslify');


const register = require('./Controllers/register');
const signin = require('./Controllers/signin');
const profile = require('./Controllers/profile');
const image = require('./Controllers/image');


const db = knex(
  {   //from their website http://knexjs.org/ .
    client: 'pg',
    connection: process.env.DATABASE_URL,
    ssl: true,
  }
)




const app = express();
const port = process.env.PORT || 5000;

app.use(cors())

app.use(express.json());


if (process.env.NODE_ENV === 'production') {
  app.use(compression());
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
  })
}



//Register
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })        //<== this is called dependencies injection!


//sign in
app.post('/signin', (req, res) => { signin.handleSignIn(req, res, db, bcrypt) })


//Profile
app.post('/profile/:id', (req, res) => { profile.handleProfile(req, res, db) })


//Image (to return entries)
app.put('/image', (req, res) => { image.handleImage(req, res, db) })

//ImageURL (to return facebox)
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })





app.listen(port, error => {
  if (error) throw error;
  console.log("Server running on port" + port);
})