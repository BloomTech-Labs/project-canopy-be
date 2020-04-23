const db=require('../../data/dbconfig');

module.exports = {
    speciesCardInformation
};

function speciesCardInformation(scientificName){
    return db('CommonNames as com')
        .select(`a.scientificName`, 'com.name', 't.className', 'a.redlistCategory',  'a.threats', 'a.population', 'a.populationTrend')
        .join('taxonomy as t', 'com.scientificName', 't.scientificName')
        .join('assessments as a', 'com.scientificName', 'a.scientificName')
        .where('com.main', '=', '1')
        .andWhere('com.scientificName', '=', `${scientificName}`)
        .then(data => {
            return speciesCardHabitats(scientificName)
            .then(habitatList => {
                return speciesCardCITES(scientificName)
                .then(listing => {
                    let CITES_list = '';
                    if(listing.length > 0){
                        CITES_list = listing[0].Listing
                    } else {
                        CITES_list = 'Unlisted'
                    };
                    return {
                        ...data[0],
                        CITES_list,
                        habitats: habitatList,
                    }

                })
            })
        })
};

// helper functions for speciesCardInformation
function speciesCardHabitats(scientificName){
    return db('habitats as h')
        .select('h.code', 'h.name', 'h.majorImportance')
        .where('h.scientificName', `${scientificName}`)
};

function speciesCardCITES(scientificName){
    return db('CitesIndex')
        .select('listing')
        .where('Scientific Name', '=', `${scientificName}`)
}
