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
    threats.findByCountry()
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err})
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
    threats.findByhabitat()
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err)
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
        threats.findByTaxonomicRank('taxonomy').then(tax => {
            res.status(200).json(tax);
        })
    }
});

router.get('/test/:filter', (req, res) => {
    threats.findThreatenedBy(`${req.params.filter}`)
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({'error':err})
        })
});
module.exports = router;