const knex = require('knex');
const knexConfig = require('../../knexfile');
const db = knex(knexConfig.development);



module.exports = {
    find,
    findbyEndangered,
    findByCountry,
    findByhabitat,
    findByTaxonomicRank
};
  
function find() {
    return db("threats");
}

function findbyEndangered() {
    return db("assessments").select("ScientificName", "redlistCategory")
    .where("redlistCategory", "Critically Endangered")
    .orWhere("redlistCategory", "Endangered").orWhere("redlistCategory", "Vulnerable")
}

function findByCountry() {
    return db("assessments").join("countries","assessments.assessmentId", "countries.assessmentId" )
    .where("redlistCategory", "Critically Endangered")
    .orWhere("redlistCategory", "Endangered").orWhere("redlistCategory", "Vulnerable")
    .select("name as Country", "countries.scientificName", "redlistCategory")
}

function findByTaxonomicRank(){
    return db("assessments").join("taxonomy", "assessments.internalTaxonId", "taxonomy.internalTaxonId")
    .where("redlistCategory", "Critically Endangered")
    .orWhere("redlistCategory", "Endangered").orWhere("redlistCategory", "Vulnerable")
    .select("taxonomy.scientificName","taxonomy.className","redlistCategory")

}

function findByhabitat(){
    return db("assessments").join("habitats","assessments.assessmentId", "habitats.assessmentId")
    .where("redlistCategory", "Critically Endangered")
    .orWhere("redlistCategory", "Endangered").orWhere("redlistCategory", "Vulnerable")
    .select("habitats.name as Habitat Name", "habitats.scientificName","redlistCategory")
}


//============================================



// function returnThreatenedSpeciesByACountry(country){
//     db() // returns taxonomy class counts for a country
//         .then((findByCountry) => {
//             return {
//                 country: country, //string
//                 threat: threat //array
//             }
//         })
// }

// function returnClassCountsForCongoRiverBasis(){
//     let crb = [
//         "Republic of Congo",
//         "Cameroon",
//         "Gabon"
//     ]

//     let taxonomyCounts = []

//     crb.forEach(() => {
//         returnClassCountsByACountry()
//             .then((countryClassCount)=> {
//                 taxonomyCounts.push(countryClassCount)
//             })
//     })

//     return taxonomyCounts




