var gulp = require('gulp'),
    $ = require('gulp-load-plugins')();

var merge = require('merge-stream');

gulp.task('sass', function() {
    return gulp.src('./css/style.scss')
        .pipe($.plumber({errorHandler: $.notify.onError()}))
        .pipe($.sass())
        .pipe(gulp.dest('./css/'))
        .pipe($.minifyCss())
        .pipe($.rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./css/'))
});

gulp.task('serve', $.serve({
    root: './',
    port: 3000
}));

gulp.task('watch', function() {
    gulp.watch('css/**/*.{scss,sass}', ['sass']);
});

// Creating a default task
gulp.task('default', ['watch', 'serve']);