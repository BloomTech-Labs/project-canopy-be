const express = require('express');
const router = express.Router();
const Th_s_model = require("./th_s_model");


router.get('/CountryClassCounts', (req, res) => {
    const crbArry = ['Cameroon', 'Congo, The Democratic Republic of the', 'Gabon', 'Congo', 'Central African Republic', 'Equatorial Guinea'];

    let arry = [];

    function promiseCheck(res, arry, crbArry){
        if(arry.length === crbArry.length){
            res.status(200).json(arry)
        }
    }
    
    crbArry.map(country => {
        Th_s_model.classCountByCountry(country)
            .then(data => {
                arry.push(data)
                promiseCheck(res, arry, crbArry)
            })
            .catch(err => {
                res.status(500).json({"error": err})
            })
    })
        
})


module.exports = router;


