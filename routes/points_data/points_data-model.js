const knex = require('knex');
const knexConfig = require('../../knexfile');
const db = knex(knexConfig.development);



module.exports = {
    find,
    findCoordinates
};
  

function find() {
    return db("points_data");
}

function findCoordinates(){
    return db("points_data").select('longitude','latitude');
}