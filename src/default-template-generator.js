function DefaultTemplateGenerator() {
    this.generatorType = "default";

    var createCheckbox = function(property) {
        var element = document.createElement("input");
        element.type = "checkbox";
        element.setAttribute("data-bind", "checked: " + property);
        return element;
    };

    var createInputType = function(property, type) {
        var element = document.createElement("input");
        element.type = type;
        element.setAttribute("data-bind", "value: " + property);
        return element;
    };

    var generateId = function(property, idPrefix, idSuffix) {
        return idPrefix + property.toLowerCase() + idSuffix;
    };

    var createInputElement = function(property, observable) {
        var observableValue = observable();

        if(observableValue === true || observableValue === false)
        { return createCheckbox(property); }

        if(isNumber(observableValue))
        { return createInputType(property, "number"); }

        if(isDate(observableValue))
        { return createInputType(property, "date")}

        if(observable.rules)
        {
            var rules = [];
            observable.rules().forEach(function(validationRule) {
                rules.push(validationRule.rule);
            });

            if(rules.indexOf("email") >= 0)
            { return createInputType(property, "email"); }

            if(rules.indexOf("min") >= 0 || rules.indexOf("max") >= 0 ||
                rules.indexOf("number") >= 0 || rules.indexOf("digits") >= 0)
            { return createInputType(property, "number"); }

            if(rules.indexOf("date") >= 0)
            { return createInputType(property, "date"); }
        }

        if(property.toLowerCase().indexOf("password") >= 0)
        { return createInputType(property, "password"); }

        return createInputType(property, "text");
    };

    var createForObservable = function(property, observable, idPrefix, idSuffix) {
        var inputElement = createInputElement(property, observable);
        inputElement.id = generateId(property, idPrefix, idSuffix);
        return inputElement;
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