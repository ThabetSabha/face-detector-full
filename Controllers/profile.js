const handleProfileGet = (req, res, db) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({
      id: id,
    })
    .then((user) => {
      // <=== this will give us an array that has all the users where id = id;
      if (user.length) {
        // empty arrays has lenght of 0 so false
        res.json(user[0]); // <=== we can also do (user) but it will return the whole arry instead of only the 1st user obj.
      } else {
        res.status(400).json("sorry not found");
      }
    })
    .catch((err) => res.status(400).json("error"));
};

const handleProfileUpdate = (req, res, db) => {
  const { id } = req.params;
  const { name, avatars3key } = req.body.formInput;
  if (!name && !avatars3key) {
    return res.status(400).json("nothing to update");
  }

  const updatedInfo =
    name && avatars3key
      ? { name, avatars3key }
      : name
      ? { name }
      : { avatars3key };

  db("users")
    .where({ id })
    .update(updatedInfo)
    .then((resp) => {
      if (resp) {
        res.status(200).json("success");
      } else {
        res.status(400).json("unable to update");
      }
    })
    .catch((err) => res.status(400).json("error updating user in db"));
};

module.exports = {
  handleProfileGet: handleProfileGet,
  handleProfileUpdate: handleProfileUpdate,
};
