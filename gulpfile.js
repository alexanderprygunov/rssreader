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

gulp.task('js', function() {
    return gulp.src('./app/**/*.js')
        .pipe($.concat('app.js'))
        .pipe(gulp.dest('./js/'));
});

gulp.task('watch', function() {
    gulp.watch('css/**/*.{scss,sass}', ['sass']);
    gulp.watch('app/**/*.{js}', ['js']);
    gulp.watch('app/app.{js}', ['js']);
});

// Creating a default task
gulp.task('default', ['watch', 'serve', 'sass', 'js']);