const express = require('express');
const server = express();

// middleware
const cors = require('cors');

server.use(express.json());
server.use(cors());

// Routes
const th_s = require('./routes/threatened_species/th_s_route');

server.use('/th_s', th_s);


module.exports = server;