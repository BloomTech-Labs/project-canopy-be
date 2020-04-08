const db=require('../../data/dbconfig');


module.exports = {
    classCountByCountry,
    classCountAllCountries,
    classCountByHabitat
};

function classCountByCountry(country){
    return db('assessments as a')
        .select("t.className", "c.name")
        .count('t.className as classCount')
        .groupBy('t.className')
        .whereIn("a.redlistCategory",["Critically Endangered", "Endangered", "Vulnerable"])
        .andWhere('c.name', country)
        .join('taxonomy as t', "a.scientificName", "t.scientificName")
        .join("countries as c", "a.scientificName", "c.scientificName")
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
    return db('assessments as a')
        .join("taxonomy as t", "a.scientificName", "t.scientificName")
        .join("habitats as h", "a.scientificName", "h.scientificName")
        .select("t.className", "h.name", )
        .count("t.className as classCount")
        .groupBy("t.className")
        .whereIn("a.redlistCategory",["Critically Endangered", "Endangered", "Vulnerable"])
        .andWhere("h.code", code)
    .then(habitatCounts => {
        const objValues = Object.values(habitatCounts[0])
        
        const classObj = habitatCounts.map(item => {
            return {
                className: item.className,
                totalThreatened: item.classCount
            }
        })
        return {
            habitatName: objValues[1],
            habitatCode: code,
            classes: classObj
        }
    })
}

function classCountAllCountries() {
    const crbCountries = ['Cameroon', 'Congo, The Democratic Republic of the', 'Gabon', 'Congo', 'Central African Republic', 'Equatorial Guinea'];

    const allClassCountryCounts = [];

    crbCountries.map(country => {
        classCountByCountry(country)
            .then(countryCount => {
                allClassCountryCounts.push(countryCount)
            })
    });
    return allClassCountryCounts;
};