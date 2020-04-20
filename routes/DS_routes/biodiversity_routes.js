const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', (req, res) => {
    axios.get('http://52.35.82.66/hotspot-habitats/')
        .then(resp => {
            res.status(200).json(resp.data)
        })
        .catch(err => {
            res.status(500).json({"error": err})
        })
});
router.get('/:country', (req, res) => {
    const { country } = req.params
    axios.get(`http://52.35.82.66/hotspot-habitats/${country}`)
        .then(resp => {
            res.status(200).json(resp.data)
        })
        .catch(err => {
            res.status(500).json({"error": err})
        })
});

module.exports = router;