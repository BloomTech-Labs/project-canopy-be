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
    allCountsByClass
}

function countriesClasses(){
    return db('taxonomy as t')
        .select("t.className", "c.name as country", "a.redlistCategory",'t.scientificName', 't.speciesName', 't.kingdomName', 't.phylumName')
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
            // this builds out the schema for the format of the returned data
            const countObj = crbArry.map(item => {
                return {
                    country: item,
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
            // this is mapping the data returned from the DB call and molding it to fit the schema
            data.map(item => {
                const species = item;
                countObj.map(obj => {
                    if(species.country === obj.country){
                        obj.classes.map(className => {
                            if(species.className === className.class){
                                className.species.push(species)
                                className.speciesCount++
                                className.threatLevels.map(threatRank => {
                                    if(species.redlistCategory === threatRank.rank){
                                        className.threatenedSpecies.push(species)
                                        className.threatenedCount++
                                        threatRank.count++
                                        }
                                    })
                            }
                        })
                    }
                })
            });
            return countObj
        })
};

function habitatsClasses(){
    return db('taxonomy as t')
        .select('t.className', 'h.code as habitat', 'h.name as habitat_name', 'a.redlistCategory', 't.scientificName', 't.speciesName', 't.kingdomName', 't.phylumName')
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
            // this builds out the schema for the format of the returned data
            const countObj = habitatCodes.map(item => {
                return {
                    habitat: item,
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
            // this is mapping the data returned from the DB call and molding it to fit the schema
            data.map(item => {
                const species = item;
                countObj.map(obj => {
                    if(species.country === obj.country){
                        obj.classes.map(className => {
                            if(species.className === className.class){
                                className.species.push(species)
                                className.speciesCount++
                                className.threatLevels.map(threatRank => {
                                    if(species.redlistCategory === threatRank.rank){
                                        className.threatenedSpecies.push(species)
                                        className.threatenedCount++
                                        threatRank.count++
                                        }
                                    })
                            }
                        })
                    }
                })
            });
            return countObj
        })
};

function allCountsByClass(){
    return db('taxonomy as t')
        .join('assessments as a', "t.scientificName", "a.scientificName")
        .select("t.className", "a.redlistCategory",'t.scientificName', 't.speciesName', 't.kingdomName', 't.phylumName')
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
};

// WORK IN PROGRESS

// function dataFormatHelper(data, filter){
//     const filterVar = filter;
//     const filterObj = {
//         class: taxClass,
//         habitat: habitatCodes,
//         country: crbArry
//     };
//     const objArry = filterObj[filterVar].map(item => {
//         return {
//             [filterVar]: item,
//             classes: taxClass.map(className => {
//                 return {
//                     class: className,
//                     speciesCount: 0,
//                     threatenedCount: 0,
//                     threatLevels: redlistRanks.map(rank => {
//                         return { 
//                             rank, 
//                             count: 0
//                         }
//                     }),
//                     species: [],
//                     threatenedSpecies: []
//                     }
//                 })
//             }
//         })
        
//         data.map(item => {
//             objArry.map(obj => {
//                 if(`${item[filterVar]}` === `${obj[filterVar]}`){
//                     obj.classes.map(className => {
//                         if(item.className === className.class){
//                             className.species.push(item)
//                             className.speciesCount++
//                             className.threatLevels.map(threatRank => {
//                                     if(species.redlistCategory === threatRank.rank){
//                                         className.threatenedSpecies.push(species)
//                                         className.threatenedCount++
//                                         threatRank.count++
//                                         }
//                                     })
//                         }
//                     })
//                 }
//             })
//         });
//         return objArry
// };