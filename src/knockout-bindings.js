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