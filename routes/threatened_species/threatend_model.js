const db=require('../../data/dbconfig');
const { 
    habitatCodes,
    crbArry,
    taxClass,
    redlistRanks
} = require('../../utils/helpers.js')

module.exports = {
    threatenedSpeciesByClass,
    threatenedSpeciesByCountry,
    threatenedSpeciesByHabitat
};

function threatenedSpeciesByClass(filter){
    return db('assessments as a')
        .join('taxonomy as t', 'a.scientificName', 't.scientificName')
        .select('t.className','t.scientificName', 'a.redlistCategory')
        .whereIn('a.redlistCategory', redlistRanks)
        .andWhere(function(){
            this.whereIn('t.className', taxClass)
            .andWhere(function(){
                this.whereIn('t.scientificName', function(){
                    this.distinct('c.scientificName').from('countries as c')
                    .join("habitats as h", "c.scientificName", "h.scientificName")
                    .whereIn('c.name', crbArry)
                    .andWhere(function(){
                        this.whereIn("h.code", habitatCodes)
                    })
                })
            })
        })
        // .then(data => {
        //     console.log('from class model')
        //     return dataFormatHelper(data, filter)
        // })
        .then(data => {
            const classObj = taxClass.map(tax => {
                return {
                    class: tax,
                    threatenedSpecies: []
                }
            })
            data.map(species => {
                classObj.map(tax => {
                    if(species.className === tax.class){
                        tax.threatenedSpecies.push(species)
                    }
                })
            })
            return classObj
        })
};

function threatenedSpeciesByCountry(filter){
    return db('assessments as a')
        .join('taxonomy as t', 'a.scientificName', 't.scientificName')
        .join('countries as c', 't.scientificName', 'c.scientificName')
        .select('t.scientificName', 'a.redlistCategory', 't.className', 'c.name as country')
        .whereIn('a.redlistCategory', redlistRanks)
        .andWhere(function(){
            this.whereIn('c.name', crbArry)
            .andWhere(function(){
                this.whereIn("t.className", taxClass)
                .andWhere(function(){
                    this.whereIn('t.scientificName', function(){
                        this.distinct("h.scientificName").from("habitats as h")
                        .andWhere(function(){
                            this.whereIn("h.code", habitatCodes)
                        })
                    })
                })
            })
        })
        // .then(data => {
        //     console.log('from country model')
        //     return dataFormatHelper(data, filter)
        // })
        .then(data => {
            const countryObj = crbArry.map(country => {
                return {
                    country,
                    species: []
                }
            })
            data.map(species => {
                countryObj.map(country => {
                    if(species.country === country.country){
                        country.species.push(species)
                    }
                })
            })
            return countryObj
        })
};

function threatenedSpeciesByHabitat(filter){
    return db('assessments as a')
        .join('taxonomy as t', 'a.scientificName', 't.scientificName')
        .join('habitats as h', 't.scientificName', 'h.scientificName')
        .select('t.scientificName', 'a.redlistCategory', 'h.code', 'h.name as habitat_name')
        .whereIn("h.code", habitatCodes)
        .andWhere(function(){
            this.whereIn("a.redlistCategory", redlistRanks)
            .andWhere(function(){
                this.whereIn("t.className", taxClass)
                .andWhere(function(){
                    this.whereIn('a.scientificName', function(){
                        this.distinct('c.scientificName').from('countries as c')
                        .whereIn('c.name', crbArry)
                    })
                })
            })
        })
        // .then(data => {
        //     console.log('from habitat model')
        //     return dataFormatHelper(data, filter)
        // })
        .then(data => {
            const habitatObj = habitatCodes.map(habitat => {
                return {
                    habitat,
                    species: []
                }
            });

            data.map(species => {
                habitatObj.map(habitat => {
                    if(species.code === `${habitat.habitat}`){
                        habitat.species.push(species)
                    }
                })
            })
            return habitatObj
        })
}

// function dataFormatHelper(data, filter){
//     const filterVar = filter;
//     const filterObj = {
//         class: taxClass,
//         habitat: habitatCodes,
//         country: crbArry
//     }

//     const objArry = filterObj[filterVar].map(item => {
//         return {
//             [filterVar]: item,
//             species: []
//         }
//     })
//     console.log(filterVar)
//     data.map(item => {
//         // console.log('item',item)
//         objArry.map(thing => {
//             // console.log('thing',thing)
//             if(`${item[filterVar]}` === `${thing[filterVar]}`){
//                 thing.species.push(item)
//             }
//         })
//     })
//     return objArry
// };