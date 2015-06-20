function SomeVm()
{
    this.Name = ko.observable("Some Name");
    this.Score = ko.observable(10).extend({min: 1, max: 100});
    this.Email = ko.observable("not an email").extend({email: true});
    this.DateOfBirth = ko.observable(new Date()).extend({date: true});
    this.Password = ko.observable("").extend({required: true});
    this.IsActive = ko.observable(false);
}