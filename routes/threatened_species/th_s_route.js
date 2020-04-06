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

router.get('/tax/class', (req, res) => {
    Th_s_model.UniqueClassNames().then(user=>{
        let destictClases=user.map(item=>{
            return item.className;
        })
        Th_s_model.tax().then(res=>{
            res.filter(item=>{
               
            })
        })
        console.log(destictClases);
        res.status(200).json(
            user
            );
    }).catch(err=>{
        console.log(err);
        res.status(500).json({errorMessage:'Can\'t get Users Because there\'s something wrong with DATABASE'})
    })
});

router.get('/tax/class/count', (req, res) => {
    Th_s_model.UniqueClassNames()
        .then(UniqueClasses => {
            UniqueClasses.map(count=>{
                Th_s_model.classNameCount(count.className)
            })
        })
        
})


module.exports = router;