const db=require('../../data/dbconfig');
const { 
    habitatCodes,
    crbArry,
    taxClass,
    redlistRanks
} = require('../../utils/helpers.js')

module.exports = {
    countriesClasses,
    habitatsClasses,
    allCountsByClass,
}

function countriesClasses(filter){
    return db('taxonomy as t')
        .select("t.className", "c.name as country", "a.redlistCategory",'t.scientificName', 't.speciesName', 't.kingdomName', 't.phylumName', 'a.populationTrend')
        .join("countries as c", "t.scientificName", "c.scientificName")
        .join('assessments as a', "t.scientificName", "a.scientificName")
        .whereIn('c.name', crbArry)
        .andWhere(function(){
            this.whereIn("t.className", taxClass)
            .andWhere(function(){
                this.whereIn('t.scientificName', function(){
                    this.distinct('h.scientificName').from('habitats as h')
                    .whereIn("h.code", habitatCodes)
                })
            })
        })
        .then(data => {
            return findCommonName()
            .then(com => {
                data.map(animal => {
                    com.map(name => {
                        if(animal.scientificName === name.scientificName){
                            animal.commonName = name.commonName
                        }
                    })
                })
                return dataFormatHelper(data, filter);
            })
        })
};

function habitatsClasses(filter){
    return db('taxonomy as t')
        .select('t.className', 'h.code as habitat', 'h.name as habitat_name', 'a.redlistCategory', 't.scientificName', 't.speciesName', 't.kingdomName', 'a.populationTrend')
        .join('habitats as h', 't.scientificName', 'h.scientificName')
        .join('assessments as a', 't.scientificName', 'a.scientificName')
        .whereIn('h.code', habitatCodes)
        .andWhere(function(){
            this.whereIn('t.className', taxClass)
            .andWhere(function(){
                this.whereIn('t.scientificName', function(){
                    this.distinct('c.scientificName').from('countries as c')
                    .whereIn('c.name', crbArry)
                })
            })
        })
        .then(data => {
            return findCommonName()
            .then(com => {
                data.map(animal => {
                    com.map(name => {
                        if(animal.scientificName === name.scientificName){
                            animal.commonName = name.commonName
                        }
                    })
                })
                return dataFormatHelper(data, filter);
            })
        })
};

function allCountsByClass(){
    return db('taxonomy as t')
        .join('assessments as a', "t.scientificName", "a.scientificName")
        .select("t.className", "a.redlistCategory",'t.scientificName', 't.speciesName', 't.kingdomName', 't.phylumName', 'a.populationTrend')
        .whereIn("t.className", taxClass)
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
        .then(data => {
            const allCountObj = {
                classes: taxClass.map(className => {
                    return {
                        class: className,
                        speciesCount: 0,
                        threatenedCount: 0,
                        threatLevels: redlistRanks.map(rank => {
                            return { 
                                rank, 
                                count: 0
                            }
                        }),
                        species: [],
                        threatenedSpecies: []
                    }
                })
            }
            return findCommonName()
            .then(com => {
                data.map(animal => {
                    com.map(name => {
                        if(animal.scientificName === name.scientificName){
                            animal.commonName = name.commonName
                        }
                    })
                })
                data.map(item => {
                    const species = item;
                    allCountObj.classes.map(obj => {
                        if(species.className === obj.class){
                            obj.species.push(species)
                            obj.speciesCount++
                            obj.threatLevels.map(threatRank => {
                                if(species.redlistCategory === threatRank.rank){
                                    obj.threatenedSpecies.push(species)
                                    obj.threatenedCount++
                                    threatRank.count++
                                    }
                                })
                        }
                    })
                });
                return allCountObj
            })
        })
};

function findCommonName(){
    return db('CommonNames')
        .select('scientificName', 'name as commonName')
        .where('main', '=', '1')
}


// helper to dynamically format the returned data
function dataFormatHelper(data, filter){
    const filterObj = {
        all: taxClass,
        habitat: habitatCodes,
        country: crbArry
    };
    const objArry = filterObj[filter].map(item => {
        return {
            [filter]: item,
            classes: taxClass.map(className => {
                return {
                    class: className,
                    speciesCount: 0,
                    threatenedCount: 0,
                    threatLevels: redlistRanks.map(rank => {
                        return { 
                            rank, 
                            count: 0
                        }
                    }),
                    species: [],
                    threatenedSpecies: []
                    }
                })
            }
        });
        data.map(item => {
            objArry.map(obj => {
                if(`${item[filter]}` === `${obj[filter]}`){
                    obj.classes.map(className => {
                        if(item.className === className.class){
                            className.species.push(item)
                            className.speciesCount++
                            className.threatLevels.map(threatRank => {
                                    if(item.redlistCategory === threatRank.rank){
                                        className.threatenedSpecies.push(item)
                                        className.threatenedCount++
                                        threatRank.count++
                                        }
                                    })
                        }
                    })
                }
            })
        });
        return objArry
};