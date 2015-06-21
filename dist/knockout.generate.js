(function (factory) {
    // Module systems magic dance.

    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        // CommonJS or Node: hard-coded dependency on "knockout"
        factory(require("knockout"));
    } else if (typeof define === "function" && define["amd"]) {
        // AMD anonymous module with hard-coded dependency on "knockout"
        define(["knockout"], factory);
    } else {
        // <script> tag: use the global `ko` object, attaching a `mapping` property
        factory(ko);
    }
}
(function (ko) {

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

function DefaultTemplateGenerator() {
    this.generatorType = "default";

    var createCheckbox = function(property) {
        var inputElement = document.createElement("input");
        inputElement.type = "checkbox";
        inputElement.setAttribute("data-bind", "checked: " + property);
        return inputElement;
    };

    var createInputType = function(property, type) {
        var inputElement = document.createElement("input");
        inputElement.type = type;
        inputElement.setAttribute("data-bind", "value: " + property);
        return inputElement;
    };

    var createLabelFor = function(element, property) {
        var labelElement = document.createElement("label");
        labelElement.htmlFor = element.id;
        labelElement.innerHTML = makeTextualName(property);
        return labelElement;
    };

    var createContainer = function() {
        var containerElement = document.createElement("div");
        return containerElement;
    };

    var generateId = function(property, idPrefix, idSuffix) {
        var generatedId = "";

        if(idPrefix) { generatedId += (idPrefix + "-"); }
        generatedId += makeSpinalCase(property);
        if(idSuffix) { generatedId += ("-" + idSuffix); }

        return generatedId;
    };

    var createInputElement = function(property, observable) {
        var observableValue = observable();

        if(isBoolean(observableValue))
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

    var createForObservable = function(property, observable, idPrefix, idSuffix, withPlaceholders) {
        var inputElement = createInputElement(property, observable);

        if(withPlaceholders && inputElement.type != "checkbox") {
            var placeholderText = makeTextualName(property);
            inputElement.placeholder = placeholderText;
        }

        return inputElement;
    };

    this.generateTemplate = function(allBindings) {
        var model = allBindings.for;
        var idPrefix = allBindings.idPrefix || "";
        var idSuffix = allBindings.idSuffix || "";
        var withLabels = isBoolean(allBindings.withLabels) ? allBindings.withLabels : true;
        var withPlaceholders = isBoolean(allBindings.withPlaceholders) ? allBindings.withPlaceholders : true;
        var withContainer = isBoolean(allBindings.withContainer) ? allBindings.withContainer : true;

        var generatedElements = [];
        var inputElement, labelElement, containerElement;

        for(var property in model)
        {
            if(ko.isObservable(model[property])) {
                inputElement = createForObservable(property, model[property], idPrefix, idSuffix, withPlaceholders);
                inputElement.id = generateId(property, idPrefix, idSuffix) + "-input";

                if(withLabels) {
                    labelElement = createLabelFor(inputElement, property);
                    labelElement.id = generateId(property, idPrefix, idSuffix) + "-label";
                }

                if(withContainer){
                    containerElement = createContainer();
                    containerElement.id = generateId(property, idPrefix, idSuffix) + "-container";

                    if(withLabels) { containerElement.appendChild(labelElement); }
                    containerElement.appendChild(inputElement);
                    generatedElements.push(containerElement);
                }
                else {
                    if(withLabels) { generatedElements.push(labelElement); }
                    generatedElements.push(inputElement);
                }
            }
        }
        return generatedElements;
    }
}

ko.generators = [ new DefaultTemplateGenerator() ];

ko.bindingHandlers['generate'] = {
    "init": function(element, valueAccessor, viewModel, bindingContext) {
        var type = valueAccessor().type || "default";
        var generatorToUse = findGeneratorForType(type);

        var generatedElements = generatorToUse.generateTemplate(valueAccessor());
        ko.virtualElements.emptyNode(element);
        ko.virtualElements.setDomNodeChildren(element, generatedElements);
        ko.applyBindingsToDescendants(bindingContext, element);
        return { 'controlsDescendantBindings': true };
    }
};
ko.virtualElements.allowedBindings.generate = true;

}));