const db=require('../../data/dbconfig');
const { 
    habitatCodes,
    crbArry,
    taxClass,
    redlistRanks
} = require('../../utils/helpers.js')

module.exports = {
    allCountsCRB
};

function allCountsCRB(){
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
            const allCountObj = taxClass.map(className => {
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

            data.map(item => {
                const species = item;
                allCountObj.map(obj => {
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