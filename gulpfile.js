var gulp = require('gulp');
var concat = require('gulp-concat');
var less = require('gulp-less');
var minifyJs = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var bs = require("browser-sync").create();

bs.init({
    proxy: 'http://192.12.344.45:3000'
});

gulp.task('browserSync', function () {
    bs({
        server: {
            baseDir: 'app'
        },
    })

});

gulp.task('jsCompile', function () {
    return gulp.src(config.app + '/js/*.js')
        .pipe(concat('all.js'))
        .pipe(minifyJs())
        .pipe(gulp.dest(config.app + '/src/js'));
});
gulp.task('cssCompile', function() {
    return gulp.src(config.app + '/css/*.less')
        .pipe(less())
        .pipe(concat('all.css'))
        .pipe(autoprefixer())
        .pipe(minifyCss())
        .pipe(gulp.dest(config.app + '/src/css'));
});

var config = {
    app: 'app/',
};