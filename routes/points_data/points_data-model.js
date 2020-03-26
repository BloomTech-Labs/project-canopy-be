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
        .where('longitude', '>', 8.365347)
        .andWhere('longitude', '<', 28.616874)
        .andWhere('latitude', '>', -4.784469)
        .andWhere('latitude', '<', 10.141932)
}