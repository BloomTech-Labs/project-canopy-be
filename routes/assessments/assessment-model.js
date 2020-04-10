const knex = require('knex');
const knexConfig = require('../../knexfile');
const db = knex(knexConfig.development);



module.exports = {
    all,
};
  
function all(){
    return db("assessments")
}
