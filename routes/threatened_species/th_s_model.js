const db=require('../../data/dbconfig');


module.exports = {
    classCountByCountry,
    classCountAllCountries
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
}
