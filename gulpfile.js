var gulp = require('gulp')
var browserify = require('browserify')
var source = require('vinyl-source-stream');
var babel = require('gulp-babel')

gulp.task('default', function () {
    return browserify('./src/app.js').bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./'));
})