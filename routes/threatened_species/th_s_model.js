const db=require('../../data/dbconfig');


module.exports = {
    tax,
    UniqueClassNames,
    classNameCount
};

function tax(){
    return db('assessments as a')
    .select("a.scientificName", "a.redlistCategory", "a.assessmentDate", "t.kingdomName", "t.phylumName","t.orderName","t.className", "t.familyName", "t.genusName", "t.speciesName")
    .where("a.redlistCategory","Critically Endangered").orWhere("a.redlistCategory","Endangered").orWhere("a.redlistCategory","Vulnerable")
    .join('taxonomy as t', "a.internalTaxonId", "t.internalTaxonId");
}

function UniqueClassNames(){
    return db('assessments as a')
    .distinct("t.className")
    .where("a.redlistCategory","Critically Endangered").orWhere("a.redlistCategory","Endangered").orWhere("a.redlistCategory","Vulnerable")
    .join('taxonomy as t', "a.internalTaxonId", "t.internalTaxonId");
}


function classNameCount(name){
    return db('assessments as a')
    .select("t.className")
    .where("a.redlistCategory","Critically Endangered").orWhere("a.redlistCategory","Endangered").orWhere("a.redlistCategory","Vulnerable")
    .count("t.className", `${name}`)
    .join('taxonomy as t', "a.internalTaxonId", "t.internalTaxonId");
}
