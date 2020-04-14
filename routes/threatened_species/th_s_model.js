const db=require('../../data/dbconfig');

module.exports = {
    classCountByCountry,
    classCountByHabitat,
    classCountCRB,
    allClassCountCRB
};

const habitatCodes = [1.5, 1.6, 1.7, 1.8, 1.9, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 14.6];
const crbArry = ['Cameroon', 'Congo, The Democratic Republic of the', 'Gabon', 'Congo', 'Central African Republic', 'Equatorial Guinea'];

function classCountByCountry(country){
    return db('taxonomy as t')
        .select("t.className")
        .count('t.className as classCount')
        .whereIn("t.className",["MAMMALIA", "AVES", "REPTILIA", "AMPHIBIA"])
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
        .whereIn("t.className",["MAMMALIA", "AVES", "REPTILIA", "AMPHIBIA"])
        .andWhere(function(){
            this.whereIn('t.scientificName', function(){
                this.distinct('c.scientificName').from('countries as c')
                .join("habitats as h", "c.scientificName", "h.scientificName")
                .join('assessments as a', "c.scientificName", "a.scientificName")
                .whereIn('c.name', crbArry)
                .andWhere(function(){
                    this.where("h.code", code)
                    .andWhere(function(){
                        this.whereIn("a.redlistCategory",["Critically Endangered", "Endangered", "Vulnerable"])
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
                        this.whereIn("a.redlistCategory",["Critically Endangered", "Endangered", "Vulnerable"])
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
