const db=require('../../data/dbconfig');
const { 
    habitatCodes,
    crbArry,
    taxClass,
    redlistRanks
} = require('../../utils/helpers.js')

module.exports = {
    classCountByCountry,
    classCountByHabitat,
    classCountCRB,
    allClassCountCRB,
    allClassCountByCountry
};

function allClassCountByCountry(){
    return db('taxonomy as t')
        .select("t.className", "c.name as country")
        .join("countries as c", "t.scientificName", "c.scientificName")
        .whereIn("t.className", taxClass)
        .andWhere(function(){
            this.whereIn('c.name', crbArry)
            .andWhere(function(){
                this.whereIn('t.scientificName', function(){
                    this.distinct('c.scientificName').from('countries as c')
                    .join("habitats as h", "c.scientificName", "h.scientificName")
                    .andWhere(function(){
                        this.whereIn("h.code", habitatCodes)
                    })
                })
            })
        })
        .then(data => {
            const countObj = crbArry.map(item => {
                return {
                    country: item,
                    classes: taxClass.map(className => {
                        return {
                            class: className,
                            speciesCount: 0,
                        }
                    })
                }
            });
            data.map(item => {
                const species = item;
                countObj.map(obj => {
                    if(species.country === obj.country){
                        obj.classes.map(className => {
                            if(species.className === className.class){
                                className.speciesCount++
                            }
                        })
                    }
                })
            });
            return countObj
        })
};

function classCountByCountry(){
    return db('taxonomy as t')
        .select("t.className", "c.name as country", "a.redlistCategory")
        .join("countries as c", "t.scientificName", "c.scientificName")
        .join('assessments as a', "t.scientificName", "a.scientificName")
        .whereIn("t.className", taxClass)
        .andWhere(function(){
            this.whereIn('t.scientificName', function(){
                this.distinct('c.scientificName').from('countries as c')
                .join('assessments as a', "c.scientificName", "a.scientificName")
                .join("habitats as h", "c.scientificName", "h.scientificName")
                .whereIn('c.name', crbArry)
                .andWhere(function(){
                    this.whereIn("h.code", habitatCodes)
                    .andWhere(function(){
                        this.whereIn("a.redlistCategory", redlistRanks)
                    })
                })
            })
        })
        .then(data => {
            const countryObj = crbArry.map(item => {
                return {
                    country: item,
                    threatendClasses: taxClass.map(className => {
                        return {
                            class: className,
                            threatendCount: 0,
                            threatLevels: redlistRanks.map(rank => {
                                return { 
                                    rank, 
                                    count: 0
                                }
                            })
                        }
                    })
                }
            });
            data.map(item => {
                const species = item;
                countryObj.map(obj => {
                    if(species.country === obj.country){
                        obj.threatendClasses.map(className => {
                            if(species.className === className.class){
                                className.threatendCount++
                                className.threatLevels.map(threatRank => {
                                    if(species.redlistCategory === threatRank.rank){
                                        threatRank.count++
                                    }
                                })
                            }
                        })
                    }
                })
            });
            return countryObj
        })
};

function classCountByHabitat(){
    return db('taxonomy as t')
        .select("t.className", "a.redlistCategory", "h.code")
        .join("habitats as h", "t.scientificName", "h.scientificName")
        .join('assessments as a', "t.scientificName", "a.scientificName")
        .whereIn("t.className", taxClass)
        .andWhere(function(){
            this.whereIn('t.scientificName', function(){
                this.distinct('c.scientificName').from('countries as c')
                .join("habitats as h", "c.scientificName", "h.scientificName")
                .join('assessments as a', "c.scientificName", "a.scientificName")
                .whereIn('c.name', crbArry)
                .andWhere(function(){
                    this.whereIn("h.code", habitatCodes)
                    .andWhere(function(){
                        this.whereIn("a.redlistCategory", redlistRanks)
                    })
                })
            })
        })
        .then(data => {
            const habitatObj = habitatCodes.map(item => {
                return {
                    habitat_code: item,
                    threatendClasses: taxClass.map(className => {
                        return {
                            class: className,
                            threatendCount: 0,
                            threatLevels: redlistRanks.map(rank => {
                                return { 
                                    rank, 
                                    count: 0
                                }
                            })
                        }
                    })
                }
            });
            data.map(item => {
                const species = item;
                habitatObj.map(obj => {
                    if(species.code === `${obj.habitat_code}`){
                        obj.threatendClasses.map(className => {
                            if(species.className === className.class){
                                className.threatendCount++
                                className.threatLevels.map(threatRank => {
                                    if(species.redlistCategory === threatRank.rank){
                                        threatRank.count++
                                    }
                                })
                            }
                        })
                    }
                })
            });
            return habitatObj
        })
};

function classCountCRB(){
    return db('taxonomy as t')
        .select("t.className", "a.redlistCategory")
        .join('assessments as a', "t.scientificName", "a.scientificName")
        .whereIn("t.className", taxClass)
        .andWhere(function(){
            this.whereIn('t.scientificName', function(){
                this.distinct('c.scientificName').from('countries as c')
                .join('assessments as a', "c.scientificName", "a.scientificName")
                .join("habitats as h", "c.scientificName", "h.scientificName")
                .whereIn('c.name', crbArry)
                .andWhere(function(){
                    this.whereIn("h.code", habitatCodes)
                    .andWhere(function(){
                        this.whereIn("a.redlistCategory", redlistRanks)
                    })
                })
            })
        })
        .then(data => {
            const countObj = taxClass.map(className => {
                return {
                        class: className,
                        threatenedCount: 0,
                        threatLevels: redlistRanks.map(rank => {
                            return { 
                                rank, 
                                count: 0
                            }
                        })
                    }
                });
         
            data.map(item => {
                const species = item;
                countObj.map(obj => {
                    if(species.className === obj.class){
                        obj.threatenedCount++
                        obj.threatLevels.map(threat_lvl => {
                            if(species.redlistCategory === threat_lvl.rank){
                                threat_lvl.count++
                            }
                        })
                    }
                })
            });
            return countObj
        })
};

function allClassCountCRB(){
    return db('taxonomy as t')
        .select("t.className")
        .count('t.className as classCount')
        .whereIn("t.className", taxClass)
        .andWhere(function(){
            this.whereIn('t.scientificName', function(){
                this.distinct('c.scientificName').from('countries as c')
                .join("habitats as h", "c.scientificName", "h.scientificName")
                .join('assessments as a', "c.scientificName", "a.scientificName")
                .whereIn('c.name', crbArry)
                .andWhere(function(){
                    this.whereIn("h.code", habitatCodes)
                })
            })
        })
        .groupBy('t.className')
};
