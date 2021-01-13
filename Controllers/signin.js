
const handleSignIn = (req, res, db, bcrypt) => {

    const { email, password } = req.body;
    db.select('email', 'hash').from('login')
        .where({ email: email })
        .then(data => {
            if (data.length) {
                const isValid = bcrypt.compareSync(password, data[0].hash);
                if (isValid) {
                    return db.select('*')
                        .from('users')
                        .where({ email: data[0].email })
                        .then(user => res.json(user[0]))
                        .catch(err => res.status(400).json("unable to get user"))

                } else {
                    res.status(400).json("wrong email or password")
                }
            } else { res.status(404).json("wrong email or password") }
        })

}


module.exports = {
    handleSignIn: handleSignIn
}