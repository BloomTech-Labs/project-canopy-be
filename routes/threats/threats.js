const express = require('express');
const router = express.Router();
const threats = require('./threats-model')

router.get('/species/:filter', (req, res) => {
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