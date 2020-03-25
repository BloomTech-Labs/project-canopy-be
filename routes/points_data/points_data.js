const express = require('express');
const router = express.Router();
const points_data=require('./points_data-model')
router.get('/', (req,res)=>{
    points_data.find().then(assess=>{
        res.status(200).json(assess);
    }).catch(err=>{
        console.log(err);
        res.status(500).json({errorMessage:'Failed To Get Data'})
    })
});

router.get('/coordinates', (req,res)=>{
    points_data.findCoordinates().then(coordinates=>{
        res.status(200).json(coordinates);
    }).catch(err=>{
        console.log(err);
        res.status(500).json({errorMessage:'Failed To Get Data'})
    })
});

router.get('/congo_coordinates', (req, res) => {
    points_data.findCongoPoints()
        .then(points => {
            res.status(200).json(points)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error:'Failed to retrieve the data'})
        })
})



module.exports = router;


