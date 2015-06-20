var fs = require("fs");
var gulp = require("gulp");
var mustache = require("gulp-mustache");

gulp.task("default", function() {
    var defaultGeneratorContent =  fs.readFileSync("./src/default-template-generator.js");
    var helpersContent =  fs.readFileSync("./src/helpers.js");
    var knockoutBindingsContent =  fs.readFileSync("./src/knockout-bindings.js");

    gulp.src("./src/knockout.generate.js")
        .pipe(mustache({
            defaultGeneratorContent: defaultGeneratorContent,
            helpersContent: helpersContent,
            knockoutBindingsContent: knockoutBindingsContent
        }))
        .pipe(gulp.dest('./dist'));

});
