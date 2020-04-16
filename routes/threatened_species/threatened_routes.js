const express = require('express');
const router = express.Router();
const threats = require('./threatend_model.js');



router.get('/by/:filter', (req, res) => {
    const { filter } = req.params;
    routeFilter(filter)
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

module.exports = router;

function routeFilter(filter){
    if(filter.toLowerCase() === 'country'){
       return threats.threatenedSpeciesByCountry(filter)  
    }
    if(filter.toLowerCase() === 'habitat'){
       return threats.threatenedSpeciesByHabitat(filter)
    }
    if(filter.toLowerCase() === 'class'){
       return threats.threatenedSpeciesByClass(filter)
    }
}

