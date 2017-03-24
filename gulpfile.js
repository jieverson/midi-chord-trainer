var gulp = require('gulp')
var browserify = require('browserify')
var uglify = require('gulp-uglify')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var babel = require('gulp-babel')

gulp.task('default', function () {
    return browserify('./src/app.js', { debug: false }).bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./'))
})