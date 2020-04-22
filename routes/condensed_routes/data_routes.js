const express = require('express');
const router = express.Router();
const ClassModel = require('./classModel.js');

router.get('/by/:filter', (req, res) => {
    const { filter } = req.params;
    routeFilter(filter)
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(500).json({Error: err})
        })
});

module.exports = router;


function routeFilter(filter){
    if(filter.toLowerCase() === 'country'){
       return ClassModel.countriesClasses(filter)  
    };
    if(filter.toLowerCase() === 'habitat'){
       return ClassModel.habitatsClasses(filter)
    };
    if(filter.toLowerCase() === 'all'){
        return ClassModel.allCountsByClass()
    };
};