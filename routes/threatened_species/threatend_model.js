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
        .select('t.className as class','t.scientificName', 'a.redlistCategory')
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
        .then(data => {
            return dataFormatHelper(data, filter)
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
        .then(data => {
            return dataFormatHelper(data, filter)
        })
};

function threatenedSpeciesByHabitat(filter){
    return db('assessments as a')
        .join('taxonomy as t', 'a.scientificName', 't.scientificName')
        .join('habitats as h', 't.scientificName', 'h.scientificName')
        .select('t.scientificName', 'a.redlistCategory', 'h.code as habitat', 'h.name as habitat_name')
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
        .then(data => {
            return dataFormatHelper(data, filter)
        })
};

function dataFormatHelper(data, filter){
    const filterVar = filter;
    const filterObj = {
        class: taxClass,
        habitat: habitatCodes,
        country: crbArry
    };
    const objArry = filterObj[filterVar].map(item => {
        return {
            [filterVar]: item,
            species: []
        }
    });
    data.map(item => {
        objArry.map(thing => {
            if(`${item[filterVar]}` === `${thing[filterVar]}`){
                thing.species.push(item)
            }
        })
    });
    return objArry
};