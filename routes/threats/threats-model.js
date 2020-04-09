const knex = require('knex');
const knexConfig = require('../../knexfile');
const db = knex(knexConfig.development);

module.exports = {
    findThreatenedBy
};

const habitatCodes = [1.5, 1.6, 1.7, 1.8, 1.9, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 14.6];

const crbArry = ['Cameroon', 'Congo, The Democratic Republic of the', 'Gabon', 'Congo', 'Central African Republic', 'Equatorial Guinea'];

 
function findThreatenedBy(filter){
    return db("assessments as a")
    .join("habitats as h","a.scientificName", "h.scientificName")
    .join("countries as c", "a.scientificName", "c.scientificName")
    .join("taxonomy as t", "a.scientificName", "t.scientificName")
    .whereIn("a.redlistCategory",["Critically Endangered", "Endangered", "Vulnerable"])
    .andWhere(function(){
        this.whereIn("c.name", crbArry)
        .andWhere(function(){
            this.whereIn("h.code", habitatCodes)
        })
    })
    .select("a.redlistCategory as redlistRank", 
            "c.name as country", 
            "h.name as habitat", 
            "h.code", 
            "t.speciesName",
            "t.className"
        )
    .then(data => {
       return dataFilterLogic(data, filter)
    })
    
}

function dataFilterLogic(data, filter){
    if(filter === 'countries'){
        const countryObj = crbArry.map(item => {
            return {
                country: item,
                species: []
            }
        })
        data.map(item => {
            const species = item;
            countryObj.map(obj => {
                if(species.country === obj.country){
                    obj.species.push(species)
                }
            })
        })
        return countryObj
    };

    if(filter === 'habitats'){
        // The start of formatting the data
        const habitatObj = habitatCodes.map(item => {
            return {
                habitatCode: item,
                species: []
            }
        });
       data.map(item=> {
            const specie = item
            habitatObj.map(tax => {
                if(specie.code === `${tax.habitatCode}`){
                    tax.species.push(specie)
                }
            })
        })
        return habitatObj
    };

    if(filter === 'taxonomy'){
        console.log('in the filter!', data)
        const classes = data.map(item => {
            return item.className            
        });
        // filters through to create an array of distinct class names
        const uniqueClasses = classes.filter((name, i) => {
            return classes.indexOf(name) === i
        });
        // The start of formatting the data
        const classObj = uniqueClasses.map(item => {
            return {
                class: item,
                species: []
            }
        });
       data.map(item=> {
            const specie = item
            classObj.map(tax => {
                if(specie.className === tax.class){
                    tax.species.push(specie)
                }
            })
        })
        return classObj;
    }
    
    else {
        return data
    }
};


