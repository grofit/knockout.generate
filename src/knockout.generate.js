
function DefaultTemplateGenerator() {
    this.generatorType = "default";

    var createCheckbox = function(property, idPrefix, idSuffix) {
        var element = document.createElement("input");
        element.id = idPrefix + property.toLowerCase() + idSuffix;
        element.type = "checkbox";
        element.setAttribute("data-bind", "checked: " + property);
        return element;
    };

    var createInputType = function(property, type, idPrefix, idSuffix) {
        var element = document.createElement("input");
        element.id = idPrefix + property.toLowerCase() + idSuffix;
        element.type = type;
        element.setAttribute("data-bind", "value: " + property);
        return element;
    };

    var createForObservable = function(property, observable, idPrefix, idSuffix) {
        var observableValue = observable();

        if(observableValue === true || observableValue === false)
        { return createCheckbox(property, idPrefix, idSuffix); }

        if(observable.rules)
        {
            var rules = [];
            observable.rules().forEach(function(validationRule) {
               rules.push(validationRule.rule);
            });

            if(rules.indexOf("email") >= 0)
            { return createInputType(property, "email", idPrefix, idSuffix); }

            if(rules.indexOf("min") >= 0 || rules.indexOf("max") >= 0 ||
               rules.indexOf("number") >= 0 || rules.indexOf("digits") >= 0)
            { return createInputType(property, "number", idPrefix, idSuffix); }

            if(rules.indexOf("date"))
            { return createInputType(property, "date", idPrefix, idSuffix); }
        }

        if(property.toLowerCase().indexOf("password") >= 0)
        { return createInputType(property, "password", idPrefix, idSuffix); }

        return createInputType(property, "text", idPrefix, idSuffix);
    };

    this.generateTemplate = function(allBindings) {
        var model = allBindings.for;
        var idPrefix = allBindings.idPrefix || "";
        var idSuffix = allBindings.idSuffix || "";
        var generatedElements = [];
        var createdElement;
        for(var property in model)
        {
            if(ko.isObservable(model[property])) {
                createdElement = createForObservable(property, model[property], idPrefix, idSuffix);
                generatedElements.push(createdElement);
            }
        }
        return generatedElements;
    }
}

var findGeneratorForType = function(generatorType) {
    var generatorToUse;
    ko.generators.forEach(function(generator){
        if(generatorType == generator.generatorType)
        { generatorToUse = generator; }
    });
    return generatorToUse || ko.generators[0];
};

ko.generators = [ new DefaultTemplateGenerator() ];

ko.bindingHandlers['generate'] = {
    "init": function() {
        return { 'controlsDescendantBindings': true };
    },
    "update": function(element, valueAccessor, viewModel, bindingContext) {
        var type = valueAccessor().type || "default";
        var generatorToUse = findGeneratorForType(type);

        var generatedElements = generatorToUse.generateTemplate(valueAccessor());
        ko.virtualElements.emptyNode(element);
        ko.virtualElements.setDomNodeChildren(element, generatedElements);
        ko.applyBindingsToDescendants(bindingContext, element);
    }
};
ko.virtualElements.allowedBindings.generate = true;