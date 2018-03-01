'use strict';

const bs = require('browser-sync').create(),
      cssmin = require('gulp-cssmin'),
      del = require('del'),
      imagemin = require('gulp-imagemin'),
      gulp = require('gulp'),
      notify = require('gulp-notify'),
      prefix = require('gulp-autoprefixer'),
      rename = require('gulp-rename'),
      sass = require('gulp-sass'),
      uncss = require('gulp-uncss');

gulp.task('html', function () {
    return gulp.src('./src/index.html')
        .pipe(gulp.dest('./build'));
});

gulp.task('sass', ['html'] ,function () {
    return gulp.src('./src/sass/main.scss')
        .pipe(sass().on('error', notify.onError({title: 'sass'})))
        .pipe(uncss({html: ['./build/index.html']}))
        .pipe(prefix({browsers: ['last 2 versions'], cascade: true}))
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./build'))
        .pipe(bs.stream());
});

gulp.task('server', function () {
    bs.init({
        server: {
            baseDir: "./build"
        }
    });
    gulp.watch('./build/index.html').on('change', bs.reload);
});

gulp.task('watch', function () {
    gulp.watch('./src/*.html', ['html']);
    gulp.watch('./src/sass/**/*.scss', ['sass']);
});

gulp.task('clean', function () {
    return del('./build/*');
});

gulp.task('image', function () {
    return gulp.src('./src/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./build/img'))
});

gulp.task('fonts', function () {
    return gulp.src('./src/fonts/*')
        .pipe(gulp.dest('./build/fonts'))
});

gulp.task('build', ['clean', 'html', 'sass', 'image', 'fonts']);

gulp.task('default', ['html', 'sass', 'server', 'watch']);