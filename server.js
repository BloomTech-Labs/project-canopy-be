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

server.use('/api/data', data_routes)
server.use('/api/biodiversity', biodiversity);
server.use('/api/threats', threats);


module.exports = server;