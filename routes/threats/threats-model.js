const knex = require('knex');
const knexConfig = require('../../knexfile');
const db = knex(knexConfig.development);

module.exports = {
    findThreatenedBy,
};

// habitat codes that are specific to the areas of concern for project canopy
const habitatCodes = [1.5, 1.6, 1.7, 1.8, 1.9, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 14.6];
// countries that are specific to the areas of concern for project canopy
const crbArry = ['Cameroon', 'Congo, The Democratic Republic of the', 'Gabon', 'Congo', 'Central African Republic', 'Equatorial Guinea'];
 
function findThreatenedBy(filter){
    return db("assessments as a")
    .join("habitats as h","a.scientificName", "h.scientificName")
    .join("countries as c", "a.scientificName", "c.scientificName")
    .join("taxonomy as t", "a.scientificName", "t.scientificName")
    .whereIn("a.redlistCategory",["Critically Endangered", "Endangered", "Vulnerable"])
    .andWhere(function(){
        // this subquery futher specifies the results by limiting to the countries Project Canopy is concerned with
        this.whereIn("c.name", crbArry)
        // this subquery futher specifies the results by limiting to the habitats Project Canopy is concerned with (by the habitat code)
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
        // this function formats the returned data based on the filter parameter
       return dataFilterLogic(data, filter)
    })
    
}
// Used to filter the data based on params
function dataFilterLogic(data, filter){
    if(filter === 'countries'){
        // The start of formatting the data
        const countryObj = crbArry.map(item => {
            //The setup of the returned object with item being the country name
            return {
                country: item,
                species: []
            }
        })
        data.map(item => {
            const species = item;
            countryObj.map(obj => {
                //sorting the species into the right country and pushing the species into the array
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
            // the setup of the array of objects to be returned, each object will have a unique habitat code and an empty array
            return {
                habitatCode: item,
                species: []
            }
        });
        // We are mapping through the data to be able to filter and format it.
        data.map(item=> {
            const specie = item
            // mapping through the habitatObj and comparing the habitat code of each species and habitatObj objects to sort/filter the data in the correct format.
            habitatObj.map(tax => {
                if(specie.code === `${tax.habitatCode}`){
                    // if the codes match, the species is pushed into the empty array of the habitatObj object
                    tax.species.push(specie)
                }
            })
        })
        return habitatObj
    };

    if(filter === 'taxonomy'){
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
                    //if the classnames match it will be pushed into empty array classObj
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


