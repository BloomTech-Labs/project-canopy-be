const express = require('express');
const server = express();

// middleware
const cors = require('cors');

server.use(express.json());
server.use(cors());

// Routes
const biodiversity = require('./routes/DS_routes/biodiversity_routes.js');
const threats = require('./routes/DS_routes/threats_route.js');
const data_routes = require('./routes/condensed_routes/data_routes.js');
const species_info = require('./routes/species_routes/species_route.js')

server.use('/api/data', data_routes)
server.use('/api/biodiversity', biodiversity);
server.use('/api/threats', threats);
server.use('/api/species', species_info)


module.exports = server;