const db=require('../../data/dbconfig');


module.exports = {
    tax,
    classNameCount,
    countryClassCounts,
    classCountByCountry,
    // classCountAllCountries
};

function tax(){
    return db('assessments as a')
    .select("a.scientificName", "a.redlistCategory", "a.assessmentDate", "t.kingdomName", "t.phylumName","t.orderName","t.className", "t.familyName", "t.genusName", "t.speciesName")
    .where("a.redlistCategory","Critically Endangered").orWhere("a.redlistCategory","Endangered").orWhere("a.redlistCategory","Vulnerable")
    .join('taxonomy as t', "a.internalTaxonId", "t.internalTaxonId");
}

function classNameCount(){
    return db('assessments as a')
    .select("t.className")
    .count('t.className')
    .groupBy('t.className')
    .where("a.redlistCategory","Critically Endangered")
        .orWhere("a.redlistCategory","Endangered")
        .orWhere("a.redlistCategory","Vulnerable")
    .join('taxonomy as t', "a.internalTaxonId", "t.internalTaxonId");
}

function countryClassCounts(){
    // db('assessments as a')
    // .select("t.className")
    // .count('t.className')
    // .groupBy('t.className')
    // .where("a.redlistCategory","Critically Endangered")
    //     .orWhere("a.redlistCategory","Endangered")
    //     .orWhere("a.redlistCategory","Vulnerable")
    // .join('taxonomy as t', "a.internalTaxonId", "t.internalTaxonId")
    // .join("countries as c", "a.internalTaxonId", "c.internalTaxonId");
}


//============== HELPER FUNCTION ================

function classCountByCountry(country){
    return db('assessments as a')
        .select("t.className", "c.name")
        .count('t.className as classCount')
        .groupBy('t.className')
        .whereIn("a.redlistCategory",["Critically Endangered", "Endangered", "Vulnerable"])
        .andWhere('c.name', country)
        .join('taxonomy as t', "a.internalTaxonId", "t.internalTaxonId")
        .join("countries as c", "a.internalTaxonId", "c.internalTaxonId")
    .then(countryCount => {
        const counts = countryCount.map(item => {
            return {
                className: item.className,
                count: item.classCount
            }
        })
        return {
            country: country,
            counts: counts
        }
    })
    // return {"banana": "apple"}
}

// function classCountAllCountries() {
//     const crbCountries = ['Cameroon', 'Congo, The Democratic Republic of the', 'Gabon', 'Congo', 'Central African Republic', 'Equatorial Guinea'];

//     const allClassCountryCounts = [];

//     crbCountries.map(country => {
//         classCountByCountry(country)
//             .then(countryCount => {
//                 allClassCountryCounts.push(countryCount)
//             })
//     });
//     return allClassCountryCounts;
// }



// function classCountAllCountries(){
//     const crbCountries = ['Cameroon', 'Congo, The Democratic Republic of the', 'Gabon', 'Congo', 'Central African Republic', 'Equatorial Guinea'];

//     let allClassCountryCounts = crbCountries.map(country => {
//         return classCountByCountry(country)
//         .then((count) => {
//             return count
//         })
//     });

//     // return allClassCountryCounts;
//     // return [1, 2, 3]
// }


















// function returnClassCountsByACountry(country){
//     db() // returns taxonomy class counts for a country
//         .then((taxonomyCountsOfACountry) => {
//             return {
//                 country: country, //string
//                 taxonomyCounts: taxonomyCounts //array
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

//     crb.forEach(item => {
//         return ClassCountsByACountry(item)
//             .then((countryClassCount)=> {
//                 taxonomyCounts.push(countryClassCount)
//             })
//     })

//     return taxonomyCounts
// }




