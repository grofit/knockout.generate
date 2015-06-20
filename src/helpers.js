var findGeneratorForType = function(generatorType) {
    var generatorToUse;
    ko.generators.forEach(function(generator){
        if(generatorType == generator.generatorType)
        { generatorToUse = generator; }
    });
    return generatorToUse || ko.generators[0];
};

function isNumber(obj) {
    return !isNaN(parseFloat(obj)) && isFinite(obj);
}

function isDate(obj) {
    return obj instanceof Date && !isNaN(obj.valueOf());
}