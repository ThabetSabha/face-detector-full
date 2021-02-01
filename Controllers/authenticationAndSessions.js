const jwt = require("jsonwebtoken");
const redis = require("redis");
const redisClient = redis.createClient(process.env.REDIS_URI);

//grabbing JWT_SECRET from .env
if (process.env.NODE_ENV !== "production") require("dotenv").config();

//Removes the provided token from Redis on signout (Clears session)
const handleSignOut = (req, res) => {
  const { authorization } = req.headers;
  return redisClient.del(authorization, (err, reply) => {
    if (err || !reply) {
      res.status(400).json("Error with Redis");
    } else {
      res.status(200).json("success Signing Out");
    }
  });
};

//Checks to see if the user entered a valid username and password or not
const validateEmailAndPassword = (req, db, bcrypt) => {
  const { email, password } = req.body;
  return db
    .select("email", "hash")
    .from("login")
    .where({ email })
    .then((data) => {
      if (data.length) {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if (isValid) {
          return db
            .select("*")
            .from("users")
            .where({ email })
            .then((user) => user[0])
            .catch((err) => Promise.reject("unable to get user"));
        } else {
          Promise.reject("wrong email or password").catch((err) =>
            console.log(err)
          );
        }
      } else {
        Promise.reject("wrong email or password").catch((err) =>
          console.log(err)
        );
      }
    })
    .catch((err) => {
      console.log(err);
      Promise.reject("There is a problem with the database");
    });
};

//Gets the id of the user that sent the jwt
const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers;
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      res.status(400).json("Unauthorized access");
    } else {
      res.status(200).json({ id: reply });
    }
  });
};

//Signs the JWT
const signToken = (payload) => {
  const jwtPayload = { payload };
  return jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: "10h" });
};

//Creates a User Session by calling signToken and then storeTokenInRedis (With a 10h expiration date)
const createSession = async (data) => {
  const token = signToken(data.email);
  try {
    await storeTokenInRedis(token, data.id);
    return { sucess: true, userId: data.id, token };
  } catch (error) {
    console.log(error);
  }
};

const storeTokenInRedis = async (token, id) => {
  try {
    let data = await redisClient.set(token, id);
    redisClient.expire(token, 10*60*60);
    return data;
  } catch (error) {
    console.log(error);
  }
};

//if the req has a jwt checks if it's valid, else checks if username & password are valid and creates a new session.
const handleSignInAuthentiaction = (req, res, db, bcrypt) => {
  const { authorization } = req.headers;
  return authorization
    ? getAuthTokenId(req, res)
    : validateEmailAndPassword(req, db, bcrypt)
        .then((data) => {
          const { email, id } = data;
          return id && email
            ? createSession(data)
            : Promise.reject(data)
                .then((session) => res.json(session))
                .catch((err) => res.status(400).json(err));
        })
        .then((session) => res.status(200).json({ ...session }))
        .catch((err) => {
          console.log(err);
          res.status(400).json("error creating user Session");
        });
};

module.exports = {
  handleSignInAuthentiaction: handleSignInAuthentiaction,
  redisClient: redisClient,
  handleSignOut: handleSignOut,
};
