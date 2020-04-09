const knex = require('knex');
const knexConfig = require('../../knexfile');
const db = knex(knexConfig.development);

const habitatCodes = [1.5, 1.6, 1.7, 1.8, 1.9, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 14.6];

const crbArry = ['Cameroon', 'Congo, The Democratic Republic of the', 'Gabon', 'Congo', 'Central African Republic', 'Equatorial Guinea'];

module.exports = {
    // find,
    // findbyEndangered,
    // findByCountry,
    // findByhabitat,
    // findByTaxonomicRank,
    // promiseCheck,
    findThreatenedBy
};
  
// function find() {
//     return db("threats");
// }

// function findbyEndangered(filter) {
//     return db("assessments")
//         .join("countries","assessments.scientificName", "countries.scientificName" )
//         .join("habitats","assessments.scientificName", "habitats.scientificName")
//         .select("assessments.scientificName as Scientific Name", "assessments.redlistCategory as Redlist Category")
//         .whereIn("assessments.redlistCategory",["Critically Endangered", "Endangered", "Vulnerable"])
//         .andWhere(function(){
//             this.whereIn("countries.name", crbArry)
//                 .andWhere(function(){
//                     this.whereIn("habitats.code", habitatCodes)
//                 })
//         })
            
// }

// function findByCountry() {
//     return db("assessments")
//         .join("countries","assessments.scientificName", "countries.scientificName" )
//         .join("habitats","assessments.scientificName", "habitats.scientificName")
//         .whereIn("assessments.redlistCategory",["Critically Endangered", "Endangered", "Vulnerable"])
//         .andWhere(function(){
//             this.whereIn("countries.name", crbArry)
//                 .andWhere(function(){
//                     this.whereIn("habitats.code", habitatCodes)
//                 })
//         })
//         .distinct("countries.scientificName")
//         .select("redlistCategory", "countries.name as country")
//         .then(data => {
//             const countryObj = crbArry.map(item => {
//                 return {
//                     country: item,
//                     species: []
//                 }
//             })
//             data.map(item => {
//                 const species = item;
//                 countryObj.map(obj => {
//                     if(species.country === obj.country){
//                         obj.species.push(species)
//                     }
//                 })
//             })
//             return countryObj
//         })
// }

// function findByTaxonomicRank(filter){
//     return db("assessments")
//         .join("taxonomy", "assessments.scientificName", "taxonomy.scientificName")
//         .join("countries", "assessments.scientificName", "countries.scientificName")
//         .whereIn("assessments.redlistCategory",["Critically Endangered", "Endangered", "Vulnerable"])
//         .andWhere(function(){
//             this.whereIn("countries.name", crbArry)
//         })
//         .select( "countries.name as Country","taxonomy.scientificName","taxonomy.className","redlistCategory")
//         .then(data => {
//             return dataFilterLogic(data, filter)
//         })
//         //     // makes an array of all class names
//         //     const classes = data.map(item => {
//         //         return item.className            
//         //     });
//         //     // filters through to create an array of distinct class names
//         //     const uniqueClasses = classes.filter((name, i) => {
//         //         return classes.indexOf(name) === i
//         //     });
//         //     // The start of formatting the data
//         //     const classObj = uniqueClasses.map(item => {
//         //         return {
//         //             class: item,
//         //             species: []
//         //         }
//         //     });
//         //    data.map(item=> {
//         //         const specie = item
//         //         classObj.map(tax => {
//         //             if(specie.className === tax.class){
//         //                 tax.species.push(specie)
//         //             }
//         //         })
//         //     })
//         //     return classObj
//         // })
// }

// function findByhabitat(filter){
//     return db("assessments")
//         .join("habitats","assessments.scientificName", "habitats.scientificName")
//         .join("countries", "assessments.scientificName", "countries.scientificName")
//         .whereIn("assessments.redlistCategory",["Critically Endangered", "Endangered", "Vulnerable"])
//         .andWhere(function(){
//             this.whereIn("countries.name", crbArry)
//                 .andWhere(function(){
//                     this.whereIn("habitats.code", habitatCodes)
//                 })
//         })
//         .distinct("assessments.scientificName")
//         .select("redlistCategory", "countries.name as country", "habitats.name as habitat", "habitats.code")
//         .then(data => {
//             // The start of formatting the data
//             const habitatObj = habitatCodes.map(item => {
//                 return {
//                     habitatCode: item,
//                     species: []
//                 }
//             });
//            data.map(item=> {
//                 const specie = item
//                 habitatObj.map(tax => {
//                     if(specie.code === `${tax.habitatCode}`){
//                         tax.species.push(specie)
//                     }
//                 })
//             })
//             return habitatObj
//         })
// }




function findThreatenedBy(filter){
    return db("assessments as a")
    .join("habitats as h","a.scientificName", "h.scientificName")
    .join("countries as c", "a.scientificName", "c.scientificName")
    .join("taxonomy as t", "a.scientificName", "t.scientificName")
    .whereIn("a.redlistCategory",["Critically Endangered", "Endangered", "Vulnerable"])
    .andWhere(function(){
        this.whereIn("c.name", crbArry)
        .andWhere(function(){
            this.whereIn("h.code", habitatCodes)
        })
    })
    // .distinct("assessments.scientificName")
    .select("a.redlistCategory as redlistRank", 
            "c.name as country", 
            "h.name as habitat", 
            "h.code", 
            "t.speciesName",
            "t.className"
        )
    .then(data => {
       return dataFilterLogic(data, filter)
    })
    
}

function dataFilterLogic(data, filter){
    if(filter === 'countries'){
        const countryObj = crbArry.map(item => {
            return {
                country: item,
                species: []
            }
        })
        data.map(item => {
            const species = item;
            countryObj.map(obj => {
                if(species.country === obj.country){
                    obj.species.push(species)
                }
            })
        })
        return countryObj
    };

    if(filter === 'habitats'){
        // The start of formatting the data
        const habitatObj = habitatCodes.map(item => {
            return {
                habitatCode: item,
                species: []
            }
        });
       data.map(item=> {
            const specie = item
            habitatObj.map(tax => {
                if(specie.code === `${tax.habitatCode}`){
                    tax.species.push(specie)
                }
            })
        })
        return habitatObj
    };

    if(filter === 'taxonomy'){
        console.log('in the filter!', data)
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
        return classObj;
    }
    
    else {
        return data
    }
};



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




