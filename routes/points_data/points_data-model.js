const knex = require('knex');
const knexConfig = require('../../knexfile');
const db = knex(knexConfig.development);



module.exports = {
    find,
    findCoordinates,
    findCongoPoints
};
  

function find() {
    return db("points_data");
}

function findCoordinates(){
    return db("points_data").select('longitude','latitude').limit(10);
}
function findCongoPoints(){
    return db("points_data")
        .where('longitude', '>', -4.203786185310264)
        .andWhere('longitude', '<', 39.85918618530923)
        .andWhere('latitude', '>', -8.821043355800043)
        .andWhere('latitude', '<', 8.821043355801251)
}