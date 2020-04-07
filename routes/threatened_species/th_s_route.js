const express = require('express');
const router = express.Router();
const Th_s_model=require("./th_s_model");


router.get('/tax', (req, res) => {
    Th_s_model.tax().then(user=>{
        res.status(200).json(user);
    }).catch(err=>{
        console.log(err);
        res.status(500).json({errorMessage:'Can\'t get Users Because there\'s something wrong with DATABASE'})
    })
});

router.get('/tax/classCount', (req, res) => {
    Th_s_model.classNameCount()
        .then(classCount => {
            res.status(200).json(classCount)
        })
        .catch(err => {
            res.status(500).json({err})
        })
})

// router.post('/tax/classCount',(req,res)=>{
//     let searchBasis=req.body.searchBasis;
//     res.status(200).json({searchBasis:"whatever"})
// });

// router.get('/test', (req, res) => {
//     // Th_s_model.classCountAllCountries()
//     //     .then(count => {
//     //         res.status(200).json(count)
//     //     })
//     // res.json(Th_s_model.classCountByCountry('Kenya'));
//     // res.json(Th_s_model.classCountAllCountries());
//     Th_s_model.classCountByCountry('Kenya')
//     .then((resp) => {
//         res.json({resx: resp});
//     })
  
// })



router.get('/test', (req, res) => {
    // Th_s_model.classCountAllCountries()
    //     .then(count => {
    //         res.status(200).json(count)
    //     })
    // res.json(Th_s_model.classCountByCountry('Kenya'));
    // res.json(Th_s_model.classCountAllCountries());
    const crbCountries = ['Cameroon', 'Congo, The Democratic Republic of the', 'Gabon', 'Congo', 'Central African Republic', 'Equatorial Guinea'];
    for(let i=0; i<crbCountries; i++){
        Th_s_model.classCountByCountry(crbCountries[i])
    .then((resp) => {
        res.json({resx: resp});
    })
    }
})


module.exports = router;