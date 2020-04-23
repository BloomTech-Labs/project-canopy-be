const express = require('express');
const router = express.Router();
const SpeciesModel = require('./species_model.js');

router.post('/', (req, res) => {
    const { scientificName } = req.body
    SpeciesModel.speciesCardInformation(scientificName)
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({Error: err})
        })
});

module.exports = router;