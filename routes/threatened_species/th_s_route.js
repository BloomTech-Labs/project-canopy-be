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
    // This array contains the codes associated with habitats the Project Canopy wishes to focus on
    const habitatCodes = [1.5, 1.6, 1.7, 1.8, 1.9, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 14.6];

    let arry = [];

    function promiseCheck(res, arry, habitatCodes){
        if(arry.length === habitatCodes.length){
            res.status(200).json(arry)
        }
    };
    habitatCodes.map(code => {
        Th_s_model.classCountByHabitat(code)
            .then(data => {
                arry.push(data)
                promiseCheck(res, arry, habitatCodes)
            })
            .catch(err => {
                res.status(500).json({"error": err})
            })
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
router.get('/test', (req, res) => {
    Th_s_model.classCountByHabitat2()
        .then(data => {
             res.status(200).json(data)

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({"error": err})
        })
});


module.exports = router;


