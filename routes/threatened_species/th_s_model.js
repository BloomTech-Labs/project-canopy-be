const db=require('../../data/dbconfig');

module.exports = {
    classCountByCountry,
    classCountByCountry2,
    classCountByCountry3,
    classCountByCountry4,
    classCountByHabitat,
    classCountCRB,
    allClassCountCRB,
    allClassCountByCountry
};

const habitatCodes = [1.5, 1.6, 1.7, 1.8, 1.9, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 14.6];
const crbArry = ['Cameroon', 'Congo, The Democratic Republic of the', 'Gabon', 'Congo', 'Central African Republic', 'Equatorial Guinea'];
const taxClass = ["MAMMALIA", "AVES", "REPTILIA", "AMPHIBIA"];
const redlistRanks = ["Critically Endangered", "Endangered", "Vulnerable"];

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
        // .then(data => {
        //     const countObj = crbArry.map(item => {
        //         //The setup of the returned object with item being the country name
        //         return {
        //             country: item,
        //             classes: taxClass.map(className => {
        //                 return {
        //                     class: className,
        //                     speciesCount: 0,
        //                 }
        //             })
        //         }
        //     });
        //     data.map(item => {
        //         const species = item;
        //         countObj.map(obj => {
        //             // sorting the species into the right country and pushing the species into the array
        //             if(species.country === obj.country){
        //                 obj.classes.map(className => {
        //                     if(species.className === className.class){
        //                         className.speciesCount++
        //                     }
        //                 })
        //             }
        //         })
        //     });
        //     return countObj
        // })
};
function classCountByCountry4(){
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
            const countryData = data
            const countryObj = crbArry.map(item => {
                //The setup of the returned object with item being the country name
                return {
                    country: item,
                    threatendClasses: taxClass.map(className => {
                        return {
                            class: className,
                            threatendCount: 0,
                            speciesCount: 0,
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
            allClassCountByCountry()
                .then(allSpeciesCount => {
                    allSpeciesCount.map(item => {
                        const species = item;
                        countryObj.map(obj => {
                            if(species.country === obj.country){
                                obj.threatendClasses.map(className => {
                                    if(species.className === className.class){
                                        className.speciesCount++
                                    }
                                })
                            }
                        })
                    });
                })
               
            countryData.map(item => {
                const species = item;
                countryObj.map(obj => {
                    // sorting the species into the right country and pushing the species into the array
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
function classCountByCountry3(){
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
                //The setup of the returned object with item being the country name
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
                    // sorting the species into the right country and pushing the species into the array
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
function classCountByCountry2(){
    return db('taxonomy as t')
        .select("t.className", "c.name as country")
        .join("countries as c", "t.scientificName", "c.scientificName")
        // .join('assessments as a', "t.scientificName", "a.scientificName")
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
                        this.whereIn("a.redlistCategory",["Critically Endangered", "Endangered", "Vulnerable"])
                    })
                })
            })
        })
        .then(data => {
            const countryObj = crbArry.map(item => {
                //The setup of the returned object with item being the country name
                return {
                    country: item,
                    threatendClasses: taxClass.map(className => {
                        return {
                            class: className,
                            threatendCount: 0
                        }
                    })
                }
            });
            data.map(item => {
                const species = item;
                countryObj.map(obj => {
                    // sorting the species into the right country and pushing the species into the array
                    if(species.country === obj.country){
                        obj.threatendClasses.map(className => {
                            if(species.className === className.class){
                                className.threatendCount++
                            }
                        })
                    }
                })
            });
            return countryObj
        })
};
function classCountByCountry(country){
    return db('taxonomy as t')
        .select("t.className")
        .count('t.className as classCount')
        .whereIn("t.className", ["MAMMALIA", "AVES", "REPTILIA", "AMPHIBIA"])
        .andWhere(function(){
            this.whereIn('t.scientificName', function(){
                this.distinct('c.scientificName').from('countries as c')
                .join('assessments as a', "c.scientificName", "a.scientificName")
                .join("habitats as h", "c.scientificName", "h.scientificName")
                .where('c.name', country)
                .andWhere(function(){
                    this.whereIn("h.code", habitatCodes)
                    .andWhere(function(){
                        this.whereIn("a.redlistCategory",["Critically Endangered", "Endangered", "Vulnerable"])
                    })
                })
            })
        })
        .groupBy('t.className')
        .then(countryCount => {
            const classObj = countryCount.map(item => {
                return {
                    className: item.className,
                    totalThreatened: item.classCount
                }
            })
            return {
                country: country,
                classes: classObj
            }
        })
};

function classCountByHabitat(code){
    return db('taxonomy as t')
        .select("t.className")
        .count('t.className as classCount')
        .whereIn("t.className", ["MAMMALIA", "AVES", "REPTILIA", "AMPHIBIA"])
        .andWhere(function(){
            this.whereIn('t.scientificName', function(){
                this.distinct('c.scientificName').from('countries as c')
                .join("habitats as h", "c.scientificName", "h.scientificName")
                .join('assessments as a', "c.scientificName", "a.scientificName")
                .whereIn('c.name', crbArry)
                .andWhere(function(){
                    this.where("h.code", code)
                    .andWhere(function(){
                        this.whereIn("a.redlistCategory", ["Critically Endangered", "Endangered", "Vulnerable"])
                    })
                })
            })
        })
        .groupBy('t.className')
        .then(habitatCounts => {
            const classObj = habitatCounts.map(item => {
                return {
                    className: item.className,
                    totalThreatened: item.classCount
                }
            })
            return {
                habitatCode: code,
                classes: classObj
            }
        })
};

function classCountCRB(){
    return db('taxonomy as t')
        .select("t.className")
        .count('t.className as classCount')
        .whereIn("t.className",["MAMMALIA", "AVES", "REPTILIA", "AMPHIBIA"])
        .andWhere(function(){
            this.whereIn('t.scientificName', function(){
                this.distinct('c.scientificName').from('countries as c')
                .join("habitats as h", "c.scientificName", "h.scientificName")
                .join('assessments as a', "c.scientificName", "a.scientificName")
                .whereIn('c.name', crbArry)
                .andWhere(function(){
                    this.whereIn("h.code", habitatCodes)
                    .andWhere(function(){
                        this.whereIn("a.redlistCategory", ["Critically Endangered", "Endangered", "Vulnerable"])
                    })
                })
            })
        })
        .groupBy('t.className')
};

function allClassCountCRB(){
    return db('taxonomy as t')
        .select("t.className")
        .count('t.className as classCount')
        .whereIn("t.className",["MAMMALIA", "AVES", "REPTILIA", "AMPHIBIA"])
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
