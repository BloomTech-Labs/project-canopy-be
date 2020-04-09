const express = require('express');
const router = express.Router();
const threats = require('./threats-model')

router.get('/', (req, res) => {
    threats.find().then(threat => {
        res.status(200).json(threat);
    }).catch(err => {
        console.log(err);
        res.status(500).json({errorMessage:'Failed To Get Data'})
    })
});


router.get('/endangered', (req, res) => {
    threats.findbyEndangered().then(endang => {
        res.status(200).json(endang);
    }).catch(err => {
        console.log(err);
        res.status(500).json({errorMessage:'Failed To Get Data'})
    })
});


router.get('/country', (req, res) => {
    const crbArry = ['Cameroon', 'Congo, The Democratic Republic of the', 'Gabon', 'Congo', 'Central African Republic', 'Equatorial Guinea'];

    let arry = [];

    crbArry.map(country => {
        threats.findByCountry(country)
            .then(data => {
                arry.push(data)
                threats.promiseCheck(res, arry, crbArry)
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({"error": err})
            })
    })
});

router.get('/taxonomic', (req, res) => {
    threats.findByTaxonomicRank().then(taxon => {
        res.status(200).json(taxon);
    }).catch(err => {
        console.log(err);
        res.status(500).json({errorMessage:'Failed To Get Data'})
    })
});


router.get('/habitats', (req, res) => {
    const habitatCodes = [1.5, 1.6, 1.7, 1.8, 1.9, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 14.6];
    let arry = [];

    habitatCodes.map(habitat => {
        threats.findByhabitat(habitat)
            .then(data => {
                arry.push(data)
                threats.promiseCheck(res, arry, habitatCodes)
                console.log(data)
        })
    })
});


router.get('/endangered/:filter' ,(req,res) => {
    const filter = req.params.filter
    console.log(filter)
    if(filter === 'country'){
        threats.findByCountry().then(count => {
            res.status(200).json(count);
        })
    } else if (filter === 'habitat') {
        threats.findByhabitat().then(habi => {
            res.status(200).json(habi);
        })
    }   else if (filter === 'taxonomy') {
        threats.findByTaxonomicRank().then(tax => {
            res.status(200).json(tax);
        })
    }
})
module.exports = router;