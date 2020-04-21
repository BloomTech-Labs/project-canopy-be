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
            res.status(500).json({Error: err})
        })
})

module.exports = router;

function routeFilter(filter){
    if(filter.toLowerCase() === 'country'){
       return threats.threatenedSpeciesByCountry(filter)  
    }
    if(filter.toLowerCase() === 'country-all'){
        const filterSplit = filter.split('-')
        return threats.allSpeciesByCountry(filterSplit[0])  
     }
    if(filter.toLowerCase() === 'habitat'){
       return threats.threatenedSpeciesByHabitat(filter)
    }
    if(filter.toLowerCase() === 'habitat-all'){
        const filterSplit = filter.split('-')
        return threats.allSpeciesByHabitat(filterSplit[0])
     }
    if(filter.toLowerCase() === 'class'){
       return threats.threatenedSpeciesByClass(filter)
    }
    if(filter.toLowerCase() === 'all'){
        return threats.getAllSpecies()
     }
}

