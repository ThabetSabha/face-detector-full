const Clarifai = require('clarifai');


if (process.env.NODE_ENV !== 'production') require("dotenv").config();

const app = new Clarifai.App({
    apiKey: process.env.CLARIFAI_KEY
});


const handleApiCall = (req, res) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => res.json(data))
        .catch(err => res.status(400).json("can't connect to api!"));
}

const handleImage = (req, res, db) => {

    db('users').where({ id: req.body.id })
        .increment('entries', 1)
        .returning('entries')
        .then(entries => res.json(entries[0]))
        .catch(err => res.status(400).json('error'))
}


module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall,
}