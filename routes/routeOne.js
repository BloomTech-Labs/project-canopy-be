const express = require('express');
const router = express.Router();

router.get('/', (req,res)=>{

    const test=[{Message:`Router One Here`}]

    res.status(200).json(test);

    res.status(500).json({errorMessage:'Something Went Wrong'})

})


module.exports = router;