const express = require('express');
const router = express.Router();
const Th_s_model = require("./th_s_model");


router.get('/CountryClassCounts', (req, res) => {
    // this array is the list of countries that Project Canpopy is focusing on as of the first version of the PVD Prodived by Misha. The names and spellings match how they are inputted in the database
    const crbArry = ['Cameroon', 'Congo, The Democratic Republic of the', 'Gabon', 'Congo', 'Central African Republic', 'Equatorial Guinea'];

    let arry = [];

    function promiseCheck(res, arry, crbArry){
        if(arry.length === crbArry.length){
            res.status(200).json(arry)
        }
    }
    
    crbArry.map(country => {
        // The classCountByCountry model takes a country parameter and returns an object that contains "country" and "counts" keys. The value of the "counts" key is an array of objects that contain the taxonmic class and the amount of times that that class has been assessed as threatened.
        Th_s_model.classCountByCountry(country)
            .then(data => {
                // the promiseCheck function is used to work around issues around .map/looping with promises. The promiseCheck function checks to make sure that all of the promises have been resolved before sending the response.
                arry.push(data)
                promiseCheck(res, arry, crbArry)
            })
            .catch(err => {
                res.status(500).json({"error": err})
            })
    })
})
router.get('/habitatClassCount', (req, res) => {
    // This array contains the codes associated with habitats the Project Canopy wishes to focus on
    const habitatCodes = [1.5, 1.6, 1.7, 1.8, 1.9, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 14.6];

    let arry = [];

    function promiseCheck(res, arry, habitatCodes){
        if(arry.length === habitatCodes.length){
            res.status(200).json(arry)
        }
    }

    // Th_s_model.classCountByHabitat(1.5)
    //     .then(data => {
    //         res.status(200).json(data)
    //     })
    //     .catch(err => {
    //         console.log(err)
    //         res.status(500).json(err)
    //     })

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
})


module.exports = router;


