const express = require('express');
const router = express.Router();
const assessment=require('./assessment-model')
router.get('/', (req,res)=>{
    assessment.find().then(assess=>{
        res.status(200).json(assess);
    }).catch(err=>{
        console.log(err);
        res.status(500).json({errorMessage:'Failed To Get Data'})
    })
});


module.exports = router;