
const handleProfile = (req, res, db) => {

    const { id } = req.params;
    db.select('*').from('users').where({
        id: id
    }).then(user => {                        // <=== this will give us an array that has all the users where id = id;
        if (user.length) {                    // empty arrays has lenght of 0 so false
            res.json(user[0]);              // <=== we can also do (user) but it will return the whole arry instead of only the 1st user obj.
        } else {
            res.status(400).json("sorry not found")
        }
    }).catch(err => res.status(400).json("error"))

}


module.exports = {
    handleProfile: handleProfile
}