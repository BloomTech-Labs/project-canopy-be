const cors=require('cors');


const express = require('express');

const server = express();

server.use(express.json());

server.use(cors());

const routerOne=require('./routes/routeOne')

const assessments=require('./routes/assessments/assessments')

const point_data=require('./routes/points_data/points_data')

const th_s=require('./routes/threatened_species/th_s_route');

server.use('/one', routerOne);


server.use('/assessments', assessments);

server.use('/th_s', th_s);

server.use('/point_data', point_data);

server.get('/', (req,res)=>{

    const test=[{Message:`*** THIS GET WORKS :) ***`}]

    res.status(200).json(test);

})


module.exports = server;