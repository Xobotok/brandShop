var gulp = require('gulp'),
    gp = require('gulp-load-plugins')(),
    browserSync = require('browser-sync').create();
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: './app'
        }
    });
    browserSync.watch('app', browserSync.reload)
});

