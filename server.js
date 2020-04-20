const express = require('express');
const server = express();

// middleware
const cors = require('cors');

server.use(express.json());
server.use(cors());

// Routes
const th_s = require('./routes/threatened_classes/th_s_route');
const threatened_species = require('./routes/threatened_species/threatened_routes');
const biodiversity = require('./routes/DS_routes/biodiversity_routes.js');
const threats = require('./routes/DS_routes/threats_route.js');

server.use('/th_s', th_s);
server.use('/api/species', threatened_species);
server.use('/api/biodiversity', biodiversity);
server.use('/api/threats', threats);

module.exports = server;