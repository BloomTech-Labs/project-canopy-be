const express = require('express');
const router = express.Router();
const Th_s_model = require("./th_s_model");

router.get('/CountryClassCounts', (req, res) => {
    Th_s_model.classCountByCountry()
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(500).json({"error": err})
        })
});

router.get('/allcountryclasscount', (req, res) => {
    Th_s_model.allClassCountByCountry()
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({"error": err})
        })
});

router.get('/habitatClassCount', (req, res) => {
    Th_s_model.classCountByHabitat()
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(500).json({"error": err})
        })
});

router.get('/classCount', (req, res) => {
    Th_s_model.classCountCRB()
        .then(data => {
            const threatenedCounts = data
            Th_s_model.allClassCountCRB()
                .then(allData => {
                    res.status(200).json({
                        threatenedCounts,
                        allSpeciesCounts: allData
                    })
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({"error": err})
        })
});

module.exports = router;


