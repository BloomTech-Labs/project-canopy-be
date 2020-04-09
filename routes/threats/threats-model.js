const knex = require('knex');
const knexConfig = require('../../knexfile');
const db = knex(knexConfig.development);



module.exports = {
    find,
    findbyEndangered,
    findByCountry,
    findByhabitat,
    findByTaxonomicRank,
    promiseCheck
};
  
function find() {
    return db("threats");
}

function findbyEndangered() {
    return db("assessments")
        .select("scientificName", "redlistCategory")
        .where("redlistCategory", "Critically Endangered")
        .orWhere("redlistCategory", "Endangered")
        .orWhere("redlistCategory", "Vulnerable")
}

function findByCountry(country) {
    return db("assessments")
        .join("countries","assessments.assessmentId", "countries.assessmentId" )
        .where("redlistCategory", "Critically Endangered")
        .orWhere("redlistCategory", "Endangered")
        .orWhere("redlistCategory", "Vulnerable")
        .andWhere("countries.name", country)
        .distinct("countries.scientificName")
        .select("redlistCategory")
        .then(data => {
            const countrySpecies = data.map(item => {
                return {
                    speciesName: item.scientificName,
                    redlistRank: item.redlistCategory
                }
            })
            return {
                country: country,
                species: countrySpecies
            }
        })
}

function findByTaxonomicRank(){
    return db("assessments")
        .join("taxonomy", "assessments.scientificName", "taxonomy.scientificName")
        .join("countries", "assessments.scientificName", "countries.scientificName")
        .whereIn("assessments.redlistCategory",["Critically Endangered", "Endangered", "Vulnerable"])
        .andWhere(function(){
            this.where("countries.name", 'Congo, The Democratic Republic of the')
                .orWhere("countries.name", 'Gabon')
                .orWhere("countries.name", 'Congo')
                .orWhere("countries.name", 'Central African Republic')
                .orWhere("countries.name", 'Equatorial Guinea')
                .orWhere("countries.name", 'Cameroon')
        })
        .select( "countries.name as Country","taxonomy.scientificName","taxonomy.className","redlistCategory")
        .then(data => {
            // makes an array of all class names
            const classes = data.map(item => {
                return item.className            
            });
            // filters through to create an array of distinct class names
            const uniqueClasses = classes.filter((name, i) => {
                return classes.indexOf(name) === i
            });
            // The start of formatting the data
            const classObj = uniqueClasses.map(item => {
                return {
                    class: item,
                    species: []
                }
            });
           data.map(item=> {
                const specie = item
                classObj.map(tax => {
                    if(specie.className === tax.class){
                        tax.species.push(specie)
                    }
                })
            })
            return classObj
        })
}

function findByhabitat(habitat){
    return db("assessments")
        .join("habitats","assessments.scientificName", "habitats.scientificName")
        .join("countries", "assessments.scientificName", "countries.scientificName")
        .whereIn("assessments.redlistCategory",["Critically Endangered", "Endangered", "Vulnerable"])
        .andWhere(function(){
            this.where("countries.name", 'Congo, The Democratic Republic of the')
                .andWhere("habitats.code", habitat)
                .orWhere("countries.name", 'Gabon')
                .orWhere("countries.name", 'Congo')
                .orWhere("countries.name", 'Central African Republic')
                .orWhere("countries.name", 'Equatorial Guinea')
                .orWhere("countries.name", 'Cameroon')
        })
        .distinct("assessments.scientificName")
        .select("redlistCategory")
        .then(data => {
            const habitatsSpecies = data.map(item => {
                return {
                    'Species Name': item.scientificName,
                    'Redlist Rank': item.redlistCategory
                }
            })
            return {
                habitat: habitat,
                species: habitatsSpecies
            }
        })
}


//============================ helper functions --------------

function promiseCheck(res, array, crbArry){
    if(array.length === crbArry.length){
        res.status(200).json(array)
    }
}


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




