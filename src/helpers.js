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

function isBoolean(obj) {
    return obj === true || obj === false;
}

function makeTextualName(name) {
    return name.replace(/([A-Z])/g, ' $1')
        .trim()
        .toLowerCase()
        .replace(/\b\w/g, function(match) { return match.toUpperCase() });
}

function makeSpinalCase(name) {
    return name.replace(/([A-Z])/g, ' $1')
        .trim()
        .replace(" ", "-")
        .toLowerCase();
}