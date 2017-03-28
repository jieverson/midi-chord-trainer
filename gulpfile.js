var gulp = require('gulp')
var watchify = require('watchify')
var browserify = require('browserify')
var uglify = require('gulp-uglify')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var babel = require('gulp-babel')

function bundle(watching, release){
    var bundling = 
        watching
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
    
    if(release){
        bundling = bundling.pipe(
            babel({
                presets: ['es2015']
            }))
        .pipe(uglify())
    }

    return bundling.pipe(gulp.dest('./'))
}

gulp.task('default', function () {
     var watching = watchify(browserify(
        './src/app.js', { 
            debug: true
        }))
    watching.on('update', () => bundle(watching)
            .on('end', () => console.log('new bundle generated: ' + new Date())))

    return bundle(watching)
})

gulp.task('release', function () {
    var watching = browserify(
        './src/app.js', { 
            debug: true
        })

    return bundle(watching, true)
})

