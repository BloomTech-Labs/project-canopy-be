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



module.exports = router;


