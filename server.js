const express = require('express');
const server = express();

// middleware
const cors = require('cors');

server.use(express.json());
server.use(cors());

// Routes
const th_s = require('./routes/threatened_classes/th_s_route');
const threatened_species = require('./routes/threatened_species/threatened_routes');

server.use('/th_s', th_s);
server.use('/api/species', threatened_species);

module.exports = server;