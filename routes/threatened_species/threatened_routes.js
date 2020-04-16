const express = require('express');
const router = express.Router();
const threats = require('./threatend_model.js');

router.get('/byClass', (req, res) => {
    threats.threatenedSpeciesByClass()
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error:err})
        })
})

router.get('/byCountry', (req, res) => {
    threats.threatenedSpeciesByCountry()
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err})
        })
})

router.get('/byHabitat', (req, res) => {
    threats.threatenedSpeciesByHabitat()
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err})
        })
})

// router.get('/test/:filter', (req, res) => {
//     const { filter } = req.params;
//     console.log(filter, typeof filter)
//     if(filter.toLowerCase() === 'country'){
//         threats.threatenedSpeciesByCountry(filter)
//         .then(data => {
//             res.status(200).json(data)
//         })
//     }
//     if(filter.toLowerCase() === 'habitat'){
//         threats.threatenedSpeciesByHabitat(filter)
//         .then(data => {
//             res.status(200).json(data)
//         })
//     }
//     if(filter.toLowerCase() === 'class'){
//         threats.threatenedSpeciesByClass(filter)
//         .then(data => {
//             res.status(200).json(data)
//         })
//     }
// })

module.exports = router;



