const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', (req, res) => {
    axios.get(`http://52.35.82.66/threats`)
        .then(resp => {
            res.status(200).json(resp.data)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error:err})
        })
})
router.get('/:habitat_code', (req, res) => {
    const { habitat_code } = req.params
    axios.get(`http://52.35.82.66/threats/${habitat_code}`)
        .then(resp => {
            res.status(200).json(resp.data)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error:err})
        })
})
router.get('/country/:country', (req, res) => {
    const { country } = req.params
    axios.get(`http://52.35.82.66/threats/country/${country}`)
        .then(resp => {
            res.status(200).json(resp.data)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error:err})
        })
})

module.exports = router;