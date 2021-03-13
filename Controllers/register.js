const handleRegister = (req, res, db, bcrypt) => {
  const { email, password, name, avatars3key } = req.body;
  if (email.length !== 0 && name.length !== 0 && password.length !== 0) {
    const hash = bcrypt.hashSync(password);
    db.transaction((trx) => {
      trx
        .insert({ email: email, hash: hash })
        .into("login")
        .returning("email") //try to switch order
        .catch((err) => res.json("email already exists"))
        .then((loginEmail) => {
          return trx("users")
            .insert({
              email: loginEmail[0],
              name: name,
              joined: new Date(),
              avatars3key,
            })
            .returning("*")

            .then((user) => res.json(user[0]));
        })

        .then(trx.commit)
        .catch((err) => {
          trx.rollback();
          console.log(err);
          res.status(500).json("error with db.");
        });
    });
  } else {
    return res.status(400).json("Unable to register");
  }
};

module.exports = {
  handleRegister: handleRegister,
};
