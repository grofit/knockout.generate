# Knockout.generate

A binding to automagically create templates based upon your view models.

This may sound like madness but its more to be used as a conventions based way to avoid the boilerplate of making lots of mundane templates for your POCO style view models.

## WHY!?!?

First of all if you do not use composition style view models, which look something like this:

```
function User()
{
   this.Name = ko.observable("");
   this.Age = ko.observable("");
   this.IsActive = ko.observable(true);
}

function SomeVM()
{
  this.ActiveUser = new User(); // or get it via IoC or whatever
}

var viewModel = new SomeVM();
ko.applyBindings(viewModel);
```

Then you may not find this as useful, but lets assume you do this or do not care.
 
So anyway in a conventions based approach you will often end up doing lots of boilerplate templates which will just 
contain an input element for each of your VM properties. This may not always be the case, and in some situations 
you will probably still want templates, but for those times you just want to spit out some input fields which represent 
your VM then you are in luck, this is what knockout.generate should do.

## Usage

So the simplest usage would be
```
<div data-bind="generate: { for: ActiveUser }"></div>
```

Which would end up outputting (by default) the content into the div:
```
<input type="text" id="name" data-bind="value: Name" />
<input type="text" id="age" data-bind="value: Age" />
<input type="checkbox" id="isactive" data-bind="checked: IsActive" />
```

You could also achieve the same result with virtual bindings:
```
<!-- ko generate: { for: ActiveUser } --> <!-- /ko -->
```

You can also setup id prefixes and suffixes like so:

```
<!-- ko generate: { for: ActiveUser, idPrefix: "active-user-" idSuffix: "-data" } --> <!-- /ko -->
```

Which would output:

```
<input type="text" id="active-user-name-data" data-bind="value: Name" />
<input type="text" id="active-user-age-data" data-bind="value: Age" />
<input type="checkbox" id="active-user-isactive-data" data-bind="checked: IsActive" />
```

Also by default it will factor in metadata from `knockout.validation` rules, so if you were to change the age property to:

```
this.Age = ko.observable(1).extend({min: 1, digits: true});
```

Then it would change the generated age input type to use the HTML5 `number` type, same with if you were using an email 
validation rule or date. It will also check to see if the name of the property contains `password` and will automatically 
make the type a password input box, or if the data value is true/false then it will make it a checkbox.

There is also the `type` value which can influence which generator is used, and this can all be customised, like shown next.

The default template generator args are:

* **for** - The vm you wish to generate the markup for
* **idPrefix** - The prefix to give an elements id, general format is <prefix>-<name-of-property-as-spinal-case>-<suffix>, defaulted to nothing
* **idSuffix** - The suffix to give an elements id
* **withLabels** - If labels should be generated before the input element, defaults to true
* **withPlaceholders** - If placeholders should be generated for the input elements, defaults to true
* **withContainer** - If container divs should wrap each input (and possible label), defaults to true

## Customisation

So by default there is a `DefaultTemplateGenerator` which will carry out all the above usage examples and has the associated 
type `default`, however you can add your own template generator classes with custom types then register them and have everything 
resolve for you.

So for example if you wanted to make a template generator which automatically added a label around every input object you could do that 
or add a validation message after it etc. The only criteria is that the custom template generator adheres to:

```
function YourCustomTemplateGenerator()
{
    this.generatorType = "name-of-your-type";
    this.generateTemplate = function(allBindings) {
        var generatedElements = []; // your DOM elements go in here
        // ... Do your magic
        return generatedElements;
    }
}
```

That is it, the allBindings will give you access to all of the generate arguments like `for`, `type` etc as well as any custom args you add.

Once this has been done you then need to add this into the generator listings so knockout is aware of it existing.

```
ko.generators.push(new YourCustomTemplateGenerator());
```

This will register it, then once that is done you can easily use your custom type by doing:

```
<!-- ko generate: { for: ActiveUser, type: 'name-of-your-type', someCustomArg: true } --> <!-- /ko -->
```

That would then delegate the call through to your `generateTemplate` method allowing you to generate the dom elements you want adding.

Not much more too it really...

Here is an example of what it does and how to use it.
[View Example](https://rawgithub.com/grofit/knockout.generate/master/example/index.html)